// lib/eventbus.mo
// ─────────────────────────────────────────────────────────────────────────────
// Domain logic for the Event Bus System.
// This module contains pure functions that operate on state passed in from main.mo.
// No state is stored here — state lives in main.mo (enhanced orthogonal persistence).
//
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║          WHAT IS THE PUBLISH-SUBSCRIBE (Pub/Sub) PATTERN?               ║
// ║                                                                          ║
// ║  Imagine a newspaper company (Publisher) and multiple readers             ║
// ║  (Subscribers). The newspaper doesn't know who is reading — it just       ║
// ║  prints and drops copies. Each reader picks up only the sections they     ║
// ║  care about.                                                              ║
// ║                                                                          ║
// ║  In software:                                                             ║
// ║    • Publisher  → fires an event (e.g. "USER_SIGNED_UP")                 ║
// ║    • Event Bus  → the central broker that routes events                  ║
// ║    • Subscriber → any component that said "notify me for USER_SIGNED_UP" ║
// ║                                                                          ║
// ║  Key benefit: Publishers and Subscribers are DECOUPLED — they don't      ║
// ║  know about each other. This makes systems easier to extend and test.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// KEY ALGORITHM: dispatchEvent()
//   1. Receive the newly published event.
//   2. Iterate through ALL subscribers in the list.
//   3. For each subscriber, check: subscribedEventType == event.eventType?
//   4. If YES → create a DeliveryLog with status "Delivered".
//   5. If NO  → skip (subscriber is not interested in this event type).
//   6. Return all created DeliveryLog entries.
// ─────────────────────────────────────────────────────────────────────────────

import List   "mo:core/List";
import Time   "mo:core/Time";
import Types  "../types/eventbus";
import Common "../types/common";

