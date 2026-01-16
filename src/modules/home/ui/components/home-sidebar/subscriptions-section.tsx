"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/user-avatar";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const SubscriptionsSection = () => {
  const pathname = usePathname();
  const { data } = trpc.subscriptions.getMany.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data?.pages
            .flatMap((page) => page.items)
            .map((subscription) => (
              <SidebarMenuItem
                key={`${subscription.creatorId}-${subscription.viewerId}`}
              >
                <SidebarMenuButton
                  tooltip={subscription.user.name}
                  asChild
                  isActive={pathname === `/users/${subscription.user.id}`}
                >
                  <Link
                    href={`/users/${subscription.user.id}`}
                    className="flex items-center gap-4"
                  >
                    <UserAvatar
                      size="xs"
                      name={subscription.user.name}
                      imageUrl={subscription.user.imageUrl}
                    />
                    <span className="text-sm">{subscription.user.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
