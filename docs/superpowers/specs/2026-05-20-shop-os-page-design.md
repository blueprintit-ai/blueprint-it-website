# Shop OS Page — Design

**Date:** 2026-05-20
**Author:** Blueprint IT (drafted with Claude)
**Status:** Draft, awaiting user review

## Goal

Add a new page at `/shop-os` that productizes Blueprint IT's "AI Business OS" offering for small-business clients. Page is inspired in shape and pacing by [benaios.com](https://benaios.com/) but executed in Blueprint IT's existing visual identity (cream paper, ink + cyan + rust, Fraunces serif, drafting/engineering metaphors). Includes a fixed full-viewport animated background ("blueprint linework") that gives the page motion without breaking brand.

## Non-goals

- No new analytics events or A/B infrastructure.
- No new contact form on the Shop OS page — all conversions go through a Calendly link.
- No CMS. Copy lives in JSX, same as the rest of the site.
- No literal copy of benaios.com's particle-brain effect (Three.js, ~9k WebGL particles) — it doesn't fit Blueprint IT's flat-drafting aesthetic and adds ~600KB to the bundle.
- No redesign of the existing home page. Shared components (nav, footer) are extracted, but the home page renders identically.

## Architecture

### Routing refactor (one-time, small)

`react-router-dom@7.6.1` is already in `package.json` but unused. We wire it up.

**File changes:**

| File | Change |
|---|---|
| [src/main.jsx](src/main.jsx) | Wrap `<App />` in `<BrowserRouter>`. |
| [src/App.jsx](src/App.jsx) | **Replace** with a tiny shell containing `<Routes>`: `/` → `<Home />`, `/shop-os` → `<ShopOS />`. Imports `<SiteNav />` and `<SiteFooter />` once at the top level so they render on every route. |
| [src/pages/Home.jsx](src/pages/Home.jsx) | **New file** — body of the current `App.jsx`, minus the nav and footer blocks (those move to shared components). |
| [src/pages/ShopOS.jsx](src/pages/ShopOS.jsx) | **New file** — the new page. |
| [src/components/SiteNav.jsx](src/components/SiteNav.jsx) | **New file** — extracted nav, takes an optional `currentPath` prop for active-state styling. |
| [src/components/SiteFooter.jsx](src/components/SiteFooter.jsx) | **New file** — extracted footer, takes an optional `currentPath` prop so its anchor links become cross-page jumps when not on `/`. |
| [src/components/blueprint.jsx](src/components/blueprint.jsx) | **New file** — `<Plate>`, `<RegMark>`, `<SectionTag>` extracted from `App.jsx` so both pages can import them. |
| [src/components/BlueprintCanvas.jsx](src/components/BlueprintCanvas.jsx) | **New file** — the fixed full-viewport animated background. Used by `<ShopOS />`. |
| [src/App.css](src/App.css) | **Append** a `/* ===== Shop OS page ===== */` block at the bottom for any new helpers (e.g. orbit diagram geometry, animated SVG keyframes). No new CSS file — keeps tokens in one place. |
| [src/App.jsx.backup](src/App.jsx.backup), [src/Old_App.jsx](src/Old_App.jsx) | Left untouched. They predate this work. |

### Hosting note

`BrowserRouter` requires the host to rewrite unknown paths to `/index.html` so a direct deep-link to `/shop-os` works on refresh. Most static hosts (Vercel, Netlify) do this with a one-line config:

- Netlify: add `/* /index.html 200` to `public/_redirects`.
- Vercel: add `{"rewrites":[{"source":"/(.*)","destination":"/"}]}` to `vercel.json`.

If the site is hosted somewhere without this, switch to `HashRouter` instead (URLs become `/#/shop-os`).

## Moving background: `<BlueprintCanvas />`

A fixed-position, full-viewport HTML5 `<canvas>` mounted at `z-index: 0` with `pointer-events: none`, behind all Shop OS page content. **2D context only — no Three.js, no extra dependencies.** Total component target: ~300 lines including comments.

### Layers (back to front)

1. **Drifting dotted grid.** 24px cyan dot grid (matches existing `.bp-grid`). Slowly pans diagonally at ~5 px/sec. Wraps seamlessly via modulo on x/y offsets. Opacity 0.08.
2. **Dimension lines.** Every ~6 seconds, a horizontal or vertical dimension line (the `|—— 240mm ——|` drafting motif) draws itself on at a random position, dwells ~3 seconds, fades out over ~1.2 seconds. 3–5 visible at any time. Cyan stroke, `JetBrains Mono` label with a random plausible measurement (e.g. `240mm`, `1.4s`, `§07`). Opacity peaks at 0.16.
3. **Node graph.** 7–9 small registration-mark nodes (the existing `.reg-mark` motif) at fixed positions across the canvas, connected by thin cyan polylines (axis-aligned only — no diagonals, to stay drafting-pure). Every ~8 seconds one node connects to a previously-unconnected neighbor with a stroke-draw animation (~1.2s), then a label fades in at the new node from a small vocabulary: `POS`, `INVENTORY`, `EMAIL`, `CRM`, `SHEETS`, `STOCK`, `BRAIN`, `OPS`, `BOOKINGS`. When all edges are drawn, the whole graph fades out (~2s) and resets. Opacity peaks at 0.18.
4. **Scanline sweep.** A single faint cyan horizontal line crosses the viewport top-to-bottom every ~20 seconds at opacity 0.10. Sells "this is a live drawing being plotted."

