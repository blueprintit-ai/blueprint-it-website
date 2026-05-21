# Particle Brain — Undulation & Cross-Section Choreography

Bring our particle brain closer to the benaios.com reference: living per-particle motion, a real time-based assembly on load, and a single full-viewport canvas that re-assembles at the OrbitDiagram section instead of drifting there on scroll.

## Gap vs. benaios

| Aspect | Current | Target |
|---|---|---|
| Per-particle motion | Group wobble only — particles sit static at brain targets | Each particle has its own sine drift (vertex shader, `aOrder + uTime`), gated to fade in after assembly |
| Assembly | Pre-assembled on mount, no entrance | Time-based ~2.4s radial assembly from scatter, inner→outer |
| Canvas placement | Hero-bound, scroll-linked drift toward §02 | `position: fixed`, 100vw × 100vh, z-index:1; content cards lifted to z-index:2 |
| Orbit-section brain | Same canvas drifts via scroll lerp | Same canvas, re-assembled at orbit center via IntersectionObserver (smaller scale) |
| Lines | 1100 random-adjacent + 32 even-spaced gold radials | 1100 true nearest-neighbor pairs + 32 ghost threads anchored to assembled positions |
| Palette | Cyan #1c6ea4 + gold #b68a2c | Same — keep our palette, not benaios's blue/green/amber |

## Implementation order

1. **Vertex shader: per-particle drift.** Add `aOrder` attribute (already exists for staggered assembly) as phase seed. In the vertex shader, offset each particle by `sin(uTime * f + aOrder * TAU) * amp` along X/Y/Z with three different frequencies. Gate with `smoothstep(0.6, 1.0, uProgress)` so it doesn't compete with assembly motion. **This is the biggest visual gap; do it first.**
2. **Time-based radial assembly.** Replace the on-mount pre-assembled state with a 2400ms tween from scattered start positions to brain targets. Use `aOrder` to stagger inner-first.
3. **Full-viewport canvas + z-index re-layering.** Move the canvas from hero-bound to `position: fixed; inset: 0; z-index: 1`. Lift Home page content cards/sections to `z-index: 2` and ensure they have an opaque background where the brain shouldn't show through, transparent where it should.
4. **IntersectionObserver on OrbitDiagram.** When §02 enters the viewport (threshold ~0.4), trigger a fresh assembly (`uProgress` back to 0 → 1) with the target center repositioned to the orbit diagram's bounding box center and scale reduced (~0.6×). When it leaves, the hero target & scale come back.
5. **Nearest-neighbor lines.** Rebuild the 1100 line indices via true k-NN (k=2 nearest per particle, dedupe). Anchor the 32 ghost threads to assembled particle positions and radiate outward by 0.45–0.80 world units.

## Open choreography questions

These I want your call on before I touch the shader:

- **Scroll lock during assembly?** Benaios locks scroll for the ~2.8s assembly. On a marketing site that can feel intrusive. My lean: **skip the lock**, let scrolling work immediately and let the assembly play out in the background. Yes/no?
- **Drift amplitude.** Subtle (≤0.02 world units, "breathing") vs. obvious (≤0.06, "swimming"). Benaios is closer to subtle. My lean: **subtle**, with the three axis frequencies slightly detuned so it doesn't look like a single oscillation.
- **Hero → orbit transition.** When the orbit brain assembles, does the hero brain (a) fade out entirely and re-fade-in on scroll back up, or (b) cross-fade as the same canvas relocates? My lean: **(b) cross-fade / relocate** — it's literally the same canvas, repositioning feels more cohesive than fade-out/fade-in.
- **Reduced-motion users.** Current build has no `prefers-reduced-motion` handling. My lean: **gate the drift and assembly behind `prefers-reduced-motion: no-preference`**; reduced-motion users get the static assembled brain with no undulation and an instant assembly.

## Risk / rollback

- The shader change is the riskiest — getting `aOrder` wrong gives you visible banding or a frozen brain. Mitigation: keep the current shader behind a feature flag (`UNDULATE = false`) during dev so we can A/B in the same build.
- Canvas re-layering can break stacking on existing pages (ShopOS, contact form). Need to audit every page's z-index before merging.
- IntersectionObserver thresholds on mobile can fire late if the OrbitDiagram is taller than viewport. Need to test on a real iPhone, not just devtools.

## Out of scope

- New brain shapes / silhouettes (sticking with the 🧠 emoji rasterization).
- Color palette changes.
- Touching anything outside `ParticleBrainCanvas.jsx` and `pages/Home.jsx` beyond the z-index audit.
