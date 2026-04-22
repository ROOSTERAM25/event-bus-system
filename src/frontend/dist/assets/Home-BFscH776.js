import { c as createLucideIcon, j as jsxRuntimeExports, L as Link, Z as Zap, U as Users, R as Radio, S as ScrollText } from "./index-Ct2y298u.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode);
const FEATURE_CARDS = [
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-5 h-5" }),
    title: "Publisher",
    role: "Sends events onto the bus",
    description: 'A Publisher creates an event with a type (e.g. "order.placed") and a JSON payload. It broadcasts to the bus without knowing who is listening — complete separation of concerns.',
    href: "/publisher",
    ocid: "home.publisher_card"
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-5 h-5" }),
    title: "Subscriber",
    role: "Listens for specific event types",
    description: "A Subscriber registers its name and the event type it cares about. Whenever a matching event is published, the bus automatically notifies that subscriber — no polling needed.",
    href: "/subscriber",
    ocid: "home.subscriber_card"
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { className: "w-5 h-5" }),
    title: "Event Logs",
    role: "Full delivery audit trail",
    description: "Every publish and every delivery attempt is stored in a DeliveryLog. This page lets you inspect which subscribers received an event and whether delivery succeeded or failed.",
    href: "/logs",
    ocid: "home.logs_card"
  }
];
const HOW_IT_WORKS = [
  {
    number: "01",
    title: "Publisher Sends an Event",
    detail: `A component calls POST /publish-event with an eventType (e.g. "user.signup") and a payload. This is like shouting into a room — the Publisher doesn't know who will hear it.`
  },
  {
    number: "02",
    title: "Bus Scans All Subscribers",
    detail: "The Event Dispatcher on the backend loops through every subscriber in the database. It checks: does this subscriber's subscribedEventType match the incoming eventType?"
  },
  {
    number: "03",
    title: "Only Matching Subscribers Receive It",
    detail: "Each matched subscriber gets the event delivered. A DeliveryLog record is saved for each delivery (status: delivered or failed). Non-matching subscribers are untouched."
  }
];
function FeatureCardItem({ card }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: card.href,
      "data-ocid": card.ocid,
      className: "event-card group flex flex-col gap-4 p-6 no-underline",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 text-accent group-hover:bg-accent/20 transition-smooth", children: card.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold uppercase tracking-widest text-foreground", children: card.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-mono text-xs text-primary", children: card.role })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed flex-1", children: card.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-mono text-xs text-primary transition-smooth group-hover:gap-2.5", children: [
          "Open page ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3" })
        ] })
      ]
    }
  );
}
function StepItem({ step, isLast }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-primary/10 font-mono text-xs font-bold text-primary", children: step.number }),
      !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-full w-px bg-border" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-1.5", children: step.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: step.detail })
    ] })
  ] });
}
function Home() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "home.page", className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        "data-ocid": "home.hero_section",
        className: "relative overflow-hidden border-b border-border bg-card px-6 py-20 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "aria-hidden": "true",
              className: "pointer-events-none absolute inset-0",
              style: {
                backgroundImage: "radial-gradient(circle, oklch(var(--foreground) / 0.06) 1px, transparent 1px)",
                backgroundSize: "28px 28px"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6 inline-flex items-center gap-2 rounded-sm border border-accent/30 bg-accent/5 px-3 py-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-accent animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold uppercase tracking-widest text-accent", children: "Live System" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "relative font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl", children: "Event Bus System" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative mt-3 font-mono text-sm font-semibold uppercase tracking-widest text-primary", children: "Publish · Route · Subscribe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "relative mx-auto mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed", children: [
            "An ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Event Bus" }),
            " is a communication channel that lets different parts of an application talk to each other",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "text-foreground", children: "without being directly connected" }),
            ". A ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Publisher" }),
            " sends a message onto the bus; the bus automatically delivers it only to",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Subscribers" }),
            " who asked to receive that type of message — keeping every component loosely coupled and independent."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-10 flex flex-wrap items-center justify-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/publisher",
                "data-ocid": "home.publisher_cta",
                className: "button-publish",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
                  "Publish an Event"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/subscriber",
                "data-ocid": "home.subscriber_cta",
                className: "button-secondary",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
                  "Subscribe to Events"
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        "data-ocid": "home.roles_section",
        className: "border-b border-border bg-background px-6 py-14",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8 text-center", children: "The Three Parts of the System" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-sm border border-border bg-card p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "mb-3 h-5 w-5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xs font-semibold uppercase tracking-widest text-foreground mb-2", children: "Publisher" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
                "Creates events and pushes them onto the bus. It only specifies the ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "text-foreground", children: "event type" }),
                " and payload — it never directly calls subscribers."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-sm border border-accent/30 bg-accent/5 p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "mb-3 h-5 w-5 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xs font-semibold uppercase tracking-widest text-accent mb-2", children: "Event Bus" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "The central router and dispatcher. It maintains the subscriber registry, matches events to subscribers, delivers messages, and logs every outcome." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-sm border border-border bg-card p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "mb-3 h-5 w-5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xs font-semibold uppercase tracking-widest text-foreground mb-2", children: "Subscriber" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Registers interest in a specific event type. When a matching event is published, the subscriber receives it automatically with no extra wiring." })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        "data-ocid": "home.features_section",
        className: "border-b border-border bg-muted/30 px-6 py-14",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8 text-center", children: "Explore the System" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 sm:grid-cols-3", children: FEATURE_CARDS.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCardItem, { card }, card.href)) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        "data-ocid": "home.how_it_works_section",
        className: "bg-background px-6 py-14",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-10 text-center", children: "How It Works — Step by Step" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10 flex items-start gap-3 rounded-sm border border-primary/20 bg-primary/5 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
              "The dispatch algorithm lives in",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground", children: "backend/utils/eventDispatcher.js" }),
              ". It loops through all subscribers, matches by event type, delivers to each match, and writes a DeliveryLog record for every attempt."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: HOW_IT_WORKS.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            StepItem,
            {
              step,
              isLast: i === HOW_IT_WORKS.length - 1
            },
            step.number
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/publisher",
                "data-ocid": "home.try_publisher_button",
                className: "button-publish",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-4 h-4" }),
                  "Try Publisher"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/logs",
                "data-ocid": "home.view_logs_button",
                className: "button-secondary",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { className: "w-4 h-4" }),
                  "View Logs"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  Home as default
};
