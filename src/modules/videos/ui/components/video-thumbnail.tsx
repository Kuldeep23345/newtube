import Image from "next/image";
import { formatDuration } from "@/lib/utils";

interface VideoThumbnailProps {
  imageUrl?: string | null;
  previewUrl?: string | null;
  title?: string;
  duration?: number;
}

export default function VideoThumbnail({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) {
  return (
    <div className="relative group">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title || "Thumbnail"}
          fill
          className="object-cover w-full h-full group-hover:opacity-0 transition-opacity"
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl || "/placeholder.svg"}
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
