// types/common.mo
// ─────────────────────────────────────────────────────────────────────────────
// Shared cross-cutting types used across all domains of the Event Bus system.
// Think of these as the "vocabulary" that every module speaks.
// ─────────────────────────────────────────────────────────────────────────────

module {

  // A unique numeric identifier — used for Subscribers, Events, DeliveryLogs.
  // We use Nat (natural number) so IDs are always positive and auto-increment.
  public type Id = Nat;

  // A point in time stored as nanoseconds since the Unix epoch.
  // Time.now() from mo:core/Time returns this type.
  public type Timestamp = Int;

};
