# Shop OS Particle Brain Background — Design

**Date:** 2026-05-20
**Author:** Blueprint IT (drafted with Claude)
**Status:** Draft, awaiting user review
**Supersedes:** Task 5 (BlueprintCanvas) of [2026-05-20-shop-os-page-design.md](2026-05-20-shop-os-page-design.md)

## Goal

Replace the existing low-opacity 2D "blueprint linework" canvas background on `/shop-os` with a faithful clone of [benaios.com](https://benaios.com/)'s particle-brain effect, retuned to Blueprint IT's palette. ~9,000 WebGL particles start as a scattered slate cloud in the hero area, assemble radially into the silhouette of a 🧠 emoji as the user scrolls past the hero, drift into the center of the §02 OrbitDiagram, then fade out before the final CTA.

## Non-goals

- No custom shader research beyond what benaios's reference implementation uses (vanilla three.js with `PointsMaterial` or a thin `ShaderMaterial` if needed for per-particle color).
- No multi-shape morphing (just one target silhouette: 🧠).
- No interactive particle behavior (no mouse drag, no hover repulsion).
- No replacement of the existing `OrbitDiagram` SVG — it stays in place for layout and reduced-motion legibility. The particle brain just visually overlaps it.
- The existing 2D `BlueprintCanvas.jsx` component is removed (not kept as a parallel layer). Two backgrounds running simultaneously would be visually noisy and double the GPU/CPU cost.

## Architecture

### Files

| File | Change |
|---|---|
| [src/components/ParticleBrainCanvas.jsx](src/components/ParticleBrainCanvas.jsx) | **New** — Three.js + ImprovedNoise renderer. Default export. ~400 lines. |
| [src/components/BlueprintCanvas.jsx](src/components/BlueprintCanvas.jsx) | **Delete.** Replaced by the particle brain. |
| [src/pages/ShopOS.jsx](src/pages/ShopOS.jsx) | **Modify.** Swap `<BlueprintCanvas />` for `<ParticleBrainCanvas />`. Remove old import. |
| [src/App.css](src/App.css) | **Modify.** Existing `.bp-canvas` class is fine to keep — it's just a fixed-viewport positioning utility and `ParticleBrainCanvas` reuses it. No new CSS. |
| [package.json](package.json) | **Modify.** Add `"three": "^0.161.0"` to dependencies. (No new dev dep — three's TS types are bundled and we don't use TS anyway.) |

### Bundle impact

`three@0.161` adds ~580KB raw / ~170KB gzipped to the JS bundle. Currently the JS bundle is 480KB raw / 153KB gzipped; after this change it'll be ~1,060KB raw / ~323KB gzipped. **Disclosed and approved.**

### Tech stack

- `three@^0.161.0` — WebGL renderer, `Scene`, `PerspectiveCamera`, `BufferGeometry`, `Points`, `PointsMaterial` or `ShaderMaterial`.
- `three/addons/math/ImprovedNoise.js` — for subtle organic motion of the scatter cloud and ghost threads.
- Native browser `OffscreenCanvas` or `<canvas>` for rasterizing the 🧠 emoji to sample edge pixels (one-time at startup).

## Visual choreography

Driven by a single `scrollProgress` value computed from `window.scrollY` against the bounding rects of the page sections. The choreography breaks into four phases:

### Phase A — Scatter (hero only)

- Visible from `scrollY = 0` until the hero's bottom passes the viewport top.
- All ~9,000 particles distributed in a soft slate cloud roughly covering the right half of the viewport (where the spec-sheet `<Plate>` sits — the cloud surrounds it rather than overlapping the headline).
- Tinted slate `#6a7788` (the existing `--ink-mute`) at ~0.5 opacity.
- Subtle organic drift via `ImprovedNoise` — slow, low-amplitude.

### Phase B — Migration (hero → §02 boundary)

- `uProgress` ramps 0 → 1 across this scroll range.
- Each particle interpolates from its scatter position to a target position sampled from the edges of a rasterized 🧠 emoji silhouette.
- Migration is **radial inner-first** — particles closer to the brain's center reach their targets first; outer particles arrive last. Matches benaios's exact pattern.
- Tint sweeps along migration: slate → **cyan `#1c6ea4`** → **gold `#b68a2c`** → **rust `#c2461f`**.
- ~1,100 "migration lines" rendered as `LineSegments` between nearest-neighbor pairs, drawn while particles are in transit. They fade out once each pair reaches its targets.

### Phase C — Drift + ghost threads (§02 → §03 boundary)

- Assembled brain group's position interpolates from screen-center toward the center of the `OrbitDiagram` (the §02 "Shop Brain" card position, mapped from DOM bounding rect to scene coords).
- 32 persistent "ghost threads" — long radial lines fading from the brain's edge outward — rendered as `LineSegments` with low alpha. They give the brain a "live, broadcasting" feel.
- Brain group rotates subtly on Z-axis (±5°) tied to scroll progress for visual interest.

### Phase D — Collapse and fade (§03 → §05)

- Brain group's scale interpolates from 1.0 down to 0.3 across §03 → §04.
- Material alpha fades from 1.0 to 0 across §04 → §05.
- Past the final CTA section's top, the canvas renders nothing (pure transparency).

### Choreography control object

A single `useEffect` reads scroll position on every `requestAnimationFrame` tick and computes four progress scalars:

```js
{
  pA: 0..1,  // scatter intensity (hero presence) — 1 at top, 0 once hero exits
  pB: 0..1,  // migration progress (uProgress) — 0 before hero exits, 1 at §02 top
  pC: 0..1,  // drift toward §02 anatomy — 0 at §02 top, 1 at §03 top
  pD: 0..1,  // collapse + fade — 0 at §03 top, 1 at §05 top
}
```

These are recomputed cheaply on each frame from cached section offsets (recomputed on resize).

## Color implementation

Particle colors are stored in a `Float32Array` per-particle `color` buffer attribute on the `BufferGeometry`. Custom `ShaderMaterial` (thin — just position + color interpolation) blends along the brand gradient based on each particle's migration progress.

Brand stops (sRGB normalized for shader use):

```js
const C_SLATE = [0x6a / 255, 0x77 / 255, 0x88 / 255]  // var(--ink-mute) — start scatter
const C_CYAN  = [0x1c / 255, 0x6e / 255, 0xa4 / 255]  // var(--cyan) — migration midpoint
const C_GOLD  = [0xb6 / 255, 0x8a / 255, 0x2c / 255]  // var(--gold)
const C_RUST  = [0xc2 / 255, 0x46 / 255, 0x1f / 255]  // var(--rust) — assembly endpoint
```

Gradient interpolation: smooth-step (3t² - 2t³) blending between stops based on per-particle `uMigrationDone` value (0 at scatter, 1 when arrived at target).

## Brain silhouette rasterization

At component mount (one-time):

1. Create an offscreen 1024×1024 `<canvas>`.
2. Fill with white, draw `'\u{1F9E0}'` (🧠) centered at ~80% font size using Apple Color Emoji / Noto Color Emoji / Segoe UI Emoji fallbacks.
3. Read pixel data.
4. Sample non-white pixels with a stride of ~2px → produces ~26,000 candidate edge positions.
5. Subsample to exactly 9,000 (or `MAX_TARGETS`) by uniform stride.
6. Each candidate is classified as **silhouette** (on the brain's outline) or **interior** (inside the brain mass) based on neighbor pixel sums. Silhouette particles get tinted hotter at endpoint (warm rust) and interior particles cooler (cyan/gold). Matches benaios's "anatomy layer" treatment.
7. World-coordinate mapping: brain centered at origin with `worldScale = 1.55`, particles' z-jitter ±0.04 to give subtle depth.

**Fallback if emoji not rendered (e.g., headless browser, missing font):** fall back to drawing a generic brain-shaped ellipse + brain-stem curve as the silhouette. Identical to benaios's fallback.

## Scene setup

```js
camera: PerspectiveCamera(fov=38, aspect=window.innerWidth/window.innerHeight, near=0.1, far=100)
camera.position = (0, 0, 6.4)
renderer: WebGLRenderer({ alpha: true, antialias: true })
renderer.setClearColor(0x000000, 0)
renderer.setPixelRatio(min(window.devicePixelRatio, 2))
```

Canvas mounted at z-index 0, behind page content (z-index 2).

## Edge cases

### `prefers-reduced-motion: reduce`

- Skip the `requestAnimationFrame` loop entirely.
- Render one static frame with all particles at their final assembled positions, brain centered.
- Tinted at the final color (rust silhouette + cyan/gold interior).
- No migration lines, no ghost threads, no drift, no rotation.

### WebGL not supported

- Detect at startup via `canvas.getContext('webgl2') || canvas.getContext('webgl')`.
- If null, fall back to rendering a static brain silhouette to a 2D `<canvas>` (gray-cyan, low opacity).
- No animation in this branch.

### Mobile (width < 768px)

- Particle count reduced from 9,000 to 4,000.
- Migration lines reduced from 1,100 to 400.
- Ghost threads reduced from 32 to 12.
- Canvas alpha multiplied by 0.7× to stay subtle on small screens.

### Tab hidden

- Pause `requestAnimationFrame` loop when `document.hidden` is true. Resume on visibility change.

### Resize

- Debounce window resize at 150ms.
- On resize: update renderer size + camera aspect. Recompute section bounding rects. Particle target positions stay in world space (don't re-sample emoji).

### Cleanup on unmount

- `cancelAnimationFrame(rafId)`.
- Remove `scroll`, `resize`, `visibilitychange` listeners.
- Dispose: `geometry.dispose()`, `material.dispose()`, `renderer.dispose()`. Three.js object cleanup is mandatory to avoid GPU memory leaks.

## OrbitDiagram interaction

The §02 `<OrbitDiagram>` SVG component is unchanged structurally — its "Shop Brain" center `<rect>` + text labels stay in place for:
- Layout integrity (the orbit chips position themselves around this anchor).
- Reduced-motion fallback legibility (when no particle brain is rendered, the SVG card carries the message).
- Mobile fallback (the SVG card remains the only "brain" representation on small screens — the particle brain may be too subtle / perf-prohibitive).

The particle brain visually flies on top of this card during desktop scroll. When the brain lands at §02 center, the SVG card is still visible underneath; the particle brain has lower priority visually because its tint is subtle and its silhouette is loose. This is fine — the SVG card carries the "LIVE · CONNECTED" label, the particle brain provides the spectacle.

## Implementation reuse map

| Need | Source |
|---|---|
| `.bp-canvas` positioning class (fixed full-viewport, z-index 0, pointer-events none) | Existing [src/App.css](src/App.css), no changes. Reused by `ParticleBrainCanvas`. |
| Color tokens (`--cyan`, `--gold`, `--rust`, `--ink-mute`) | Existing tokens. Used as rgb-triplet constants in the shader code. |
| Section ids (`shop-os-top`, `shop-gap`, `shop-anatomy`, `shop-14-days`, `shop-operator`, `shop-ready`) | Already exist on the page. Used as anchor points for scroll progress computation. |

## Out of scope

- Server-side rendering of the brain (we're a Vite SPA — no SSR).
- Lazy-loading three.js. Could be worth doing later (~600KB is significant for the home page bundle since it's all on one entry chunk), but adds complexity (route-based code splitting, suspense boundary). Defer to a follow-up if bundle size becomes a problem.
- Tests. No test infrastructure in this project. Visual verification only.

## Open questions

None — all decisions confirmed in conversation:

- Shape: 🧠 emoji (option F).
- Color palette: Blueprint IT (option B) — cyan/gold/rust on slate base.
- Choreography: scroll-driven, lands at §02 OrbitDiagram center.
- Existing `BlueprintCanvas`: deleted, not kept in parallel.
- Reduced-motion: static brain silhouette.
- WebGL fallback: static 2D brain silhouette.
- Bundle impact (~+170KB gzipped): acknowledged.
