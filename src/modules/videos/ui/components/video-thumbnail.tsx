import Image from "next/image";
import { formatDuration } from "@/lib/utils";
import { THUMBNAIL_FALLBACK } from "../../constants";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoThumbnailProps {
  imageUrl?: string | null;
  previewUrl?: string | null;
  title?: string;
  duration?: number;
}


export const VideoThumbnailSkeleton = () => {
  return (
  <div className="relative w-full overflow-hidden rounded-xl aspect-video">
    <Skeleton className="size-full"/>
  </div>
  );
}

export const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className="relative group">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={imageUrl || THUMBNAIL_FALLBACK}
          alt={title || "Thumbnail"}
          fill
          className="object-cover w-full h-full group-hover:opacity-0 transition-opacity"
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl || THUMBNAIL_FALLBACK}
          alt={title || "Thumbnail"}
          fill
          className="object-cover w-full h-full opacity-0 group-hover:opacity-100 "
        />
      </div>
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium ">
        {formatDuration(duration || 0)}
      </div>
    </div>
  );
}
