import { QueryClient } from "@tanstack/react-query";
import { createRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ({ error }: ErrorComponentProps) => <p role="alert">{error instanceof Error ? error.message : "This page couldn't load."}</p>,
  });

  return router;
};
