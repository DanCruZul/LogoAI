import { db } from "@/db/db";
import { logos } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getLogos() {
  try {
    const result = await db.select().from(logos).orderBy(desc(logos.createdAt));
    return result;
  } catch (error) {
    console.error("Error fetching logos:", error);
    throw error;
  }
}

// Asegúrate de que este archivo solo se importe en el lado del servidor
// Por ejemplo, en rutas de API o en Server Components
