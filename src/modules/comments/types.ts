import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type CommentGetManyOutput = inferRouterOutputs<AppRouter>['comments']['getMany'];
