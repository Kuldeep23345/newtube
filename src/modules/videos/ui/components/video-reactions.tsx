import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

export const VideoReactions = () => {
  const viewerReactions: "like" | "dislike" = "like";
  return (
    <div className="flex items-center flex-none ">
      <Button
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReactions === "like" && "fill-black")}
        />
        {1}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-full gap-2 pl-3"
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReactions != "like" && "fill-black")}
        />
        {1}
      </Button>
    </div>
  );
};
