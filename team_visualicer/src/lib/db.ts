import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB || "labdb";

if (!MONGODB_URI) {
  throw new Error("Falta MONGODB_URI en el .env.local");
}

type GlobalWithMongoose = typeof globalThis & {
  _mongooseConn?: Promise<typeof mongoose>;
};

const g = global as GlobalWithMongoose;

export async function dbConnect() {
  if (!g._mongooseConn) {
    g._mongooseConn = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });
    // Logs útiles en dev
    g._mongooseConn.then(() => console.log("[db] Conectado a Mongo:", DB_NAME))
                   .catch((e) => console.error("[db] Error conexión:", e));
  }
  return g._mongooseConn;
}
