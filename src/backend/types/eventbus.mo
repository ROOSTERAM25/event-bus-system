// types/eventbus.mo
// ─────────────────────────────────────────────────────────────────────────────
// All domain-specific types for the Event Bus System.
// Three main entities: Subscriber, Event, DeliveryLog.
// These are "shared" types — safe to send across canister calls.
// ─────────────────────────────────────────────────────────────────────────────

import Common "common";

module {

  // ── Subscriber ────────────────────────────────────────────────────────────
  // Represents a component that has registered interest in a specific event type.
  // Example: A "notification service" subscribes to "USER_SIGNUP" events.
  public type Subscriber = {
    id                  : Common.Id;        // unique numeric ID
    name                : Text;             // human-readable name, e.g. "EmailService"
    subscribedEventType : Text;             // the event type this subscriber listens to
    createdAt           : Common.Timestamp; // when the subscription was created
  };

  // ── Event ─────────────────────────────────────────────────────────────────
  // Represents a message published onto the event bus.
  // Example: publisher "AuthService" publishes eventType "USER_SIGNUP" with
  //          payload '{"userId": 42, "email": "alice@example.com"}'.
  public type Event = {
    id            : Common.Id;        // unique numeric ID
    eventType     : Text;             // category/label for the event
    payload       : Text;             // the actual message content (JSON string or plain text)
    publisherName : Text;             // name of the component that fired the event
    timestamp     : Common.Timestamp; // when the event was published
  };

  // ── DeliveryLog ───────────────────────────────────────────────────────────
  // Records whether a specific event was successfully delivered to a subscriber.
  // The dispatch algorithm creates one DeliveryLog per (event, matching subscriber) pair.
  public type DeliveryLog = {
    id             : Common.Id;        // unique numeric ID
    eventId        : Common.Id;        // which event was delivered
    subscriberId   : Common.Id;        // which subscriber received it
    subscriberName : Text;             // subscriber name (denormalized for easy display)
    deliveryStatus : Text;             // "Delivered" or "Failed"
    deliveredAt    : Common.Timestamp; // when the delivery was attempted
  };

};
