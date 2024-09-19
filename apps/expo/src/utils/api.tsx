import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@hyper/api";

import { getBaseUrl } from "~/utils/base-url";
import { getDexcomTokens } from "~/utils/dexcom-store";
import { tokenRefreshLink } from "~/utils/token-refresh-link";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@hyper/api";

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export const TRPCProvider = (props: { children: React.ReactNode }) => {
  const supabase = useSupabaseClient();

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
          colorMode: "ansi",
        }),
        tokenRefreshLink,
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/api/trpc`,
          async headers() {
            const headers = new Map<string, string>();
            headers.set("x-trpc-source", "expo-react");

            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;
            if (token) headers.set("Authorization", token);

            // Add Dexcom tokens to headers
            const dexcomTokens = getDexcomTokens();
            if (dexcomTokens) {
              headers.set("X-Dexcom-Access-Token", dexcomTokens.accessToken);
              headers.set("X-Dexcom-Refresh-Token", dexcomTokens.refreshToken);
              headers.set(
                "X-Dexcom-Expires-At",
                dexcomTokens.expiresAt.toString(),
              );
            }

            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
};
