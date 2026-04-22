/**
 * Layout.tsx — Shared page layout with sidebar navigation
 *
 * Every page wraps its content in <Layout>. The sidebar shows links
 * to all 4 pages and highlights the currently active route.
 *
 * Structure:
 *   ┌────────────┬───────────────────────────────────┐
 *   │  Sidebar   │  Header (page title)               │
 *   │  (nav)     ├───────────────────────────────────┤
 *   │            │  Main content area                 │
 *   │            │                                    │
 *   └────────────┴───────────────────────────────────┘
 */

import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Radio, ScrollText, Users, Zap } from "lucide-react";

// Each nav item maps to a route and an icon
const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/publisher", label: "Publisher", icon: Radio, exact: false },
  { to: "/subscriber", label: "Subscriber", icon: Users, exact: false },
  { to: "/logs", label: "Event Logs", icon: ScrollText, exact: false },
] as const;

interface LayoutProps {
  children: React.ReactNode;
  /** Optional page title shown in the top header bar */
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    // Outer shell — fills the viewport, dark background
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card">
        {/* Logo / brand area */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-sm font-semibold text-foreground tracking-tight">
            Event Bus
          </span>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1 p-2 pt-3" data-ocid="sidebar.nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
            // Decide if this link is active based on the current path
            const active = exact
              ? currentPath === to
              : currentPath.startsWith(to);

            return (
              <Link
                key={to}
                to={to}
                data-ocid={`sidebar.nav.${label.toLowerCase().replace(/\s+/g, "_")}`}
                className={[
                  "flex items-center gap-3 rounded-sm px-3 py-2.5 font-mono text-xs font-medium transition-smooth",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer pushes footer to bottom */}
        <div className="flex-1" />

        {/* Sidebar footer — branding */}
        <div className="border-t border-border p-4">
          <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
            Pub/Sub Event Bus
            <br />
            <span className="text-accent">● LIVE</span> — canister state
          </p>
        </div>
      </aside>

      {/* ── Main area (header + content) ─────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="flex items-center gap-4 border-b border-border bg-card px-6 py-3">
          <h1 className="font-display text-sm font-semibold text-foreground tracking-tight">
            {title ?? "Event Bus System"}
          </h1>
          {/* Live pulse indicator */}
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-accent">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            SYSTEM ACTIVE
          </span>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card px-6 py-2.5">
          <p className="font-mono text-[10px] text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
