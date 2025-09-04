import mongoose from "mongoose";

function maskUri(uri: string): string {
  try {
    const u = new URL(uri);
    if (u.password) u.password = "***";
    if (u.username) u.username = "***";
    return u.toString();
  } catch {
    return uri;
  }
}

export async function connectToDatabase(mongoUri?: string) {
  const uri = mongoUri || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/travel_journal";
  mongoose.set("strictQuery", true);

  const conn = mongoose.connection;

  conn.on("connected", () => {
    console.log(`[mongo] connected → ${maskUri(uri)}`);
  });
  conn.on("error", (err: unknown) => {
    console.error("[mongo] connection error:", err);
  });
  conn.on("disconnected", () => {
    console.warn("[mongo] disconnected");
  });

  console.log(`[mongo] connecting → ${maskUri(uri)}`);
  await mongoose.connect(uri, { autoIndex: true });
  return conn;
}
