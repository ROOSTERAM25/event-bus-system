/**
 * App.tsx — Router configuration and provider wrappers
 *
 * This file ONLY sets up routing. Page content lives in src/pages/.
 *
 * Routes:
 *   /             → Home page (explains Event Bus concept)
 *   /publisher    → Publisher page (create & send events)
 *   /subscriber   → Subscriber page (subscribe/unsubscribe)
 *   /logs         → Event Logs page (delivery history)
 */

import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";

// Lazy-load pages so each page is its own code chunk
const HomePage = lazy(() => import("./pages/Home"));
const PublisherPage = lazy(() => import("./pages/Publisher"));
const SubscriberPage = lazy(() => import("./pages/Subscriber"));
const LogsPage = lazy(() => import("./pages/Logs"));

// Loading fallback — shown while page chunk loads
function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <span className="font-mono text-xs text-muted-foreground animate-pulse">
        loading…
      </span>
    </div>
  );
}

// ── Root route — wraps every page with the shared Layout ──────────────────
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

// ── Individual page routes ────────────────────────────────────────────────
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <HomePage />,
});

const publisherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/publisher",
  component: () => <PublisherPage />,
});

const subscriberRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subscriber",
  component: () => <SubscriberPage />,
});

const logsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/logs",
  component: () => <LogsPage />,
});

// ── Build the router tree ─────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  homeRoute,
  publisherRoute,
  subscriberRoute,
  logsRoute,
]);

const router = createRouter({ routeTree });

// Required for TanStack Router TypeScript support
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ── App entry ─────────────────────────────────────────────────────────────
export default function App() {
  return <RouterProvider router={router} />;
}
