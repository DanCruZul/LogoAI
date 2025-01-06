import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { logos } from "./schema";

const schema = { logos };

declare global {
  var db: ReturnType<typeof drizzle> | undefined;
}

let db: ReturnType<typeof drizzle>;

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    const client = postgres(process.env.DATABASE_URL!);
    db = drizzle(client, { schema });
  } else {
    if (!global.db) {
      const client = postgres(process.env.DATABASE_URL!);
      global.db = drizzle(client, { schema });
    }
    db = global.db;
  }
} else {
  throw new Error("Database connection is not available on the client side");
}

export { db };
export type DB = typeof db;
