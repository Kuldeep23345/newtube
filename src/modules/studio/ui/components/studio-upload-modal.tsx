"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2, Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import StudioUploader from "./studio-uploader";
import { useRouter } from "next/navigation";

export const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const router = useRouter();

  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video created");

      utils.studio.getMany.invalidate();
    },
    onError: () => {
      toast.error("Failed to create video");
    },
  });

  const onSuccess = () => {
    if (!create?.data?.video) return;
    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  };

  return (
    <>
      <ResponsiveModal
        open={!!create.data?.url}
        onOpenChange={() => {
          create.reset();
        }}
        title="Upload Video"
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data.url} onSuccess={onSuccess} />
        ) : (
          <Loader2Icon />
        )}
      </ResponsiveModal>
      <Button
        variant="secondary"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
    </>
  );
};
