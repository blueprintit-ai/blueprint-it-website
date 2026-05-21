# Particle Brain Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 2D `BlueprintCanvas` on `/shop-os` with a faithful benaios.com-style WebGL particle brain — ~9,000 particles assembling into a 🧠 silhouette as the user scrolls, drifting to the §02 OrbitDiagram center, fading by the final CTA. Blueprint IT palette (slate → cyan → gold → rust).

**Architecture:** New `src/components/ParticleBrainCanvas.jsx` using `three@0.161` + `ImprovedNoise`. Single full-viewport WebGL canvas at z-index 0. Scroll-driven choreography via four progress scalars (pA / pB / pC / pD) computed from `window.scrollY` against cached section bounding rects. Custom `ShaderMaterial` for per-particle color interpolation along the brand gradient.

**Tech stack:** React 18, Vite, `three@^0.161.0` (new dep), `framer-motion` (already present), existing palette CSS vars.

**Source spec:** [docs/superpowers/specs/2026-05-20-shop-os-particle-brain-design.md](docs/superpowers/specs/2026-05-20-shop-os-particle-brain-design.md). Authoritative on intent.

**No-test-infra note:** Same as the prior plan — no test runner in this project. Verification per task is `pnpm build` (must exit 0) plus a check that the page still renders.

**Pre-flight:** Confirm `feature/particle-brain` branch is checked out. Confirm `corepack pnpm build` passes from a clean working tree before starting Task 1.

