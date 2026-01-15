import { UserView } from "@/modules/users/ui/views/user-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface pageProps {
  params: Promise<{ userId: string }>;
}

const page = async ({ params }: pageProps) => {
  const { userId } = await params;
  void trpc.users.getOne.prefetch({ id: userId });

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default page;
