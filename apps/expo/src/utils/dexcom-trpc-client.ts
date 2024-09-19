import { createTRPCClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";

import type { AppRouter } from "@hyper/api";

import { getBaseUrl } from "~/utils/base-url";
import { getDexcomTokens } from "~/utils/dexcom-store";
import { supabase } from "~/utils/supabase";
import { tokenRefreshLink } from "~/utils/token-refresh-link";

export const dexcomTrpcClient = createTRPCClient<AppRouter>({
  links: [
    tokenRefreshLink,
    httpBatchLink({
      transformer: SuperJSON,
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
          headers.set("X-Dexcom-Expires-At", dexcomTokens.expiresAt.toString());
        }

        return Object.fromEntries(headers);
      },
    }),
  ],
});
