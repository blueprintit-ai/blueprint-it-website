# Shop OS Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new page at `/shop-os` that productizes Blueprint IT's "AI Operating System" offering, inspired in shape by benaios.com and executed in Blueprint IT's blueprint/drafting identity, with an animated linework background.

**Architecture:** Wire up `react-router-dom` (already installed but unused). Extract the existing home content and shared chrome (nav, footer, blueprint primitives) into separate files. Build a new `<ShopOS />` page assembled from a fixed-canvas animated background plus six editorial sections that reuse the existing `<Plate>` / `<RegMark>` / `<SectionTag>` primitives.

**Tech Stack:** React 18, Vite, Tailwind v4, `react-router-dom@7.6.1`, `framer-motion`, `lucide-react`. No new dependencies.

**Source spec:** [docs/superpowers/specs/2026-05-20-shop-os-page-design.md](docs/superpowers/specs/2026-05-20-shop-os-page-design.md). When in doubt about copy or visual detail, the spec is authoritative.

**No-test-infra note:** This project has no test runner. Each task's "verify" step uses `pnpm dev` (visual check) and `pnpm build` (compile / type / Tailwind check) instead of unit tests. Don't add a test runner — out of scope.

**Pre-flight:** Run `pnpm install` once at the start if `node_modules` is stale. Confirm `pnpm dev` boots and the existing home page loads at `http://localhost:5173/` before starting Task 1.

---

## Task 1: Extract blueprint primitives into a shared module

**Why:** `<Plate>`, `<RegMark>`, and `<SectionTag>` are defined inline in `App.jsx`. The new Shop OS page needs them too. This task is a pure refactor — UI must look identical after.

**Files:**
- Create: `src/components/blueprint.jsx`
- Modify: `src/App.jsx` (remove inline definitions; add import)

- [ ] **Step 1: Create the new module**

Create `src/components/blueprint.jsx` with this exact content:

```jsx
// Shared "blueprint drawing" primitives used across pages.
// Lifted verbatim from the original App.jsx so both Home and Shop OS can import.

export const SectionTag = ({ id, children }) => (
  <div className="flex items-center gap-4">
    <span className="label label-cyan">§{id}</span>
    <span className="h-px w-12 bg-[color:var(--cyan)] opacity-60" />
    <span className="label">{children}</span>
  </div>
)

export const RegMark = ({ position = 'top-left' }) => {
  const map = {
    'top-left': 'left-[-10px] top-[-10px]',
    'top-right': 'right-[-10px] top-[-10px]',
    'bottom-left': 'left-[-10px] bottom-[-10px]',
    'bottom-right': 'right-[-10px] bottom-[-10px]',
  }
  return <span aria-hidden className={`reg-mark ${map[position]}`} />
}

export const Plate = ({ accent = 'cyan', children, className = '' }) => (
  <div
    className={`plate ${accent === 'rust' ? 'plate-rust' : 'plate-cyan'} ${className}`}
  >
    <RegMark position="top-left" />
    <RegMark position="top-right" />
    <RegMark position="bottom-left" />
    <RegMark position="bottom-right" />
    {children}
  </div>
)
```

- [ ] **Step 2: Update `src/App.jsx` to import these instead of defining inline**

Open `src/App.jsx`. Near the top of the file (after the existing imports, around line 23 where `import './App.css'` lives) add:

```jsx
import { SectionTag, RegMark, Plate } from '@/components/blueprint.jsx'
```

Then delete the inline declarations of `SectionTag` (~lines 34-40), `RegMark` (~lines 42-50), and `Plate` (~lines 52-64) — the entire `// ---- small local components ----` block above `function App()`. Leave the `// -----...` separator comment so the file still parses cleanly.

- [ ] **Step 3: Verify build and visual**

```bash
pnpm build
pnpm dev
```
Expected: `pnpm build` exits 0. `pnpm dev` serves the home page with **zero visual change** — hero spec plate, service plates, registration crosshairs, section tags all render identically. Spot-check the hero spec plate (top-right) and the three services plates — the `<Plate>` corner marks must still be visible.

- [ ] **Step 4: Commit**

```bash
git add src/components/blueprint.jsx src/App.jsx
git commit -m "Extract Plate/RegMark/SectionTag into shared module"
```

---

## Task 2: Extract `<SiteNav />` and `<SiteFooter />`

**Why:** Both the home page and the new Shop OS page need the same nav and footer. Extract them so we don't duplicate. Still a pure refactor.

**Files:**
- Create: `src/components/SiteNav.jsx`
- Create: `src/components/SiteFooter.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create `src/components/SiteNav.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'

export default function SiteNav({ onCtaClick, navItems, ctaLabel = 'Discovery Call' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Live clock — editorial flourish from the original nav
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/New_York',
    })
  )
  useEffect(() => {
    const t = setInterval(() => {
      setClock(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'America/New_York',
        })
      )
    }, 15_000)
    return () => clearInterval(t)
  }, [])

  return (
    <nav className="sticky top-0 z-40 bg-[color:var(--paper)]/92 backdrop-blur border-b border-[color:var(--ink)]">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10">
        <a
          href="#top"
          className="flex items-baseline gap-3"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <span className="font-display text-2xl leading-none tracking-tight">
            Blueprint
            <span className="font-display-italic text-[color:var(--rust)]">IT</span>
          </span>
          <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-mute)]">
            / est. 2024 / Wake Forest · NC
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} onAfterClick={() => setIsMenuOpen(false)} />
          ))}
          <span className="font-mono text-[11px] text-[color:var(--ink-mute)] tabular-nums">
            {clock} EST
          </span>
          <button onClick={onCtaClick} className="btn-ink btn-rust">
            {ctaLabel}
            <ArrowUpRight size={14} strokeWidth={2} />
          </button>
        </div>

        <button
          className="md:hidden text-[color:var(--ink)]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-[color:var(--paper-line)] bg-[color:var(--paper)]">
          <div className="px-6 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                mobile
                onAfterClick={() => setIsMenuOpen(false)}
              />
            ))}
            <button
              onClick={() => {
                setIsMenuOpen(false)
                onCtaClick()
              }}
              className="btn-ink btn-rust mt-2 w-full justify-center"
            >
              {ctaLabel} <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavItem({ item, mobile, onAfterClick }) {
  const baseClass = mobile
    ? 'text-left font-mono text-xs uppercase tracking-[0.18em] py-2 text-[color:var(--ink-soft)]'
    : 'font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] transition-colors'

  if (item.kind === 'button') {
    return (
      <button
        onClick={() => {
          item.onClick()
          onAfterClick?.()
        }}
        className={baseClass}
      >
        {item.label}
      </button>
    )
  }

  // kind === 'link' — external or in-app router link
  // We render a plain <a>. Router replaces this in Task 4 with <Link>.
  return (
    <a
      href={item.href}
      onClick={(e) => {
        if (item.onAnchor) {
          e.preventDefault()
          item.onAnchor()
        }
        onAfterClick?.()
      }}
      className={baseClass}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
    >
      {item.label}
    </a>
  )
}
```

- [ ] **Step 2: Create `src/components/SiteFooter.jsx`**

```jsx
export default function SiteFooter({ links }) {
  return (
    <footer className="border-t border-[color:var(--ink)] bg-[color:var(--paper-2)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-baseline gap-4">
          <span className="font-display text-xl">
            Blueprint
            <span className="font-display-italic text-[color:var(--rust)]">IT</span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--ink-mute)]">
            © {new Date().getFullYear()} · All rights reserved
          </span>
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--ink-mute)]">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => {
                if (l.onAnchor) {
                  e.preventDefault()
                  l.onAnchor()
                }
              }}
              className="hover:text-[color:var(--ink)]"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Replace inline nav and footer in `src/App.jsx`**

At the top of `src/App.jsx` add:

```jsx
import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
```

Remove the unused icon imports that the nav previously needed (`Menu`, `X`, `ArrowUpRight`) — keep them only if other parts of `App.jsx` still use them. Run `pnpm lint` after this step if uncertain; remove only what's flagged.

Replace the entire `<nav>...</nav>` block (currently ~lines 321-404) with:

```jsx
<SiteNav
  ctaLabel="Discovery Call"
  onCtaClick={() => scrollToSection('contact')}
  navItems={[
    { kind: 'button', label: 'Services', onClick: () => scrollToSection('services') },
    { kind: 'button', label: 'Studio', onClick: () => scrollToSection('about') },
    { kind: 'button', label: 'Case', onClick: () => scrollToSection('workflow') },
    { kind: 'button', label: 'Contact', onClick: () => scrollToSection('contact') },
  ]}
/>
```

