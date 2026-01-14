import { PlaylistsRouterOutputs } from "@/modules/playlists/types";
import Link from "next/link";

interface PlaylistGridCardProps {
  data: PlaylistsRouterOutputs["items"][number];
}

export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link href={`/playlists/${data.id}`}>
      <div className="flex flex-col gap-2 w-full group">{data.name}</div>
    </Link>
  );
};
