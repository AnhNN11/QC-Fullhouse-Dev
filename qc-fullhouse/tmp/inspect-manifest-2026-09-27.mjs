import fs from "node:fs";
import nextEnv from "@next/env";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const cookieRows = JSON.parse(fs.readFileSync("/Users/nhatanh/Downloads/fullhousedev.com_26-09-2026.json", "utf8"));
const rows = Array.isArray(cookieRows) ? cookieRows : cookieRows.cookies;
const cookie = rows
  .filter((item) => String(item.domain ?? "").includes("fullhousedev.com") && item.name)
  .map((item) => `${item.name}=${item.value ?? ""}`)
  .join("; ");

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
try {
  const db = client.db(process.env.MONGODB_DB ?? "fullhouse_qc");
  const sessions = await db.collection("class_sessions")
    .find({ sourceSystem: "fullhousedev", date: "2026-09-27", recordingCount: { $gt: 0 } })
    .sort({ startTime: 1 })
    .toArray();
  for (const session of sessions) {
    const manifestUrl = session.recordingManifestUrls?.[0];
    const response = await fetch(manifestUrl, { headers: { Cookie: cookie, Accept: "application/json" } });
    const manifest = await response.json();
    console.log(JSON.stringify({
      contestCode: session.contestCode,
      sessionNo: session.sessionNo,
      sourceSessionId: session.sourceSessionId,
      started_at_ns: manifest.started_at_ns,
      ended_at_ns: manifest.ended_at_ns,
      trackCount: Array.isArray(manifest.tracks) ? manifest.tracks.length : 0,
      tracks: (manifest.tracks ?? []).map((track) => ({
        kind: track.kind,
        type: track.type,
        source: track.source,
        sid: track.sid,
        name: track.name,
        segmentCount: track.segments?.length ?? 0,
        firstSegmentKeys: Object.keys(track.segments?.[0] ?? {}),
        firstSegment: track.segments?.[0] ?? null,
      })),
    }, null, 2));
  }
} finally {
  await client.close();
}
