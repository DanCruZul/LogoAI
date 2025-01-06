import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const logos = pgTable("logos", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  prompt: text("prompt").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Logo = typeof logos.$inferSelect;
