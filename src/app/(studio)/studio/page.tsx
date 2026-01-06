import StudioView from "@/modules/studio/ui/view/studio-view";
import { trpc, HydrateClient } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";

export default async function page() {
  void trpc.studio.getMany.prefetchInfinite({
    limit:DEFAULT_LIMIT
  });
  return (
    <HydrateClient>
      <StudioView/>
    </HydrateClient>
  );
}
