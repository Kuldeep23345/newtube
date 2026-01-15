'use client';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface PlaylistHeaderSectionProps {
  playlistId: string;
}

export const PlaylistHeaderSection = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  return (
    <Suspense fallback={<PlayListHeaderSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <PlayListHeaderSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlayListHeaderSectionSkeleton = () => {
    return (
     <div className="flex flex-col gap-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-32" />
     </div>
    );
}


const PlayListHeaderSectionSuspense = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  const utils = trpc.useUtils();
  const router = useRouter();
  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId });
  const remove = trpc.playlists.remove.useMutation({
    onSuccess: () => {
      toast.success("Playlist removed");
      utils.playlists.getMany.invalidate();
      router.push("/playlists");
    },
    onError: () => {
      toast.error("Failed to remove playlist");
    },
  });
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{playlist?.name}</h1>
        <p className="text-xs text-muted-foreground">
          Videos from the playlist
        </p>
      </div>
      <Button
        className="rounded-full"
        variant="outline"
        size="icon"
        onClick={() => remove.mutate({ id: playlistId })}
        disabled={remove.isPending}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
};
