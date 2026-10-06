import { normalizeFullhouseCookie } from "../lib/fullhouse-cookie.mjs";
import nextEnv from "@next/env";
import * as cheerio from "cheerio";
import fs from "node:fs";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { buildNotebookAudio } from "./lib/recording-audio.mjs";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const BASE_URL = "https://fullhousedev.com";
const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB ?? "fullhouse_qc";
const cookieFile = process.argv.find((value) => value.startsWith("--cookie-file="))?.slice("--cookie-file=".length).trim();
const requestedContest = process.argv.find((value) => value.startsWith("--contest="))?.split("=")[1]?.trim();
const requestedDate = process.argv.find((value) => value.startsWith("--date="))?.split("=")[1]?.trim();
const skipRecordings = process.argv.includes("--skip-recordings");
const generateNotebookAudio = process.argv.includes("--with-audio") || process.env.FULLHOUSE_GENERATE_NOTEBOOK_AUDIO === "1";
const concurrency = Math.max(1, Math.min(8, Number(process.env.FULLHOUSE_CRAWL_CONCURRENCY ?? 4)));

if (requestedDate && !/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
  throw new Error("Ngày crawl phải có định dạng YYYY-MM-DD.");
}

const cookie = normalizeFullhouseCookie(cookieFile ? fs.readFileSync(cookieFile, "utf8") : process.env.FULLHOUSE_SESSION_COOKIE);

if (!uri) throw new Error("MONGODB_URI chưa được cấu hình.");
if (!cookie || !/(^|;\s*)sessionid=/.test(cookie)) {
  throw new Error("Thiếu cookie sessionid hợp lệ. Dùng --cookie-file=<đường-dẫn> hoặc FULLHOUSE_SESSION_COOKIE.");
}

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

function absoluteUrl(value) {
  return new URL(value, BASE_URL).toString();
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      Cookie: cookie,
      "User-Agent": "Fullhouse-QC-Local-Crawler/1.0",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });
  const html = await response.text();
  if (!response.ok) throw new Error(`${response.status} khi tải ${url}`);
  if (!html.includes("fhd-session-row") && !html.includes("fhd-class")) {
    throw new Error(`Phiên đăng nhập không hợp lệ hoặc contest chưa có trang buổi học: ${url}`);
  }
  return html;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Cookie: cookie,
      "User-Agent": "Fullhouse-QC-Local-Crawler/1.0",
      Accept: "application/json",
    },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`${response.status} khi tải ${url}`);
  return response.json();
}

function mediaUrlsFromManifest(manifest, manifestUrl) {
  const urls = [];
  for (const track of Array.isArray(manifest?.tracks) ? manifest.tracks : []) {
    for (const segment of Array.isArray(track?.segments) ? track.segments : []) {
      if (!segment?.url) continue;
      try {
        const url = new URL(segment.url, manifestUrl);
        if (["http:", "https:"].includes(url.protocol)) urls.push(url.toString());
      } catch {
        // Ignore malformed media URLs from the source manifest.
      }
    }
  }
  return urls;
}

