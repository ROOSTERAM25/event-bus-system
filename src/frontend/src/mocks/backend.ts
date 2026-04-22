import type { backendInterface } from "../backend";

export const mockBackend: backendInterface = {
  getDeliveryLogs: async () => [
    {
      id: BigInt(1),
      eventId: BigInt(1),
      deliveredAt: BigInt(Date.now() * 1_000_000),
      subscriberId: BigInt(1),
      subscriberName: "Alice",
      deliveryStatus: "delivered",
    },
    {
      id: BigInt(2),
      eventId: BigInt(1),
      deliveredAt: BigInt(Date.now() * 1_000_000),
      subscriberId: BigInt(2),
      subscriberName: "Bob",
      deliveryStatus: "failed",
    },
    {
      id: BigInt(3),
      eventId: BigInt(2),
      deliveredAt: BigInt(Date.now() * 1_000_000),
      subscriberId: BigInt(3),
      subscriberName: "Carol",
      deliveryStatus: "delivered",
    },
  ],
  getEvents: async () => [
    {
      id: BigInt(1),
      publisherName: "PublisherA",
      timestamp: BigInt(Date.now() * 1_000_000),
      payload: '{"message": "Hello World"}',
      eventType: "user.signup",
    },
    {
      id: BigInt(2),
      publisherName: "PublisherB",
      timestamp: BigInt(Date.now() * 1_000_000),
      payload: '{"orderId": 42}',
      eventType: "order.placed",
    },
  ],
  getSubscribers: async () => [
    {
      id: BigInt(1),
      name: "Alice",
      createdAt: BigInt(Date.now() * 1_000_000),
      subscribedEventType: "user.signup",
    },
    {
      id: BigInt(2),
      name: "Bob",
      createdAt: BigInt(Date.now() * 1_000_000),
      subscribedEventType: "order.placed",
    },
    {
      id: BigInt(3),
      name: "Carol",
      createdAt: BigInt(Date.now() * 1_000_000),
      subscribedEventType: "user.signup",
    },
  ],
  publishEvent: async (eventType, payload, publisherName) => {
    const event = {
      id: BigInt(3),
      publisherName,
      timestamp: BigInt(Date.now() * 1_000_000),
      payload,
      eventType,
    };
    const logs = [
      {
        id: BigInt(4),
        eventId: BigInt(3),
        deliveredAt: BigInt(Date.now() * 1_000_000),
        subscriberId: BigInt(1),
        subscriberName: "Alice",
        deliveryStatus: "delivered",
      },
    ];
    return [event, logs];
  },
  subscribe: async (name, eventType) => ({
    id: BigInt(4),
    name,
    createdAt: BigInt(Date.now() * 1_000_000),
    subscribedEventType: eventType,
  }),
  unsubscribe: async (_subscriberId) => true,
};
