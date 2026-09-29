import nextEnv from "@next/env";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
try {
  const db = client.db(process.env.MONGODB_DB ?? "fullhouse_qc");
  const sessions = await db.collection("class_sessions")
    .find({ sourceSystem: "fullhousedev", date: "2026-09-27", sourceActive: true })
    .sort({ startTime: 1, contestCode: 1 })
    .toArray();

  console.log(JSON.stringify(sessions.map((session) => ({
    id: session._id.toString(),
    sourceSessionId: session.sourceSessionId,
    contestCode: session.contestCode,
    contestName: session.contestName,
    teacherNames: session.teacherNames,
    sessionNo: session.sessionNo,
    date: session.date,
    startTime: session.startTime,
    endTime: session.endTime,
    topic: session.topic,
    recordingCount: session.recordingCount,
    recordingUrl: session.recordingUrl,
    manifestCount: session.recordingManifestUrls?.length ?? 0,
    mediaCount: session.recordingMediaUrls?.length ?? 0,
    mediaUrls: session.recordingMediaUrls ?? [],
    notebookAudioFile: session.notebookAudioFile,
    notebookAudioStatus: session.notebookAudioStatus,
    notebookAudioError: session.notebookAudioError,
  })), null, 2));
} finally {
  await client.close();
}
