import type { TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import PQueue from "p-queue";

import type { AppRouter } from "@hyper/api";

import { getDexcomTokens, updateDexcomTokens } from "~/utils/dexcom-store";
import { helperClient } from "~/utils/helper-client";

export const RENEW_MS_BEFORE_EXPIRATION = 5000; // 5 seconds

// Create a queue with concurrency 1 to ensure sequential token refreshes
const queue = new PQueue({ concurrency: 1 });

export const tokenRefreshLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      void queue.add(async () => {
        if (op.path.startsWith("dexcom.")) {
          const tokens = getDexcomTokens();

          if (
            tokens &&
            Date.now() >= tokens.expiresAt - RENEW_MS_BEFORE_EXPIRATION
          ) {
            try {
              const newTokens =
                await helperClient.auth.refreshDexcomToken.mutate();

              const updatedTokens = {
                ...newTokens,
              };

              updateDexcomTokens(
                updatedTokens.accessToken,
                updatedTokens.refreshToken,
                updatedTokens.expiresIn,
              );
              // Update the operation context with new tokens
              op.context.dexcomTokens = updatedTokens;
            } catch (error) {
              console.error("Error refreshing Dexcom token:", error);
              throw error; // Propagate the error
            }
          }
        }

        // Call the next link in the chain
        const unsubscribe = next(op).subscribe({
          next: (result) => observer.next(result),
          error: (error) => observer.error(error),
          complete: () => observer.complete(),
        });

        return unsubscribe;
      });
    });
  };
};
