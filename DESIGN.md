# Design Brief: Event Bus System

## Purpose & Differentiation
Developer dashboard for event-driven architecture visualization. Built for clarity, not decoration — every pixel communicates event state or delivery status.

## Tone & Aesthetic
Brutalist-utilitarian. Minimal radius, high contrast, precision typography. Technical credibility through monospace accents. Dark mode primary for focused work environment.

## Color Palette (OKLCH)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary (Publish) | `0.58 0.14 257` | `0.62 0.18 257` | CTAs, active states, publish buttons |
| Accent (Success) | `0.72 0.19 120` | `0.75 0.22 120` | Delivered badges, success indicators |
| Destructive (Failed) | `0.53 0.22 25` | `0.62 0.25 27` | Failed delivery, error states |
| Foreground | `0.12 0 0` | `0.93 0 0` | Body text, high-contrast readability |
| Background | `0.95 0 0` | `0.11 0 0` | Page foundation, neutral zones |
| Card | `0.98 0 0` | `0.13 0 0` | Elevated surfaces for events, subscribers, logs |
| Border | `0.92 0.01 0` | `0.18 0.02 0` | Subtle divisions, grid lines |

## Typography

| Category | Font | Scale | Usage |
|----------|------|-------|-------|
| Display | GeistMono | 10px–12px uppercase | Section headers, status labels, event IDs |
| Body | DMSans | 14px–16px | Form labels, descriptions, table content |
| Mono | GeistMono | 12px–14px | Event payloads, timestamps, subscriber names |

## Structural Zones

| Zone | Treatment | Notes |
|------|-----------|-------|
| Header/Nav | `bg-card` + `border-b border-border` | Elevated above background, clear separation |
| Sidebar | `bg-card` with `bg-sidebar-accent/5` on active items | Navigation hierarchy via hover state |
| Main Content | `bg-background` | Neutral foundation, card-based composition |
| Event Cards | `bg-card` + `border border-border` + hover lift | Minimal elevation via border + background shift |
| Status Row | Color-coded badge rows (success/failed/pending) | Instant visual scanning — green/red/gray |
| Footer | `bg-muted/30` + `border-t border-border` | Subtle anchor, never distracts |

## Component Patterns

- **Buttons**: Rounded 4px. Publish (primary blue), Secondary (muted), Destructive (red). No fills on secondary — outline-style or ghost.
- **Forms**: Clean label + input stacks. Input bg = `bg-input` (0.96L), border = `border-border`. Focus ring = `ring-2 ring-primary`.
- **Status Badges**: Inline flex with monospace font. Success = `bg-accent/10 text-accent`, Failed = `bg-destructive/10 text-destructive`, Pending = `bg-muted text-muted-foreground`.
- **Tables**: Minimal lines. Header row bold, striped rows via `bg-muted/5` on alternates. Right-align numbers.
- **Cards**: Flex column, gap-3, p-4, rounded-sm border, hover slight lift via opacity shift.

## Motion & Interaction

- **Transitions**: All state changes 300ms smooth easing (cubic-bezier 0.4, 0, 0.2, 1). No bounce, no flash.
- **Hover**: Card opacity shift or subtle bg lift. Button scale-95 on active.
- **Focus**: Ring-2 on primary color. Clear keyboard navigation.
- **Loading**: Pulse animation on pending badges. Optional spinner overlay on forms.

## Constraints & Gotchas

- Never use color names (blue, green) — all colors OKLCH tokens via CSS variables.
- Radius: 4px uniform. No 12px or 24px bloat.
- Keep monospace headers to 12px max — prevents visual chaos.
- Charts use chart-1 through chart-5 OKLCH tokens for consistency.
- Dark mode is default; light mode available for accessibility but secondary.

## Signature Detail

Event delivery logs render as a **monospace typewriter list** — each row is a `<code>` block with inline status badges. This reinforces the "developer tool" aesthetic and makes log scanning feel native to the domain.
