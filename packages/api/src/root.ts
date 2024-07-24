import { authRouter } from "./router/auth";
import { reportRouter } from "./router/report";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  report: reportRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
