/**
 * Publisher.tsx — Page for creating and sending events onto the Event Bus
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 *  HOW THE PUBLISH-SUBSCRIBE PATTERN WORKS (for viva explanation):
 *
 *  1. A "publisher" writes a message called an EVENT.
 *  2. An event has a "type" (e.g. "user.signup") and a "payload" (the data).
 *  3. When the publisher sends the event, the backend's eventDispatcher runs:
 *       - Looks at ALL subscribers in the database.
 *       - Keeps only the ones whose subscribedEventType == event.eventType.
 *       - Delivers the event to each matching subscriber.
 *       - Writes a DeliveryLog for every delivery attempt.
 *  4. Subscribers who registered for a DIFFERENT type are NOT notified.
 *     This is the key idea: components stay decoupled — they don't talk to
 *     each other directly; everything goes through the bus.
 * └─────────────────────────────────────────────────────────────────────┘
 */

import { CheckCircle2, Info, Loader2, Radio, XCircle } from "lucide-react";
import { useState } from "react";
import { usePublishEvent } from "../hooks/useBackend";
import type { DeliveryLog } from "../types";
import { formatTimestamp } from "../types";

// ─── Common event-type suggestions shown as quick-pick chips ────────────────
// These help users see what event type strings look like in practice.
const EVENT_TYPE_SUGGESTIONS = [
  "user.signup",
  "order.placed",
  "payment.success",
  "alert.critical",
  "system.heartbeat",
];

