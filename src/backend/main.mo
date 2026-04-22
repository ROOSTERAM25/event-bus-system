// main.mo
// ─────────────────────────────────────────────────────────────────────────────
// Composition root for the Event Bus System canister.
//
// This file:
//   1. Declares all canister state (lists and counters).
//   2. Wires state into mixins using `include`.
//   3. Contains NO business logic — all logic lives in lib/ and mixins/.
//
// Enhanced Orthogonal Persistence is used — no `stable` keyword needed.
// State is automatically persisted across canister upgrades.
// ─────────────────────────────────────────────────────────────────────────────

import List        "mo:core/List";
import Types       "types/eventbus";
import EventBusApi "mixins/eventbus-api";

actor {

  // ── State: Subscriber list ────────────────────────────────────────────────
  // Holds all active subscribers. Updated when subscribe() or unsubscribe() is called.
  let subscribers = List.empty<Types.Subscriber>();

  // ── State: Event list ─────────────────────────────────────────────────────
  // Holds all published events for historical reference.
  let events = List.empty<Types.Event>();

  // ── State: Delivery log list ──────────────────────────────────────────────
  // Records every delivery attempt made by the dispatch algorithm.
  let deliveryLogs = List.empty<Types.DeliveryLog>();

  // ── State: Auto-increment counters ───────────────────────────────────────
  // Each counter generates unique IDs for a given entity type.
  // They start at 1 and increment by 1 on every create operation.
  // We use a mutable record field (`var value`) so the mixin can update them.
  var nextSubId   : { var value : Nat } = { var value = 1 };
  var nextEventId : { var value : Nat } = { var value = 1 };
  var nextLogId   : { var value : Nat } = { var value = 1 };

  // ── Include mixin ─────────────────────────────────────────────────────────
  // Inject all state slices into the API mixin.
  // The mixin exposes publishEvent, subscribe, unsubscribe, getSubscribers,
  // getEvents, and getDeliveryLogs as public canister endpoints.
  include EventBusApi(
    subscribers,
    events,
    deliveryLogs,
    nextSubId,
    nextEventId,
    nextLogId,
  );

};
