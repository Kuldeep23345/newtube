import { DEFAULT_LIMIT } from "@/constants";
import { SearchView } from "@/modules/search/ui/views/search-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface pageProps {
  searchParams: Promise<{
    query: string | undefined;
    categoryId: string | undefined;
  }>;
}

export default async function page({ searchParams }: pageProps) {
  const { query, categoryId } = await searchParams;
  void trpc.search.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT, query, categoryId })

  void trpc.categories.getMany.prefetch()
  return (
    <HydrateClient>
   <SearchView query={query} categoryId={categoryId}/>
    </HydrateClient>
  );
}