**Deliberate spec omissions** (call out so they're not perceived as gaps during review):
- The spec mentions `ImprovedNoise` for "subtle organic motion of the scatter cloud and ghost threads." This plan does NOT use it — the scatter cloud is static (visible only briefly before migration begins) and ghost threads are static radial lines. Adding noise is a follow-up if the scatter looks lifeless.
- The spec mentions "radial inner-first migration" (particles closer to brain center reach targets earlier). This plan does uniform lerp — all particles migrate together. Adding per-particle migration offset is a follow-up if the assembly looks too synchronized vs. benaios.

---

## Task 1: Install three.js, delete BlueprintCanvas, scaffold ParticleBrainCanvas

**Why:** Get the dependency installed and the component swap done as a single self-contained commit. The scaffold renders an empty WebGL canvas so we can verify the swap works before adding behavior.

**Files:**
- Modify: `package.json` (add `three` dep)
- Delete: `src/components/BlueprintCanvas.jsx`
- Create: `src/components/ParticleBrainCanvas.jsx`
- Modify: `src/pages/ShopOS.jsx`

- [ ] **Step 1: Install three.js**

```bash
corepack pnpm add three@^0.161.0
```

Verify `package.json` now has `"three": "^0.161.0"` in `dependencies`. Verify a `pnpm-lock.yaml` update committed alongside.

- [ ] **Step 2: Delete BlueprintCanvas**

```bash
git rm src/components/BlueprintCanvas.jsx
```

- [ ] **Step 3: Create the scaffold `src/components/ParticleBrainCanvas.jsx`**

```jsx
import { useEffect, useRef } from 'react'

// Faithful benaios.com-style particle brain background.
// Implemented progressively across the plan tasks. This scaffold mounts a
// transparent WebGL canvas at z-index 0 so we can verify the swap before
// adding behavior.

export default function ParticleBrainCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Subsequent tasks add: scene setup, particle scatter, brain assembly,
    // scroll choreography, migration lines, ghost threads, fades, fallbacks.
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="bp-canvas" />
}
```

- [ ] **Step 4: Swap the import in `src/pages/ShopOS.jsx`**

Find the existing import (near the top):

```jsx
import BlueprintCanvas from '@/components/BlueprintCanvas.jsx'
```

Replace with:

```jsx
import ParticleBrainCanvas from '@/components/ParticleBrainCanvas.jsx'
```

Find the JSX usage (inside the MotionConfig wrapper):

```jsx
<BlueprintCanvas />
```

Replace with:

```jsx
<ParticleBrainCanvas />
```

- [ ] **Step 5: Verify**

```bash
corepack pnpm build
```

Expected: exit 0. Bundle should be visibly larger (the three.js dep is included even though we don't reference it yet via tree-shaking — well, actually it IS tree-shaken until we import it. We won't see the bundle jump until Task 2 imports `three`).

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/BlueprintCanvas.jsx src/components/ParticleBrainCanvas.jsx src/pages/ShopOS.jsx
git commit -m "Add three.js, delete BlueprintCanvas, scaffold ParticleBrainCanvas"
```

(The `BlueprintCanvas.jsx` deletion is staged automatically via `git rm` in Step 2; if you skipped that and just deleted the file, run `git add -A src/components/`.)

---

## Task 2: Scene setup + particle scatter (Phase A only)

**Why:** Stand up the Three.js scene, camera, renderer, and a `Points` mesh with ~9,000 particles scattered in the right-half of the viewport. Tinted slate. No assembly, no scroll yet. Verifies WebGL renders.

**Files:**
- Modify: `src/components/ParticleBrainCanvas.jsx`

- [ ] **Step 1: Replace the scaffold with a working scatter renderer**

Full file contents for `src/components/ParticleBrainCanvas.jsx`:

```jsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Faithful benaios.com-style particle brain background.
// Phase A (this task): scatter cloud only. Future tasks add brain assembly,
// scroll choreography, migration lines, ghost threads, fades.

const TOTAL_PARTICLES = 9000
const MOBILE_PARTICLES = 4000

// Brand stops (sRGB normalized 0..1).
const C_SLATE = [0x6a / 255, 0x77 / 255, 0x88 / 255]

export default function ParticleBrainCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isMobile = window.innerWidth < 768
    const count = isMobile ? MOBILE_PARTICLES : TOTAL_PARTICLES

    // --- Scene + camera + renderer ---------------------------------------
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      38,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 6.4)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight, false)
    renderer.setClearColor(0x000000, 0)

    // --- Scatter positions: right-half of viewport in world space --------
    // Camera fov=38 at z=6.4 → visible vertical extent at z=0 is ~4.4 world units.
    // Aspect varies; build a horizontal extent matching screen aspect.
    const vFov = (camera.fov * Math.PI) / 180
    const visibleH = 2 * Math.tan(vFov / 2) * camera.position.z
    const visibleW = visibleH * camera.aspect

    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Right half: x in [0.05 * visibleW, 0.45 * visibleW]
      const x = visibleW * (0.05 + Math.random() * 0.4)
      const y = visibleH * (Math.random() - 0.5) * 0.9
      const z = (Math.random() - 0.5) * 0.4
      positions[i * 3 + 0] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(C_SLATE[0], C_SLATE[1], C_SLATE[2]),
      size: 0.018,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // --- Render loop -----------------------------------------------------
    let rafId = 0
    function loop() {
      if (!document.hidden) {
        renderer.render(scene, camera)
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    // --- Resize handling (debounced) -------------------------------------
    let resizeTimer = 0
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight, false)
    }
    function debouncedResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(onResize, 150)
    }
    window.addEventListener('resize', debouncedResize)

    // --- Cleanup ---------------------------------------------------------
    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', debouncedResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="bp-canvas" />
}
```

- [ ] **Step 2: Verify**

```bash
corepack pnpm build
```

Expected:
- exit 0.
- Bundle size jumps significantly: previous JS bundle was ~480KB raw; now expect ~1,050KB raw / ~320KB gzipped due to three.js inclusion.
- (Visual, if browser available) `/shop-os` shows a soft slate dot cloud on the right side of the hero, no animation. Page text is still readable on top.

- [ ] **Step 3: Commit**

```bash
git add src/components/ParticleBrainCanvas.jsx
git commit -m "ParticleBrainCanvas: scatter cloud (Phase A)"
```

---

## Task 3: Brain emoji rasterization + assembled state

**Why:** Implement the offscreen brain rasterization to generate ~9k target positions. For this task, snap particles immediately to those targets (no animation yet) so we can verify the brain silhouette renders correctly at the expected position, size, and color tint.

**Files:**
- Modify: `src/components/ParticleBrainCanvas.jsx`

- [ ] **Step 1: Add the brain builder helper and switch initial particle positions to brain targets**

Modify `src/components/ParticleBrainCanvas.jsx`. Add this helper function above the `export default function ParticleBrainCanvas()`:

```jsx
// Rasterize 🧠 emoji to an offscreen canvas, sample non-background pixels,
// return their world-space positions. Particles will use these as targets.
// Returns { positions: Float32Array, layers: Float32Array (1=silhouette, 0=interior), count }.
function buildPointillistBrain(maxTargets, worldScale = 1.55) {
  const SIZE = 1024
  const canvas2d = document.createElement('canvas')
  canvas2d.width = SIZE
  canvas2d.height = SIZE
  const ctx2d = canvas2d.getContext('2d')
  ctx2d.fillStyle = '#ffffff'
  ctx2d.fillRect(0, 0, SIZE, SIZE)
  ctx2d.font =
    '820px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
  ctx2d.textAlign = 'center'
  ctx2d.textBaseline = 'middle'
  ctx2d.fillText('\u{1F9E0}', SIZE / 2, SIZE / 2 + 32)

  const img = ctx2d.getImageData(0, 0, SIZE, SIZE)
  const data = img.data
  function pxSum(x, y) {
    if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return 765
    const i = (y * SIZE + x) * 4
    return data[i] + data[i + 1] + data[i + 2]
  }
  function isBackground(x, y) {
    return pxSum(x, y) > 690
  }

  const STRIDE = 2
  const worldRadiusPx = SIZE * 0.42
  const positions = []
  const layers = []

  for (let py = 0; py < SIZE; py += STRIDE) {
    for (let px = 0; px < SIZE; px += STRIDE) {
      if (isBackground(px, py)) continue
      const onSilhouette =
        isBackground(px - STRIDE, py) ||
        isBackground(px + STRIDE, py) ||
        isBackground(px, py - STRIDE) ||
        isBackground(px, py + STRIDE)
      const wx = ((px - SIZE / 2) / worldRadiusPx) * worldScale
      const wy = -((py - SIZE / 2) / worldRadiusPx) * worldScale
      const wz = (Math.random() - 0.5) * 0.08 * worldScale
      positions.push(wx, wy, wz)
      layers.push(onSilhouette ? 1 : 0)
    }
  }

  // Fallback if emoji didn't render (no color emoji font available).
  // Draw a simple brain-shaped ellipse + stem curve.
  if (positions.length / 3 < 500) {
    positions.length = 0
    layers.length = 0
    ctx2d.fillStyle = '#ffffff'
    ctx2d.fillRect(0, 0, SIZE, SIZE)
    ctx2d.strokeStyle = '#000'
    ctx2d.lineWidth = 3
    ctx2d.beginPath()
    ctx2d.ellipse(SIZE / 2, SIZE / 2, 220, 170, 0, 0, Math.PI * 2)
    ctx2d.stroke()
    ctx2d.beginPath()
    ctx2d.moveTo(SIZE / 2 - 200, SIZE / 2 + 20)
    ctx2d.quadraticCurveTo(SIZE / 2, SIZE / 2 + 40, SIZE / 2 + 200, SIZE / 2 + 20)
    ctx2d.stroke()
    const img2 = ctx2d.getImageData(0, 0, SIZE, SIZE).data
    for (let py = 0; py < SIZE; py += STRIDE) {
      for (let px = 0; px < SIZE; px += STRIDE) {
        const i = (py * SIZE + px) * 4
        if (img2[i] < 100) {
          positions.push(
            ((px - SIZE / 2) / worldRadiusPx) * worldScale,
            -((py - SIZE / 2) / worldRadiusPx) * worldScale,
            (Math.random() - 0.5) * 0.08 * worldScale
          )
          layers.push(1)
        }
      }
    }
  }

  // Uniformly subsample down to maxTargets.
  const totalCandidates = positions.length / 3
  let finalPositions = positions
  let finalLayers = layers
  if (totalCandidates > maxTargets) {
    finalPositions = []
    finalLayers = []
    const step = totalCandidates / maxTargets
    for (let idx = 0; idx < totalCandidates; idx++) {
      if (Math.floor(idx / step) !== Math.floor((idx - 1) / step)) {
        finalPositions.push(
          positions[idx * 3 + 0],
          positions[idx * 3 + 1],
          positions[idx * 3 + 2]
        )
        finalLayers.push(layers[idx])
      }
    }
  }

  return {
    positions: new Float32Array(finalPositions),
    layers: new Float32Array(finalLayers),
    count: finalPositions.length / 3,
  }
}
```

Also add a second color stop for the assembled state:

```jsx
const C_RUST = [0xc2 / 255, 0x46 / 255, 0x1f / 255]
```

Now modify the scatter-positions loop to instead use brain targets as the initial positions. Replace the existing "Scatter positions" block (the `const vFov = ...` through the end of the positions loop) with:

```jsx
    // --- Brain targets (this task: snap particles directly to brain) -----
    const brain = buildPointillistBrain(count)
    const positions = brain.positions
    const actualCount = brain.count
    // (actualCount may be slightly less than `count` due to emoji edge density.
    //  Use actualCount when sizing buffers below.)