// ─── Inline validation errors shape ─────────────────────────────────────────
// We use a plain object so we can show per-field error messages below each input.
interface FieldErrors {
  publisherName?: string;
  eventType?: string;
  payload?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Publisher — the main page component
// Default-exported so App.tsx can lazy-load it.
// Note: name is "Publisher" (not "PublisherPage") to match the lazy import.
// ─────────────────────────────────────────────────────────────────────────────
export default function Publisher() {
  // ── Form field state ───────────────────────────────────────────────────────
  // Each piece of text the user types is stored in its own state variable.
  const [publisherName, setPublisherName] = useState("Publisher-1");
  const [eventType, setEventType] = useState("");
  const [payload, setPayload] = useState(
    '{\n  "message": "Hello, subscribers!"\n}',
  );

  // ── Validation errors ──────────────────────────────────────────────────────
  // Only populated after the user tries to submit. Reset when field changes.
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // ── Result state ──────────────────────────────────────────────────────────
  // Holds the delivery logs from the last successful publish.
  // null means "not yet published". [] means "published but no matches".
  const [lastLogs, setLastLogs] = useState<DeliveryLog[] | null>(null);
  const [lastEventType, setLastEventType] = useState("");

  // ── usePublishEvent hook ──────────────────────────────────────────────────
  // useMutation from React Query — tracks loading/error state automatically.
  // mutate()       → fire-and-forget
  // mutateAsync()  → returns a Promise, lets us await the result here
  const publishMutation = usePublishEvent();
  const isLoading = publishMutation.isPending;

  // ─────────────────────────────────────────────────────────────────────────
  // validate — checks all fields are filled in
  // Returns true if valid, false if any field is empty.
  // Also sets per-field error messages so the UI can highlight them.
  // ─────────────────────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: FieldErrors = {};

    if (!publisherName.trim()) {
      errs.publisherName = "Publisher name is required.";
    }
    if (!eventType.trim()) {
      errs.eventType = "Event type is required.";
    }
    if (!payload.trim()) {
      errs.payload = "Payload is required.";
    }

    setFieldErrors(errs);
    // The form is valid only when there are no error entries
    return Object.keys(errs).length === 0;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // handlePublish — called when the user clicks "Publish Event"
  // ─────────────────────────────────────────────────────────────────────────
  async function handlePublish() {
    // Clear any previous result so the UI doesn't show stale data
    setLastLogs(null);

    // Stop here if validation fails — errors are already shown by validate()
    if (!validate()) return;

    try {
      // Call the Motoko backend via the hook.
      // The backend's eventDispatcher algorithm runs here (see utils/eventDispatcher.js
      // analogy in the Motoko backend).
      const data = await publishMutation.mutateAsync({
        eventType: eventType.trim(),
        payload: payload.trim(),
        publisherName: publisherName.trim(),
      });

      // Store result for the result panel
      setLastLogs(data.logs);
      setLastEventType(data.event.eventType);

      // ── Clear the form after a successful publish ──────────────────────
      setEventType("");
      setPayload('{\n  "message": "Hello, subscribers!"\n}');
      // publisherName is intentionally kept — users often publish multiple events
      setFieldErrors({});
    } catch {
      // Error is already tracked by publishMutation.error — nothing else needed
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Derived counts — used in the result panel summary
  // ─────────────────────────────────────────────────────────────────────────
  const deliveredCount =
    lastLogs?.filter((l) => l.deliveryStatus === "delivered").length ?? 0;
  const failedCount =
    lastLogs?.filter((l) => l.deliveryStatus !== "delivered").length ?? 0;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl space-y-6" data-ocid="publisher.page">
      {/* ── Page header ────────────────────────────────────────────────── */}
      {/* Explains what this page does — important for first-time users */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary/10">
          <Radio className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground tracking-tight">
            Publish Event
          </h2>
          <p className="font-body text-xs text-muted-foreground leading-relaxed">
            Fill in the form below to send a message onto the Event Bus. The
            backend will match the{" "}
            <span className="font-mono text-foreground">eventType</span> against
            all active subscribers and deliver the message only to those who
            registered for that type — everyone else is untouched.
          </p>
        </div>
      </div>

      {/* ── Publisher Form ─────────────────────────────────────────────── */}
      {/* noValidate disables the browser's built-in popups; we handle it ourselves */}
      <div
        className="rounded-sm border border-border bg-card p-6 space-y-5"
        data-ocid="publisher.form"
      >
        {/* ── Publisher Name field ──────────────────────────────────────── */}
        {/* Who is sending this event — e.g. "OrderService", "AuthService" */}
        <div className="space-y-1.5">
          <label htmlFor="publisher-name" className="event-header-mono">
            Publisher Name
          </label>
          <input
            id="publisher-name"
            type="text"
            value={publisherName}
            onChange={(e) => {
              setPublisherName(e.target.value);
              // Clear the error for this field as the user starts typing
              if (fieldErrors.publisherName)
                setFieldErrors((prev) => ({
                  ...prev,
                  publisherName: undefined,
                }));
            }}
            placeholder="e.g. OrderService"
            data-ocid="publisher.name.input"
            aria-describedby={
              fieldErrors.publisherName ? "err-publisher-name" : undefined
            }
            className="w-full rounded-sm border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {/* Inline validation error — shows only after a failed submit */}
          {fieldErrors.publisherName && (
            <p
              id="err-publisher-name"
              data-ocid="publisher.publisher_name.field_error"
              className="flex items-center gap-1 font-mono text-xs text-destructive"
            >
              <XCircle className="h-3 w-3 shrink-0" />
              {fieldErrors.publisherName}
            </p>
          )}
        </div>

        {/* ── Event Type field ──────────────────────────────────────────── */}
        {/* The category/topic of the event. Subscribers filter on this. */}
        <div className="space-y-1.5">
          <label htmlFor="event-type" className="event-header-mono">
            Event Type
          </label>
          <input
            id="event-type"
            type="text"
            value={eventType}
            onChange={(e) => {
              setEventType(e.target.value);
              if (fieldErrors.eventType)
                setFieldErrors((prev) => ({ ...prev, eventType: undefined }));
            }}
            placeholder="e.g. user.signup"
            data-ocid="publisher.event_type.input"
            aria-describedby={
              fieldErrors.eventType ? "err-event-type" : undefined
            }
            className="w-full rounded-sm border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {/* Inline error */}
          {fieldErrors.eventType && (
            <p
              id="err-event-type"
              data-ocid="publisher.event_type.field_error"
              className="flex items-center gap-1 font-mono text-xs text-destructive"
            >
              <XCircle className="h-3 w-3 shrink-0" />
              {fieldErrors.eventType}
            </p>
          )}
          {/* Quick-pick suggestion chips — click to fill the field */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {EVENT_TYPE_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setEventType(suggestion);
                  // Also clear the field error when a suggestion is picked
                  setFieldErrors((prev) => ({ ...prev, eventType: undefined }));
                }}
                data-ocid={`publisher.event_type_suggestion.${suggestion.replace(/\./g, "_")}`}
                className="rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-smooth hover:border-primary hover:text-primary"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* ── Payload field ─────────────────────────────────────────────── */}
        {/* The actual data to send — usually a JSON object */}
        <div className="space-y-1.5">
          <label htmlFor="payload" className="event-header-mono">
            Payload (JSON)
          </label>
          <textarea
            id="payload"
            rows={5}
            value={payload}
            onChange={(e) => {
              setPayload(e.target.value);
              if (fieldErrors.payload)
                setFieldErrors((prev) => ({ ...prev, payload: undefined }));
            }}
            placeholder='{ "key": "value" }'
            data-ocid="publisher.payload.textarea"
            aria-describedby={fieldErrors.payload ? "err-payload" : undefined}
            className="w-full rounded-sm border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          {/* Inline error */}
          {fieldErrors.payload && (
            <p
              id="err-payload"
              data-ocid="publisher.payload.field_error"
              className="flex items-center gap-1 font-mono text-xs text-destructive"
            >
              <XCircle className="h-3 w-3 shrink-0" />
              {fieldErrors.payload}
            </p>
          )}
        </div>

        {/* ── Submit button ─────────────────────────────────────────────── */}
        {/*
          - disabled while loading to prevent duplicate submissions
          - shows a spinner (Loader2 icon) while the backend call is in-flight
          - opacity-50 + cursor-not-allowed gives clear visual feedback
        */}
        <button
          type="button"
          onClick={handlePublish}
          disabled={isLoading}
          data-ocid="publisher.publish.submit_button"
          className="button-publish w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Publishing…
            </>
          ) : (
            <>
              <Radio className="h-4 w-4" /> Publish Event
            </>
          )}
        </button>

        {/* ── Backend / network error message ──────────────────────────── */}
        {/* This catches errors that happen AFTER validation — e.g. actor not ready */}
        {publishMutation.isError && (
          <div
            data-ocid="publisher.error_state"
            className="flex items-center gap-2 rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2"
          >
            <XCircle className="h-4 w-4 shrink-0 text-destructive" />
            <p className="font-mono text-xs text-destructive">
              {publishMutation.error instanceof Error
                ? publishMutation.error.message
                : "Publish failed. Please try again."}
            </p>
          </div>
        )}
      </div>

      {/* ── Result Panel ─────────────────────────────────────────────────── */}
      {/*
        Shown only after a successful publish.
        Visualises the output of the backend's eventDispatcher algorithm:
        — How many subscribers matched the event type
        — Each subscriber's name and delivery status
        — Timestamp of delivery
      */}
      {lastLogs !== null && (
        <div
          className="rounded-sm border border-border bg-card p-6 space-y-4"
          data-ocid="publisher.result.panel"
        >
          {/* Result panel header — summary of what happened */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Delivery Result
              </span>
            </div>

            {/* Subscriber count summary */}
            <div className="flex items-center gap-2">
              {deliveredCount > 0 && (
                <span
                  className="status-badge-success"
                  data-ocid="publisher.delivered_count"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {deliveredCount} delivered
                </span>
              )}
              {failedCount > 0 && (
                <span
                  className="status-badge-failed"
                  data-ocid="publisher.failed_count"
                >
                  <XCircle className="h-3 w-3" />
                  {failedCount} failed
                </span>
              )}
            </div>
          </div>

          {/* Event type + total subscribers matched */}
          <p className="font-mono text-xs text-muted-foreground">
            Event type:{" "}
            <span className="text-primary font-semibold">{lastEventType}</span>
            {" — "}
            {lastLogs.length === 0
              ? "No subscribers matched this event type."
              : `${lastLogs.length} subscriber${lastLogs.length !== 1 ? "s" : ""} matched and notified.`}
          </p>

          {/* Empty state — no subscribers were registered for this event type */}
          {lastLogs.length === 0 ? (
            <p
              className="rounded-sm border border-dashed border-border py-4 text-center font-mono text-xs text-muted-foreground"
              data-ocid="publisher.result.empty_state"
            >
              Go to the <strong>Subscriber</strong> page and register a
              subscriber for{" "}
              <span className="text-foreground">{lastEventType}</span> first.
            </p>
          ) : (
            /* Delivery log list — one row per matched subscriber */
            <div className="space-y-2" data-ocid="publisher.result.list">
              {lastLogs.map((log, i) => (
                <div
                  key={String(log.id)}
                  data-ocid={`publisher.result.item.${i + 1}`}
                  className="flex items-center gap-3 rounded-sm border border-border bg-background px-4 py-2"
                >
                  {/* Status icon — green check or red X */}
                  {log.deliveryStatus === "delivered" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                  )}

                  {/* Subscriber name — truncated if too long */}
                  <span className="flex-1 font-mono text-xs text-foreground min-w-0 truncate">
                    {log.subscriberName}
                  </span>

                  {/* Delivery status badge — uses CSS utility classes from index.css */}
                  <span
                    className={
                      log.deliveryStatus === "delivered"
                        ? "status-badge-success"
                        : "status-badge-failed"
                    }
                  >
                    {log.deliveryStatus}
                  </span>

                  {/* Timestamp — formatted from nanoseconds using helpers in types.ts */}
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                    {formatTimestamp(log.deliveredAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
