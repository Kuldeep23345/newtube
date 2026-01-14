import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { ListVideoIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface PlaylistThumbnailProps {
  imageUrl?: string | null;
  title: string;
  videoCount: number;
  className?: string;
}


export const PlaylistThumbnailSkeleton = () => {
    return (
     <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Skeleton className="size-full" />
     </div>
    )
}

export const PlaylistThumbnail = ({
  imageUrl,
  title,
  videoCount,
  className,
}: PlaylistThumbnailProps) => {

const compactViews = useMemo(()=>{
    return Intl.NumberFormat("en", {
        notation: "compact",
      }).format(videoCount);
}, [videoCount]);


  return (
    <div className={cn("relative pt-3 ", className)}>
      {/* stack effect layers */}
      <div className="relative">
        {/* background layers */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] overflow-hidden rounded-xl bg-black/20 aspect-video" />
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] overflow-hidden rounded-xl bg-black/25 aspect-video" />

        {/* main image */}
        <div className="relative overflow-hidden w-full rounded-xl aspect-video">
          <Image
            src={imageUrl || THUMBNAIL_FALLBACK}
            fill
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* hover overlay  */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-x-2">
              <PlayIcon className="size-4 text-white fill-white" />
              <span className="text-white font-medium">Play all</span>
            </div>
          </div>
        </div>
      </div>

      {/* video count indicator */}

      <div className="absolute bottom-2 right-2  px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium flex items-center gap-x-1">
        <ListVideoIcon className="size-4" />
        {compactViews} videos
      </div>
    </div>
  );
};
