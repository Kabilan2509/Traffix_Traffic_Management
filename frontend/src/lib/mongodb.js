import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

const globalWithMongoose = global;

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = { conn: null, promise: null };
}

export default async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const cached = globalWithMongoose._mongoose;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
      dbName: MONGODB_DB || undefined,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((instance) => instance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
