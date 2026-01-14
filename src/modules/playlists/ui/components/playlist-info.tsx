import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistsRouterOutputs } from "../../types";

interface PlaylistInfoProps {
  data: PlaylistsRouterOutputs["items"][number];
}
export const PlaylistInfoSkeleton = () => {
  return (
    <div className="flex gap-3">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-[90%]" />
        <Skeleton className="h-5 w-[70%]" />
        <Skeleton className="h-5 w-[50%]" />
      </div>
    </div>
  );
};

export const PlaylistInfo = ({ data }: PlaylistInfoProps) => {
  return (
    <div className="flex gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-sm wrap-break-word">
          {data.name}
        </h3>
        <p className="text-sm text-muted-foreground font-semibold hover:text-primary">
          playlists
        </p>
        <p className="text-sm text-muted-foreground font-semibold hover:text-primary">
          View full playlists{" "}
        </p>
      </div>
    </div>
  );
};
