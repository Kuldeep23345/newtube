import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
  prompt: string;
}

export const { POST } = serve(async (context) => {
  const { userId, videoId, prompt } = context.requestPayload as InputType;

  /* ---------------------------- GET VIDEO ---------------------------- */
  const video = await context.run("get-video", async () => {
    const result = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!result[0]) {
      throw new Error("Video not found");
    }

    return result[0];
  });

  /* ----------------------- GENERATE THUMBNAIL ------------------------ */
  const thumbnailUrl = await context.run("generate-thumbnail", async () => {
    const enhancedPrompt = `
YouTube thumbnail, ultra high quality, cinematic lighting,
bold colors, expressive face, clean background,
large readable text, professional YouTube style.
Prompt: ${prompt}
    `.trim();

    const res = await fetch("https://openrouter.ai/api/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        prompt: enhancedPrompt,
        size: "1280x720", // YouTube thumbnail size
      }),
    });

    if (!res.ok) {
      console.error("Image generation failed:", await res.text());
      throw new Error("Thumbnail generation failed");
    }

    const data = await res.json();
    return data?.data?.[0]?.url;
  });

  if (!thumbnailUrl) {
    throw new Error("No thumbnail generated");
  }

  
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ thumbnailUrl })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