```

Update the `BufferGeometry` setAttribute call:

```jsx
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
```

(No change needed; `positions` is just sourced differently now.)

Update the `PointsMaterial` color to use rust for the assembled state:

```jsx
const material = new THREE.PointsMaterial({
  color: new THREE.Color(C_RUST[0], C_RUST[1], C_RUST[2]),
  size: 0.018,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.85,
  depthWrite: false,
})
```

- [ ] **Step 2: Verify**

```bash
corepack pnpm build
```

Expected: exit 0. (Visual, if browser available) `/shop-os` shows a clear rust-tinted brain silhouette centered on screen, no animation. The shape should be unmistakably a 🧠.

- [ ] **Step 3: Commit**

```bash
git add src/components/ParticleBrainCanvas.jsx
git commit -m "ParticleBrainCanvas: rasterize 🧠 emoji, snap particles to targets"
```

---

## Task 4: Scroll progress + Phase B migration

**Why:** Wire up the scroll listener, compute the four progress scalars (`pA`, `pB`, `pC`, `pD`) from `window.scrollY` and cached section offsets, and implement Phase B: particles interpolate from a scatter cloud to brain targets as `pB` ramps 0→1.

**Files:**
- Modify: `src/components/ParticleBrainCanvas.jsx`

- [ ] **Step 1: Add scatter source positions (stored separately from targets)**

Modify `src/components/ParticleBrainCanvas.jsx`. Inside the `useEffect`, after computing `brain` and before the BufferGeometry, add:

```jsx
    // --- Scatter source positions (Phase A — right-half cloud) -----------
    const vFov = (camera.fov * Math.PI) / 180
    const visibleH = 2 * Math.tan(vFov / 2) * camera.position.z
    const visibleW = visibleH * camera.aspect

    const scatterPositions = new Float32Array(actualCount * 3)
    for (let i = 0; i < actualCount; i++) {
      const x = visibleW * (0.05 + Math.random() * 0.4)
      const y = visibleH * (Math.random() - 0.5) * 0.9
      const z = (Math.random() - 0.5) * 0.4
      scatterPositions[i * 3 + 0] = x
      scatterPositions[i * 3 + 1] = y
      scatterPositions[i * 3 + 2] = z
    }
    const targetPositions = positions // alias for clarity
    // Working buffer that gets interpolated each frame.
    const livePositions = new Float32Array(actualCount * 3)
    livePositions.set(scatterPositions)