### Color & layering

- All elements use the existing palette: `--cyan` (`#1c6ea4`), `--rust` (`#c2461f`), `--ink-soft` (`#2a3f55`). Most strokes are cyan; occasional dimension labels use rust for variety.
- Canvas opacity ceiling 0.18 anywhere so page text always dominates.
- All Shop OS page content sits at `z-index: 2`; canvas is at `z-index: 0`; nav remains at `z-index: 40`.

### Performance

- Single `requestAnimationFrame` loop, capped at 30fps (effect is slow; 60fps is wasted work).
- Loop pauses when `document.hidden` is true.
- On viewport width < 768px, canvas alpha is multiplied by 0.5.
- Canvas uses `devicePixelRatio` capped at 2 to avoid retina blowout on big screens.
- Resizes on window `resize` with a 150ms debounce.

### Accessibility

- Respects `prefers-reduced-motion: reduce` — renders one static frame and skips the animation loop entirely.
- `aria-hidden="true"` on the canvas — purely decorative.
- No keyboard interaction (pointer-events disabled).

## Page sections: `<ShopOS />`

All sections wrapped in existing patterns: `<SectionTag id="NN">Drawing № 0X · …</SectionTag>`, `<Plate>` cards with `<RegMark>` registration crosshairs, `font-display` Fraunces headlines with italic accents in cyan (`font-display-italic text-[color:var(--cyan)]`) or rust. `BlueprintCanvas` mounts once at the top of the component (sibling to sections, not parent).

**Terminology lock:** wherever benaios.com says "Second Brain" or "the Brain," we say **"Shop Brain"**.

### Hero — Drawing № 01 · Introduction

Two-column on desktop (8/4 split), single column on mobile. Mirrors the home page hero structure.

**Left column:**
- `SectionTag`: `Drawing № 01 · Introduction`
- Headline (Fraunces, clamp size, `font-display` with italic accents):
  > An AI operating system for your small business — *installed in 14 days.*
  - "AI" set in `font-display-italic text-[color:var(--cyan)]`
  - "installed in 14 days" set in `font-display-italic text-[color:var(--rust)]`
- Subhead (~3 lines, `text-[color:var(--ink-soft)]`):
  > Your team has ChatGPT. Your company has nothing. Blueprint IT installs Shop OS in two weeks: a shared context layer wired into your stack, two proof automations running on top, and a tuned-up team that owns it on day one.
- CTAs:
  - Primary `btn-ink`: **Start the 14-day install →** (Calendly, opens new tab)
  - Secondary mono link: **↓ See what gets installed** (scrolls to `#shop-anatomy`)

**Right column — `<Plate accent="cyan">` spec sheet:**

| Field | Value |
|---|---|
| Practice | AI Operating System |
| Duration | 14 days, kickoff to live |
| Includes | Shop Brain + 2 automations |
| Stack | Plugs into yours |
| Handoff | Owned by your team |
| Discovery | 15 minutes, free |

### §01 — Drawing № 02 · The Gap

Two-column. Left: copy. Right: animated growth chart.

**Left:**
- `SectionTag id="01"`: `Drawing № 02 · The Gap`
- Headline: **Your team has AI.** *Your company has scattered context.*
- Two paragraphs adapting benaios.com's "Knowledge lives in Slack threads, email chains, Drive folders…" — in Blueprint IT's voice (slightly more concrete, fewer abstractions).

**Right — animated growth chart (static SVG, no canvas):**
- Dotted-grid background matching `.bp-grid`.
- Two curves on the chart:
  - **Scattered Context** — flat-ish, drawn in `--ink-soft`, dashed stroke.
  - **Institutional Intelligence** (label: "With Shop OS") — compounds upward, drawn in `--cyan`, solid stroke with shadow.
- X-axis ticks: `Day 14`, `Month 1`, `Month 3`, `Month 6`, `Year 1` in mono.
- Y-axis label: `Company intelligence accumulated` in mono, rotated.
- "Day 14 · handoff" tick mark in rust on the x-axis.
- Animation: stroke-draw the two curves with `framer-motion` `whileInView` on first scroll into view. Stagger by 0.3s. ~1.5s total.
- Below the chart, one-line caption: "Scattered context stays flat. Institutional intelligence compounds. The gap widens every month."

