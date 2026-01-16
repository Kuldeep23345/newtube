import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";
import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export const StudioSidebarHeader = () => {
  const { user } = useUser();
  const { state } = useSidebar();
  if (!user)
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-28 rounded-full" />
        <div className="flex flex-col items-center mt-2 gap-y-2">
          <Skeleton className="w-20 h-4 " />
          <Skeleton className="w-25 h-4 " />
        </div>
      </SidebarHeader>
    );

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="You profile" asChild>
          <Link prefetch href="/users/current">
            <UserAvatar
              imageUrl={user?.imageUrl}
              name={user?.fullName || "User"}
              size="sm"
            />
            <span className="text-sm">Your profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link prefetch href="/users/current">
        <UserAvatar
          imageUrl={user.imageUrl}
          name={user.firstName || "User"}
          className="size-28 hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="flex flex-col items-center mt-2 gap-y-1">
        <p className="text-sm font-medium">Your profile</p>
        <p className="text-xs text-muted-foreground">{user?.fullName}</p>
      </div>
    </SidebarHeader>
  );
};