Replace the entire `<footer>...</footer>` block (currently ~lines 1205-1230) with:

```jsx
<SiteFooter
  links={[
    { label: 'Services', href: '#services', onAnchor: () => scrollToSection('services') },
    { label: 'Studio', href: '#about', onAnchor: () => scrollToSection('about') },
    { label: 'Contact', href: '#contact', onAnchor: () => scrollToSection('contact') },
  ]}
/>
```

Delete the now-orphaned `isMenuOpen` state and `clock` state from `App()` (the new `SiteNav` owns them internally). Search-and-delete:

```jsx
const [isMenuOpen, setIsMenuOpen] = useState(false)
```

and the entire `clock` `useState`/`useEffect` block (currently ~lines 88-108). Keep `formSubmissionState`, `formData`, `thankYouRef` — those are still used by the contact form.

- [ ] **Step 4: Verify**

```bash
pnpm lint
pnpm build
pnpm dev
```

Expected:
- `pnpm lint` reports no new errors.
- `pnpm build` exits 0.
- Browser at `localhost:5173`: nav looks identical (Blueprint IT logo, four items, live clock, Discovery Call button). Mobile menu (resize browser < 768px) opens/closes the hamburger correctly. Footer at bottom looks identical. Anchor clicks still scroll to the right sections.

- [ ] **Step 5: Commit**

```bash
git add src/components/SiteNav.jsx src/components/SiteFooter.jsx src/App.jsx
git commit -m "Extract SiteNav and SiteFooter into shared components"
```

---

## Task 3: Wire up React Router and create the Home page

**Why:** We need real routes so `/shop-os` can be a separate page with its own URL and `<title>`. The current `App.jsx` becomes a tiny route shell; its body moves to `pages/Home.jsx`.

**Files:**
- Modify: `src/main.jsx`
- Create: `src/pages/Home.jsx`
- Modify: `src/App.jsx` (rewrite to be a tiny route shell)
- Create: `src/pages/ShopOS.jsx` (placeholder stub for now)

- [ ] **Step 1: Wrap the app in `<BrowserRouter>`**

Replace the entire contents of `src/main.jsx` with:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 2: Move current home content to `src/pages/Home.jsx`**

Create `src/pages/Home.jsx`. Copy the entire current `src/App.jsx` into it, then:

1. Change the function name from `App` to `Home`.
2. Change the default export at the bottom from `export default App` to `export default Home` (or update the existing `export default function App()` block accordingly).
3. Update all relative imports to go up one more level: `'./App.css'` → `'../App.css'`, `'./assets/...'` → `'../assets/...'`, `'@/components/...'` paths stay the same (the `@` alias points at `src/`).

If your `App.jsx` uses `export default function App() { ... }` syntax, the simplest rewrite is:

```jsx
// Top of file
// ... imports (with relative paths bumped up one level) ...

function Home() {
  // ... existing body ...
}

export default Home
```

- [ ] **Step 3: Create a placeholder `src/pages/ShopOS.jsx`**

```jsx
function ShopOS() {
  return (
    <div className="bp-grid bp-grain min-h-screen text-[color:var(--ink)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-32">
        <h1 className="font-display text-6xl">Shop OS — placeholder</h1>
        <p className="mt-6 text-[color:var(--ink-soft)]">
          This page will be built out in subsequent tasks.
        </p>
      </div>
    </div>
  )
}

export default ShopOS
```

- [ ] **Step 4: Rewrite `src/App.jsx` as a route shell**

Replace the entire contents of `src/App.jsx` with:

```jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ShopOS from './pages/ShopOS.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop-os" element={<ShopOS />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default App
```

- [ ] **Step 5: Verify both routes**

```bash
pnpm build
pnpm dev
```

Expected:
- `pnpm build` exits 0.
- `http://localhost:5173/` renders the full home page exactly as before.
- `http://localhost:5173/shop-os` renders the "Shop OS — placeholder" stub with the same `.bp-grid` paper background.
- Refreshing on `/shop-os` still renders the stub (Vite dev server handles SPA fallback automatically; production hosting is addressed in Task 12).

- [ ] **Step 6: Commit**

```bash
git add src/main.jsx src/App.jsx src/pages/Home.jsx src/pages/ShopOS.jsx
git commit -m "Wire up React Router; extract Home page; add /shop-os stub"
```

---

## Task 4: Make nav and footer page-aware; add "Shop OS" link

**Why:** When on `/shop-os`, the "Services" / "Studio" / "Case" / "Contact" nav items can't scroll-to-section — those sections live on `/`. They need to become cross-page anchor links. Also, add the new "Shop OS" item itself.

**Files:**
- Modify: `src/components/SiteNav.jsx` (add `<Link>` support to `NavItem`)
- Modify: `src/components/SiteFooter.jsx` (add `<Link>` support)
- Modify: `src/pages/Home.jsx` (pass home-mode nav items)
- Modify: `src/pages/ShopOS.jsx` (mount SiteNav + SiteFooter; pass shop-os-mode nav items)

- [ ] **Step 1: Update `NavItem` in `SiteNav.jsx` to support router links + active-state styling**

At the top of `src/components/SiteNav.jsx`, add the import:

```jsx
import { Link, useLocation } from 'react-router-dom'
```

Replace the existing `NavItem` function (the entire `function NavItem(...) {...}` block at the bottom of the file) with:

```jsx
function NavItem({ item, mobile, onAfterClick }) {
  const location = useLocation()
  const activeClass = 'text-[color:var(--ink)]'
  const inactiveClass = 'text-[color:var(--ink-soft)]'

  // Determine active: route matches current path; "/" matches both "/" and "/#..."
  let isActive = false
  if (item.kind === 'route' && location.pathname === item.to) isActive = true
  // For 'button' or 'link' kinds, active state is implied by being on the home route
  // and the item targeting the home route's sections — we leave them inactive (subtle).

  const colorClass = isActive ? activeClass : inactiveClass

  const baseClass = mobile
    ? `text-left font-mono text-xs uppercase tracking-[0.18em] py-2 ${colorClass}`
    : `font-mono text-[11px] uppercase tracking-[0.18em] ${colorClass} hover:text-[color:var(--ink)] transition-colors`

  if (item.kind === 'button') {
    return (
      <button
        onClick={() => {
          item.onClick()
          onAfterClick?.()
        }}
        className={baseClass}
      >
        {item.label}
      </button>
    )
  }

  if (item.kind === 'route') {
    return (
      <Link to={item.to} onClick={() => onAfterClick?.()} className={baseClass}>
        {item.label}
      </Link>
    )
  }

  // kind === 'link' — plain anchor (used for cross-page hash links like /#services).
  // We use a plain <a> on purpose: browser handles scroll-to-hash automatically after
  // the home page loads, which avoids needing a custom ScrollToHash router helper.
  return (
    <a
      href={item.href}
      onClick={(e) => {
        if (item.onAnchor) {
          e.preventDefault()
          item.onAnchor()
        }
        onAfterClick?.()
      }}
      className={baseClass}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
    >
      {item.label}
    </a>
  )
}
```

- [ ] **Step 2: Update `SiteFooter.jsx` to support router links**

Replace the entire contents of `src/components/SiteFooter.jsx` with:

```jsx
import { Link } from 'react-router-dom'

export default function SiteFooter({ links }) {
  return (
    <footer className="border-t border-[color:var(--ink)] bg-[color:var(--paper-2)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-baseline gap-4">
          <span className="font-display text-xl">
            Blueprint
            <span className="font-display-italic text-[color:var(--rust)]">IT</span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--ink-mute)]">
            © {new Date().getFullYear()} · All rights reserved
          </span>
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--ink-mute)]">
          {links.map((l) => {
            if (l.to) {
              return (
                <Link key={l.label} to={l.to} className="hover:text-[color:var(--ink)]">
                  {l.label}
                </Link>
              )
            }
            return (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => {
                  if (l.onAnchor) {
                    e.preventDefault()
                    l.onAnchor()
                  }
                }}
                className="hover:text-[color:var(--ink)]"
              >
                {l.label}
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Update `Home.jsx` to add the "Shop OS" nav item**

In `src/pages/Home.jsx`, find the `<SiteNav navItems={[ ... ]} />` array and update it to:

```jsx
<SiteNav
  ctaLabel="Discovery Call"
  onCtaClick={() => scrollToSection('contact')}
  navItems={[
    { kind: 'button', label: 'Services', onClick: () => scrollToSection('services') },
    { kind: 'route', to: '/shop-os', label: 'Shop OS' },
    { kind: 'button', label: 'Studio', onClick: () => scrollToSection('about') },
    { kind: 'button', label: 'Case', onClick: () => scrollToSection('workflow') },
    { kind: 'button', label: 'Contact', onClick: () => scrollToSection('contact') },
  ]}
