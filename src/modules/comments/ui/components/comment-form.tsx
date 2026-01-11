import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { useUser, useClerk } from "@clerk/nextjs";
import { commentsInsertSchema } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface CommentFormProps {
  videoId: string;
  onSuccess?: () => void;
}

const formSchema = commentsInsertSchema.omit({ userId: true });

export const CommentForm = ({ videoId, onSuccess }: CommentFormProps) => {
  const { user } = useUser();
  const utils = trpc.useUtils();
  const clerk = useClerk();

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      form.reset();
      toast.success("Comment added");
      onSuccess?.();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You must be logged in to comment");
        clerk.openSignIn();
        return;
      }
      toast.error("Failed to create comment");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoId,
      value: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    create.mutate(values);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-4 group"
      >
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || "/user-placeholder.svg"}
          name={user?.username || "User"}
        />
        <div className="flex-1">
          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Add a comment..."
                    className="resize-none bg-transparent overflow-hidden min-h-16"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="justify-end gap-2 mt-2 flex ">
            <Button disabled={create.isPending} type="submit" size="sm">
              Comment
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
