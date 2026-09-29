import "server-only";
import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Thiếu biến môi trường MONGODB_URI.");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export async function getMongoClient(): Promise<MongoClient> {
  const promise = globalForMongo.mongoClientPromise ?? new MongoClient(uri!, { serverSelectionTimeoutMS: 5000 }).connect();
  globalForMongo.mongoClientPromise = promise;
  const client = await promise.catch((error) => {
    globalForMongo.mongoClientPromise = undefined;
    throw error;
  });
  return client;
}

export async function getMongoDatabase(): Promise<Db> {
  return (await getMongoClient()).db();
}
