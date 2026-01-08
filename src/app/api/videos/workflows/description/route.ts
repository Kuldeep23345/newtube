import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

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

  
  const description = await context.run("generate-description", async () => {

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
          { role: "system", content: DESCRIPTION_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Video transcript:\n${trimmedTranscript}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("OpenRouter error:", await res.text());
      return "";
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || "";
  });

  
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ description })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
