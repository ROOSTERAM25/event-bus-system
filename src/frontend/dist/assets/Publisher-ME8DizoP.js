import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, R as Radio } from "./index-Ct2y298u.js";
import { u as usePublishEvent, f as formatTimestamp } from "./types-Cnjh3dDj.js";
import { L as LoaderCircle } from "./loader-circle-CpdVfO_9.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode);
const EVENT_TYPE_SUGGESTIONS = [
  "user.signup",
  "order.placed",
  "payment.success",
  "alert.critical",
  "system.heartbeat"
];
function Publisher() {
  const [publisherName, setPublisherName] = reactExports.useState("Publisher-1");
  const [eventType, setEventType] = reactExports.useState("");
  const [payload, setPayload] = reactExports.useState(
    '{\n  "message": "Hello, subscribers!"\n}'
  );
  const [fieldErrors, setFieldErrors] = reactExports.useState({});
  const [lastLogs, setLastLogs] = reactExports.useState(null);
  const [lastEventType, setLastEventType] = reactExports.useState("");
  const publishMutation = usePublishEvent();
  const isLoading = publishMutation.isPending;
  function validate() {
    const errs = {};
    if (!publisherName.trim()) {
      errs.publisherName = "Publisher name is required.";
    }
    if (!eventType.trim()) {
      errs.eventType = "Event type is required.";
    }
    if (!payload.trim()) {
      errs.payload = "Payload is required.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }
  async function handlePublish() {
    setLastLogs(null);
    if (!validate()) return;
    try {
      const data = await publishMutation.mutateAsync({
        eventType: eventType.trim(),
        payload: payload.trim(),
        publisherName: publisherName.trim()
      });
      setLastLogs(data.logs);
      setLastEventType(data.event.eventType);
      setEventType("");
      setPayload('{\n  "message": "Hello, subscribers!"\n}');
      setFieldErrors({});
    } catch {
    }
  }
  const deliveredCount = (lastLogs == null ? void 0 : lastLogs.filter((l) => l.deliveryStatus === "delivered").length) ?? 0;
  const failedCount = (lastLogs == null ? void 0 : lastLogs.filter((l) => l.deliveryStatus !== "delivered").length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-6", "data-ocid": "publisher.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground tracking-tight", children: "Publish Event" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-xs text-muted-foreground leading-relaxed", children: [
          "Fill in the form below to send a message onto the Event Bus. The backend will match the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: "eventType" }),
          " against all active subscribers and deliver the message only to those who registered for that type — everyone else is untouched."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-sm border border-border bg-card p-6 space-y-5",
        "data-ocid": "publisher.form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "publisher-name", className: "event-header-mono", children: "Publisher Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "publisher-name",
                type: "text",
                value: publisherName,
                onChange: (e) => {
                  setPublisherName(e.target.value);
                  if (fieldErrors.publisherName)
                    setFieldErrors((prev) => ({
                      ...prev,
                      publisherName: void 0
                    }));
                },
                placeholder: "e.g. OrderService",
                "data-ocid": "publisher.name.input",
                "aria-describedby": fieldErrors.publisherName ? "err-publisher-name" : void 0,
                className: "w-full rounded-sm border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              }
            ),
            fieldErrors.publisherName && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                id: "err-publisher-name",
                "data-ocid": "publisher.publisher_name.field_error",
                className: "flex items-center gap-1 font-mono text-xs text-destructive",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 shrink-0" }),
                  fieldErrors.publisherName
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "event-type", className: "event-header-mono", children: "Event Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "event-type",
                type: "text",
                value: eventType,
                onChange: (e) => {
                  setEventType(e.target.value);
                  if (fieldErrors.eventType)
                    setFieldErrors((prev) => ({ ...prev, eventType: void 0 }));
                },
                placeholder: "e.g. user.signup",
                "data-ocid": "publisher.event_type.input",
                "aria-describedby": fieldErrors.eventType ? "err-event-type" : void 0,
                className: "w-full rounded-sm border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              }
            ),
            fieldErrors.eventType && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                id: "err-event-type",
                "data-ocid": "publisher.event_type.field_error",
                className: "flex items-center gap-1 font-mono text-xs text-destructive",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 shrink-0" }),
                  fieldErrors.eventType
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 pt-1", children: EVENT_TYPE_SUGGESTIONS.map((suggestion) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setEventType(suggestion);
                  setFieldErrors((prev) => ({ ...prev, eventType: void 0 }));
                },
                "data-ocid": `publisher.event_type_suggestion.${suggestion.replace(/\./g, "_")}`,
                className: "rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-smooth hover:border-primary hover:text-primary",
                children: suggestion
              },
              suggestion
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "payload", className: "event-header-mono", children: "Payload (JSON)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "payload",
                rows: 5,
                value: payload,
                onChange: (e) => {
                  setPayload(e.target.value);
                  if (fieldErrors.payload)
                    setFieldErrors((prev) => ({ ...prev, payload: void 0 }));
                },
                placeholder: '{ "key": "value" }',
                "data-ocid": "publisher.payload.textarea",
                "aria-describedby": fieldErrors.payload ? "err-payload" : void 0,
                className: "w-full rounded-sm border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              }
            ),
            fieldErrors.payload && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                id: "err-payload",
                "data-ocid": "publisher.payload.field_error",
                className: "flex items-center gap-1 font-mono text-xs text-destructive",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 shrink-0" }),
                  fieldErrors.payload
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handlePublish,
              disabled: isLoading,
              "data-ocid": "publisher.publish.submit_button",
              className: "button-publish w-full disabled:opacity-50 disabled:cursor-not-allowed",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                " Publishing…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-4 w-4" }),
                " Publish Event"
              ] })
            }
          ),
          publishMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "publisher.error_state",
              className: "flex items-center gap-2 rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 shrink-0 text-destructive" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-destructive", children: publishMutation.error instanceof Error ? publishMutation.error.message : "Publish failed. Please try again." })
              ]
            }
          )
        ]
      }
    ),
    lastLogs !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-sm border border-border bg-card p-6 space-y-4",
        "data-ocid": "publisher.result.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Delivery Result" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              deliveredCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "status-badge-success",
                  "data-ocid": "publisher.delivered_count",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                    deliveredCount,
                    " delivered"
                  ]
                }
              ),
              failedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "status-badge-failed",
                  "data-ocid": "publisher.failed_count",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
                    failedCount,
                    " failed"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
            "Event type:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: lastEventType }),
            " — ",
            lastLogs.length === 0 ? "No subscribers matched this event type." : `${lastLogs.length} subscriber${lastLogs.length !== 1 ? "s" : ""} matched and notified.`
          ] }),
          lastLogs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "rounded-sm border border-dashed border-border py-4 text-center font-mono text-xs text-muted-foreground",
              "data-ocid": "publisher.result.empty_state",
              children: [
                "Go to the ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Subscriber" }),
                " page and register a subscriber for",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: lastEventType }),
                " first."
              ]
            }
          ) : (
            /* Delivery log list — one row per matched subscriber */
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "publisher.result.list", children: lastLogs.map((log, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `publisher.result.item.${i + 1}`,
                className: "flex items-center gap-3 rounded-sm border border-border bg-background px-4 py-2",
                children: [
                  log.deliveryStatus === "delivered" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 shrink-0 text-destructive" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 font-mono text-xs text-foreground min-w-0 truncate", children: log.subscriberName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: log.deliveryStatus === "delivered" ? "status-badge-success" : "status-badge-failed",
                      children: log.deliveryStatus
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground shrink-0", children: formatTimestamp(log.deliveredAt) })
                ]
              },
              String(log.id)
            )) })
          )
        ]
      }
    )
  ] });
}
export {
  Publisher as default
};
