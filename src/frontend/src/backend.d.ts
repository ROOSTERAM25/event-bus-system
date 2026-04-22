import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Event {
    id: Id;
    publisherName: string;
    timestamp: Timestamp;
    payload: string;
    eventType: string;
}
export interface Subscriber {
    id: Id;
    name: string;
    createdAt: Timestamp;
    subscribedEventType: string;
}
export type Timestamp = bigint;
export interface DeliveryLog {
    id: Id;
    eventId: Id;
    deliveredAt: Timestamp;
    subscriberId: Id;
    subscriberName: string;
    deliveryStatus: string;
}
export type Id = bigint;
export interface backendInterface {
    getDeliveryLogs(): Promise<Array<DeliveryLog>>;
    getEvents(): Promise<Array<Event>>;
    getSubscribers(): Promise<Array<Subscriber>>;
    publishEvent(eventType: string, payload: string, publisherName: string): Promise<[Event, Array<DeliveryLog>]>;
    subscribe(name: string, eventType: string): Promise<Subscriber>;
    unsubscribe(subscriberId: Id): Promise<boolean>;
}
