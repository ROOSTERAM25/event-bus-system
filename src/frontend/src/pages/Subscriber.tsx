/**
 * Subscriber.tsx — Subscriber Management Page
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  HOW SUBSCRIBE / UNSUBSCRIBE WORKS  (viva explanation)              ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║                                                                      ║
 * ║  SUBSCRIBE:                                                          ║
 * ║  1. User enters a component name and the event type they care about. ║
 * ║  2. Frontend calls actor.subscribe(name, eventType) on the backend.  ║
 * ║  3. Backend stores the subscriber in its canister state list.        ║
 * ║  4. From this point, any event of that type published on the bus     ║
 * ║     will be delivered to this subscriber automatically.              ║
 * ║                                                                      ║
 * ║  UNSUBSCRIBE:                                                        ║
 * ║  1. User clicks the trash icon / "Unsubscribe" button on a row.      ║
 * ║  2. A confirmation dialog is shown to prevent accidental removal.    ║
 * ║  3. If confirmed, frontend calls actor.unsubscribe(id).              ║
 * ║  4. Backend removes the record — that component gets no more events. ║
 * ║                                                                      ║
 * ║  KEY CONCEPT — Decoupling:                                           ║
 * ║  Publishers and subscribers never call each other directly.          ║
 * ║  The Event Bus routes messages between them, so they remain fully    ║
 * ║  independent (decoupled). This is the Publish-Subscribe pattern.     ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Trash2, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetSubscribers,
  useSubscribe,
  useUnsubscribe,
} from "../hooks/useBackend";
// IMPORTANT: alias the type so it doesn't clash with the component named "Subscriber" below.
import type { Subscriber as SubscriberType } from "../types";
import { formatTimestamp } from "../types";

// ---------- Quick-pick event type suggestions (beginner-friendly) ----------
const EVENT_SUGGESTIONS = [
  "user.signup",
  "order.placed",
  "payment.success",
  "alert.critical",
  "system.heartbeat",
];

// ── Confirmation dialog — shown before removing a subscriber ───────────────
// This prevents accidental unsubscriptions by requiring explicit confirmation.
interface ConfirmDialogProps {
  subscriber: SubscriberType;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  subscriber,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    // Semi-transparent backdrop covers the whole screen
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      data-ocid="unsubscribe.dialog"
    >
      <div className="w-full max-w-sm rounded-sm border border-border bg-card p-6 shadow-lg">
        <h2
          id="confirm-dialog-title"
          className="font-display text-sm font-semibold text-foreground"
        >
          Confirm Unsubscribe
        </h2>

        <p className="mt-2 font-mono text-xs text-muted-foreground leading-relaxed">
          Remove{" "}
          <span className="font-semibold text-foreground">
            {subscriber.name}
          </span>{" "}
          from{" "}
          <span className="font-semibold text-primary">
            {subscriber.subscribedEventType}
          </span>{" "}
          events?
          <br />
          They will no longer receive messages of this type.
        </p>

        <div className="mt-5 flex justify-end gap-3">
          {/* Cancel — close dialog, no change */}
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            data-ocid="unsubscribe.cancel_button"
            className="rounded-sm border border-border bg-muted px-4 py-1.5 font-mono text-xs text-foreground transition-smooth hover:bg-muted/60 disabled:opacity-50"
          >
            Cancel
          </button>

          {/* Confirm — actually calls the backend */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            data-ocid="unsubscribe.confirm_button"
            className="flex items-center gap-2 rounded-sm border border-destructive bg-destructive px-4 py-1.5 font-mono text-xs text-destructive-foreground transition-smooth hover:opacity-80 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Removing…
              </>
            ) : (
              "Yes, Unsubscribe"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Single subscriber row card ─────────────────────────────────────────────
function SubRow({
  sub,
  index,
  onUnsubscribeClick,
}: {
  sub: SubscriberType;
  index: number;
  /** Called when the unsubscribe button is pressed — opens the dialog */
  onUnsubscribeClick: (s: SubscriberType) => void;
}) {
  return (
    <div
      data-ocid={`subscriber.item.${index}`}
      className="flex items-center gap-4 rounded-sm border border-border bg-card px-4 py-3 transition-colors duration-150 hover:bg-muted/20"
    >
      {/* Initials avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-secondary/20 font-mono text-xs font-semibold text-foreground">
        {sub.name.slice(0, 2).toUpperCase()}
      </div>

      {/* Name + subscribed event type */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-sm font-semibold text-foreground">
          {sub.name}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">
          listens to:{" "}
          <span className="text-primary">{sub.subscribedEventType}</span>
        </p>
      </div>

      {/* Subscription time (hidden on very small screens) */}
      <span className="hidden shrink-0 font-mono text-[10px] text-muted-foreground sm:block">
        {formatTimestamp(sub.createdAt)}
      </span>

      {/* Unsubscribe icon button — opens confirmation dialog */}
      <button
        type="button"
        onClick={() => onUnsubscribeClick(sub)}
        data-ocid={`subscriber.delete_button.${index}`}
        aria-label={`Unsubscribe ${sub.name}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-border text-muted-foreground transition-smooth hover:border-destructive hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ── Main page component ────────────────────────────────────────────────────
export default function Subscriber() {
  // Form field state
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");

  // Which subscriber is pending confirmation for unsubscription?
  // null = dialog closed; a SubscriberType value = dialog open for that entry.
  const [pendingUnsubscribe, setPendingUnsubscribe] =
    useState<SubscriberType | null>(null);

  // Backend hooks
  const { data: subscribers = [], isLoading } = useGetSubscribers();
  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();

  // ── Handle the Subscribe form ────────────────────────────────────────────
  function handleSubscribe() {
    if (!name.trim() || !eventType.trim()) {
      toast.error("Please enter both a name and an event type.");
      return;
    }
    subscribeMutation.mutate(
      { name: name.trim(), eventType: eventType.trim() },
      {
        onSuccess: (sub) => {
          // Show a friendly toast and clear the form
          toast.success(
            `"${sub.name}" subscribed to "${sub.subscribedEventType}"`,
          );
          setName("");
          setEventType("");
        },
        onError: (err) =>
          toast.error(`Subscribe failed: ${(err as Error).message}`),
      },
    );
  }

  // ── Called after user confirms the dialog ───────────────────────────────
  function handleConfirmedUnsubscribe() {
    if (!pendingUnsubscribe) return;

    unsubscribeMutation.mutate(pendingUnsubscribe.id, {
      onSuccess: () => {
        toast.success(`"${pendingUnsubscribe.name}" unsubscribed.`);
        setPendingUnsubscribe(null); // close dialog
      },
      onError: (err) => {
        toast.error(`Unsubscribe failed: ${(err as Error).message}`);
        setPendingUnsubscribe(null); // close dialog even on error
      },
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6" data-ocid="subscriber.page">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-chart-2/10">
          <Users className="h-5 w-5 text-chart-2" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Subscribers
          </h2>
          <p className="font-body text-xs text-muted-foreground">
            Register a component to listen for a specific event type on the
            Event Bus.
          </p>
        </div>
      </div>

      {/* ── Subscribe form ────────────────────────────────────────────── */}
      <div
        className="space-y-5 rounded-sm border border-border bg-card p-6"
        data-ocid="subscriber.form"
      >
        <p className="event-header-mono">New Subscriber</p>

        {/* Two-column grid on wider screens */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Subscriber name */}
          <div className="space-y-1.5">
            <label
              htmlFor="sub-name"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              Subscriber Name
            </label>
            <input
              id="sub-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. EmailService"
              data-ocid="subscriber.name.input"
              className="w-full rounded-sm border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Event type */}
          <div className="space-y-1.5">
            <label
              htmlFor="sub-event"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              Event Type to Listen
            </label>
            <input
              id="sub-event"
              type="text"
              required
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="e.g. user.signup"
              data-ocid="subscriber.event_type.input"
              className="w-full rounded-sm border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Quick-pick chips — click to auto-fill the event type field */}
        <div className="flex flex-wrap gap-1.5">
          {EVENT_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setEventType(s)}
              data-ocid={`subscriber.event_suggestion.${s.replace(/\./g, "_")}`}
              className="rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-smooth hover:border-chart-2 hover:text-chart-2"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={subscribeMutation.isPending}
          data-ocid="subscriber.subscribe.submit_button"
          className="button-publish w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {subscribeMutation.isPending ? (
            <>
              <Loader2
                className="h-4 w-4 animate-spin"
                data-ocid="subscriber.subscribe.loading_state"
              />{" "}
              Subscribing…
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" /> Subscribe
            </>
          )}
        </button>
      </div>

      {/* ── Active subscribers list ───────────────────────────────────── */}
      <div className="space-y-3" data-ocid="subscriber.list">
        <div className="flex items-center justify-between">
          <span className="event-header-mono">Active Subscribers</span>
          <span className="font-mono text-xs text-muted-foreground">
            {subscribers.length} total
          </span>
        </div>

        {/* Loading skeleton — shown while data is being fetched */}
        {isLoading ? (
          <div className="space-y-2" data-ocid="subscriber.list.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-sm" />
            ))}
          </div>
        ) : subscribers.length === 0 ? (
          // Empty state — shown when there are no subscribers yet
          <div
            className="rounded-sm border border-dashed border-border bg-muted/30 p-8 text-center"
            data-ocid="subscriber.list.empty_state"
          >
            <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
            <p className="font-mono text-sm text-muted-foreground">
              No subscribers yet
            </p>
            <p className="font-body mt-1 text-xs text-muted-foreground">
              Use the form above to add the first subscriber.
            </p>
          </div>
        ) : (
          // Subscriber card rows
          <div className="space-y-2">
            {subscribers.map((sub, i) => (
              <SubRow
                key={String(sub.id)}
                sub={sub}
                index={i + 1}
                // Opens the confirm dialog instead of deleting immediately
                onUnsubscribeClick={setPendingUnsubscribe}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Confirmation dialog overlay ──────────────────────────────── */}
      {/* Renders only when pendingUnsubscribe is set (user clicked trash icon) */}
      {pendingUnsubscribe && (
        <ConfirmDialog
          subscriber={pendingUnsubscribe}
          isLoading={unsubscribeMutation.isPending}
          onConfirm={handleConfirmedUnsubscribe}
          onCancel={() => setPendingUnsubscribe(null)}
        />
      )}
    </div>
  );
}
