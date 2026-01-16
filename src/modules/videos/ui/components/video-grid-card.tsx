import Link from "next/link";
import { VideoGetManyOutput } from "../../types";
import { VideoThumbnail } from "./video-thumbnail";
import { VideoInfo } from "./video-info";
import { VideoThumbnailSkeleton } from "./video-thumbnail";
import { VideoInfoSkeleton } from "./video-info";

interface VideoGridCardProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <VideoThumbnailSkeleton />
      <VideoInfoSkeleton />
    </div>
  );
};

export const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <Link prefetch href={`/videos/${data.id}`}>
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration}
        />
      </Link>
      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
};
