"use client";

import Link from "next/link";
import { Suspense } from "react";
import { trpc } from "@/trpc/client";
import { format } from "date-fns";
import { DEFAULT_LIMIT } from "@/constants";
import { snakeCaseToTitle } from "@/lib/utils";
import { ErrorBoundary } from "react-error-boundary";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import { GlobeIcon, LockIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const VideosSection = () => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosSectionSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col sm:flex-row gap-4 p-3 sm:p-4">
          <Skeleton className="aspect-video w-full sm:w-48 rounded-md shrink-0" />
          <div className="flex flex-col justify-between flex-1 overflow-hidden">
            <div className="space-y-2">
              <Skeleton className="h-4 md:max-w-md" />
              <div className="md:space-y-3 space-y-2 md:mt-4 mt-2">
                <Skeleton className="h-3 w-full md:max-w-sm" />
                <Skeleton className="h-3 w-5/6 md:max-w-sm" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-xs md:mt-2 mt-3.5 text-muted-foreground">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const VideosSectionSuspense = () => {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (last) => last.nextCursor }
  );

  const allVideos = videos.pages.flatMap((p) => p.items);

  return (
    <div className="space-y-4">
      {allVideos.map((video) => (
        <Link
          key={video.id}
          href={`/studio/videos/${video.id}`}
          className="group flex flex-col sm:flex-row gap-4 p-3 sm:p-4 hover:bg-muted/50 transition"
        >
          <div className="relative aspect-video w-full sm:w-48 shrink-0 overflow-hidden rounded-md">
            <VideoThumbnail
              imageUrl={video.thumbnailUrl}
              previewUrl={video.previewUrl}
              title={video.title}
              duration={video.duration || 0}
            />
          </div>

          <div className="flex flex-col justify-between flex-1 overflow-hidden">
            <div className="space-y-1">
              <h3 className="text-sm font-medium line-clamp-1 md:max-w-sm">
                {video.title || "No title"}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-6 md:mt-2 md:max-w-sm">
                {video.description || "No description"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                {video.visibility === "private" ? (
                  <LockIcon className="size-3.5" />
                ) : (
                  <GlobeIcon className="size-3.5" />
                )}
                <span>{snakeCaseToTitle(video.visibility)}</span>
              </div>

              <span>{format(video.createdAt, "dd/MM/yyyy")}</span>
              <span>{video.viewCount} views</span>
              <span>{video.commentCount} comments</span>
              <span>{video.likeCount} likes</span>
            </div>
          </div>
        </Link>
      ))}

      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};
