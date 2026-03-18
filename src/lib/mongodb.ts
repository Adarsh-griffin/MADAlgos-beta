import mongoose from "mongoose";

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: Cached | undefined;
}

const cached = global.mongooseCache ?? { conn: null, promise: null };
if (process.env.NODE_ENV !== "production") global.mongooseCache = cached;

/** Rejects after `ms` milliseconds — used to abort slow DNS/TCP hangs. */
const timeout = (ms: number) =>
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`DB connect timed out after ${ms}ms`)), ms)
  );

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set.");

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const connectOptions: Parameters<typeof mongoose.connect>[1] = {
      serverSelectionTimeoutMS: 5_000,
      connectTimeoutMS: 5_000,
      socketTimeoutMS: 5_000,
      family: 4,
    };

    // Optional, but important when your connection string doesn't include
    // the database path (MongoDB often falls back to `test`).
    // Set this in env if you want to explicitly target a specific DB.
    if (process.env.MONGODB_DB_NAME) {
      connectOptions.dbName = process.env.MONGODB_DB_NAME;
    }

    cached.promise = mongoose.connect(uri, connectOptions);
  }

  try {
    // Hard 6-second wall-clock limit so OS-level DNS timeouts don't block the request.
    cached.conn = await Promise.race([cached.promise, timeout(6_000)]);
    return cached.conn;
  } catch (err) {
    // Reset so next request tries a fresh connection instead of reusing failed promise.
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
}
