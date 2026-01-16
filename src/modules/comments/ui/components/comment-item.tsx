import Link from "next/link";
import { CommentGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessagesSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CommentForm } from "./comment-form";
import { CommentReplies } from "./comment-replies";
interface CommentItemProps {
  comment: CommentGetManyOutput["items"][number];
  variant?: "reply" | "comment";
}

export const CommentItem = ({
  comment,
  variant = "comment",
}: CommentItemProps) => {
  const { userId } = useAuth();
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success("Comment deleted");
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Failed to delete comment");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Failed to like comment");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });
  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Failed to dislike comment");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  return (
    <div>
      <div className="flex gap-4">
        <Link prefetch href={`/users/${comment.userId}`}>
          <UserAvatar
            size={variant === "reply" ? "sm" : "lg"}
            name={comment.user.name}
            imageUrl={comment.user.imageUrl}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link prefetch href={`/users/${comment.userId}`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.value}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <Button
                disabled={like.isPending}
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => like.mutate({ commentId: comment.id })}
              >
                <ThumbsUpIcon
                  className={cn(
                    comment.viewerReaction === "like" && "fill-black"
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.likeCount}
              </span>
              <Button
                disabled={dislike.isPending}
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => dislike.mutate({ commentId: comment.id })}
              >
                <ThumbsDownIcon
                  className={cn(
                    comment.viewerReaction === "dislike" && "fill-black"
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.dislikeCount}
              </span>
            </div>
            {variant === "comment" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => setIsReplyOpen(true)}
              >
                Reply
              </Button>
            )}
          </div>
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
              <MessagesSquareIcon className="size-4" />
              Reply
            </DropdownMenuItem>

            {userId === comment.user.clerkId && (
              <DropdownMenuItem
                onClick={() => remove.mutate({ id: comment.id })}
              >
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isReplyOpen && variant === "comment" && (
        <div className="mt-4 pl-14">
          <CommentForm
            videoId={comment.videoId}
            parentId={comment.id}
            variant="reply"
            onCancel={() => setIsReplyOpen(false)}
            onSuccess={() => {
              setIsReplyOpen(false);
              setIsRepliesOpen(true);
            }}
          />
        </div>
      )}

      {comment.replyCount > 0 && variant === "comment" && (
        <div className=" pl-14">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setIsRepliesOpen((current) => !current)}
          >
            {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            {comment.replyCount} Replies
          </Button>
        </div>
      )}
      {comment.replyCount > 0 && isRepliesOpen && variant === "comment" && (
        <CommentReplies parentId={comment.id} videoId={comment.videoId} />
      )}
    </div>
  );
};
