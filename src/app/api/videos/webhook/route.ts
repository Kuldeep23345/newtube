import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
  VideoAssetDeletedWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { mux } from "@/lib/mux";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetDeletedWebhookEvent;

export const POST = async (request: Request) => {
  if (!SIGNING_SECRET) {
    throw new Error("Missing MUX_WEBHOOK_SECRET");
  }
  const headersPlayload = await headers();
  const muxSignature = headersPlayload.get("mux-signature");

  if (!muxSignature) {
    return new Response("No signature found", { status: 401 });
  }
  const payload = await request.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(
    body,
    {
      "mux-signature": muxSignature,
    },
    SIGNING_SECRET
  );

  

  switch (payload.type as WebhookEvent['type']) {
    case "video.asset.created":{
        const data = payload.data as VideoAssetCreatedWebhookEvent['data'];
        if(!data.upload_id){
            return new Response("No upload id found", { status: 400 });
        }
       await db.update(videos).set({muxAssetId: data.id,muxStatus:data.status}).where(eq(videos.muxUploadId, data.upload_id));
    }
      break;
    case "video.asset.ready":{
        const data = payload.data as VideoAssetReadyWebhookEvent['data'];
        if(!data.upload_id){
            return new Response("No upload id found", { status: 400 });
        }
       await db.update(videos).set({muxAssetId: data.id,muxStatus:data.status}).where(eq(videos.muxUploadId, data.upload_id));
    }
      break;
    case "video.asset.errored":
      break;
    case "video.asset.track.ready":
      break;
    case "video.asset.deleted":
      break;
    default:
      break;
  }
  return new Response("webhook received", { status: 200 });
};