```

Update the geometry to use `livePositions`:

```jsx
geometry.setAttribute('position', new THREE.BufferAttribute(livePositions, 3))
```

- [ ] **Step 2: Add scroll-progress computation**

After the geometry/material setup and before the render loop, add:

```jsx
    // --- Scroll progress scalars -----------------------------------------
    // pA: scatter intensity     — 1 at top, 0 once hero exits
    // pB: migration progress    — 0 before hero exits, 1 at §02 top
    // pC: drift toward §02      — 0 at §02 top, 1 at §03 top
    // pD: collapse + fade       — 0 at §03 top, 1 at §05 top
    const sectionIds = [
      'shop-os-top',
      'shop-gap',
      'shop-anatomy',
      'shop-14-days',
      'shop-operator',
      'shop-ready',
    ]
    const sectionTops = {} // recomputed on resize

    function cacheSectionOffsets() {
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        sectionTops[id] = el
          ? el.getBoundingClientRect().top + window.scrollY
          : 0
      }
    }
    cacheSectionOffsets()

    function lerpProgress(y, start, end) {
      if (end <= start) return y >= start ? 1 : 0
      return Math.max(0, Math.min(1, (y - start) / (end - start)))
    }

    let pA = 1, pB = 0, pC = 0, pD = 0
    function recomputeProgress() {
      const y = window.scrollY
      pB = lerpProgress(y, sectionTops['shop-os-top'] || 0, sectionTops['shop-anatomy'] || 1)
      pA = 1 - pB
      pC = lerpProgress(y, sectionTops['shop-anatomy'] || 0, sectionTops['shop-14-days'] || 1)
      pD = lerpProgress(y, sectionTops['shop-14-days'] || 0, sectionTops['shop-ready'] || 1)
    }

    window.addEventListener('scroll', recomputeProgress, { passive: true })
    recomputeProgress()
```

- [ ] **Step 3: Update resize handler to re-cache section offsets**

Inside `onResize`, append after the renderer.setSize call:

```jsx
      cacheSectionOffsets()
      recomputeProgress()
