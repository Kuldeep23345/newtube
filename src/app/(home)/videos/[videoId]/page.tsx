import { HydrateClient, trpc } from "@/trpc/server";
import { VideoView } from "@/modules/videos/ui/views/video-view";
interface PageProps {
  params: Promise<{ videoId: string }>;
}

export default async function page({ params }: PageProps) {
  const { videoId } = await params;
  void trpc.videos.getOne.prefetch({ id: videoId });
  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}
