// mixins/eventbus-api.mo
// ─────────────────────────────────────────────────────────────────────────────
// Public API mixin for the Event Bus System.
// Exposes all the canister endpoints that the frontend will call.
// State is injected from main.mo — this mixin never owns state directly.
//
// Endpoints:
//   publishEvent    → publish a new event and dispatch to matching subscribers
//   subscribe       → register a new subscriber
//   unsubscribe     → remove a subscriber by ID
//   getSubscribers  → list all active subscribers (query — free, no consensus)
//   getEvents       → list all published events (query)
//   getDeliveryLogs → list all delivery records (query)
// ─────────────────────────────────────────────────────────────────────────────

import List      "mo:core/List";
import EventLib  "../lib/eventbus";
import Types     "../types/eventbus";
import Common    "../types/common";

// Mixin declarations must be at the top level — not inside a module block.
// The mixin receives all state slices as parameters from main.mo.
mixin (
  subscribers  : List.List<Types.Subscriber>,
  events       : List.List<Types.Event>,
  deliveryLogs : List.List<Types.DeliveryLog>,
  nextSubId    : { var value : Common.Id },
  nextEventId  : { var value : Common.Id },
  nextLogId    : { var value : Common.Id },
) {

  // ── publishEvent ──────────────────────────────────────────────────────────
  // This function is called when a Publisher wants to fire an event onto the bus.
  //
  // What it does (step by step):
  //   1. Grab the next available event ID from the counter and increment it.
  //   2. Build a new Event record using lib/eventbus.mo's newEvent().
  //   3. Save the event into the persistent `events` list.
  //   4. Run the dispatch algorithm — find all matching subscribers.
  //   5. Save each delivery log into the persistent `deliveryLogs` list.
  //   6. Advance the log ID counter past however many logs were created.
  //   7. Return both the Event and the array of DeliveryLogs to the caller.
  //
  // Returns: (Event, [DeliveryLog]) — the event itself + all dispatch records.
  public func publishEvent(
    eventType     : Text,
    payload       : Text,
    publisherName : Text,
  ) : async (Types.Event, [Types.DeliveryLog]) {

    // Step 1 — Assign a unique ID to this new event.
    let eventId = nextEventId.value;
    nextEventId.value := nextEventId.value + 1;

    // Step 2 — Create the Event record (with current timestamp).
    let newEvent = EventLib.newEvent(eventId, eventType, payload, publisherName);

    // Step 3 — Persist the event in canister state.
    events.add(newEvent);

    // Step 4 — Run the event dispatch algorithm.
    // This checks every subscriber and creates a DeliveryLog for each match.
    // We pass nextLogId.value so log IDs continue from where we left off.
    let newLogs = EventLib.dispatchEvent(newEvent, subscribers, nextLogId.value);

    // Step 5 — Save all generated delivery logs into canister state.
    // We iterate the returned array and add each log to the persistent list.
    for (log in newLogs.vals()) {
      deliveryLogs.add(log);
    };

    // Step 6 — Advance the log ID counter by however many logs were created.
    // newLogs.size() tells us how many matching subscribers were found.
    nextLogId.value := nextLogId.value + newLogs.size();

    // Step 7 — Return the event and delivery logs to the frontend.
    (newEvent, newLogs)
  };

  // ── subscribe ─────────────────────────────────────────────────────────────
  // Register a new component as a subscriber on the event bus.
  //
  // What it does:
  //   1. Assign a unique subscriber ID.
  //   2. Build a Subscriber record.
  //   3. Save it in the persistent list.
  //   4. Return the new Subscriber to the caller.
  //
  // Parameters:
  //   name      — a label for this subscriber (e.g. "NotificationService")
  //   eventType — the type of event this subscriber wants to receive
  public func subscribe(
    name      : Text,
    eventType : Text,
  ) : async Types.Subscriber {

    // Step 1 — Get the next subscriber ID and increment the counter.
    let subId = nextSubId.value;
    nextSubId.value := nextSubId.value + 1;

    // Step 2 — Build the Subscriber record using the lib helper.
    let newSub = EventLib.newSubscriber(subId, name, eventType);

    // Step 3 — Persist the subscriber so future dispatches will include them.
    subscribers.add(newSub);

    // Step 4 — Return the created subscriber (useful for the frontend to display).
    newSub
  };

  // ── unsubscribe ───────────────────────────────────────────────────────────
  // Remove a subscriber from the event bus by their unique ID.
  // After this call, the subscriber will no longer receive any events.
  //
  // Parameters:
  //   subscriberId — the numeric ID of the subscriber to remove
  //
  // Returns: true if the subscriber was found and removed; false if not found.
  public func unsubscribe(subscriberId : Common.Id) : async Bool {
    // Delegate to the lib function which handles the list filtering.
    EventLib.removeSubscriber(subscribers, subscriberId)
  };

  // ── getSubscribers ────────────────────────────────────────────────────────
  // Return the current list of all active subscribers.
  //
  // 'query' means this call is FREE and FAST:
  //   → No blockchain consensus is needed (read-only).
  //   → Response comes back almost instantly.
  //   → Perfect for displaying a live subscriber table in the UI.
  public query func getSubscribers() : async [Types.Subscriber] {
    // Convert the internal mutable List to an immutable array for the response.
    subscribers.toArray()
  };

  // ── getEvents ─────────────────────────────────────────────────────────────
  // Return the full history of all published events.
  // Also a 'query' call — free and fast.
  public query func getEvents() : async [Types.Event] {
    events.toArray()
  };

  // ── getDeliveryLogs ───────────────────────────────────────────────────────
  // Return the full delivery log — every dispatch record ever created.
  // Shows which subscriber received which event, and when.
  public query func getDeliveryLogs() : async [Types.DeliveryLog] {
    deliveryLogs.toArray()
  };

};
