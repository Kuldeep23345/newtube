'use client';

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

export default function VideosSection() {
    const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery({
     limit:DEFAULT_LIMIT,
    },{getNextPageParam:(lastPage)=>lastPage.nextCursor});

  return (
    <div>
       {JSON.stringify(data)}
    </div>
  )
}
