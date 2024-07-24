import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import type { AppRouter } from "@hyper/api";
import { createCaller, createTRPCContext } from "@hyper/api";

import { createQueryClient } from "~/trpc/query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
    auth: auth(),
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
