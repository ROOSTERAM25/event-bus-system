/**
 * Home.tsx — Landing page for the Event Bus System
 *
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  COLLEGE VIVA EXPLANATION                                 ║
 * ║                                                           ║
 * ║  This is the landing page. It explains:                   ║
 * ║  • What "Publish-Subscribe" means in plain English        ║
 * ║  • The role of Publisher, Subscriber, and Event Bus       ║
 * ║  • How the dispatch algorithm works, step by step         ║
 * ║  • Navigation links to the three feature pages            ║
 * ╚═══════════════════════════════════════════════════════════╝
 *
 * Design tokens (dark mode):
 *   bg-background  → deep charcoal  (page base)
 *   bg-card        → slightly lighter charcoal  (cards, hero)
 *   bg-muted/30    → subtle separator for alternating sections
 *   text-accent    → emerald green  (highlights)
 *   text-primary   → electric blue  (headings, CTAs)
 */

import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  CheckCircle,
  Radio,
  ScrollText,
  Users,
  Zap,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────

/** One feature card on the home page — links to a page */
interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  role: string; // one-line role description
  description: string; // 2-sentence expanded description
  href: string;
  ocid: string;
}

/** One step in the "How it Works" section */
interface Step {
  number: string;
  title: string;
  detail: string;
}

// ── Static data ───────────────────────────────────────────────────────────

/**
 * FEATURE_CARDS — the three core parts of the system.
 *
 * For viva: Each card maps to a real page in the app and a real backend
 * API (POST /publish-event, POST /subscribe, GET /delivery-logs).
 */
const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: <Radio className="w-5 h-5" />,
    title: "Publisher",
    role: "Sends events onto the bus",
    description:
      'A Publisher creates an event with a type (e.g. "order.placed") and a JSON payload. It broadcasts to the bus without knowing who is listening — complete separation of concerns.',
    href: "/publisher",
    ocid: "home.publisher_card",
  },
  {
    icon: <Bell className="w-5 h-5" />,
    title: "Subscriber",
    role: "Listens for specific event types",
    description:
      "A Subscriber registers its name and the event type it cares about. Whenever a matching event is published, the bus automatically notifies that subscriber — no polling needed.",
    href: "/subscriber",
    ocid: "home.subscriber_card",
  },
  {
    icon: <ScrollText className="w-5 h-5" />,
    title: "Event Logs",
    role: "Full delivery audit trail",
    description:
      "Every publish and every delivery attempt is stored in a DeliveryLog. This page lets you inspect which subscribers received an event and whether delivery succeeded or failed.",
    href: "/logs",
    ocid: "home.logs_card",
  },
];

/**
 * HOW_IT_WORKS — numbered steps matching the backend dispatch algorithm.
 *
 * For viva: These steps map directly to the code in
 * utils/eventDispatcher.js on the backend:
 *   Step 1 → POST /publish-event endpoint called
 *   Step 2 → eventDispatcher iterates subscriber list
 *   Step 3 → matched subscribers receive the message; DeliveryLog saved
 */
