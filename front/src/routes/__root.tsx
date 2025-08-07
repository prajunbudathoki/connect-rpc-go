import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "../components/Header";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Toaster richColors />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
