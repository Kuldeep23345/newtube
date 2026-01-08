import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

export const { POST } = serve(async (context) => {
  const { userId, videoId } = context.requestPayload as InputType;

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

 
  const transcript = await context.run("get-transcript", async () => {
    if (!video.muxPlaybackId || !video.muxTrackId) {
      throw new Error("Missing Mux IDs");
    }

    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const res = await fetch(trackUrl);

    if (!res.ok) {
      throw new Error("Failed to fetch transcript");
    }

    const text = await res.text();
    if (!text.trim()) {
      throw new Error("Transcript empty");
    }

    return text;
  });

  
  const title = await context.run("generate-title", async () => {

    const trimmedTranscript = transcript.slice(0, 4000);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "video-title-generator",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        temperature: 0.7,
        max_tokens: 20,
        messages: [
          { role: "system", content: TITLE_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Video transcript:\n${trimmedTranscript}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("OpenRouter error:", await res.text());
      return "Untitled video";
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || "Untitled video";
  });

  
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ title })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
