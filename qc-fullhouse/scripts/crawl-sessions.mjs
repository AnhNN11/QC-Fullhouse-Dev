import nextEnv from "@next/env";
import * as cheerio from "cheerio";
import fs from "node:fs";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const BASE_URL = "https://fullhousedev.com";
const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB ?? "fullhouse_qc";
const cookieFile = process.argv.find((value) => value.startsWith("--cookie-file="))?.slice("--cookie-file=".length).trim();
const requestedContest = process.argv.find((value) => value.startsWith("--contest="))?.split("=")[1]?.trim();
const skipRecordings = process.argv.includes("--skip-recordings");
const concurrency = Math.max(1, Math.min(8, Number(process.env.FULLHOUSE_CRAWL_CONCURRENCY ?? 4)));

function isFullhouseDomain(value) {
  const domain = String(value ?? "").trim().replace(/^\./, "").toLowerCase();
  return domain === "fullhousedev.com" || domain.endsWith(".fullhousedev.com");
}

function cookieFromFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  try {
    const parsed = JSON.parse(text);
    const rows = Array.isArray(parsed) ? parsed : parsed.cookies;
    if (Array.isArray(rows)) {
      const value = rows
        .filter((item) => isFullhouseDomain(item.domain) && item.name)
        .map((item) => `${item.name}=${item.value ?? ""}`)
        .join("; ");
      if (value) return value;
    }
  } catch {
    // Continue with Netscape or raw Cookie formats.
  }
  const netscape = text.split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("\t"))
    .filter((parts) => parts.length >= 7 && isFullhouseDomain(parts[0]))
    .map((parts) => `${parts[5]}=${parts[6]}`)
    .join("; ");
  if (netscape) return netscape;
  const raw = text.replace(/^Cookie:\s*/i, "");
  if (/(^|;\s*)sessionid=/.test(raw)) return raw;
  return "";
}

const cookie = cookieFile ? cookieFromFile(cookieFile) : process.env.FULLHOUSE_SESSION_COOKIE?.trim();

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
  const manifests = $(".fhd-xem-track[data-manifest]").map((_, element) => absoluteUrl($(element).attr("data-manifest"))).get();
  return { recordingCount: manifests.length };
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
  const teacherIds = [...new Set(contests.flatMap((contest) => Array.isArray(contest.teacherIds) ? contest.teacherIds.map(String) : []))];
  const teachers = await db.collection("teachers").find({
    _id: { $in: teacherIds.filter(ObjectId.isValid).map((id) => new ObjectId(id)) },
  }).toArray();
  const teacherNameById = new Map(teachers.map((teacher) => [teacher._id.toString(), teacher.name]));

  let imported = 0;
  let withRecordings = 0;
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
        if (lessonStatus(session.date, session.endTime) === "completed") {
          try {
            recording = await recordingInfo(session);
          } catch (error) {
            console.warn(`  ! Không đọc được recording buổi ${session.sessionNo}: ${error.message}`);
          }
        }
        const recordingCount = recording?.recordingCount ?? Number(existing?.recordingCount ?? 0);
        const preservedStatus = ["reviewed", "issue"].includes(String(existing?.recordingStatus)) ? existing.recordingStatus : null;
        const recordingStatus = preservedStatus ?? (recordingCount > 0 ? "ready" : "pending_upload");
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
              recordingStatus,
              sourceActive: true,
              crawledAt: new Date(),
              updatedAt: new Date(),
            },
            $setOnInsert: { createdAt: new Date() },
            $unset: { recordingManifestUrls: "" },
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
  console.log(`\nHoàn tất: ${imported} buổi, ${withRecordings} buổi có recording, ${failed} contest lỗi.`);
} finally {
  await client.close();
}
