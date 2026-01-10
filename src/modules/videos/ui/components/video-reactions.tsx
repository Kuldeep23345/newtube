import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { VideoGetOneOutput } from "../../types";
import { useClerk } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReactions: VideoGetOneOutput["viewerReaction"];
}

export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReactions,
}: VideoReactionsProps) => {
const clerk = useClerk();
const utils = trpc.useUtils();

const like = trpc.videoReactions.like.useMutation({
    onSuccess:()=>{
        utils.videos.getOne.invalidate({id:videoId})
    },
    onError:(error)=>{
      toast.error('something went wrong')
      if(error.data?.code === "UNAUTHORIZED"){
        clerk.openSignIn();
      }
        
    }
})
const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess:()=>{
        utils.videos.getOne.invalidate({id:videoId})
    },
    onError:(error)=>{
      toast.error('something went wrong')
      if(error.data?.code === "UNAUTHORIZED"){
        clerk.openSignIn();
      }
        
    }
})



  return (
    <div className="flex items-center flex-none ">
      <Button
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
        onClick={() => like.mutate({videoId})}
        disabled={like.isPending || dislike.isPending}
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReactions === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-full gap-2 pl-3"
        onClick={() => dislike.mutate({videoId})}
        disabled={like.isPending || dislike.isPending}
      >
        <ThumbsDownIcon
          className={cn(
            "size-5",
            viewerReactions === "dislike" && "fill-black"
          )}
        />
        {dislikes}
      </Button>
    </div>
  );
};