module {

  // ── Subscriber operations ─────────────────────────────────────────────────

  /// Create a new Subscriber record with a generated ID and the current timestamp.
  /// Called when a component calls subscribe(name, eventType).
  ///
  /// Parameters:
  ///   id        — the auto-incremented unique ID assigned by main.mo
  ///   name      — human-readable label for this subscriber (e.g. "BillingService")
  ///   eventType — the event type string this subscriber wants to receive
  ///
  /// Returns: a fully populated Subscriber record (immutable, safe to share).
  public func newSubscriber(
    id        : Common.Id,
    name      : Text,
    eventType : Text,
  ) : Types.Subscriber {
    // Build the Subscriber record with all required fields.
    // Time.now() gives us the current canister clock in nanoseconds.
    {
      id                  = id;
      name                = name;
      subscribedEventType = eventType;
      createdAt           = Time.now();
    }
  };

  /// Remove a subscriber by ID from the mutable List.
  /// Scans through the list, keeps every subscriber whose ID is NOT the target.
  ///
  /// Parameters:
  ///   subscribers  — the live List of all active subscribers
  ///   subscriberId — the ID of the subscriber to remove
  ///
  /// Returns: true if a subscriber was found and removed; false otherwise.
  public func removeSubscriber(
    subscribers  : List.List<Types.Subscriber>,
    subscriberId : Common.Id,
  ) : Bool {
    // Step 1 — Check if the subscriber exists before trying to remove it.
    // We use find() which returns ?Subscriber (Some or null).
    let found = subscribers.find(func(s : Types.Subscriber) : Bool {
      s.id == subscriberId
    });

    // Step 2 — If not found, return false immediately (nothing to remove).
    switch (found) {
      case (null) { false };
      case (?_) {
        // Step 3 — Keep every subscriber EXCEPT the one matching the target ID.
        // retain() removes items in-place that do NOT satisfy the predicate,
        // so we pass the OPPOSITE condition (keep where id != target).
        subscribers.retain(func(s : Types.Subscriber) : Bool {
          s.id != subscriberId
        });
        true
      };
    }
  };

  // ── Event operations ──────────────────────────────────────────────────────

  /// Create a new Event record with a generated ID and current timestamp.
  /// Called when a publisher calls publishEvent(eventType, payload, publisherName).
  ///
  /// Parameters:
  ///   id            — the auto-incremented unique ID assigned by main.mo
  ///   eventType     — label/category for this event (e.g. "ORDER_PLACED")
  ///   payload       — the message body (plain text or JSON string)
  ///   publisherName — who fired this event (e.g. "CheckoutService")
  ///
  /// Returns: a fully populated Event record.
  public func newEvent(
    id            : Common.Id,
    eventType     : Text,
    payload       : Text,
    publisherName : Text,
  ) : Types.Event {
    // Build the Event record. timestamp captures the exact moment of publishing.
    {
      id            = id;
      eventType     = eventType;
      payload       = payload;
      publisherName = publisherName;
      timestamp     = Time.now();
    }
  };

  // ── Event Dispatch Algorithm ──────────────────────────────────────────────
  //
  // ┌─────────────────────────────────────────────────────────────────────┐
  // │  STEP-BY-STEP WALKTHROUGH (for college viva explanation):           │
  // │                                                                     │
  // │  Input:  event = { eventType: "USER_SIGNUP", ... }                  │
  // │          subscribers = [                                            │
  // │            { name: "EmailSvc", subscribedEventType: "USER_SIGNUP" } │
  // │            { name: "LogSvc",   subscribedEventType: "ORDER_PLACED" }│
  // │          ]                                                          │
  // │                                                                     │
  // │  Algorithm:                                                         │
  // │    for each subscriber in subscribers:                              │
  // │      if subscriber.subscribedEventType == event.eventType:          │
  // │        → match! create DeliveryLog { status: "Delivered" }          │
  // │      else:                                                          │
  // │        → no match, skip                                             │
  // │                                                                     │
  // │  Output: [ DeliveryLog { subscriberName: "EmailSvc", ... } ]        │
  // │          (LogSvc is skipped — it doesn't care about USER_SIGNUP)    │
  // └─────────────────────────────────────────────────────────────────────┘
  //
  /// Dispatch an event to all matching subscribers.
  /// Returns an array of DeliveryLog records — one entry per matched subscriber.
  ///
  /// Parameters:
  ///   event       — the event that was just published
  ///   subscribers — all active subscribers on the bus
  ///   nextLogId   — starting log ID counter (will be incremented per log entry)
  public func dispatchEvent(
    event       : Types.Event,
    subscribers : List.List<Types.Subscriber>,
    nextLogId   : Common.Id,
  ) : [Types.DeliveryLog] {

    // We build up the delivery logs into a mutable local List.
    let logs = List.empty<Types.DeliveryLog>();

    // logCounter tracks the ID for each new DeliveryLog we create.
    // Each matching subscriber gets its own log entry with a unique ID.
    var logCounter : Nat = nextLogId;

    // ── CORE LOOP: iterate over every registered subscriber ──────────────
    // forEach visits each subscriber one by one, in insertion order.
    subscribers.forEach(func(subscriber : Types.Subscriber) {

      // ── MATCHING STEP ─────────────────────────────────────────────────
      // This is the heart of the publish-subscribe pattern:
      // Only deliver the event to subscribers who asked for THIS event type.
      if (subscriber.subscribedEventType == event.eventType) {

        // ── DELIVERY LOG CREATION ──────────────────────────────────────
        // We matched! Record a delivery log for this (event, subscriber) pair.
        let deliveryLog : Types.DeliveryLog = {
          id             = logCounter;         // unique log ID
          eventId        = event.id;           // which event
          subscriberId   = subscriber.id;      // which subscriber
          subscriberName = subscriber.name;    // name for easy display
          deliveryStatus = "Delivered";        // status: successfully dispatched
          deliveredAt    = Time.now();         // timestamp of delivery
        };

        // Add the log entry to our result collection.
        logs.add(deliveryLog);

        // Increment the counter so the next log gets a different ID.
        logCounter := logCounter + 1;
      };
      // If there's no match, we simply do nothing — that subscriber
      // is not interested in this event type, so we skip it entirely.
    });

    // Convert the mutable List to an immutable array for the return value.
    // Immutable arrays are "shared types" — safe to return across canister calls.
    logs.toArray()
  };

};
