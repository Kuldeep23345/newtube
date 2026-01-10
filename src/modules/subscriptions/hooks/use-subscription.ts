import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

interface useSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: useSubscriptionProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast.success("Subscribed");
      if (fromVideoId) {
        utils.videos.getOne.invalidate({
          id: fromVideoId,
        });
      }
    },
    onError: (error) => {
      toast.error("Failed to subscribe");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });
  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: () => {
      toast.success("Unsubscribed");
      if (fromVideoId) {
        utils.videos.getOne.invalidate({
          id: fromVideoId,
        });
      }
    },
    onError: (error) => {
      toast.error("Failed to unsubscribe");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({
        userId,
      });
    } else {
      subscribe.mutate({
        userId,
      });
    }
  };

  return {
    isPending,
    onClick,
  };
};
