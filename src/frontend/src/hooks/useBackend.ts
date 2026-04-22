/**
 * useBackend.ts — React Query hooks for the Event Bus backend
 *
 * Every data operation goes through these hooks. They call the
 * Motoko canister via `useActor` and cache results with React Query.
 *
 * Beginner note:
 *  - useQuery   → reads data (GET equivalent)
 *  - useMutation → writes data (POST/DELETE equivalent)
 *  - queryClient.invalidateQueries → refreshes cached data after a mutation
 */

import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { DeliveryLog, Event, Subscriber } from "../types";

// ---------- Query keys — used to identify cached data ----------
const KEYS = {
  subscribers: ["subscribers"] as const,
  events: ["events"] as const,
  deliveryLogs: ["deliveryLogs"] as const,
};

// --------------------------------------------------------------------------
// useGetSubscribers — fetches the list of all active subscribers
// --------------------------------------------------------------------------
export function useGetSubscribers() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Subscriber[]>({
    queryKey: KEYS.subscribers,
    queryFn: async () => {
      if (!actor) return [];
      // Call backend method — returns Subscriber[]
      const result = await actor.getSubscribers();
      return result as Subscriber[];
    },
    // Only run when actor is ready
    enabled: !!actor && !isFetching,
    // Refresh every 5 seconds to show live updates
    refetchInterval: 5000,
  });
}

// --------------------------------------------------------------------------
// useGetEvents — fetches the list of all published events
// --------------------------------------------------------------------------
export function useGetEvents() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Event[]>({
    queryKey: KEYS.events,
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getEvents();
      return result as Event[];
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

// --------------------------------------------------------------------------
// useGetDeliveryLogs — fetches the delivery log records
// --------------------------------------------------------------------------
export function useGetDeliveryLogs() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<DeliveryLog[]>({
    queryKey: KEYS.deliveryLogs,
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getDeliveryLogs();
      return result as DeliveryLog[];
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

// --------------------------------------------------------------------------
// usePublishEvent — sends a new event onto the bus
//
// Algorithm: the backend's eventDispatcher matches the eventType against
// all active subscribers and creates a DeliveryLog for each one.
// Returns the new Event plus the resulting DeliveryLogs.
// --------------------------------------------------------------------------
export function usePublishEvent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      eventType: string;
      payload: string;
      publisherName: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const [event, logs] = await actor.publishEvent(
        params.eventType,
        params.payload,
        params.publisherName,
      );
      return { event: event as Event, logs: logs as DeliveryLog[] };
    },
    onSuccess: () => {
      // Refresh events and delivery logs after a new publish
      queryClient.invalidateQueries({ queryKey: KEYS.events });
      queryClient.invalidateQueries({ queryKey: KEYS.deliveryLogs });
    },
  });
}

// --------------------------------------------------------------------------
// useSubscribe — registers a new subscriber for a specific event type
// --------------------------------------------------------------------------
export function useSubscribe() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; eventType: string }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.subscribe(params.name, params.eventType);
      return result as Subscriber;
    },
    onSuccess: () => {
      // Refresh the subscriber list
      queryClient.invalidateQueries({ queryKey: KEYS.subscribers });
    },
  });
}

// --------------------------------------------------------------------------
// useUnsubscribe — removes a subscriber by their ID
// --------------------------------------------------------------------------
export function useUnsubscribe() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriberId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      const success = await actor.unsubscribe(subscriberId);
      if (!success) throw new Error("Unsubscribe failed — ID not found");
      return success;
    },
    onSuccess: () => {
      // Refresh subscribers and logs after removal
      queryClient.invalidateQueries({ queryKey: KEYS.subscribers });
      queryClient.invalidateQueries({ queryKey: KEYS.deliveryLogs });
    },
  });
}