```

- [ ] **Step 4: Update render loop to interpolate positions per frame**

Replace the existing render loop with:

```jsx
    // --- Render loop -----------------------------------------------------
    const positionAttr = geometry.getAttribute('position')

    let rafId = 0
    function loop() {
      if (!document.hidden) {
        // Smoothstep pB for nicer easing
        const t = pB * pB * (3 - 2 * pB)
        for (let i = 0; i < actualCount; i++) {
          const i3 = i * 3
          livePositions[i3 + 0] =
            scatterPositions[i3 + 0] +
            (targetPositions[i3 + 0] - scatterPositions[i3 + 0]) * t
          livePositions[i3 + 1] =
            scatterPositions[i3 + 1] +
            (targetPositions[i3 + 1] - scatterPositions[i3 + 1]) * t
          livePositions[i3 + 2] =
            scatterPositions[i3 + 2] +
            (targetPositions[i3 + 2] - scatterPositions[i3 + 2]) * t
        }
        positionAttr.needsUpdate = true
        renderer.render(scene, camera)
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
```

- [ ] **Step 5: Update cleanup to remove the scroll listener**

In the cleanup function, add:

```jsx
      window.removeEventListener('scroll', recomputeProgress)
```

- [ ] **Step 6: Verify**

```bash
corepack pnpm build
```

Expected: exit 0. (Visual, if browser available) `/shop-os` at top of page shows the scatter cloud on the right. As you scroll down past the hero, particles migrate toward the brain silhouette in the center, fully assembled by §02.

- [ ] **Step 7: Commit**

```bash
git add src/components/ParticleBrainCanvas.jsx
git commit -m "ParticleBrainCanvas: scroll-driven Phase B migration"
```

---

## Task 5: ShaderMaterial with per-particle color gradient

**Why:** Replace the flat `PointsMaterial` with a thin custom `ShaderMaterial` that interpolates each particle's color along the slate → cyan → gold → rust gradient based on migration progress. This is the "tinting sweep" benaios uses.

**Files:**
- Modify: `src/components/ParticleBrainCanvas.jsx`

- [ ] **Step 1: Add the cyan and gold color constants**

Near the top of the file (with `C_SLATE` and `C_RUST`):

```jsx
const C_CYAN = [0x1c / 255, 0x6e / 255, 0xa4 / 255]
const C_GOLD = [0xb6 / 255, 0x8a / 255, 0x2c / 255]
```

- [ ] **Step 2: Replace `PointsMaterial` with a `ShaderMaterial`**

Remove the existing `material = new THREE.PointsMaterial({...})` block. Add this in its place:

```jsx
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0 },
        uAlpha: { value: 1 },
        uSize: { value: 0.018 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColorSlate: { value: new THREE.Color(C_SLATE[0], C_SLATE[1], C_SLATE[2]) },
        uColorCyan: { value: new THREE.Color(C_CYAN[0], C_CYAN[1], C_CYAN[2]) },
        uColorGold: { value: new THREE.Color(C_GOLD[0], C_GOLD[1], C_GOLD[2]) },
        uColorRust: { value: new THREE.Color(C_RUST[0], C_RUST[1], C_RUST[2]) },
      },
      vertexShader: `
        uniform float uProgress;
        uniform float uSize;
        uniform float uPixelRatio;
        attribute float aLayer;
        varying float vProgress;
        varying float vLayer;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = uSize * (300.0 / -mvPosition.z) * uPixelRatio;
          vProgress = uProgress;
          vLayer = aLayer;
        }
      `,
      fragmentShader: `
        uniform float uAlpha;
        uniform vec3 uColorSlate;
        uniform vec3 uColorCyan;
        uniform vec3 uColorGold;
        uniform vec3 uColorRust;
        varying float vProgress;
        varying float vLayer;

        vec3 brandGradient(float t) {
          // 4-stop: slate (0) → cyan (0.33) → gold (0.66) → rust (1)
          t = clamp(t, 0.0, 1.0);
          if (t < 0.333) {
            float s = t / 0.333;
            s = s * s * (3.0 - 2.0 * s);
            return mix(uColorSlate, uColorCyan, s);
          } else if (t < 0.666) {
            float s = (t - 0.333) / 0.333;
            s = s * s * (3.0 - 2.0 * s);
            return mix(uColorCyan, uColorGold, s);
          } else {
            float s = (t - 0.666) / 0.334;
            s = s * s * (3.0 - 2.0 * s);
            return mix(uColorGold, uColorRust, s);
          }
        }

        void main() {
          // Circular sprite shape with soft edge
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float edge = smoothstep(0.5, 0.35, d);

          // Silhouette particles bias warmer; interior particles bias cooler.
          float tint = vProgress * (vLayer > 0.5 ? 1.0 : 0.85);

          vec3 col = brandGradient(tint);
          float alpha = edge * uAlpha * (vProgress * 0.7 + 0.3);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    })
```

- [ ] **Step 3: Add the `aLayer` attribute to the geometry**

After `geometry.setAttribute('position', ...)`, add:

```jsx
geometry.setAttribute('aLayer', new THREE.BufferAttribute(brain.layers, 1))
```

- [ ] **Step 4: Drive `uProgress` from `pB` in the render loop**

In the render loop (where you currently smoothstep `pB`), update the uniform:

```jsx
      if (!document.hidden) {
        const t = pB * pB * (3 - 2 * pB)
        material.uniforms.uProgress.value = t

        for (let i = 0; i < actualCount; i++) {
          // ... existing position interpolation ...
        }
        positionAttr.needsUpdate = true
        renderer.render(scene, camera)
      }
```

- [ ] **Step 5: Update the resize handler to update uniform `uPixelRatio`**

In `onResize`:

```jsx
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
```

- [ ] **Step 6: Verify**

```bash
corepack pnpm build
```

Expected: exit 0. (Visual) `/shop-os` at top: slate scatter cloud. Scroll progressively: tint sweeps slate → cyan → gold → rust as the brain assembles. By §02, the brain is fully rust-tinted with cyan/gold interior particles.

- [ ] **Step 7: Commit**

```bash
git add src/components/ParticleBrainCanvas.jsx
git commit -m "ParticleBrainCanvas: ShaderMaterial with brand-gradient tinting"
```

---

## Task 6: Phase C drift toward §02 OrbitDiagram center + Phase D collapse/fade

**Why:** After the brain assembles, it should drift toward the §02 OrbitDiagram center (replacing/overlaying the "Shop Brain" card). Then through §03 and beyond it shrinks and fades. Both phases driven by `pC` and `pD`.

**Files:**
- Modify: `src/components/ParticleBrainCanvas.jsx`

- [ ] **Step 1: Wrap `points` in a `Group` so we can drift/scale/rotate the whole brain**

Modify `src/components/ParticleBrainCanvas.jsx`. Replace `scene.add(points)` with:

```jsx
    const brainGroup = new THREE.Group()
    brainGroup.add(points)
    scene.add(brainGroup)
```

- [ ] **Step 2: Add helper to map a DOM element's center to world-space coords**

Add this helper inside the `useEffect`, near `cacheSectionOffsets`:

```jsx
    // Map a DOM bounding rect center to world coords at z=0.
    // The §02 OrbitDiagram center is the natural "land here" target.
    function domCenterToWorld(elementId) {
      const el = document.getElementById(elementId)
      if (!el) return new THREE.Vector3(0, 0, 0)
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // NDC: -1..1 with y flipped
      const ndcX = (cx / window.innerWidth) * 2 - 1
      const ndcY = -((cy / window.innerHeight) * 2 - 1)
      // Unproject at depth z=0 (camera at z=6.4 looking -z; intersect plane z=0)
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5)
      vec.unproject(camera)
      const dir = vec.sub(camera.position).normalize()
      const distance = -camera.position.z / dir.z
      return camera.position.clone().add(dir.multiplyScalar(distance))
    }
```

- [ ] **Step 3: Cache the drift target on resize and on first frame**

After `cacheSectionOffsets()`, add:

```jsx
    let driftTarget = new THREE.Vector3(0, 0, 0)
    function cacheDriftTarget() {
      driftTarget = domCenterToWorld('shop-anatomy')
    }
    cacheDriftTarget()
```

In `onResize`, append:

```jsx
      cacheDriftTarget()
```

- [ ] **Step 4: Apply pC drift and pD scale/fade in the render loop**

In the render loop, after the position interpolation but before `renderer.render(...)`, add:

```jsx
        // Phase C: drift brainGroup toward §02 anatomy center
        const driftT = pC * pC * (3 - 2 * pC)
        brainGroup.position.x = driftTarget.x * driftT
        brainGroup.position.y = driftTarget.y * driftT
        // Slight rotation for life
        brainGroup.rotation.z = (driftT - 0.5) * 0.18

        // Phase D: collapse + fade
        const scale = 1.0 - 0.7 * (pD * pD * (3 - 2 * pD))
        brainGroup.scale.set(scale, scale, scale)
        material.uniforms.uAlpha.value = Math.max(0, 1 - pD)
```

- [ ] **Step 5: Verify**

```bash
corepack pnpm build
```

Expected: exit 0. (Visual) `/shop-os`: brain assembles in hero region, drifts to §02 OrbitDiagram center as you scroll through §02, then shrinks and fades to nothing by the final CTA.

- [ ] **Step 6: Commit**

```bash
git add src/components/ParticleBrainCanvas.jsx
git commit -m "ParticleBrainCanvas: Phase C drift + Phase D collapse/fade"
```

---

## Task 7: Migration lines (Phase B) + ghost threads (Phase C)

**Why:** Two visual flourishes from the benaios spec: ~1,100 nearest-neighbor "migration lines" rendered as `LineSegments` during particle migration (fade out as particles arrive), and 32 persistent "ghost threads" radiating outward from the assembled brain. Both add a sense of network connectivity.

**Files:**
- Modify: `src/components/ParticleBrainCanvas.jsx`

- [ ] **Step 1: Add migration-line state and helper**

Modify `src/components/ParticleBrainCanvas.jsx`. Near `TOTAL_PARTICLES`:

```jsx
const MIGRATION_LINES = 1100
const MOBILE_MIGRATION_LINES = 400
const GHOST_THREADS = 32
const MOBILE_GHOST_THREADS = 12
```

Inside the `useEffect`, after `actualCount` is known:

```jsx
    const lineCount = isMobile ? MOBILE_MIGRATION_LINES : MIGRATION_LINES
    const threadCount = isMobile ? MOBILE_GHOST_THREADS : GHOST_THREADS

    // --- Migration lines: pick nearest-neighbor pairs --------------------
    // Each line is 2 vertices; lineCount lines = lineCount*2 vertices.
    const linePositions = new Float32Array(lineCount * 2 * 3)
    const linePairs = new Array(lineCount) // [aIndex, bIndex]
    for (let l = 0; l < lineCount; l++) {
      const a = Math.floor(Math.random() * actualCount)
      // Pick a random other particle within a moderate index range as a stand-in for "near"
      // (true nearest-neighbor would be O(n²); random nearby index is good enough for visual).
      let b = a + Math.floor((Math.random() - 0.5) * 200)
      b = Math.max(0, Math.min(actualCount - 1, b))
      if (b === a) b = (a + 1) % actualCount
      linePairs[l] = [a, b]
    }

    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3)
    )
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(C_CYAN[0], C_CYAN[1], C_CYAN[2]),
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
    })
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial)
    brainGroup.add(lineSegments)
```

- [ ] **Step 2: Add ghost threads (radial lines from brain edge outward)**

After the migration-lines setup:

```jsx
    // --- Ghost threads: persistent radial lines from brain edge outward ---
    const threadPositions = new Float32Array(threadCount * 2 * 3)
    for (let t = 0; t < threadCount; t++) {
      const angle = (t / threadCount) * Math.PI * 2
      const innerR = 1.4
      const outerR = 3.2 + Math.random() * 1.0
      const i6 = t * 6
      threadPositions[i6 + 0] = Math.cos(angle) * innerR
      threadPositions[i6 + 1] = Math.sin(angle) * innerR
      threadPositions[i6 + 2] = 0
      threadPositions[i6 + 3] = Math.cos(angle) * outerR
      threadPositions[i6 + 4] = Math.sin(angle) * outerR
      threadPositions[i6 + 5] = 0
    }
    const threadGeometry = new THREE.BufferGeometry()
    threadGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(threadPositions, 3)
    )
    const threadMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(C_GOLD[0], C_GOLD[1], C_GOLD[2]),
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
    })
    const ghostThreads = new THREE.LineSegments(threadGeometry, threadMaterial)
    brainGroup.add(ghostThreads)
```

- [ ] **Step 3: Update render loop to animate line positions + opacities**

Inside the render loop, after the particle position interpolation, before `renderer.render(...)`, add:

```jsx
        // Migration lines: positions follow the two endpoint particles each frame
        const lineAttr = lineGeometry.getAttribute('position')
        for (let l = 0; l < lineCount; l++) {
          const [a, b] = linePairs[l]
          const i6 = l * 6
          lineAttr.array[i6 + 0] = livePositions[a * 3 + 0]
          lineAttr.array[i6 + 1] = livePositions[a * 3 + 1]
          lineAttr.array[i6 + 2] = livePositions[a * 3 + 2]
          lineAttr.array[i6 + 3] = livePositions[b * 3 + 0]
          lineAttr.array[i6 + 4] = livePositions[b * 3 + 1]
          lineAttr.array[i6 + 5] = livePositions[b * 3 + 2]
        }
        lineAttr.needsUpdate = true
        // Lines fade in during early migration, fade out as it completes.
        // Peak around pB=0.5.
        const lineFade = Math.sin(Math.min(1, pB) * Math.PI) * 0.35
        lineMaterial.opacity = lineFade * material.uniforms.uAlpha.value

        // Ghost threads fade in once the brain is assembled (pB > 0.7)
        // and fade out as the brain fades (pD).
        const threadFade =
          Math.max(0, Math.min(1, (pB - 0.7) / 0.3)) *
          material.uniforms.uAlpha.value *
          0.4
        threadMaterial.opacity = threadFade
```

- [ ] **Step 4: Add line + thread disposal to cleanup**

In the cleanup function:

```jsx
      lineGeometry.dispose()
      lineMaterial.dispose()
      threadGeometry.dispose()
      threadMaterial.dispose()
```

- [ ] **Step 5: Verify**

```bash
corepack pnpm build
```

Expected: exit 0. (Visual) During scroll through hero → §02: faint cyan lines flicker between migrating particles, fading out as the brain settles. Once assembled, 12-32 gold "ghost thread" lines radiate outward from the brain. Both fade out by the final CTA.

- [ ] **Step 6: Commit**

```bash
git add src/components/ParticleBrainCanvas.jsx
git commit -m "ParticleBrainCanvas: migration lines + ghost threads"
```

---

## Task 8: Reduced-motion fallback + WebGL detection

**Why:** Honor `prefers-reduced-motion: reduce` by rendering one static assembled brain frame, no animation. Detect missing WebGL support and fall back to a static 2D `<canvas>` brain silhouette.

**Files:**
- Modify: `src/components/ParticleBrainCanvas.jsx`

- [ ] **Step 1: Add reduced-motion + WebGL detection at the top of `useEffect`**

Modify `src/components/ParticleBrainCanvas.jsx`. Near the top of the `useEffect` body (right after `if (!canvas) return`):

```jsx
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // WebGL detection: try to create a context. If it fails, fall back to 2D.
    const testGl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!testGl) {
      // Lose the WebGL context cleanly so we can re-acquire as 2D
      const lose = testGl?.getExtension?.('WEBGL_lose_context')
      lose?.loseContext?.()
      // Render a static 2D brain silhouette
      const ctx2d = canvas.getContext('2d')
      if (ctx2d) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx2d.globalAlpha = 0.3
        ctx2d.font =
          '320px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
        ctx2d.textAlign = 'center'
        ctx2d.textBaseline = 'middle'
        ctx2d.fillText('\u{1F9E0}', canvas.width / 2, canvas.height / 2)
      }
      return () => {}
    }
```

Wait — the WebGL detection above will pollute the canvas context. Better approach: probe with a throwaway canvas. Replace the WebGL detection block with:

```jsx
    // WebGL detection via throwaway canvas (real one stays untouched).
    const probe = document.createElement('canvas')
    const hasWebgl = !!(
      probe.getContext('webgl2') || probe.getContext('webgl')
    )

    if (!hasWebgl) {
      // Render a static 2D brain silhouette to the real canvas
      const ctx2d = canvas.getContext('2d')
      if (ctx2d) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx2d.globalAlpha = 0.3
        ctx2d.font =
          '320px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
        ctx2d.textAlign = 'center'
        ctx2d.textBaseline = 'middle'
        ctx2d.fillText('\u{1F9E0}', canvas.width / 2, canvas.height / 2)
      }
      return () => {}
    }
```

- [ ] **Step 2: Handle reduced-motion by drawing one static frame and skipping the loop**

At the bottom of `useEffect`, where the `requestAnimationFrame(loop)` call is, change:

```jsx
    rafId = requestAnimationFrame(loop)
```

to:

```jsx
    if (reducedMotion) {
      // Render one static frame at the assembled brain state.
      pB = 1; pA = 0; pC = 0; pD = 0
      material.uniforms.uProgress.value = 1
      material.uniforms.uAlpha.value = 0.7
      lineMaterial.opacity = 0
      threadMaterial.opacity = 0
      livePositions.set(targetPositions)
      const positionAttr = geometry.getAttribute('position')
      positionAttr.needsUpdate = true
      renderer.render(scene, camera)
      // Don't start the rAF loop.
    } else {
      rafId = requestAnimationFrame(loop)
    }
```

(Note: `pA`, `pB`, etc., are reassigned here — they're `let` bindings already, so this works.)

- [ ] **Step 3: Verify**

```bash
corepack pnpm build
```

Expected: exit 0. With reduced-motion enabled in OS settings, `/shop-os` shows a static assembled brain without animation. On a browser with WebGL disabled, you'd see a static 🧠 emoji rendered at low opacity.

- [ ] **Step 4: Commit**

```bash
git add src/components/ParticleBrainCanvas.jsx
git commit -m "ParticleBrainCanvas: reduced-motion + WebGL fallback"
```

---

## Task 9: Final verification + lint baseline check

**Why:** End-to-end correctness check before declaring done.

- [ ] **Step 1: Lint + build clean**

```bash
corepack pnpm lint
corepack pnpm build
```

Expected:
- `pnpm build` exit 0.
- `pnpm lint` flags only pre-existing issues. Compare to the previous baseline (18 errors + 6 warnings). Confirm `src/components/ParticleBrainCanvas.jsx` and `src/pages/ShopOS.jsx` add zero new lint errors.

- [ ] **Step 2: Confirm the file inventory matches the plan**

```bash
ls -la src/components/ParticleBrainCanvas.jsx
ls -la src/components/BlueprintCanvas.jsx 2>&1 | head -1
```

Expected:
- `ParticleBrainCanvas.jsx` exists.
- `BlueprintCanvas.jsx` does NOT exist (`ls` returns "No such file or directory" — that's correct).

```bash
grep -c "BlueprintCanvas" src/pages/ShopOS.jsx
grep -c "ParticleBrainCanvas" src/pages/ShopOS.jsx
```

Expected:
- BlueprintCanvas grep: 0 hits.
- ParticleBrainCanvas grep: 2 hits (import + JSX usage).

- [ ] **Step 3: Confirm three.js dep landed**

```bash
grep '"three"' package.json
```

Expected: a line like `"three": "^0.161.0",`.

- [ ] **Step 4: Confirm bundle size jump matches expectations**

After `pnpm build`, note the JS bundle size from the build output. Expected: ~1,000–1,100KB raw / ~310–340KB gzipped (was 480KB raw / 153KB gzipped before this branch).

- [ ] **Step 5: Confirm git log**

```bash
git log feature/particle-brain --not main --oneline
```

Expected: ~9 commits with clear task-related messages.

- [ ] **Step 6: Commit cleanup if anything fixed**

If you found any NEW lint errors that should be addressed, fix them and commit with message `Cleanup from final verification pass`. Otherwise, skip — no commit needed.

---

## Done

All particle-brain work is now on `feature/particle-brain`. Spec at [docs/superpowers/specs/2026-05-20-shop-os-particle-brain-design.md](docs/superpowers/specs/2026-05-20-shop-os-particle-brain-design.md). Branch is ready for cross-cutting review and PR.