### §02 — Drawing № 03 · The Anatomy

ID anchor: `#shop-anatomy`.

- `SectionTag id="02"`: `Drawing № 03 · The Anatomy`
- Headline: *The anatomy* of your AI Operating System.
- Lead paragraph: "Two deliverables, installed in 14 days. A Shop Brain that plugs into your stack, and two proof automations running on top of it. Owned by you on day one of handoff."

**Orbit diagram** (SVG, ~600px tall on desktop, stacks vertically on mobile):
- Central `<Plate accent="cyan">` tile labeled **"Shop Brain"** with subline `Live · Connected`.
- 8 connector chips arranged at 45° intervals on a ring of ~280px radius: **Email**, **Calls**, **Calendar**, **Docs**, **CRM**, **Sheets**, **Messaging**, **Contracts** (matches benaios.com's chip set; reorderable later).
- Each chip styled like `.label-cyan` — small uppercase mono text in a thin-bordered rounded-none box, sized to label width.
- Connection lines: thin cyan polylines, cardinal/diagonal only, drawn with stroke-draw animation on first scroll into view (stagger by 0.08s per chip).
- Mobile: chips stack vertically in a column above the Shop Brain card, no orbit geometry — simpler and faster.

**Below the orbit — two `<Plate>` cards side-by-side (stack on mobile):**

| Card | Subtitle | Body |
|---|---|---|
| **Deliverable 01 — A working Shop Brain** | context · queryable · operator-owned | "Every AI interaction on your team reads from one centralized place: customer history, SOPs, brand voice, commercial rules. The institutional knowledge that lives in ten people's heads, queryable by every person and every automation. Plugs into your existing stack without replacing anything." + "What your team gets" / "At handoff" bulleted lists. |
| **Deliverable 02 — Two proof automations** | scheduled · autonomous · template for the rest | "End-to-end automations built on top of the Shop Brain in week two. Picked from your highest-leverage repetitive workflows. They run on real systems, unprompted, and they become the template your Operator uses to build the next ten without us." + "Example shapes" / "Why two" bulleted lists. |

**Seed Imports strip** (below the two cards):
- Small label: "Seed Imports · one-time at onboarding"
- 6 dashed-border chips (visually distinct from live connectors): **Past Contracts**, **Email Archives**, **Call Library**, **Slack / Teams History**, **Spreadsheets & CSVs**, **PDF Library**.

### §03 — Drawing № 04 · The 14 Days

- `SectionTag id="03"`: `Drawing № 04 · The 14 Days`
- Headline: Three phases. Two weeks. *One handoff.*
- Lead paragraph: "Every engagement runs the same playbook. By day 14, the system is live, the proof automations are running, and your internal Operator owns it without us in the room."

Three `<Plate>` cards in a 3-column grid (stack on mobile). Each card uses the existing `<Plate>` pattern with phase label, day range as a large `font-display` number, title, body paragraph, and an "Output" bulleted list.

| Card | Label | Title | Body | Output |
|---|---|---|---|---|
| 01 | Phase 01 · Days 1–4 | Discovery | "Live screen-share sessions. We watch how the business actually runs, not how the docs say it runs. Real workflows, real friction, real handoffs between tools and people." | • Operational map grounded in observation<br>• Two proof automations scoped and confirmed |
| 02 | Phase 02 · Days 5–10 | Shop Brain Setup | "We build the Shop Brain: project structure, knowledge base, decision log, modular connectors. The substrate every future automation will run on." | • Centralized context layer, populated and wired<br>• Connector layer live with your stack |
| 03 | Phase 03 · Days 11–14 | Proof + Handoff | "Two end-to-end automations shipped on top of the Shop Brain. Live team workshop. Operator trained on extension patterns so the team keeps building without us." | • Two proof automations running on real data<br>• System fully owned by your team |

### §04 — Drawing № 05 · The Operator

- `SectionTag id="04"`: `Drawing № 05 · The Operator`
- Headline: Who runs Shop OS *after we leave.*
- Lead paragraph: "Every successful implementation has one thing in common. An internal owner who runs the Shop Brain after we leave. Not a new full-time hire. A few hours a week, owned by someone already on the team. We pick them with you in week one and train them in parallel with the build."

Four numbered cards (01–04) in a 2×2 grid on desktop, stacked on mobile. Each card: large `font-display` number, title, ~3-line body.

| # | Title | Body |
|---|---|---|
| 01 | Maintains the Shop Brain | Updates context as strategy shifts, products change, people join. The Shop Brain stays current, so every output stays accurate. Minutes a day, not hours. |
| 02 | Ships New Automations | Takes the patterns from the two proof builds and applies them to the next workflow. And the next. The Shop Brain compounds because the Operator keeps building. |
| 03 | Onboards Teammates | Shows new hires how the Shop Brain works on day one. Adoption stops being a leadership problem and becomes a built-in onboarding step. |
| 04 | Internal Point of Contact | When a teammate has an AI question, the Operator is the first stop. Not IT. Not the CEO. Real position, not a side gig. |

### Final CTA — Drawing № 06 · Ready

Full-width section, centered content.

- `SectionTag id="05"`: `Drawing № 06 · Ready`
- Big headline (Fraunces, very large): Install your *Shop OS.*
- One paragraph: "14 days from kickoff to a working system your team owns. One call to scope it. One handoff to run it."
- Primary CTA button (`btn-ink btn-rust`, large): **Start the 14-day install →**
  - `href="https://calendly.com/blueprintit/15-ai-shop-os-discovery"`
  - `target="_blank" rel="noopener noreferrer"`
- Subtext (mono, muted): "Straight to a real call. No funnel. No email gauntlet."

### Footer

Rendered by shared `<SiteFooter />`. No Shop OS–specific changes.

## Shared components

### `<SiteNav currentPath />`

Extracted verbatim from current `App.jsx` nav block. Two changes:

1. New nav item **Shop OS** inserted between **Services** and **Studio**. On desktop and mobile menus. Renders as `<Link to="/shop-os">`. Active state when `currentPath === "/shop-os"`.
2. Existing nav items (`services`, `about`, `workflow`, `contact`) become page-aware:
   - When `currentPath === "/"`: existing scroll-to-section behavior.
   - Otherwise: `<Link to="/#services">`, `<Link to="/#about">`, etc. (cross-page anchor jumps).
3. "Discovery Call" header button is page-aware:
   - On `/`: existing scroll to `#contact`.
   - On `/shop-os`: links to the Calendly URL, opens in new tab.

### `<SiteFooter currentPath />`

Extracted from the bottom of current `App.jsx`. Same page-aware anchor rewriting as `<SiteNav />`: footer's `Services`/`Studio`/`Contact` links become `<Link to="/#…">` when `currentPath !== "/"`, scroll-to-section when on `/`. No "Shop OS" link in the footer (intentional — footer stays concise; nav is the discovery path).

## Edge cases & accessibility

- **`prefers-reduced-motion: reduce`** — `BlueprintCanvas` renders one static frame, no animation loop. Section-entry `framer-motion` animations switch to opacity-only via `useReducedMotion()`. Growth-chart stroke-draw plays at 0s (instant).
- **Mobile (< 768px)** — canvas alpha 0.5×, orbit diagram in §02 collapses to a vertical chip stack with the Shop Brain card on top. Phase cards in §03 and operator cards in §04 stack to single column.
- **No-JS / pre-hydration** — page renders with the static `.bp-grid` body background. All copy is server-rendered (well, statically built — this is Vite). The animated canvas is the only thing missing.
- **Direct deep link to `/shop-os`** — depends on host rewrites (see "Hosting note" above).
- **External Calendly link** — always `target="_blank" rel="noopener noreferrer"`. Three places: hero CTA, nav button, final CTA.
- **`<head>` per page** — we set a Shop OS–specific `<title>` and OG meta via a small `useEffect` in `<ShopOS />` (no `react-helmet` dep — manual `document.title` assignment is fine for a 2-page site). Title: `Shop OS — AI Operating System Installed in 14 Days · Blueprint IT`.

## Implementation reuse map

| Need | Source |
|---|---|
| Color tokens, fonts, `.bp-grid`, `.bp-grain`, `.reg-mark`, `.plate`, `.btn-ink`, `.label`, `.dim-line` | Existing [src/App.css](src/App.css), no changes. |
| `<Plate>`, `<RegMark>`, `<SectionTag>` components | Currently inline in `App.jsx`. Extract to [src/components/blueprint.jsx](src/components/blueprint.jsx) so both pages can import them. |
| `framer-motion` animations | Already a dep. |
| Icons (`ArrowRight`, `ArrowUpRight`) | `lucide-react`, already a dep. |
| Marquee ticker (if we want one on Shop OS) | Existing `.bp-ticker` class. Optional addition; not in current spec. |
| Hidden iframe form-post pattern | N/A — Shop OS doesn't use it. Calendly only. |

## Open questions

None at this time. All decisions confirmed in conversation:

- Background style: animated blueprint linework (option A).
- Routing: React Router with `/shop-os`.
- Section count: faithful 5-section adaptation.
- Install duration: 14 days.
- CTA: Calendly link → `https://calendly.com/blueprintit/15-ai-shop-os-discovery`.
- Nav inclusion: yes.
- Brain terminology: "Shop Brain."
