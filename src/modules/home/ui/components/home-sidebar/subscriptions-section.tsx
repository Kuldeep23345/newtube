"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/user-avatar";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListIcon } from "lucide-react";

export const LoadingSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4].map((item) => (
        <SidebarMenuItem key={item}>
          <SidebarMenuButton disabled>
            <Skeleton className="size-6 rounded-full shrink-0" />
            <Skeleton className="h-4 w-full" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};

export const SubscriptionsSection = () => {
  const pathname = usePathname();
  const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

   const { isMobile, setOpenMobile } = useSidebar();

  const closeSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading && <LoadingSkeleton />}
          {!isLoading &&
            data?.pages
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
                      prefetch
                      href={`/users/${subscription.user.id}`}
                      className="flex items-center gap-4"
                      onClick={closeSidebar}
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
          {!isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/subscriptions"}
              >
                <Link
                  prefetch
                  href="/subscriptions"
                  className="flex items-center gap-4"
                  onClick={closeSidebar}
                >
                  <ListIcon className="size-4" />
                  <span className="text-sm">All ubscriptions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
