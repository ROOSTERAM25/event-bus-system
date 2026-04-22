/**
 * Logs.tsx — Event Logs Page
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VIVA EXPLANATION — What is a Delivery Log?
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * A Delivery Log is a record that proves whether an event message was
 * successfully delivered to each subscriber.
 *
 * WHY we track it:
 *  - Debugging:  If a subscriber never received a message, the log shows "Failed"
 *  - Auditing:   You can review exactly which event reached which subscriber
 *  - Reliability: In real systems, failed deliveries can trigger automatic retries
 *
 * How it works in our Event Bus:
 *  1. Publisher sends an event (e.g., eventType = "user.login")
 *  2. Backend eventDispatcher algorithm scans all subscribers
 *  3. For each subscriber whose eventType matches, it dispatches the event
 *  4. One DeliveryLog record is created per match with status "delivered" or "failed"
 *  5. This page fetches and displays those DeliveryLog records from the backend
 *
 * Columns in Event History table:
 *   Event Type | Payload (truncated to 50 chars) | Publisher Name | Time
 *
 * Columns in Delivery Logs table:
 *   Event ID | Subscriber Name | Status (green/red badge) | Time
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, Radio, RefreshCw } from "lucide-react";
import { useGetDeliveryLogs, useGetEvents } from "../hooks/useBackend";
import type { DeliveryLog, Event } from "../types";
import { formatTimestamp } from "../types";

// ─── Status Badge ─────────────────────────────────────────────────────────────
// Renders a GREEN badge for "delivered" and a RED badge for "failed".
// Uses utility classes status-badge-success / status-badge-failed defined in index.css.
function StatusBadge({ status }: { status: string }) {
  const isDelivered = status.toLowerCase() === "delivered";

  return (
    <span
      data-ocid="logs.status_badge"
      className={isDelivered ? "status-badge-success" : "status-badge-failed"}
    >
      {/* Dot indicator */}
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          isDelivered ? "bg-accent" : "bg-destructive"
        }`}
      />
      {isDelivered ? "Delivered" : "Failed"}
    </span>
  );
}

// ─── Skeleton rows — shown while data is being fetched ───────────────────────
function TableSkeleton({ cols }: { cols: number }) {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <tr key={i} className="border-b border-border">
          {Array.from({ length: cols }, (_, j) => `col-${j}`).map((colKey) => (
            <td key={colKey} className="px-4 py-3">
              <Skeleton className="h-3 w-full rounded-sm" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Empty state row ──────────────────────────────────────────────────────────
function EmptyRow({
  message,
  ocid,
}: {
  message: string;
  ocid: string;
}) {
  return (
    <tr>
      <td colSpan={99}>
        <div
          data-ocid={ocid}
          className="flex flex-col items-center justify-center py-10 gap-2 text-center"
        >
          <span className="font-mono text-xs text-muted-foreground">
            {message}
          </span>
        </div>
      </td>
    </tr>
  );
}

// ─── Event History Table ──────────────────────────────────────────────────────
function EventHistoryTable({
  events,
  isLoading,
  isError,
}: {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
}) {
  // Sort newest first by timestamp
  const sorted = [...events].sort((a, b) =>
    b.timestamp > a.timestamp ? 1 : -1,
  );

  return (
    <section
      data-ocid="logs.events.section"
      className="rounded-sm border border-border overflow-hidden"
    >
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border">
        <Radio className="w-3.5 h-3.5 text-primary" />
        <span className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Event History
        </span>
        <Badge
          variant="secondary"
          className="font-mono text-xs ml-auto"
          data-ocid="logs.events.count"
        >
          {events.length}
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Event Type
              </th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Payload
              </th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Publisher
              </th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton cols={4} />
            ) : isError ? (
              <EmptyRow
                ocid="logs.events.error_state"
                message="⚠ Could not load events. Try refreshing."
              />
            ) : sorted.length === 0 ? (
              <EmptyRow
                ocid="logs.events.empty_state"
                message="No events published yet. Go to the Publisher page to send one."
              />
            ) : (
              sorted.map((ev, index) => (
                <tr
                  key={String(ev.id)}
                  data-ocid={`logs.events.item.${index + 1}`}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors duration-150"
                >
                  {/* Event type — highlighted in primary accent colour */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {ev.eventType}
                    </span>
                  </td>

                  {/* Payload — truncated to 50 characters for readability */}
                  <td className="px-4 py-3 max-w-[200px]">
                    <span
                      className="font-mono text-xs text-foreground block truncate"
                      title={ev.payload}
                    >
                      {ev.payload.length > 50
                        ? `${ev.payload.slice(0, 50)}…`
                        : ev.payload}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {ev.publisherName}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {formatTimestamp(ev.timestamp)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Delivery Logs Table ──────────────────────────────────────────────────────
function DeliveryLogsTable({
  logs,
  isLoading,
  isError,
}: {
  logs: DeliveryLog[];
  isLoading: boolean;
  isError: boolean;
}) {
  // Sort newest first by deliveredAt
  const sorted = [...logs].sort((a, b) =>
    b.deliveredAt > a.deliveredAt ? 1 : -1,
  );

  return (
    <section
      data-ocid="logs.delivery.section"
      className="rounded-sm border border-border overflow-hidden"
    >
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border">
        <Activity className="w-3.5 h-3.5 text-accent" />
        <span className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Delivery Logs
        </span>
        <Badge
          variant="secondary"
          className="font-mono text-xs ml-auto"
          data-ocid="logs.delivery.count"
        >
          {logs.length}
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Event ID
              </th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Subscriber
              </th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Status
              </th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton cols={4} />
            ) : isError ? (
              <EmptyRow
                ocid="logs.delivery.error_state"
                message="⚠ Could not load delivery logs. Try refreshing."
              />
            ) : sorted.length === 0 ? (
              <EmptyRow
                ocid="logs.delivery.empty_state"
                message="No delivery logs yet. Publish an event to see delivery records here."
              />
            ) : (
              sorted.map((log, index) => (
                <tr
                  key={String(log.id)}
                  data-ocid={`logs.delivery.item.${index + 1}`}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors duration-150"
                >
                  {/* Event ID as a zero-padded identifier */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      #{String(log.eventId).padStart(4, "0")}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      {log.subscriberName}
                    </span>
                  </td>

                  {/* Status badge — GREEN for Delivered, RED for Failed */}
                  <td className="px-4 py-3">
                    <StatusBadge status={log.deliveryStatus} />
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {formatTimestamp(log.deliveredAt)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function Logs() {
  // React Query hook — fetches events from backend, auto-refreshes every 5s
  const {
    data: events = [],
    isLoading: eventsLoading,
    isError: eventsError,
  } = useGetEvents();

  // React Query hook — fetches delivery logs from backend
  const {
    data: deliveryLogs = [],
    isLoading: logsLoading,
    isError: logsError,
  } = useGetDeliveryLogs();

  // queryClient lets us manually trigger a re-fetch on demand
  const queryClient = useQueryClient();

  function handleRefresh() {
    // Invalidate cache → React Query re-fetches both queries immediately
    queryClient.invalidateQueries({ queryKey: ["events"] });
    queryClient.invalidateQueries({ queryKey: ["deliveryLogs"] });
  }

  return (
    <div className="space-y-6" data-ocid="logs.page">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h1 className="font-display text-lg font-semibold tracking-tight">
              Event Logs
            </h1>
          </div>
          {/* Brief description for non-technical audience (viva-friendly) */}
          <p className="text-sm text-muted-foreground max-w-xl">
            Every event published on the bus is recorded below. The{" "}
            <span className="font-mono text-foreground">Delivery Logs</span>{" "}
            table shows which subscriber received each event and whether
            delivery <span className="font-mono text-accent">succeeded</span> or{" "}
            <span className="font-mono text-destructive">failed</span>.
          </p>
        </div>

        {/* Manual refresh button */}
        <Button
          data-ocid="logs.refresh_button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="font-mono text-xs gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {/* ── Stats Strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3" data-ocid="logs.stats.section">
        {[
          { label: "Total Events", value: events.length },
          { label: "Total Deliveries", value: deliveryLogs.length },
          {
            label: "Success Rate",
            value:
              deliveryLogs.length === 0
                ? "—"
                : `${Math.round(
                    (deliveryLogs.filter(
                      (l) => l.deliveryStatus === "delivered",
                    ).length /
                      deliveryLogs.length) *
                      100,
                  )}%`,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-sm border border-border bg-card px-4 py-3"
          >
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              {label}
            </p>
            <p className="font-mono text-2xl font-bold text-foreground mt-0.5">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Event History Table ──────────────────────────────────────── */}
      <EventHistoryTable
        events={events}
        isLoading={eventsLoading}
        isError={eventsError}
      />

      {/* ── Delivery Logs Table ──────────────────────────────────────── */}
      <DeliveryLogsTable
        logs={deliveryLogs}
        isLoading={logsLoading}
        isError={logsError}
      />

      {/* ── Footer Explainer (viva-friendly) ────────────────────────── */}
      <div className="rounded-sm border border-border bg-card/50 px-4 py-3 text-xs text-muted-foreground font-mono space-y-1">
        <p>
          <span className="text-foreground font-semibold">Algorithm: </span>
          When a publisher sends an event, the backend{" "}
          <span className="text-primary">eventDispatcher</span> scans all active
          subscribers, matches them by eventType, dispatches the message, and
          writes one DeliveryLog per matched subscriber.
        </p>
        <p>
          Tables auto-refresh every 5 seconds via React Query. Use the{" "}
          <span className="text-foreground">Refresh</span> button for an
          immediate update.
        </p>
      </div>
    </div>
  );
}
