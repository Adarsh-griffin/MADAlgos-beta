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

/** Wall-clock cap for initial connect (Atlas / slow networks often need 15–30s). */
function connectTimeoutMs(): number {
  const raw = process.env.MONGODB_CONNECT_TIMEOUT_MS?.trim();
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n >= 5_000 ? n : 25_000;
}

const timeout = (ms: number) =>
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`DB connect timed out after ${ms}ms`)), ms)
  );

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.DATABASE_URI?.trim() || process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("DATABASE_URI (or MONGODB_URI) is not set.");

  // Mongoose expects standard Mongo URI schemes.
  // This catches cases where the env var accidentally contains a wrong format
  // (or starts with a different prefix), before Mongoose throws a parse error.
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    throw new Error(
      `Invalid DATABASE_URI scheme. Expected to start with "mongodb://" or "mongodb+srv://". Got: ${uri.slice(0, 25)}...`
    );
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const t = connectTimeoutMs();
    const connectOptions: Parameters<typeof mongoose.connect>[1] = {
      serverSelectionTimeoutMS: t,
      connectTimeoutMS: t,
      socketTimeoutMS: 45_000,
      // Do not force IPv4 — Atlas + some networks need the default (dual-stack).
    };

    // Optional, but important when your connection string doesn't include
    // the database path (MongoDB often falls back to `test`).
    // Set this in env if you want to explicitly target a specific DB.
    const dbName = process.env.DATABASE_NAME?.trim() || process.env.MONGODB_DB_NAME?.trim();
    if (dbName) {
      connectOptions.dbName = dbName;
    }

    cached.promise = mongoose.connect(uri, connectOptions);
  }

  try {
    cached.conn = await Promise.race([cached.promise, timeout(connectTimeoutMs())]);
    return cached.conn;
  } catch (err) {
    // Reset so next request tries a fresh connection instead of reusing failed promise.
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
}
