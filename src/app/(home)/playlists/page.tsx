import { PlaylistsView } from "@/modules/playlists/ui/views/playlists-view";
import { HydrateClient } from "@/trpc/server";

export default function page() {
  return (
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  );
}
