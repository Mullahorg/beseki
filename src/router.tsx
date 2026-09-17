import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Re-use recent results instead of re-querying the database on every
        // mount, but retry once so a single hiccup does not show an error.
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        retryDelay: 800,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
