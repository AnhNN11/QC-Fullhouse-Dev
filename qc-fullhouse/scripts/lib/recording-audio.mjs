import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import ffmpegPath from "ffmpeg-static";

const DEFAULT_BITRATE = "48k";
const DEFAULT_SAMPLE_RATE = "16000";

function safeFilePart(value) {
  return String(value ?? "recording")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "recording";
}

function isAllowedMediaUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && (url.hostname === "fullhousedev.com"
        || url.hostname.endsWith(".fullhousedev.com")
        || url.hostname.endsWith(".amazonaws.com")
        || url.hostname === "idrivee2.com"
        || url.hostname.endsWith(".idrivee2.com"));
  } catch {
    return false;
  }
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

async function downloadSegment(segment, destination) {
  const response = await fetch(segment.url, { signal: AbortSignal.timeout(180_000) });
  if (!response.ok || !response.body) {
    throw new Error(`Không tải được audio segment (${response.status}).`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(destination));
}

function runFfmpeg(args) {
  if (!ffmpegPath) throw new Error("Không tìm thấy FFmpeg. Hãy cài ffmpeg-static hoặc cấu hình FFMPEG_PATH.");
  const executable = process.env.FFMPEG_PATH?.trim() || ffmpegPath;
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr = `${stderr}${chunk}`.slice(-8_000); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.trim() || `FFmpeg dừng với mã ${code}.`));
    });
  });
}

export function recordingOutputDirectory() {
  return path.resolve(process.env.RECORDING_OUTPUT_DIR?.trim() || path.join(process.cwd(), "storage", "recordings"));
}

export function recordingOutputPath(fileName) {
  const safeName = path.basename(String(fileName ?? ""));
  if (!safeName || safeName !== fileName) return null;
  return path.join(recordingOutputDirectory(), safeName);
}

export async function buildNotebookAudio({ manifests, sourceSessionId, contestCode, sessionNo, concurrency = 4 }) {
  const audioSegments = [];
  for (const manifest of manifests) {
    for (const track of Array.isArray(manifest?.tracks) ? manifest.tracks : []) {
      if (track?.kind !== "audio") continue;
      for (const segment of Array.isArray(track?.segments) ? track.segments : []) {
        if (!segment?.url || !segment?.started_at_ns || !isAllowedMediaUrl(segment.url)) continue;
        audioSegments.push({ url: segment.url, startedAtNs: BigInt(segment.started_at_ns) });
      }
    }
  }
  if (!audioSegments.length) throw new Error("Recording không có audio segment hợp lệ.");

  const timelineStartNs = audioSegments.reduce(
    (earliest, segment) => segment.startedAtNs < earliest ? segment.startedAtNs : earliest,
    audioSegments[0].startedAtNs,
  );
  const outputDirectory = recordingOutputDirectory();
  await fs.mkdir(outputDirectory, { recursive: true });
  const fileName = `${safeFilePart(contestCode)}-buoi-${safeFilePart(sessionNo)}-${safeFilePart(sourceSessionId)}.mp3`;
  const outputPath = path.join(outputDirectory, fileName);
  const partialPath = `${outputPath}.part-${process.pid}`;
  const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "fullhouse-recording-"));

  try {
    const localSegments = audioSegments.map((segment, index) => ({
      ...segment,
      delayMs: Number((segment.startedAtNs - timelineStartNs) / 1_000_000n),
      filePath: path.join(temporaryDirectory, `${index}.ogg`),
    }));
    await mapLimit(localSegments, Math.max(1, Math.min(8, concurrency)), (segment) => downloadSegment(segment, segment.filePath));

    const args = ["-y", "-loglevel", "error"];
    for (const segment of localSegments) args.push("-i", segment.filePath);
    const labels = [];
    const filters = [];
    localSegments.forEach((segment, index) => {
      const label = `audio${index}`;
      labels.push(`[${label}]`);
      filters.push(`[${index}:a]adelay=${segment.delayMs}:all=1[${label}]`);
    });
    filters.push(`${labels.join("")}amix=inputs=${localSegments.length}:duration=longest:normalize=0,alimiter=limit=0.95[out]`);
    args.push(
      "-filter_complex", filters.join(";"),
      "-map", "[out]",
      "-vn",
      "-ac", "1",
      "-ar", DEFAULT_SAMPLE_RATE,
      "-b:a", DEFAULT_BITRATE,
      "-id3v2_version", "3",
      "-f", "mp3",
      partialPath,
    );
    await runFfmpeg(args);
    await fs.rename(partialPath, outputPath);
    const stats = await fs.stat(outputPath);
    const latestEndNs = manifests.reduce((latest, manifest) => {
      if (!manifest?.ended_at_ns) return latest;
      const endedAt = BigInt(manifest.ended_at_ns);
      return endedAt > latest ? endedAt : latest;
    }, timelineStartNs);
    return {
      notebookAudioFile: fileName,
      notebookAudioStatus: "ready",
      notebookAudioSize: stats.size,
      notebookAudioDurationSeconds: Number((latestEndNs - timelineStartNs) / 1_000_000_000n),
      notebookAudioGeneratedAt: new Date(),
      notebookAudioError: null,
    };
  } finally {
    await fs.rm(temporaryDirectory, { recursive: true, force: true });
    await fs.rm(partialPath, { force: true });
  }
}