function parseSessions(html, contest) {
  const $ = cheerio.load(html);
  const className = $(".page-title h2").first().text().replace(/\s+/g, " ").trim() || contest.name;
  const sessions = [];

  $(".fhd-session-row").each((_, row) => {
    const edit = $(row).find('button[data-session-modal][data-mode="edit"]').first();
    const link = $(row).find("a.fhd-session-link").first();
    const href = link.attr("href") ?? "";
    const sourceSessionId = href.match(/\/sessions\/(\d+)\//)?.[1];
    const sessionNo = Number(edit.attr("data-number") ?? link.find(".fhd-session-no").text());
    const date = edit.attr("data-date") ?? "";
    const startTime = edit.attr("data-start") ?? "";
    const endTime = edit.attr("data-end") ?? "";
    const rawTitle = (edit.attr("data-title") ?? link.find(".fhd-session-name").clone().children().remove().end().text()).replace(/\s+/g, " ").trim();
    const topic = rawTitle
      .replace(/^Bu\S*i\s+\d+\s*[:\-–—.]?\s*/iu, "")
      .replace(/^[:\-–—.]\s*/, "")
      .trim();
    if (!sourceSessionId || !Number.isFinite(sessionNo) || !date || !startTime || !endTime) return;
    sessions.push({
      sourceSessionId,
      sessionNo,
      date,
      startTime,
      endTime,
      topic: topic || "Chưa có nội dung",
      sourceUrl: absoluteUrl(href),
      recordingUrl: `${absoluteUrl(href)}?tab=recordings`,
      contestName: className,
    });
  });
  return sessions;
}

async function recordingInfo(session) {
  if (skipRecordings) return null;
  const html = await fetchHtml(session.recordingUrl);
  const $ = cheerio.load(html);
  const manifests = [...new Set(
    $(".fhd-xem-track[data-manifest]")
      .map((_, element) => $(element).attr("data-manifest"))
      .get()
      .filter(Boolean)
      .map(absoluteUrl),
  )];
  const manifestResults = await mapLimit(manifests, concurrency, async (manifestUrl) => {
    try {
      const manifest = await fetchJson(manifestUrl);
      return { manifest, mediaUrls: mediaUrlsFromManifest(manifest, manifestUrl) };
    } catch (error) {
      console.warn(`  ! Không đọc được file media từ ${manifestUrl}: ${error.message}`);
      return null;
    }
  });
  const validManifests = manifestResults.filter(Boolean);
  return {
    recordingCount: manifests.length,
    recordingManifestUrls: manifests,
    recordingMediaUrls: [...new Set(validManifests.flatMap((item) => item.mediaUrls))],
    manifestData: validManifests.map((item) => item.manifest),
  };
}

async function mapLimit(items, limit, callback) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await callback(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function lessonStatus(date, endTime) {
  const end = new Date(`${date}T${endTime}:00+07:00`).getTime();
  return Number.isFinite(end) && end < Date.now() ? "completed" : "scheduled";
}

try {
  await client.connect();
  const db = client.db(databaseName);
  const legacyIndex = (await db.collection("class_sessions").indexes())
    .find((index) => index.name === "classId_1_sessionNo_1");
  if (legacyIndex) {
    await db.collection("class_sessions").dropIndex(legacyIndex.name);
    console.log("✓ Đã gỡ index lớp học cũ classId_1_sessionNo_1");
  }
  const contestQuery = requestedContest
    ? { code: requestedContest }
    : { sourceUrl: { $regex: "fullhousedev\\.com/contest/" } };
  const contests = await db.collection("contests").find(contestQuery).sort({ endTime: 1 }).toArray();
  if (!contests.length) throw new Error("Không tìm thấy contest để crawl. Kiểm tra danh sách lớp hoặc mã contest.");
  const teacherIds = [...new Set(contests.flatMap((contest) => Array.isArray(contest.teacherIds) ? contest.teacherIds.map(String) : []))];
  const teachers = await db.collection("teachers").find({
    _id: { $in: teacherIds.filter(ObjectId.isValid).map((id) => new ObjectId(id)) },
  }).toArray();
  const teacherNameById = new Map(teachers.map((teacher) => [teacher._id.toString(), teacher.name]));

  let imported = 0;
  let withRecordings = 0;
  let audioReady = 0;
  let audioFailed = 0;
  let failed = 0;

  for (const contest of contests) {
    const code = String(contest.code ?? "").trim();
    if (!code) continue;
    try {
      const learningUrl = `${BASE_URL}/learning/${encodeURIComponent(code)}/`;
      const sessions = parseSessions(await fetchHtml(learningUrl), contest);
      const teacherIdsForContest = Array.isArray(contest.teacherIds) ? contest.teacherIds.map(String) : [];
      const teacherNames = teacherIdsForContest.map((id) => teacherNameById.get(id)).filter(Boolean);

      await mapLimit(sessions, concurrency, async (session) => {
        const existing = await db.collection("class_sessions").findOne({ sourceSystem: "fullhousedev", sourceSessionId: session.sourceSessionId });
        let recording = null;
        const isRequestedDate = !requestedDate || session.date === requestedDate;
        if (lessonStatus(session.date, session.endTime) === "completed" && isRequestedDate) {
          try {
            recording = await recordingInfo(session);
          } catch (error) {
            console.warn(`  ! Không đọc được recording buổi ${session.sessionNo}: ${error.message}`);
          }
        }
        const recordingCount = recording?.recordingCount ?? Number(existing?.recordingCount ?? 0);
        const recordingManifestUrls = recording?.recordingManifestUrls
          ?? (Array.isArray(existing?.recordingManifestUrls) ? existing.recordingManifestUrls : []);
        const recordingMediaUrls = recording?.recordingMediaUrls
          ?? (Array.isArray(existing?.recordingMediaUrls) ? existing.recordingMediaUrls : []);
        const preservedStatus = ["reviewed", "issue"].includes(String(existing?.recordingStatus)) ? existing.recordingStatus : null;
        const recordingStatus = preservedStatus ?? (recordingCount > 0 ? "ready" : "pending_upload");
        let notebookAudio = {
          notebookAudioFile: existing?.notebookAudioFile ?? null,
          notebookAudioStatus: existing?.notebookAudioStatus ?? "pending",
          notebookAudioSize: existing?.notebookAudioSize ?? null,
          notebookAudioDurationSeconds: existing?.notebookAudioDurationSeconds ?? null,
          notebookAudioGeneratedAt: existing?.notebookAudioGeneratedAt ?? null,
          notebookAudioError: existing?.notebookAudioError ?? null,
        };
        if (generateNotebookAudio && recording?.manifestData?.length) {
          try {
            notebookAudio = await buildNotebookAudio({
              manifests: recording.manifestData,
              sourceSessionId: session.sourceSessionId,
              contestCode: code,
              sessionNo: session.sessionNo,
              concurrency,
            });
            audioReady += 1;
          } catch (error) {
            audioFailed += 1;
            console.warn(`  ! Không ghép được audio buổi ${session.sessionNo}: ${error.message}`);
            if (!notebookAudio.notebookAudioFile) {
              notebookAudio = {
                ...notebookAudio,
                notebookAudioStatus: "error",
                notebookAudioError: String(error.message ?? error).slice(0, 1_000),
              };
            }
          }
        }
        await db.collection("class_sessions").updateOne(
          { sourceSystem: "fullhousedev", sourceSessionId: session.sourceSessionId },
          {
            $set: {
              sourceSystem: "fullhousedev",
              sourceSessionId: session.sourceSessionId,
              contestId: contest._id.toString(),
              contestCode: code,
              contestName: session.contestName,
              teacherIds: teacherIdsForContest,
              teacherNames,
              sessionNo: session.sessionNo,
              date: session.date,
              startTime: session.startTime,
              endTime: session.endTime,
              topic: session.topic,
              status: lessonStatus(session.date, session.endTime),
              sourceUrl: session.sourceUrl,
              recordingUrl: session.recordingUrl,
              recordingCount,
              recordingManifestUrls,
              recordingMediaUrls,
              recordingStatus,
              ...notebookAudio,
              sourceActive: true,
              crawledAt: new Date(),
              updatedAt: new Date(),
            },
            $setOnInsert: { createdAt: new Date() },
          },
          { upsert: true },
        );
        imported += 1;
        if (recordingCount > 0) withRecordings += 1;
      });
      await db.collection("class_sessions").updateMany(
        {
          sourceSystem: "fullhousedev",
          contestId: contest._id.toString(),
          sourceSessionId: { $nin: sessions.map((session) => session.sourceSessionId) },
        },
        { $set: { sourceActive: false, updatedAt: new Date() } },
      );
      console.log(`✓ ${code}: ${sessions.length} buổi`);
    } catch (error) {
      failed += 1;
      console.warn(`✗ ${code}: ${error.message}`);
    }
  }

  await Promise.all([
    db.collection("class_sessions").createIndex({ sourceSystem: 1, sourceSessionId: 1 }, { unique: true, partialFilterExpression: { sourceSystem: "fullhousedev" } }),
    db.collection("class_sessions").createIndex({ sourceSystem: 1, date: -1, startTime: 1 }),
    db.collection("class_sessions").createIndex({ sourceSystem: 1, recordingStatus: 1 }),
  ]);
  const audioSummary = generateNotebookAudio ? `, ${audioReady} audio NotebookLM, ${audioFailed} audio lỗi` : "";
  console.log(`\nHoàn tất: ${imported} buổi, ${withRecordings} buổi có recording${audioSummary}, ${failed} contest lỗi.`);
  if (failed === contests.length) throw new Error("Không crawl được contest nào. Kiểm tra phiên Fullhouse và quyền truy cập lớp.");
} finally {
  await client.close();
}
