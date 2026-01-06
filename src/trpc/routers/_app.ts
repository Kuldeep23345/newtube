import { categoriesRouter } from "@/modules/categories/server/procedures";
import {  createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedures";



export const appRouter = createTRPCRouter({
    studio:studioRouter,
    categories:categoriesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
