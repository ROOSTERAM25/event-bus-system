/**
 * types.ts — Shared TypeScript interfaces for the Event Bus System
 *
 * These types mirror the backend Motoko data structures so that
 * the frontend and backend always stay in sync.
 *
 * NOTE: Motoko uses `bigint` for Nat/Int types. We keep that here
 * so the compiler can catch any mismatches early.
 */

// --------------------------------------------------------------------------
// Subscriber — a component that wants to receive events of a specific type
// --------------------------------------------------------------------------
export interface Subscriber {
  id: bigint;
  name: string;
  subscribedEventType: string;
  createdAt: bigint; // Unix timestamp in nanoseconds from Motoko
}

// --------------------------------------------------------------------------
// Event — a message published on the bus by a publisher
// --------------------------------------------------------------------------
export interface Event {
  id: bigint;
  eventType: string;
  payload: string;
  publisherName: string;
  timestamp: bigint; // Unix timestamp in nanoseconds
}

// --------------------------------------------------------------------------
// DeliveryLog — records whether an event reached a specific subscriber
// --------------------------------------------------------------------------
export interface DeliveryLog {
  id: bigint;
  eventId: bigint;
  subscriberId: bigint;
  subscriberName: string;
  deliveryStatus: string; // "delivered" | "failed"
  deliveredAt: bigint; // Unix timestamp in nanoseconds
}

// --------------------------------------------------------------------------
// Helpers — convert nanosecond bigint timestamps to JS Date
// --------------------------------------------------------------------------
export function toDate(ns: bigint): Date {
  // Motoko timestamps are in nanoseconds; JS Date uses milliseconds
  return new Date(Number(ns / 1_000_000n));
}

export function formatTimestamp(ns: bigint): string {
  return toDate(ns).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