const HOW_IT_WORKS: Step[] = [
  {
    number: "01",
    title: "Publisher Sends an Event",
    detail:
      'A component calls POST /publish-event with an eventType (e.g. "user.signup") and a payload. This is like shouting into a room — the Publisher doesn\'t know who will hear it.',
  },
  {
    number: "02",
    title: "Bus Scans All Subscribers",
    detail:
      "The Event Dispatcher on the backend loops through every subscriber in the database. It checks: does this subscriber's subscribedEventType match the incoming eventType?",
  },
  {
    number: "03",
    title: "Only Matching Subscribers Receive It",
    detail:
      "Each matched subscriber gets the event delivered. A DeliveryLog record is saved for each delivery (status: delivered or failed). Non-matching subscribers are untouched.",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────

/**
 * FeatureCardItem — renders one navigable feature card.
 *
 * Uses the .event-card utility class defined in index.css.
 */
function FeatureCardItem({ card }: { card: FeatureCard }) {
  return (
    <Link
      to={card.href}
      data-ocid={card.ocid}
      className="event-card group flex flex-col gap-4 p-6 no-underline"
    >
      {/* Icon badge */}
      <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 text-accent group-hover:bg-accent/20 transition-smooth">
        {card.icon}
      </span>

      {/* Title + role */}
      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
          {card.title}
        </h3>
        <p className="mt-1 font-mono text-xs text-primary">{card.role}</p>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
        {card.description}
      </p>

      {/* Navigate arrow — animates on hover via group */}
      <span className="flex items-center gap-1 font-mono text-xs text-primary transition-smooth group-hover:gap-2.5">
        Open page <ArrowRight className="w-3 h-3" />
      </span>
    </Link>
  );
}

/**
 * StepItem — renders one numbered step with a vertical connector line.
 */
function StepItem({ step, isLast }: { step: Step; isLast: boolean }) {
  return (
    <div className="flex gap-5">
      {/* Number badge + connector */}
      <div className="flex flex-col items-center">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-primary/10 font-mono text-xs font-bold text-primary">
          {step.number}
        </span>
        {/* Vertical line connecting steps — hidden after last */}
        {!isLast && <div className="mt-1 h-full w-px bg-border" />}
      </div>

      {/* Step text */}
      <div className="pb-8">
        <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-1.5">
          {step.title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {step.detail}
        </p>
      </div>
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────

/**
 * Home — entry point of the Event Bus System app.
 *
 * For college viva:
 *   Q: "What does this page do?"
 *   A: "It introduces the publish-subscribe pattern, explains each
 *       component's role, and provides navigation to the three main
 *       features: Publisher, Subscriber, and Event Logs."
 */
export default function Home() {
  return (
    <div data-ocid="home.page" className="min-h-screen bg-background">
      {/* ─────────────────────────────────────────────────────────────────
          HERO SECTION
          Background: bg-card (elevated charcoal) for visual separation
          from the bg-background content below.
      ───────────────────────────────────────────────────────────────── */}
      <section
        data-ocid="home.hero_section"
        className="relative overflow-hidden border-b border-border bg-card px-6 py-20 text-center"
      >
        {/* Decorative dot-grid overlay — pure CSS, no images */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(var(--foreground) / 0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* "Live system" badge */}
        <div className="relative mb-6 inline-flex items-center gap-2 rounded-sm border border-accent/30 bg-accent/5 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            Live System
          </span>
        </div>

        {/* Main title — display font (GeistMono) for brutalist aesthetic */}
        <h1 className="relative font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Event Bus System
        </h1>

        {/* Electric-blue sub-heading */}
        <p className="relative mt-3 font-mono text-sm font-semibold uppercase tracking-widest text-primary">
          Publish · Route · Subscribe
        </p>

        {/*
          PLAIN-LANGUAGE EXPLANATION (2–3 sentences) — for beginners / viva:
          Explain publish-subscribe without technical jargon.
        */}
        <p className="relative mx-auto mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed">
          An <strong className="text-foreground">Event Bus</strong> is a
          communication channel that lets different parts of an application talk
          to each other{" "}
          <em className="text-foreground">without being directly connected</em>.
          A <strong className="text-foreground">Publisher</strong> sends a
          message onto the bus; the bus automatically delivers it only to{" "}
          <strong className="text-foreground">Subscribers</strong> who asked to
          receive that type of message — keeping every component loosely coupled
          and independent.
        </p>

        {/* Call-to-action buttons */}
        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/publisher"
            data-ocid="home.publisher_cta"
            className="button-publish"
          >
            <Zap className="w-4 h-4" />
            Publish an Event
          </Link>
          <Link
            to="/subscriber"
            data-ocid="home.subscriber_cta"
            className="button-secondary"
          >
            <Users className="w-4 h-4" />
            Subscribe to Events
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          ROLES SECTION
          "What does each part do?" — one clear sentence per role.
          Background: bg-background (contrast from hero above)
      ───────────────────────────────────────────────────────────────── */}
      <section
        data-ocid="home.roles_section"
        className="border-b border-border bg-background px-6 py-14"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8 text-center">
            The Three Parts of the System
          </h2>

          {/* Role cards — three columns on sm+ screens */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Publisher */}
            <div className="rounded-sm border border-border bg-card p-5">
              <Radio className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-foreground mb-2">
                Publisher
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Creates events and pushes them onto the bus. It only specifies
                the <em className="text-foreground">event type</em> and payload
                — it never directly calls subscribers.
              </p>
            </div>

            {/* Event Bus (centre, visually highlighted) */}
            <div className="rounded-sm border border-accent/30 bg-accent/5 p-5">
              <Zap className="mb-3 h-5 w-5 text-accent" />
              <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-accent mb-2">
                Event Bus
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The central router and dispatcher. It maintains the subscriber
                registry, matches events to subscribers, delivers messages, and
                logs every outcome.
              </p>
            </div>

            {/* Subscriber */}
            <div className="rounded-sm border border-border bg-card p-5">
              <Bell className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-foreground mb-2">
                Subscriber
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Registers interest in a specific event type. When a matching
                event is published, the subscriber receives it automatically
                with no extra wiring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          FEATURE CARDS SECTION
          Three large cards that navigate to the main pages.
          Background: bg-muted/30 — subtle alternating tone.
      ───────────────────────────────────────────────────────────────── */}
      <section
        data-ocid="home.features_section"
        className="border-b border-border bg-muted/30 px-6 py-14"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8 text-center">
            Explore the System
          </h2>

          {/* Feature cards grid */}
          <div className="grid gap-5 sm:grid-cols-3">
            {FEATURE_CARDS.map((card) => (
              <FeatureCardItem key={card.href} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          HOW IT WORKS SECTION
          Step-by-step breakdown of the dispatch algorithm.
          Background: bg-background — returns to base for contrast.

          For viva: These three steps map directly to the algorithm in
          utils/eventDispatcher.js on the backend.
      ───────────────────────────────────────────────────────────────── */}
      <section
        data-ocid="home.how_it_works_section"
        className="bg-background px-6 py-14"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-10 text-center">
            How It Works — Step by Step
          </h2>

          {/*
            Algorithm callout box:
            Tells the reader (and viva examiner) exactly where the core
            logic lives in the source code.
          */}
          <div className="mb-10 flex items-start gap-3 rounded-sm border border-primary/20 bg-primary/5 p-4">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              The dispatch algorithm lives in{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
                backend/utils/eventDispatcher.js
              </code>
              . It loops through all subscribers, matches by event type,
              delivers to each match, and writes a DeliveryLog record for every
              attempt.
            </p>
          </div>

          {/* Numbered steps with vertical connector line */}
          <div>
            {HOW_IT_WORKS.map((step, i) => (
              <StepItem
                key={step.number}
                step={step}
                isLast={i === HOW_IT_WORKS.length - 1}
              />
            ))}
          </div>

          {/* Bottom CTA after reading the steps */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/publisher"
              data-ocid="home.try_publisher_button"
              className="button-publish"
            >
              <Radio className="w-4 h-4" />
              Try Publisher
            </Link>
            <Link
              to="/logs"
              data-ocid="home.view_logs_button"
              className="button-secondary"
            >
              <ScrollText className="w-4 h-4" />
              View Logs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
