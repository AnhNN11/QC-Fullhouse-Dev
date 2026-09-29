import "server-only";
import { getMongoDatabase } from "./mongodb";
import { learningDay } from "./activity";
export async function recordActivity(userId: string) {
  const day = learningDay();
  await (await getMongoDatabase()).collection<{_id:string;userId:string;day:string}>("learning_activity").updateOne({ _id: `${userId}:${day}` }, { $setOnInsert: { userId, day } }, { upsert: true });
}
