import { PlaylistsView } from "@/modules/playlists/ui/views/playlists";
import { HydrateClient } from "@/trpc/server";

export default function page() {
  return (
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  );
}
