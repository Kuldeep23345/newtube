import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { and, eq } from "drizzle-orm";
export const commentReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;
      if (!userId) {
        throw new Error("Unauthorized");
      }
      const [existingCommentReactionLike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.userId, userId),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.type, "like")
          )
        );

      if (existingCommentReactionLike) {
        const [deletedViewerReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId)
            )
          )
          .returning();
        return deletedViewerReaction;
      }
      const [createdCommentReaction] = await db
        .insert(commentReactions)
        .values({
          userId,
          commentId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: {
            type: "like",
          },
        })
        .returning();
      return createdCommentReaction;
    }),
  dislike: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;
      if (!userId) {
        throw new Error("Unauthorized");
      }
      const [existingCommentReactionDislike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.userId, userId),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.type, "dislike")
          )
        );

      if (existingCommentReactionDislike) {
        const [deletedViewerReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId)
            )
          )
          .returning();
        return deletedViewerReaction;
      }
      const [createdCommentReaction] = await db
        .insert(commentReactions)
        .values({
          userId,
          commentId,
          type: "dislike",
        })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: {
            type: "dislike",
          },
        })
        .returning();
      return createdCommentReaction;
    }),
});
