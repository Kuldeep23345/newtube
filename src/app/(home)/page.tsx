import { trpc } from "@/trpc/server";

export default async function page() {
  const data = await trpc.hello({ text: "world" });

  return <div>{data?.greeting}</div>;
}
