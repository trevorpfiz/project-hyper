import { authRouter } from "./router/auth";
import { dexcomRouter } from "./router/dexcom";
import { recapRouter } from "./router/recap";
import { reportRouter } from "./router/report";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  dexcom: dexcomRouter,
  recap: recapRouter,
  report: reportRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