/>
```

Footer in `Home.jsx` stays as-is (no Shop OS link in the footer — intentional per spec).

- [ ] **Step 4: Mount nav and footer on `ShopOS.jsx`**

Replace the placeholder body in `src/pages/ShopOS.jsx` with:

```jsx
import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'

const CALENDLY_URL = 'https://calendly.com/blueprintit/15-ai-shop-os-discovery'
const openCalendly = () => window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')

function ShopOS() {
  return (
    <div className="bp-grid bp-grain min-h-screen text-[color:var(--ink)] relative">
      <SiteNav
        ctaLabel="Start install"
        onCtaClick={openCalendly}
        navItems={[
          { kind: 'link', label: 'Services', href: '/#services' },
          { kind: 'route', to: '/shop-os', label: 'Shop OS' },
          { kind: 'link', label: 'Studio', href: '/#about' },
          { kind: 'link', label: 'Case', href: '/#workflow' },
          { kind: 'link', label: 'Contact', href: '/#contact' },
        ]}
      />

      <main className="relative z-[2]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-32">
          <h1 className="font-display text-6xl">Shop OS — placeholder</h1>
          <p className="mt-6 text-[color:var(--ink-soft)]">
            Real sections land in subsequent tasks.
          </p>
        </div>
      </main>

      <SiteFooter
        links={[
          { label: 'Services', href: '/#services' },
          { label: 'Studio', href: '/#about' },
          { label: 'Contact', href: '/#contact' },
        ]}
      />
    </div>
  )
}

export default ShopOS
```

- [ ] **Step 5: Verify both pages**

```bash
pnpm build
pnpm dev
```

Expected:
- `/` shows the home page with "Shop OS" as a new nav item between "Services" and "Studio." Clicking it routes to `/shop-os`.
- `/shop-os` shows the placeholder page with the same nav (now including Shop OS), and clicking "Services" from the Shop OS page navigates back to `/` and scrolls to `#services`.
- "Start install" button on Shop OS opens Calendly in a new tab.
- Mobile menu works correctly on both pages.

- [ ] **Step 6: Commit**

```bash
git add src/components/SiteNav.jsx src/components/SiteFooter.jsx src/pages/Home.jsx src/pages/ShopOS.jsx
git commit -m "Add Shop OS nav link; make nav and footer page-aware"
```

---

## Task 5: Build `<BlueprintCanvas />` — the animated background

**Why:** This is the "moving background" the spec calls for. A fixed-viewport 2D canvas with four layered effects (drifting grid, dimension lines, node graph, scanline). Plain canvas; no Three.js.

**Files:**
- Create: `src/components/BlueprintCanvas.jsx`
- Modify: `src/pages/ShopOS.jsx` (mount the canvas)
- Modify: `src/App.css` (append canvas positioning class)

- [ ] **Step 1: Append canvas style to `src/App.css`**

Add at the bottom of `src/App.css`:

```css
/* -----------------------------------------------------------
   Shop OS page — blueprint canvas background
------------------------------------------------------------*/
.bp-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 2: Create `src/components/BlueprintCanvas.jsx`**

```jsx
import { useEffect, useRef } from 'react'

// Fixed-viewport, low-opacity animated background.
// Four layers, all drawn with the existing palette (cyan, rust, ink-soft).
// 2D canvas only — no WebGL, no extra deps. Honors prefers-reduced-motion.

const COLORS = {
  cyan: '28, 110, 164', // var(--cyan) as rgb triplet
  rust: '194, 70, 31', // var(--rust)
  inkSoft: '42, 63, 85', // var(--ink-soft)
}

const NODE_LABELS = [
  'POS', 'INVENTORY', 'EMAIL', 'CRM', 'SHEETS',
  'STOCK', 'BRAIN', 'OPS', 'BOOKINGS',
]
const DIM_LABEL_POOL = [
  '240mm', '1.4s', '§07', '180mm', '0.6s', '320mm',
  '§02', '14d', '500mm', '24px', '§14',
]

