"use server";

import { db } from "@/db/db";
import { logos } from "@/db/schema";
import { nanoid } from "nanoid";
import { ActionState } from "@/types/action-types";
import { desc } from "drizzle-orm";

export async function saveLogo({
  imageData,
  prompt,
}: {
  imageData: string;
  prompt: string;
}): Promise<ActionState<{ id: number; url: string }>> {
  try {
    const filename = `${nanoid()}.png`;
    // Store the base64 image data directly in the database
    const url = `data:image/png;base64,${imageData}`;

    const [insertedLogo] = await db
      .insert(logos)
      .values({
        url,
        prompt,
        createdAt: new Date(),
      })
      .returning({ id: logos.id, url: logos.url });

    return {
      status: "success",
      data: { id: insertedLogo.id, url: insertedLogo.url },
    };
  } catch (error) {
    console.error("Error saving logo:", error);
    return { status: "error", message: "Failed to save logo" };
  }
}

export async function getLogos(): Promise<
  ActionState<(typeof logos.$inferSelect)[]>
> {
  try {
    const result = await db.select().from(logos).orderBy(desc(logos.createdAt));
    return { status: "success", data: result };
  } catch (error) {
    console.error("Error fetching logos:", error);
    return { status: "error", message: "Failed to fetch logos" };
  }
}
