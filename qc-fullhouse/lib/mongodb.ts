import { Db, MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB ?? "fullhouse_qc";

if (!uri) {
  throw new Error("MONGODB_URI chưa được cấu hình trong biến môi trường.");
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise =
  global.mongoClientPromise ?? new MongoClient(uri, options).connect();

if (process.env.NODE_ENV !== "production") {
  global.mongoClientPromise = clientPromise;
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(databaseName);
}

export default clientPromise;