export default function BlueprintCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let mobileScale = 1

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      mobileScale = width < 768 ? 0.5 : 1
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Re-seed node positions on resize so the graph stays distributed.
      seedNodes()
    }

    // --- Layer state -------------------------------------------------------
    let gridOffsetX = 0
    let gridOffsetY = 0
    let dimLines = [] // { x, y, length, axis: 'h'|'v', label, color, age, ttl }
    let dimSpawnTimer = 0
    let scanlineY = 0
    let nodes = [] // { x, y, label }
    let edges = [] // { a, b, drawn }  drawn 0..1
    let edgeSpawnTimer = 0
    let graphFadeOut = 0 // 0..1
    let graphResetTimer = 0

    function seedNodes() {
      nodes = []
      const count = 8
      const cols = 4
      const rows = 2
      const padX = width * 0.12
      const padY = height * 0.18
      const colW = (width - padX * 2) / (cols - 1)
      const rowH = (height - padY * 2) / (rows - 1)
      for (let i = 0; i < count; i++) {
        const c = i % cols
        const r = Math.floor(i / cols)
        const jitterX = (Math.random() - 0.5) * 60
        const jitterY = (Math.random() - 0.5) * 60
        nodes.push({
          x: padX + c * colW + jitterX,
          y: padY + r * rowH + jitterY,
          label: NODE_LABELS[i % NODE_LABELS.length],
        })
      }
      edges = []
      graphFadeOut = 0
      graphResetTimer = 0
    }

    function spawnDimLine() {
      const axis = Math.random() < 0.5 ? 'h' : 'v'
      const minLen = 120
      const maxLen = axis === 'h' ? Math.min(360, width * 0.35) : Math.min(220, height * 0.32)
      const length = minLen + Math.random() * (maxLen - minLen)
      const margin = 60
      const x = margin + Math.random() * (width - margin * 2 - (axis === 'h' ? length : 0))
      const y = margin + Math.random() * (height - margin * 2 - (axis === 'v' ? length : 0))
      dimLines.push({
        x, y, length, axis,
        label: DIM_LABEL_POOL[Math.floor(Math.random() * DIM_LABEL_POOL.length)],
        color: Math.random() < 0.18 ? COLORS.rust : COLORS.cyan,
        age: 0,
        ttl: 5.0, // seconds total: 0.8 draw + 3.0 dwell + 1.2 fade
      })
    }

    function spawnEdge() {
      // Pick a node that has < 2 edges, connect to its nearest unconnected neighbor.
      const degree = (i) => edges.filter((e) => e.a === i || e.b === i).length
      const candidates = nodes.map((_, i) => i).filter((i) => degree(i) < 3)
      if (candidates.length === 0) return false
      const a = candidates[Math.floor(Math.random() * candidates.length)]
      let bestB = -1
      let bestD = Infinity
      for (let b = 0; b < nodes.length; b++) {
        if (b === a) continue
        if (edges.some((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))) continue
        const dx = nodes[a].x - nodes[b].x
        const dy = nodes[a].y - nodes[b].y
        const d = dx * dx + dy * dy
        if (d < bestD) {
          bestD = d
          bestB = b
        }
      }
      if (bestB === -1) return false
      edges.push({ a, b: bestB, drawn: 0 })
      return true
    }

    // --- Draw helpers ------------------------------------------------------
    function drawGrid() {
      const step = 24
      const cellOpacity = 0.08 * mobileScale
      ctx.fillStyle = `rgba(${COLORS.cyan}, ${cellOpacity})`
      const ox = ((gridOffsetX % step) + step) % step
      const oy = ((gridOffsetY % step) + step) % step
      for (let y = -step; y < height + step; y += step) {
        for (let x = -step; x < width + step; x += step) {
          ctx.fillRect(x - ox, y - oy, 1, 1)
        }
      }
    }

    function drawDimLines() {
      ctx.font = '10px "JetBrains Mono", ui-monospace, Menlo, monospace'
      ctx.textBaseline = 'middle'
      for (const d of dimLines) {
        // Compute alpha across age phases
        let alpha = 0
        let drawProgress = 0
        if (d.age < 0.8) {
          drawProgress = d.age / 0.8
          alpha = drawProgress
        } else if (d.age < 0.8 + 3.0) {
          drawProgress = 1
          alpha = 1
        } else {
          drawProgress = 1
          alpha = Math.max(0, 1 - (d.age - 3.8) / 1.2)
        }
        const peakAlpha = 0.16 * mobileScale
        ctx.strokeStyle = `rgba(${d.color}, ${alpha * peakAlpha})`
        ctx.lineWidth = 1
        if (d.axis === 'h') {
          const len = d.length * drawProgress
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x + len, d.y)
          ctx.stroke()
          // tick marks at each end
          ctx.beginPath()
          ctx.moveTo(d.x, d.y - 4); ctx.lineTo(d.x, d.y + 4)
          ctx.moveTo(d.x + len, d.y - 4); ctx.lineTo(d.x + len, d.y + 4)
          ctx.stroke()
          if (drawProgress > 0.95) {
            ctx.fillStyle = `rgba(${d.color}, ${alpha * peakAlpha * 1.4})`
            ctx.textAlign = 'center'
            ctx.fillText(d.label, d.x + d.length / 2, d.y - 8)
          }
        } else {
          const len = d.length * drawProgress
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x, d.y + len)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(d.x - 4, d.y); ctx.lineTo(d.x + 4, d.y)
          ctx.moveTo(d.x - 4, d.y + len); ctx.lineTo(d.x + 4, d.y + len)
          ctx.stroke()
          if (drawProgress > 0.95) {
            ctx.save()
            ctx.translate(d.x + 8, d.y + d.length / 2)
            ctx.rotate(-Math.PI / 2)
            ctx.fillStyle = `rgba(${d.color}, ${alpha * peakAlpha * 1.4})`
            ctx.textAlign = 'center'
            ctx.fillText(d.label, 0, 0)
            ctx.restore()
          }
        }
      }
    }

    function drawNodeGraph() {
      const fade = 1 - graphFadeOut
      const baseAlpha = 0.18 * mobileScale * fade
      // edges
      ctx.lineWidth = 1
      for (const e of edges) {
        const a = nodes[e.a]
        const b = nodes[e.b]
        // Axis-aligned L-shaped polyline (drafting style): cardinal only.
        const midX = a.x + (b.x - a.x) * e.drawn
        const midY = a.y + (b.y - a.y) * e.drawn
        ctx.strokeStyle = `rgba(${COLORS.cyan}, ${baseAlpha * 0.7})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        // First leg horizontal, second leg vertical
        ctx.lineTo(midX, a.y)
        ctx.lineTo(midX, midY)
        ctx.stroke()
      }
      // nodes — small registration crosshairs
      ctx.strokeStyle = `rgba(${COLORS.cyan}, ${baseAlpha})`
      ctx.fillStyle = `rgba(${COLORS.cyan}, ${baseAlpha * 1.2})`
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        ctx.beginPath()
        ctx.moveTo(n.x - 6, n.y); ctx.lineTo(n.x + 6, n.y)
        ctx.moveTo(n.x, n.y - 6); ctx.lineTo(n.x, n.y + 6)
        ctx.stroke()
        // Label only on connected nodes
        const isConnected = edges.some((e) => e.a === i || e.b === i)
        if (isConnected) {
          ctx.font = '9px "JetBrains Mono", ui-monospace, Menlo, monospace'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText(n.label, n.x + 10, n.y + 1)
        }
      }
    }

    function drawScanline() {
      const alpha = 0.10 * mobileScale
      ctx.fillStyle = `rgba(${COLORS.cyan}, ${alpha})`
      ctx.fillRect(0, scanlineY, width, 1)
    }

    // --- Main loop ---------------------------------------------------------
    function drawFrame(dt) {
      ctx.clearRect(0, 0, width, height)
      drawGrid()
      drawDimLines()
      drawNodeGraph()
      drawScanline()
    }

    function tick(dt) {
      // Grid pan
      gridOffsetX += 5 * dt
      gridOffsetY += 3 * dt

      // Dim lines
      dimSpawnTimer -= dt
      if (dimSpawnTimer <= 0 && dimLines.length < 5) {
        spawnDimLine()
        dimSpawnTimer = 4 + Math.random() * 4
      }
      for (const d of dimLines) d.age += dt
      dimLines = dimLines.filter((d) => d.age < d.ttl)

      // Node graph
      if (graphFadeOut === 0) {
        edgeSpawnTimer -= dt
        if (edgeSpawnTimer <= 0) {
          const ok = spawnEdge()
          edgeSpawnTimer = ok ? 6 + Math.random() * 4 : 0
          if (!ok && edges.length >= nodes.length - 1) {
            graphFadeOut = 0.0001 // start fade
          }
        }
        for (const e of edges) e.drawn = Math.min(1, e.drawn + dt / 1.2)
      } else {
        graphFadeOut = Math.min(1, graphFadeOut + dt / 2.0)
        if (graphFadeOut >= 1) {
          graphResetTimer += dt
          if (graphResetTimer > 0.6) seedNodes()
        }
      }

      // Scanline
      scanlineY += (height / 20) * dt
      if (scanlineY > height) scanlineY = -1
    }

    // 30fps cap. dt is seconds since last frame.
    let last = performance.now()
    let rafId = 0
    const frameInterval = 1000 / 30

    function loop(now) {
      const elapsed = now - last
      if (elapsed >= frameInterval) {
        const dt = Math.min(0.1, elapsed / 1000)
        last = now - (elapsed % frameInterval)
        if (!document.hidden) {
          tick(dt)
          drawFrame(dt)
        }
      }
      rafId = requestAnimationFrame(loop)
    }

    function drawStaticFrame() {
      // Seed once, draw once. No animation.
      seedNodes()
      // Pre-populate a few edges and dim lines for visual interest
      for (let i = 0; i < 4; i++) spawnEdge()
      for (const e of edges) e.drawn = 1
      for (let i = 0; i < 3; i++) {
        spawnDimLine()
        dimLines[dimLines.length - 1].age = 1.0 // hold in dwell phase
      }
      drawFrame(0)
    }

    // 150ms debounce on resize per spec.
    let resizeTimer = 0
    function debouncedResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 150)
    }

    resize()
    window.addEventListener('resize', debouncedResize)

    if (reducedMotion) {
      drawStaticFrame()
    } else {
      seedNodes()
      rafId = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', debouncedResize)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="bp-canvas" />
}
```

- [ ] **Step 3: Mount the canvas on `ShopOS.jsx`**

Update `src/pages/ShopOS.jsx`:

```jsx
import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
import BlueprintCanvas from '@/components/BlueprintCanvas.jsx'

const CALENDLY_URL = 'https://calendly.com/blueprintit/15-ai-shop-os-discovery'
const openCalendly = () => window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')

function ShopOS() {
  return (
    <div className="bp-grid bp-grain min-h-screen text-[color:var(--ink)] relative">
      <BlueprintCanvas />

      <SiteNav
        ctaLabel="Start install"
        onCtaClick={openCalendly}
        navItems={[
          { kind: 'link', label: 'Services', href: '/#services' },
          { kind: 'route', to: '/shop-os', label: 'Shop OS' },
          { kind: 'link', label: 'Studio', href: '/#about' },
          { kind: 'link', label: 'Case', href: '/#workflow' },
          { kind: 'link', label: 'Contact', href: '/#contact' },
        ]}
      />

      <main className="relative z-[2]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-32">
          <h1 className="font-display text-6xl">Shop OS — placeholder</h1>
          <p className="mt-6 text-[color:var(--ink-soft)]">
            Real sections land in subsequent tasks. Canvas should be visibly animating behind this text.
          </p>
        </div>
      </main>

      <SiteFooter
        links={[
          { label: 'Services', href: '/#services' },
          { label: 'Studio', href: '/#about' },
          { label: 'Contact', href: '/#contact' },
        ]}
      />
    </div>
  )
}

export default ShopOS
```

- [ ] **Step 4: Verify**

```bash
pnpm build
pnpm dev
```

Visit `http://localhost:5173/shop-os`. Expected:
- Cream paper background.
- Faint cyan dotted grid drifting slowly diagonally.
- Every ~6 seconds, a small dimension line draws on, holds, fades out.
- Small registration crosshairs visible at ~8 spots; thin cyan lines connect them one at a time.
- A faint horizontal scanline crosses the screen top-to-bottom every ~20 seconds.
- All canvas elements are subtle — page text/headline remains the clear visual hero.
- No console errors.

Resize the browser to < 768px width: canvas opacity halves (animation still runs but is subtler).

In macOS System Settings → Accessibility → Display → "Reduce motion," enable it, refresh: canvas draws one static frame, no animation. (Optional spot-check.)

- [ ] **Step 5: Commit**

```bash
git add src/components/BlueprintCanvas.jsx src/pages/ShopOS.jsx src/App.css
git commit -m "Add BlueprintCanvas animated background and mount on /shop-os"
```

---

## Task 6: Build the Shop OS hero section

**Why:** First real content section. Headline + subhead + CTAs + spec-sheet `<Plate>`.

**Files:**
- Modify: `src/pages/ShopOS.jsx`

- [ ] **Step 1: Add the hero JSX**

In `src/pages/ShopOS.jsx`, add these imports at the top alongside the existing imports:

```jsx
import { motion, MotionConfig } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SectionTag, Plate } from '@/components/blueprint.jsx'
```

Then wrap the existing top-level `<div className="bp-grid bp-grain ...">` with `<MotionConfig reducedMotion="user">`. The opening of the JSX returned from `ShopOS()` should now look like:

```jsx
return (
  <MotionConfig reducedMotion="user">
    <div className="bp-grid bp-grain min-h-screen text-[color:var(--ink)] relative">
      <BlueprintCanvas />
      <SiteNav ... />
      <main className="relative z-[2]">
        {/* hero section below */}
```

And the closing tags at the end of the return should be `</main> <SiteFooter ... /> </div> </MotionConfig>` (one extra `</MotionConfig>` wrapper at the very end). `MotionConfig` with `reducedMotion="user"` instructs framer-motion to skip transform animations when the user prefers reduced motion, while still allowing opacity transitions — matching the spec's behavior requirement.

Replace the entire `<main>...</main>` block with:

```jsx
<main className="relative z-[2]">
  {/* =========================================================
      HERO — Drawing № 01
  ==========================================================*/}
  <section id="shop-os-top" className="relative overflow-hidden">
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-14 md:pt-24 pb-20 md:pb-32">
      <div className="grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <SectionTag id="00">Drawing № 01 · Introduction</SectionTag>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-display mt-8 text-[clamp(2.6rem,8vw,7.2rem)] leading-[0.92] tracking-[-0.03em]"
          >
            An{' '}
            <span className="font-display-italic text-[color:var(--cyan)]">AI</span>{' '}
            operating system for your small business —{' '}
            <span className="font-display-italic text-[color:var(--rust)]">
              installed in 14 days.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="mt-8 max-w-2xl text-lg md:text-xl leading-[1.55] text-[color:var(--ink-soft)]"
          >
            Your team has ChatGPT. Your company has nothing. Blueprint IT installs
            Shop OS in two weeks: a shared context layer wired into your stack,
            two proof automations running on top, and a tuned-up team that owns
            it on day one.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <button onClick={openCalendly} className="btn-ink">
              Start the 14-day install
              <ArrowRight size={14} strokeWidth={2.2} />
            </button>
            <a
              href="#shop-anatomy"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] transition-colors underline-offset-[6px] hover:underline"
            >
              ↓ See what gets installed
            </a>
          </motion.div>
        </div>

        {/* Right spec plate */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="md:col-span-4"
        >
          <Plate accent="cyan">
            <div className="label label-cyan mb-4">Spec sheet</div>
            <dl className="divide-y divide-[color:var(--paper-line)] font-mono text-xs">
              {[
                ['Practice', 'AI Operating System'],
                ['Duration', '14 days, kickoff to live'],
                ['Includes', 'Shop Brain + 2 automations'],
                ['Stack', 'Plugs into yours'],
                ['Handoff', 'Owned by your team'],
                ['Discovery', '15 minutes, free'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between py-2.5">
                  <dt className="uppercase tracking-[0.14em] text-[color:var(--ink-mute)]">
                    {k}
                  </dt>
                  <dd className="text-[color:var(--ink)] font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Plate>
        </motion.div>
      </div>
    </div>
  </section>
</main>
```

- [ ] **Step 2: Verify**

```bash
pnpm dev
```

Visit `/shop-os`. Expected:
- Large display headline with "AI" in cyan italics and "installed in 14 days." in rust italics.
- Subhead reads as in the spec.
- "Start the 14-day install" black button — clicking opens Calendly in a new tab.
- "↓ See what gets installed" mono link — clicking jumps to (nonexistent yet) `#shop-anatomy`; that's fine for now.
- Spec sheet plate on the right with 6 rows.
- Canvas background still animates behind everything.

- [ ] **Step 3: Commit**

```bash
git add src/pages/ShopOS.jsx
git commit -m "Build Shop OS hero section"
```

---

## Task 7: Build §01 — The Gap (copy + animated growth chart SVG)

**Files:**
- Modify: `src/pages/ShopOS.jsx`

- [ ] **Step 1: Append §01 to the `<main>` block in `ShopOS.jsx`**

Inside `<main>`, after the hero `</section>`, add:

```jsx
{/* =========================================================
    §01 — Drawing № 02 · The Gap
==========================================================*/}
<section id="shop-gap" className="relative">
  <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
    <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
      <div className="md:col-span-5">
        <SectionTag id="01">Drawing № 02 · The Gap</SectionTag>
        <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
          Your team has AI.{' '}
          <span className="font-display-italic text-[color:var(--rust)]">
            Your company has scattered context.
          </span>
        </h2>
        <p className="mt-6 text-[color:var(--ink-soft)] leading-relaxed text-lg">
          Knowledge lives in inboxes, Slack threads, Drive folders, CRM notes,
          and the heads of three people who joined before anyone wrote things
          down. Every new project re-discovers what the company already knows.
        </p>
        <p className="mt-4 text-[color:var(--ink-soft)] leading-relaxed text-lg">
          The businesses pulling ahead aren&apos;t the ones with more AI seats.
          They&apos;re the ones who built shared institutional intelligence on
          top of the AI — and let it compound.
        </p>
      </div>

      <div className="md:col-span-7 md:col-start-6">
        <Plate accent="cyan" className="bg-[color:var(--paper-2)]">
          <div className="label label-cyan mb-4">Fig. 02-A · Intelligence accumulated over time</div>
          <GrowthChart />
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] text-center">
            Scattered context stays flat. Institutional intelligence compounds.
          </p>
        </Plate>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add the `GrowthChart` component at the bottom of `ShopOS.jsx`** (before `export default ShopOS`)

```jsx
function GrowthChart() {
  const VBW = 600
  const VBH = 320
  const padL = 50
  const padR = 24
  const padT = 24
  const padB = 50
  const innerW = VBW - padL - padR
  const innerH = VBH - padT - padB

  // X positions for tick labels
  const ticks = [
    { x: 0.0, label: 'Day 0' },
    { x: 0.18, label: 'Day 14' },
    { x: 0.34, label: 'Mo 1' },
    { x: 0.56, label: 'Mo 3' },
    { x: 0.78, label: 'Mo 6' },
    { x: 1.0, label: 'Yr 1' },
  ]
  // Y for institutional intelligence — compounds: y = e^(2.4x) - 1 normalized
  function instY(x) {
    const raw = Math.pow(Math.E, 2.4 * x) - 1
    const max = Math.pow(Math.E, 2.4) - 1
    return raw / max
  }
  // Y for scattered context — flat with small noise
  function scatY(x) {
    return 0.08 + 0.06 * Math.sin(x * 6)
  }

  // Build SVG paths
  const samples = 60
  const instPath = ['M']
  const scatPath = ['M']
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const px = padL + t * innerW
    const py1 = padT + innerH * (1 - instY(t))
    const py2 = padT + innerH * (1 - scatY(t))
    instPath.push(`${px.toFixed(1)},${py1.toFixed(1)}`)
    scatPath.push(`${px.toFixed(1)},${py2.toFixed(1)}`)
    if (i === 0) {
      instPath.push('L')
      scatPath.push('L')
    }
  }
  // Remove trailing "L"
  const instD = instPath.join(' ').replace(/L$/, '').trim()
  const scatD = scatPath.join(' ').replace(/L$/, '').trim()

  return (
    <svg viewBox={`0 0 ${VBW} ${VBH}`} className="w-full h-auto">
      {/* dotted grid background */}
      <defs>
        <pattern id="dotgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="rgba(28, 110, 164, 0.18)" />
        </pattern>
      </defs>
      <rect
        x={padL}
        y={padT}
        width={innerW}
        height={innerH}
        fill="url(#dotgrid)"
      />

      {/* Axes */}
      <line x1={padL} y1={padT + innerH} x2={padL + innerW} y2={padT + innerH} stroke="var(--ink)" strokeWidth="1" />
      <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke="var(--ink)" strokeWidth="1" />

      {/* Day 14 vertical guide (rust dashed) */}
      <line
        x1={padL + innerW * 0.18}
        y1={padT}
        x2={padL + innerW * 0.18}
        y2={padT + innerH}
        stroke="var(--rust)"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.7"
      />
      <text
        x={padL + innerW * 0.18 + 6}
        y={padT + 14}
        fontFamily="JetBrains Mono"
        fontSize="9"
        fill="var(--rust)"
        textTransform="uppercase"
      >
        Day 14 · handoff
      </text>

      {/* Scattered context curve (dashed, ink-soft) */}
      <motion.path
        d={scatD}
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.7 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />

      {/* Institutional intelligence curve (solid cyan, thicker) */}
      <motion.path
        d={instD}
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
      />

      {/* X-axis ticks */}
      {ticks.map((t) => (
        <g key={t.label}>
          <line
            x1={padL + t.x * innerW}
            y1={padT + innerH}
            x2={padL + t.x * innerW}
            y2={padT + innerH + 4}
            stroke="var(--ink-soft)"
            strokeWidth="1"
          />
          <text
            x={padL + t.x * innerW}
            y={padT + innerH + 18}
            fontFamily="JetBrains Mono"
            fontSize="9"
            fill="var(--ink-soft)"
            textAnchor="middle"
          >
            {t.label}
          </text>
        </g>
      ))}

      {/* Y-axis label */}
      <text
        x={14}
        y={padT + innerH / 2}
        fontFamily="JetBrains Mono"
        fontSize="9"
        fill="var(--ink-soft)"
        textAnchor="middle"
        transform={`rotate(-90 14 ${padT + innerH / 2})`}
      >
        Company intelligence accumulated
      </text>

      {/* Curve labels at right edge */}
      <text
        x={padL + innerW - 6}
        y={padT + innerH * (1 - instY(1)) - 8}
        fontFamily="JetBrains Mono"
        fontSize="10"
        fill="var(--cyan)"
        textAnchor="end"
      >
        With Shop OS
      </text>
      <text
        x={padL + innerW - 6}
        y={padT + innerH * (1 - scatY(1)) - 8}
        fontFamily="JetBrains Mono"
        fontSize="10"
        fill="var(--ink-soft)"
        textAnchor="end"
      >
        Scattered Context
      </text>
    </svg>
  )
}
```

- [ ] **Step 3: Verify**

```bash
pnpm dev
```

Visit `/shop-os` and scroll down past the hero. Expected:
- §01 section with two-column layout.
- Left: section tag, headline with "Your company has scattered context." in rust italic, two paragraphs.
- Right: a `Plate` containing the growth chart SVG with dotted background, two curves (cyan solid, ink-soft dashed) that animate in via stroke-draw on scroll into view, x-axis ticks, "Day 14 · handoff" guide.
- Caption beneath the chart.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ShopOS.jsx
git commit -m "Build Shop OS §01 — The Gap with animated growth chart"
```

---

## Task 8: Build §02 — The Anatomy (orbit diagram + deliverable plates)

**Files:**
- Modify: `src/pages/ShopOS.jsx`

- [ ] **Step 1: Append §02 to `<main>`**

After §01's `</section>`, add:

```jsx
{/* =========================================================
    §02 — Drawing № 03 · The Anatomy
==========================================================*/}
<section id="shop-anatomy" className="relative bg-[color:var(--paper-2)]/60">
  <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
    <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20">
      <div className="md:col-span-6">
        <SectionTag id="02">Drawing № 03 · The Anatomy</SectionTag>
        <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
          The{' '}
          <span className="font-display-italic text-[color:var(--cyan)]">anatomy</span>{' '}
          of your AI Operating System.
        </h2>
      </div>
      <div className="md:col-span-5 md:col-start-8 md:pt-8">
        <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
          Two deliverables, installed in 14 days. A Shop Brain that plugs into
          your stack, and two proof automations running on top. Owned by you
          on day one of handoff.
        </p>
      </div>
    </div>

    {/* Orbit diagram */}
    <OrbitDiagram />

    {/* Two deliverable plates */}
    <div className="grid md:grid-cols-2 gap-8 mt-16 md:mt-20">
      <Plate accent="cyan" className="h-full">
        <div className="flex items-baseline justify-between mb-6">
          <span className="font-display text-5xl leading-none">01</span>
          <span className="label label-cyan">Deliverable</span>
        </div>
        <div className="label mb-3">context · queryable · operator-owned</div>
        <h3 className="font-display text-[2rem] leading-[1.05] tracking-[-0.015em] mb-4">
          A working Shop Brain.
        </h3>
        <p className="text-[color:var(--ink-soft)] leading-relaxed mb-6">
          Every AI interaction on your team reads from one centralized place:
          customer history, SOPs, brand voice, commercial rules. The
          institutional knowledge that lives in ten people&apos;s heads,
          queryable by every person and every automation. Plugs into your
          existing stack without replacing anything.
        </p>
        <div className="pt-5 border-t border-[color:var(--paper-line)]">
          <div className="label label-cyan mb-3">What your team gets</div>
          <ul className="space-y-2 mb-5">
            {[
              'One source of truth for every AI interaction',
              'Auto-ingestion from calls, email, and docs',
              'Connects to your CRM, calendar, and tools',
            ].map((d) => (
              <li key={d} className="flex items-center gap-3 font-mono text-[12px]">
                <span className="inline-block h-1.5 w-4 bg-[color:var(--cyan)]" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="label mb-3">At handoff</div>
          <ul className="space-y-2">
            {[
              'Operator trained to extend the Brain',
              'System owned by your team, not ours',
            ].map((d) => (
              <li key={d} className="flex items-center gap-3 font-mono text-[12px]">
                <span className="inline-block h-1.5 w-4 bg-[color:var(--ink-soft)]" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </Plate>

      <Plate accent="rust" className="h-full">
        <div className="flex items-baseline justify-between mb-6">
          <span className="font-display text-5xl leading-none">02</span>
          <span className="label label-rust">Deliverable</span>
        </div>
        <div className="label mb-3">scheduled · autonomous · template for the rest</div>
        <h3 className="font-display text-[2rem] leading-[1.05] tracking-[-0.015em] mb-4">
          Two proof automations.
        </h3>
        <p className="text-[color:var(--ink-soft)] leading-relaxed mb-6">
          End-to-end automations built on top of the Shop Brain in week two.
          Picked from your highest-leverage repetitive workflows. They run on
          real systems, unprompted, and they become the template your Operator
          uses to build the next ten without us.
        </p>
        <div className="pt-5 border-t border-[color:var(--paper-line)]">
          <div className="label label-rust mb-3">Example shapes</div>
          <ul className="space-y-2 mb-5">
            {[
              'Inbound call → CRM update + follow-up tasks',
              'Weekly ops digest auto-sent to leadership',
              'Deal qualification and routing on autopilot',
            ].map((d) => (
              <li key={d} className="flex items-center gap-3 font-mono text-[12px]">
                <span className="inline-block h-1.5 w-4 bg-[color:var(--rust)]" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="label mb-3">Why two</div>
          <ul className="space-y-2">
            {[
              'One proves the Brain works on real data',
              'One proves the pattern repeats',
            ].map((d) => (
              <li key={d} className="flex items-center gap-3 font-mono text-[12px]">
                <span className="inline-block h-1.5 w-4 bg-[color:var(--ink-soft)]" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </Plate>
    </div>

    {/* Seed Imports strip */}
    <div className="mt-12 border-t border-[color:var(--paper-line)] pt-8">
      <div className="flex items-baseline gap-4 mb-5">
        <div className="label label-cyan">Seed Imports</div>
        <div className="font-mono text-[11px] text-[color:var(--ink-mute)] uppercase tracking-[0.18em]">
          one-time at onboarding
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {[
          'Past Contracts',
          'Email Archives',
          'Call Library',
          'Slack / Teams History',
          'Spreadsheets & CSVs',
          'PDF Library',
        ].map((chip) => (
          <div
            key={chip}
            className="border border-dashed border-[color:var(--ink-soft)] bg-[color:var(--paper)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-soft)]"
          >
            {chip}
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add the `OrbitDiagram` component at the bottom of `ShopOS.jsx`** (next to `GrowthChart`)

```jsx
function OrbitDiagram() {
  // 8 chips arranged at 45° intervals on a ring around a center Shop Brain card.
  const chips = [
    'Email', 'Calls', 'Calendar', 'Docs',
    'CRM', 'Sheets', 'Messaging', 'Contracts',
  ]
  const VBW = 800
  const VBH = 560
  const cx = VBW / 2
  const cy = VBH / 2
  const r = 220

  return (
    <>
      {/* Desktop orbit */}
      <div className="hidden md:block">
        <svg viewBox={`0 0 ${VBW} ${VBH}`} className="w-full h-auto">
          {/* Orbit ring */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--paper-line)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {/* Center Shop Brain card */}
          <g>
            <rect
              x={cx - 120}
              y={cy - 56}
              width="240"
              height="112"
              fill="var(--card)"
              stroke="var(--ink)"
              strokeWidth="1"
            />
            <rect
              x={cx - 114}
              y={cy - 50}
              width="228"
              height="100"
              fill="none"
              stroke="var(--paper-line)"
              strokeWidth="1"
            />
            <text
              x={cx}
              y={cy - 8}
              fontFamily="Fraunces"
              fontSize="22"
              fill="var(--ink)"
              textAnchor="middle"
              fontStyle="italic"
            >
              The Shop Brain
            </text>
            <text
              x={cx}
              y={cy + 20}
              fontFamily="JetBrains Mono"
              fontSize="10"
              letterSpacing="2"
              fill="var(--cyan)"
              textAnchor="middle"
            >
              LIVE · CONNECTED
            </text>
          </g>

          {/* Chips with connecting lines */}
          {chips.map((chip, i) => {
            const angle = (i / chips.length) * Math.PI * 2 - Math.PI / 2
            const x = cx + Math.cos(angle) * r
            const y = cy + Math.sin(angle) * r
            // Inner ring end-point — just outside the center card
            const innerR = 70
            const ix = cx + Math.cos(angle) * innerR
            const iy = cy + Math.sin(angle) * innerR
            return (
              <motion.g
                key={chip}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              >
                {/* Connection line */}
                <line
                  x1={ix}
                  y1={iy}
                  x2={x}
                  y2={y}
                  stroke="var(--cyan)"
                  strokeWidth="1"
                  opacity="0.5"
                />
                {/* Chip background */}
                <rect
                  x={x - 50}
                  y={y - 14}
                  width="100"
                  height="28"
                  fill="var(--paper)"
                  stroke="var(--cyan)"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={y + 4}
                  fontFamily="JetBrains Mono"
                  fontSize="11"
                  letterSpacing="1.5"
                  fill="var(--cyan)"
                  textAnchor="middle"
                  style={{ textTransform: 'uppercase' }}
                >
                  {chip}
                </text>
              </motion.g>
            )
          })}
        </svg>
      </div>

      {/* Mobile fallback — vertical stack */}
      <div className="md:hidden">
        <Plate accent="cyan" className="text-center mb-4">
          <div className="font-display italic text-2xl mb-1">The Shop Brain</div>
          <div className="label label-cyan">LIVE · CONNECTED</div>
        </Plate>
        <div className="grid grid-cols-2 gap-2">
          {chips.map((chip) => (
            <div
              key={chip}
              className="border border-[color:var(--cyan)] bg-[color:var(--paper)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--cyan)] text-center"
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Verify**

```bash
pnpm dev
```

Visit `/shop-os` and scroll to §02. Expected:
- Section heading with "anatomy" in cyan italic.
- Lead paragraph on the right.
- Orbit diagram: dashed ring, "The Shop Brain" card in the middle, 8 chips around the ring with thin cyan connecting lines. Chips fade in with stagger on scroll.
- Two side-by-side `Plate` cards (cyan and rust). Each has Deliverable label, big "01"/"02", subtitle, headline, body, two bulleted lists.
- Seed Imports strip with 6 dashed-border chips at the bottom.
- On mobile (resize < 768px): orbit collapses to a stacked Shop Brain plate + 2-col chip grid.
- The "↓ See what gets installed" link from the hero now jumps here correctly.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ShopOS.jsx
git commit -m "Build Shop OS §02 — The Anatomy with orbit diagram and deliverables"
```

---

## Task 9: Build §03 — The 14 Days (3 phase cards)

**Files:**
- Modify: `src/pages/ShopOS.jsx`

- [ ] **Step 1: Append §03 to `<main>`**

After §02's `</section>`, add:

```jsx
{/* =========================================================
    §03 — Drawing № 04 · The 14 Days
==========================================================*/}
<section id="shop-14-days" className="relative">
  <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
    <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20">
      <div className="md:col-span-6">
        <SectionTag id="03">Drawing № 04 · The 14 Days</SectionTag>
        <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
          Three phases. Two weeks.{' '}
          <span className="font-display-italic text-[color:var(--rust)]">
            One handoff.
          </span>
        </h2>
      </div>
      <div className="md:col-span-5 md:col-start-8 md:pt-8">
        <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
          Every engagement runs the same playbook. By day 14, the system is
          live, the proof automations are running, and your internal Operator
          owns it without us in the room.
        </p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-8 items-stretch">
      {[
        {
          tag: 'Phase 01 · Days 1–4',
          range: '01',
          title: 'Discovery',
          body: 'Live screen-share sessions. We watch how the business actually runs, not how the docs say it runs. Real workflows, real friction, real handoffs between tools and people.',
          outputs: [
            'Operational map grounded in observation',
            'Two proof automations scoped and confirmed',
          ],
          accent: 'cyan',
        },
        {
          tag: 'Phase 02 · Days 5–10',
          range: '02',
          title: 'Shop Brain Setup',
          body: 'We build the Shop Brain: project structure, knowledge base, decision log, modular connectors. The substrate every future automation will run on.',
          outputs: [
            'Centralized context layer, populated and wired',
            'Connector layer live with your stack',
          ],
          accent: 'cyan',
        },
        {
          tag: 'Phase 03 · Days 11–14',
          range: '03',
          title: 'Proof + Handoff',
          body: 'Two end-to-end automations shipped on top of the Shop Brain. Live team workshop. Operator trained on extension patterns so the team keeps building without us.',
          outputs: [
            'Two proof automations running on real data',
            'System fully owned by your team',
          ],
          accent: 'rust',
        },
      ].map((phase, i) => (
        <motion.div
          key={phase.range}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, delay: i * 0.12 }}
          className="h-full"
        >
          <Plate accent={phase.accent} className="h-full flex flex-col">
            <div className="flex items-baseline justify-between mb-6">
              <span className="font-display text-5xl leading-none">{phase.range}</span>
              <span className={`label ${phase.accent === 'rust' ? 'label-rust' : 'label-cyan'}`}>
                {phase.tag}
              </span>
            </div>
            <h3 className="font-display text-[2rem] leading-[1.05] tracking-[-0.015em] mb-4">
              {phase.title}
            </h3>
            <p className="text-[color:var(--ink-soft)] leading-relaxed mb-6 flex-1">
              {phase.body}
            </p>
            <div className="pt-5 border-t border-[color:var(--paper-line)]">
              <div className={`label ${phase.accent === 'rust' ? 'label-rust' : 'label-cyan'} mb-3`}>
                Output
              </div>
              <ul className="space-y-2">
                {phase.outputs.map((o) => (
                  <li key={o} className="flex items-center gap-3 font-mono text-[12px]">
                    <span
                      className={`inline-block h-1.5 w-4 ${phase.accent === 'rust' ? 'bg-[color:var(--rust)]' : 'bg-[color:var(--cyan)]'}`}
                    />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Plate>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

```bash
pnpm dev
```

Expected on `/shop-os`:
- §03 heading with "One handoff." in rust italic.
- 3 phase cards in a row (cyan, cyan, rust accents), each with big number, phase tag, title, body, and "Output" bulleted list.
- Cards stagger-fade-in on scroll.
- On mobile, cards stack vertically.

- [ ] **Step 3: Commit**

```bash
git add src/pages/ShopOS.jsx
git commit -m "Build Shop OS §03 — The 14 Days phase cards"
```

---

## Task 10: Build §04 — The Operator (4 numbered cards)

**Files:**
- Modify: `src/pages/ShopOS.jsx`

- [ ] **Step 1: Append §04 to `<main>`**

After §03's `</section>`, add:

```jsx
{/* =========================================================
    §04 — Drawing № 05 · The Operator
==========================================================*/}
<section id="shop-operator" className="relative bg-[color:var(--paper-2)]/60">
  <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
    <div className="grid md:grid-cols-12 gap-10 md:gap-16 mb-14 md:mb-20">
      <div className="md:col-span-6">
        <SectionTag id="04">Drawing № 05 · The Operator</SectionTag>
        <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
          Who runs Shop OS{' '}
          <span className="font-display-italic text-[color:var(--cyan)]">
            after we leave.
          </span>
        </h2>
      </div>
      <div className="md:col-span-6">
        <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
          Every successful implementation has one thing in common. An internal
          owner who runs the Shop Brain after we leave. Not a new full-time
          hire. A few hours a week, owned by someone already on the team. We
          pick them with you in week one and train them in parallel with the
          build.
        </p>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-5">
      {[
        {
          n: '01',
          title: 'Maintains the Shop Brain',
          body: 'Updates context as strategy shifts, products change, people join. The Shop Brain stays current, so every output stays accurate. Minutes a day, not hours.',
        },
        {
          n: '02',
          title: 'Ships New Automations',
          body: 'Takes the patterns from the two proof builds and applies them to the next workflow. And the next. The Shop Brain compounds because the Operator keeps building.',
        },
        {
          n: '03',
          title: 'Onboards Teammates',
          body: 'Shows new hires how the Shop Brain works on day one. Adoption stops being a leadership problem and becomes a built-in onboarding step.',
        },
        {
          n: '04',
          title: 'Internal Point of Contact',
          body: 'When a teammate has an AI question, the Operator is the first stop. Not IT. Not the CEO. Real position, not a side gig.',
        },
      ].map((op, i) => (
        <motion.div
          key={op.n}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className="grid grid-cols-12 gap-4 md:gap-6 border-b border-[color:var(--paper-line)] pb-8 last:border-b-0 md:border-b-0 md:pb-0 md:p-6 md:bg-[color:var(--card)] md:border md:border-[color:var(--paper-line)]"
        >
          <div className="col-span-2">
            <div className="font-display text-4xl leading-none">{op.n}</div>
          </div>
          <div className="col-span-10">
            <h3 className="font-display text-2xl md:text-3xl leading-[1.1] tracking-[-0.015em]">
              {op.title}
            </h3>
            <p className="mt-2 text-[color:var(--ink-soft)] leading-relaxed">
              {op.body}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Expected on `/shop-os`:
- §04 heading with "after we leave." in cyan italic.
- Lead paragraph.
- Four cards in a 2×2 grid (single column on mobile), each with a big serif number on the left and title + body on the right.
- Cards stagger-fade-in on scroll.

- [ ] **Step 3: Commit**

```bash
git add src/pages/ShopOS.jsx
git commit -m "Build Shop OS §04 — The Operator cards"
```

---

## Task 11: Build final CTA section + per-page metadata

**Files:**
- Modify: `src/pages/ShopOS.jsx`

- [ ] **Step 1: Append the final CTA to `<main>`**

After §04's `</section>`, add:

```jsx
{/* =========================================================
    Final CTA — Drawing № 06 · Ready
==========================================================*/}
<section id="shop-ready" className="relative">
  <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-36 border-t border-[color:var(--ink)] text-center">
    <SectionTag id="05">Drawing № 06 · Ready</SectionTag>
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.8 }}
      className="font-display mt-8 text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-[-0.03em]"
    >
      Install your{' '}
      <span className="font-display-italic text-[color:var(--rust)]">Shop OS.</span>
    </motion.h2>
    <p className="mt-8 mx-auto max-w-2xl text-lg md:text-xl text-[color:var(--ink-soft)] leading-relaxed">
      14 days from kickoff to a working system your team owns. One call to
      scope it. One handoff to run it.
    </p>
    <div className="mt-10 flex flex-col items-center gap-4">
      <button onClick={openCalendly} className="btn-ink btn-rust">
        Start the 14-day install
        <ArrowUpRight size={14} strokeWidth={2.2} />
      </button>
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
        Straight to a real call. No funnel. No email gauntlet.
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add per-page metadata via `useEffect`**

At the top of `src/pages/ShopOS.jsx`, add `useEffect` to the React import:

```jsx
import { useEffect } from 'react'
```

Inside `function ShopOS()` (at the top of the function body, before `return`), add:

```jsx
useEffect(() => {
  const prevTitle = document.title
  document.title = 'Shop OS — AI Operating System Installed in 14 Days · Blueprint IT'

  // Update og:title and og:description meta tags if present
  const ogTitle = document.querySelector('meta[property="og:title"]')
  const ogDesc = document.querySelector('meta[property="og:description"]')
  const prevOgTitle = ogTitle?.getAttribute('content')
  const prevOgDesc = ogDesc?.getAttribute('content')
  ogTitle?.setAttribute('content', 'Shop OS — AI Operating System Installed in 14 Days · Blueprint IT')
  ogDesc?.setAttribute('content', 'Blueprint IT installs your Shop OS in 14 days — a Shop Brain wired into your stack, two proof automations, and a team that owns it on day one.')

  return () => {
    document.title = prevTitle
    if (prevOgTitle) ogTitle?.setAttribute('content', prevOgTitle)
    if (prevOgDesc) ogDesc?.setAttribute('content', prevOgDesc)
  }
}, [])
```

- [ ] **Step 3: Verify**

```bash
pnpm dev
```

Expected:
- §05 / Final CTA section: big italic-rust "Shop OS." headline, paragraph, large rust-styled `btn-ink btn-rust` CTA button, subtext.
- Clicking CTA opens Calendly.
- Browser tab title reads "Shop OS — AI Operating System Installed in 14 Days · Blueprint IT" when on `/shop-os`, reverts to the original title when navigating back to `/`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ShopOS.jsx
git commit -m "Build Shop OS final CTA section and add page metadata"
```

---

## Task 12: Add SPA fallback config for production hosting

**Why:** When the production site is served as a static build, a direct hit to `/shop-os` (or a hard refresh) returns 404 unless the host rewrites unknown paths to `/index.html`. Add both common hosts' configs so it works wherever this gets deployed.

**Files:**
- Create: `public/_redirects` (Netlify)
- Create: `vercel.json` (Vercel)

- [ ] **Step 1: Add Netlify redirects file**

Create `public/_redirects` with this exact content:

```
/*  /index.html  200
```

(One line. Two spaces between the columns. Vite copies the `public/` directory verbatim into the build output.)

- [ ] **Step 2: Add Vercel rewrites config**

Create `vercel.json` at the repo root with:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

- [ ] **Step 3: Verify build copies the redirects file**

```bash
pnpm build
ls dist/_redirects
```

Expected: `dist/_redirects` exists.

- [ ] **Step 4: Commit**

```bash
git add public/_redirects vercel.json
git commit -m "Add SPA fallback config for Netlify and Vercel hosting"
```

---

## Task 13: Final verification pass

**Why:** End-to-end check before declaring done.

- [ ] **Step 1: Lint and build clean**

```bash
pnpm lint
pnpm build
```

Expected: zero new errors. If `pnpm lint` flags pre-existing issues unrelated to the new files, leave them.

- [ ] **Step 2: Manual walkthrough on desktop (≥ 1024px wide)**

Open `pnpm dev` and walk through:

1. Home page `/` loads identical to before. Nav contains: Services, **Shop OS**, Studio, Case, Contact.
2. Click "Shop OS" in nav. URL changes to `/shop-os`. Hero loads with animated background visible.
3. Scroll through every section: Hero → §01 Gap (chart animates in) → §02 Anatomy (orbit + plates + seed strip) → §03 14 Days (3 phases) → §04 Operator (4 cards) → Final CTA.
4. Click "Start the 14-day install" in hero, in nav button, and in final CTA. All three open `https://calendly.com/blueprintit/15-ai-shop-os-discovery` in a new tab.
5. Click "↓ See what gets installed" in hero. Scrolls to §02.
6. Click "Services" in nav from Shop OS. Routes to `/#services` and scrolls to home services section.
7. Click "Contact" in footer from Shop OS. Routes to `/#contact` and scrolls.
8. Hit browser back. Returns to `/shop-os` cleanly.
9. Hard-refresh on `/shop-os` in dev. Page still renders (Vite handles SPA fallback).

- [ ] **Step 3: Mobile spot-check (DevTools, < 768px width)**

1. Hero stacks vertically (spec sheet under headline).
2. Hamburger menu opens with all 5 items including Shop OS.
3. §02 orbit collapses to stacked Shop Brain plate + 2-col chip grid.
4. §03 phase cards stack vertically.
5. §04 operator cards stack vertically.
6. Canvas background is visibly subtler (opacity 0.5×).

- [ ] **Step 4: Reduced-motion spot-check**

In macOS: System Settings → Accessibility → Display → enable "Reduce motion." Refresh `/shop-os`.

Expected: canvas renders one static frame (visible grid, a few held dim lines, a partially-connected node graph) but does not animate. No console errors.

Disable "Reduce motion" again when done.

- [ ] **Step 5: Production build sanity check**

```bash
pnpm build
pnpm preview
```

Open the preview URL. Navigate to `/shop-os`. Hard-refresh — the page should still render (the `_redirects` file makes this work on the preview server).

- [ ] **Step 6: Final commit (if any cleanup needed)**

If any lint/build fixes were made during verification, commit them:

```bash
git add -A
git commit -m "Final cleanup from verification pass"
```

Otherwise skip.

---

## Done

All Shop OS work is now on `main`. Spec at [docs/superpowers/specs/2026-05-20-shop-os-page-design.md](docs/superpowers/specs/2026-05-20-shop-os-page-design.md). To deploy, push to `main` and let the host pick up the build (Netlify and Vercel configs are both committed).
