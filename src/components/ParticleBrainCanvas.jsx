import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Particle brain background — benaios.com-style WebGL effect retuned to
// Blueprint IT palette. ~14k particles render an assembled 🧠 silhouette
// in the right half of the hero from page load. On scroll, the brain
// drifts from right-half to the §02 OrbitDiagram center, then scales down
// and fades by §05. Cyan body, gold edge accents.

// Sparse nodes (500/250) connected by spatial-proximity lines replicates
// the geometric mesh look of the reference image. Ghost threads removed.
const TOTAL_PARTICLES = 900
const MOBILE_PARTICLES = 450
const STATIC_LINES = 0   // unused — lines built dynamically by proximity
const MOBILE_STATIC_LINES = 0
const GHOST_THREADS = 0
const MOBILE_GHOST_THREADS = 0

// Brand stops (sRGB normalized 0..1).
const C_CYAN = [0x1c / 255, 0x6e / 255, 0xa4 / 255]
const C_CYAN_SOFT = [0x2e / 255, 0x8f / 255, 0xc9 / 255]
const C_GOLD = [0xb6 / 255, 0x8a / 255, 0x2c / 255]
// Rust amped 50% beyond brand --rust (#c2461f → #ff692f) for stronger
// warm/cool contrast in the particle brain. Brand --rust elsewhere stays.
const C_RUST = [0xff / 255, 0x69 / 255, 0x2f / 255]
const C_INK_SOFT = [0x2a / 255, 0x3f / 255, 0x55 / 255]
const C_INK_MUTE = [0x6a / 255, 0x77 / 255, 0x88 / 255]

// Rasterize 🧠 emoji to an offscreen canvas; return brain particle targets.
// Captures silhouette edges + interior gradient edges (gyri/sulci) for
// anatomical recognizability at any density.
function buildPointillistBrain(maxTargets, worldScale = 2.4) {
  const SIZE = 1280
  const canvas2d = document.createElement('canvas')
  canvas2d.width = SIZE
  canvas2d.height = SIZE
  const ctx2d = canvas2d.getContext('2d')

  ctx2d.fillStyle = '#ffffff'
  ctx2d.fillRect(0, 0, SIZE, SIZE)

  // Lateral (left-side sagittal) view — frontal lobe faces left,
  // occipital pole right, cerebellum at lower-right.
  // cx/cy anchor the cerebrum centroid; rw/rh scale the path.
  const cx = SIZE * 0.470   // 602
  const cy = SIZE * 0.415   // 531
  const rw = SIZE * 0.415   // 531  — horizontal radius
  const rh = SIZE * 0.330   // 422  — vertical radius

  // ── SILHOUETTE: one continuous path (cerebrum + cerebellum + stem) ────────
  ctx2d.fillStyle = '#111111'
  ctx2d.beginPath()
  ctx2d.moveTo(cx - rw * 0.82, cy + rh * 0.28)         // A  front-bottom
  ctx2d.bezierCurveTo(                                   // front face (concave)
    cx - rw * 0.96, cy - rh * 0.06,
    cx - rw * 0.90, cy - rh * 0.48,
    cx - rw * 0.70, cy - rh * 0.74
  )
  ctx2d.bezierCurveTo(                                   // forehead arc → crown
    cx - rw * 0.48, cy - rh * 1.00,
    cx - rw * 0.10, cy - rh * 1.12,
    cx + rw * 0.14, cy - rh * 1.12
  )
  ctx2d.bezierCurveTo(                                   // crown → occipital top
    cx + rw * 0.42, cy - rh * 1.10,
    cx + rw * 0.72, cy - rh * 0.94,
    cx + rw * 0.86, cy - rh * 0.62
  )
  ctx2d.bezierCurveTo(                                   // occipital descending
    cx + rw * 1.02, cy - rh * 0.28,
    cx + rw * 1.00, cy + rh * 0.16,
    cx + rw * 0.80, cy + rh * 0.42
  )
  ctx2d.bezierCurveTo(                                   // cerebrum → cerebellum notch
    cx + rw * 0.70, cy + rh * 0.56,
    cx + rw * 0.56, cy + rh * 0.58,
    cx + rw * 0.47, cy + rh * 0.51
  )
  ctx2d.bezierCurveTo(                                   // cerebellum upper arc
    cx + rw * 0.60, cy + rh * 0.44,
    cx + rw * 0.96, cy + rh * 0.48,
    cx + rw * 1.02, cy + rh * 0.70
  )
  ctx2d.bezierCurveTo(                                   // cerebellum lower arc
    cx + rw * 1.02, cy + rh * 0.92,
    cx + rw * 0.78, cy + rh * 1.06,
    cx + rw * 0.52, cy + rh * 1.00
  )
  ctx2d.bezierCurveTo(                                   // brain stem connector
    cx + rw * 0.36, cy + rh * 1.00,
    cx + rw * 0.16, cy + rh * 1.02,
    cx + rw * 0.04, cy + rh * 0.97
  )
  ctx2d.bezierCurveTo(                                   // temporal base (forward)
    cx - rw * 0.20, cy + rh * 0.97,
    cx - rw * 0.50, cy + rh * 0.89,
    cx - rw * 0.72, cy + rh * 0.72
  )
  ctx2d.bezierCurveTo(                                   // temporal → front-bottom
    cx - rw * 0.88, cy + rh * 0.58,
    cx - rw * 0.92, cy + rh * 0.42,
    cx - rw * 0.82, cy + rh * 0.28
  )
  ctx2d.closePath()
  ctx2d.fill()

  // ── SULCI in mid-grey (#777) ──────────────────────────────────────────────
  // The gradient-edge detector picks up the dark (#111) → grey (#777)
  // transition at each sulcus edge as interior particle candidates.
  ctx2d.strokeStyle = '#777777'
  ctx2d.lineCap = 'round'
  ctx2d.lineJoin = 'round'

  // Lateral / Sylvian fissure — the deepest, most prominent sulcus.
  // Separates temporal lobe (below) from frontal + parietal (above).
  // Runs nearly horizontal then turns up at its posterior end.
  ctx2d.lineWidth = SIZE * 0.014
  ctx2d.beginPath()
  ctx2d.moveTo(cx - rw * 0.40, cy + rh * 0.24)
  ctx2d.bezierCurveTo(
    cx + rw * 0.04, cy + rh * 0.14,
    cx + rw * 0.34, cy + rh * 0.10,
    cx + rw * 0.44, cy - rh * 0.02
  )
  ctx2d.bezierCurveTo(
    cx + rw * 0.50, cy - rh * 0.14,
    cx + rw * 0.46, cy - rh * 0.26,
    cx + rw * 0.38, cy - rh * 0.30
  )
  ctx2d.stroke()

  // Central sulcus (Rolandic fissure) — nearly vertical,
  // divides motor cortex (front) from sensory cortex (behind).
  ctx2d.lineWidth = SIZE * 0.010
  ctx2d.beginPath()
  ctx2d.moveTo(cx - rw * 0.10, cy - rh * 0.98)
  ctx2d.bezierCurveTo(
    cx - rw * 0.02, cy - rh * 0.62,
    cx + rw * 0.08, cy - rh * 0.22,
    cx + rw * 0.14, cy + rh * 0.12
  )
  ctx2d.stroke()

  // Precentral sulcus (just anterior to central)
  ctx2d.lineWidth = SIZE * 0.008
  ctx2d.beginPath()
  ctx2d.moveTo(cx - rw * 0.24, cy - rh * 0.94)
  ctx2d.bezierCurveTo(
    cx - rw * 0.16, cy - rh * 0.58,
    cx - rw * 0.06, cy - rh * 0.20,
    cx - rw * 0.02, cy + rh * 0.12
  )
  ctx2d.stroke()

  // Postcentral sulcus (just posterior to central)
  ctx2d.lineWidth = SIZE * 0.008
  ctx2d.beginPath()
  ctx2d.moveTo(cx + rw * 0.06, cy - rh * 0.96)
  ctx2d.bezierCurveTo(
    cx + rw * 0.16, cy - rh * 0.60,
    cx + rw * 0.24, cy - rh * 0.20,
    cx + rw * 0.28, cy + rh * 0.10
  )
  ctx2d.stroke()

  // Superior frontal sulcus — runs roughly front-to-back in upper frontal lobe
  ctx2d.lineWidth = SIZE * 0.008
  ctx2d.beginPath()
  ctx2d.moveTo(cx - rw * 0.64, cy - rh * 0.74)
  ctx2d.bezierCurveTo(
    cx - rw * 0.50, cy - rh * 0.80,
    cx - rw * 0.32, cy - rh * 0.82,
    cx - rw * 0.20, cy - rh * 0.76
  )
  ctx2d.stroke()

  // Inferior frontal sulcus — below superior, parallel
  ctx2d.lineWidth = SIZE * 0.007
  ctx2d.beginPath()
  ctx2d.moveTo(cx - rw * 0.60, cy - rh * 0.46)
  ctx2d.bezierCurveTo(
    cx - rw * 0.46, cy - rh * 0.54,
    cx - rw * 0.28, cy - rh * 0.52,
    cx - rw * 0.18, cy - rh * 0.44
  )
  ctx2d.stroke()

  // Intraparietal sulcus — parietal lobe, runs front-to-back
  ctx2d.lineWidth = SIZE * 0.008
  ctx2d.beginPath()
  ctx2d.moveTo(cx + rw * 0.12, cy - rh * 0.82)
  ctx2d.bezierCurveTo(
    cx + rw * 0.30, cy - rh * 0.74,
    cx + rw * 0.50, cy - rh * 0.62,
    cx + rw * 0.62, cy - rh * 0.46
  )
  ctx2d.stroke()

  // Superior temporal sulcus — parallels Sylvian, below it in temporal lobe
  ctx2d.lineWidth = SIZE * 0.007
  ctx2d.beginPath()
  ctx2d.moveTo(cx - rw * 0.26, cy + rh * 0.56)
  ctx2d.bezierCurveTo(
    cx + rw * 0.10, cy + rh * 0.46,
    cx + rw * 0.32, cy + rh * 0.44,
    cx + rw * 0.42, cy + rh * 0.38
  )
  ctx2d.stroke()

  // Cerebellum folds — two horizontal bands across the cerebellar surface
  ctx2d.lineWidth = SIZE * 0.007
  ctx2d.beginPath()
  ctx2d.moveTo(cx + rw * 0.53, cy + rh * 0.64)
  ctx2d.bezierCurveTo(
    cx + rw * 0.72, cy + rh * 0.62,
    cx + rw * 0.92, cy + rh * 0.64,
    cx + rw * 1.00, cy + rh * 0.72
  )
  ctx2d.stroke()
  ctx2d.beginPath()
  ctx2d.moveTo(cx + rw * 0.55, cy + rh * 0.82)
  ctx2d.bezierCurveTo(
    cx + rw * 0.72, cy + rh * 0.80,
    cx + rw * 0.90, cy + rh * 0.82,
    cx + rw * 0.98, cy + rh * 0.88
  )
  ctx2d.stroke()

  // ── Rasterise drawn shape into particle candidates ────────────────────────
  const img = ctx2d.getImageData(0, 0, SIZE, SIZE)
  const data = img.data
  function pxSum(x, y) {
    if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return 765
    const i = (y * SIZE + x) * 4
    return data[i] + data[i + 1] + data[i + 2]
  }
  function isBackground(x, y) { return pxSum(x, y) > 690 }

  const STRIDE = 3
  const worldRadiusPx = SIZE * 0.42
  const positions = []
  const layers = []
  let silCount = 0

  for (let py = 0; py < SIZE; py += STRIDE) {
    for (let px = 0; px < SIZE; px += STRIDE) {
      if (isBackground(px, py)) continue
      const onSilhouette =
        isBackground(px - STRIDE, py) ||
        isBackground(px + STRIDE, py) ||
        isBackground(px, py - STRIDE) ||
        isBackground(px, py + STRIDE)
      // Accept every interior pixel — fills the whole brain uniformly so
      // the subsampled nodes scatter throughout the shape like the reference.
      const wx = ((px - SIZE / 2) / worldRadiusPx) * worldScale
      const wy = -((py - SIZE / 2) / worldRadiusPx) * worldScale
      const wz = (Math.random() - 0.5) * 0.06 * worldScale
      positions.push(wx, wy, wz)
      layers.push(onSilhouette ? 1 : 0)
    }
  }

  // Uniformly subsample to maxTargets.
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

export default function ParticleBrainCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // WebGL detection via throwaway canvas (real one stays untouched).
    const probe = document.createElement('canvas')
    const hasWebgl = !!(probe.getContext('webgl2') || probe.getContext('webgl'))

    if (!hasWebgl) {
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

    // Visible world extent at z=0 plane (recomputed on resize)
    const vFov = (camera.fov * Math.PI) / 180
    let visibleH = 2 * Math.tan(vFov / 2) * camera.position.z
    let visibleW = visibleH * camera.aspect

    // --- Build brain particles (assembled from page load) ----------------
    // Desktop: worldScale=1.45 (~42% of viewport width). Mobile: half size
    // (0.725) so the brain shape stays recognizable on narrow viewports
    // instead of overflowing as an unrecognizable cloud.
    const worldScale = isMobile ? 0.85 : 1.7
    const brain = buildPointillistBrain(count, worldScale)
    const targetPositions = brain.positions
    const actualCount = brain.count
    const livePositions = new Float32Array(actualCount * 3)
    livePositions.set(targetPositions)

    // Per-particle phase seed for vertex-shader drift (independent oscillation
    // per particle so the assembled brain breathes instead of sitting static).
    const orderSeeds = new Float32Array(actualCount)
    for (let i = 0; i < actualCount; i++) orderSeeds[i] = Math.random()

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(livePositions, 3))
    geometry.setAttribute('aLayer', new THREE.BufferAttribute(brain.layers, 1))
    geometry.setAttribute('aOrder', new THREE.BufferAttribute(orderSeeds, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uAlpha: { value: 1 },
        uSize: { value: 0.110 },  // large nodes to match reference mesh style
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uTime: { value: 0 },
        // uProgress: assembly progress 0→1. Drift gates in via smoothstep so
        // it doesn't compete with the radial assembly motion (step 2). Until
        // assembly lands, defaults to 1.0 (post-assembly state).
        uProgress: { value: 1 },
        // uDrift: master enable for per-particle drift. Set to 0 for
        // prefers-reduced-motion users so the brain stays perfectly still.
        uDrift: { value: 1 },
        uColorCyan: { value: new THREE.Color(C_CYAN[0], C_CYAN[1], C_CYAN[2]) },
        uColorCyanSoft: { value: new THREE.Color(C_CYAN_SOFT[0], C_CYAN_SOFT[1], C_CYAN_SOFT[2]) },
        uColorGold: { value: new THREE.Color(C_GOLD[0], C_GOLD[1], C_GOLD[2]) },
        uColorRust: { value: new THREE.Color(C_RUST[0], C_RUST[1], C_RUST[2]) },
        uColorInkSoft: { value: new THREE.Color(C_INK_SOFT[0], C_INK_SOFT[1], C_INK_SOFT[2]) },
      },
      vertexShader: `
        uniform float uSize;
        uniform float uPixelRatio;
        uniform float uTime;
        uniform float uProgress;
        uniform float uDrift;
        uniform vec3 uColorCyan;
        uniform vec3 uColorCyanSoft;
        uniform vec3 uColorGold;
        uniform vec3 uColorRust;
        uniform vec3 uColorInkSoft;
        attribute float aLayer;
        attribute float aOrder;
        varying vec3 vColor;

        const float TAU = 6.2831853;

        void main() {
          // Per-particle breathing drift. Three detuned axis frequencies
          // (~5–7s periods) with per-particle phase from aOrder give the
          // brain a living, non-uniform shimmer instead of a single global
          // oscillation. Gated by uProgress*uDrift so it fades in after
          // assembly and is silenced under reduced-motion.
          float gate = smoothstep(0.6, 1.0, uProgress) * uDrift;
          float seed = aOrder * TAU;
          // Each node drifts on three detuned axes with unique phase (seed).
          // Amplitude 0.045 = ~30% of inter-node spacing → clearly visible
          // independent jitter per node. Frequencies ~0.5 rad/s ≈ 12 s period.
          vec3 drift = vec3(
            sin(uTime * 0.52 + seed * 1.00) * 0.045,
            sin(uTime * 0.61 + seed * 1.73) * 0.045,
            sin(uTime * 0.41 + seed * 2.31) * 0.028
          ) * gate;
          vec3 driftedPos = position + drift;

          vec4 mvPosition = modelViewMatrix * vec4(driftedPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = uSize * (300.0 / -mvPosition.z) * uPixelRatio;

          // Per-particle color from the brand palette. Body particles vary
          // across cyan-soft (top/right) → cyan (mid) → ink-soft (bottom-left)
          // to give a multi-tonal blue rather than monolithic. ~14% of body
          // particles get a rust accent for warmth. Silhouette particles
          // (anatomical edges) mix gold and rust based on aOrder for
          // edge variety.
          float xFactor = clamp((position.x + 1.2) / 2.4, 0.0, 1.0);
          float yFactor = clamp((position.y + 1.2) / 2.4, 0.0, 1.0);
          vec3 col;
          if (aLayer > 0.5) {
            // Silhouette: warm — gold↔rust mix
            col = mix(uColorGold, uColorRust, smoothstep(0.3, 0.8, aOrder));
          } else if (aOrder < 0.40) {
            // Pure rust accent in body (~40% of particles) — echoes the
            // §03 "14 Days" section's rust headline and Phase 03 card,
            // and gives the brain a strong warm/cool contrast.
            col = uColorRust;
          } else {
            // Body: layered cyan/ink gradient
            vec3 cool = mix(uColorInkSoft, uColorCyan, yFactor);
            vec3 warm = mix(uColorCyan, uColorCyanSoft, yFactor);
            col = mix(cool, warm, xFactor);
          }
          vColor = col;
        }
      `,
      fragmentShader: `
        uniform float uAlpha;
        varying vec3 vColor;

        void main() {
          // Circular sprite with soft edge
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float edge = smoothstep(0.5, 0.25, d);
          float alpha = edge * uAlpha * 0.9;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    })

    const points = new THREE.Points(geometry, material)
    const brainGroup = new THREE.Group()
    brainGroup.add(points)
    scene.add(brainGroup)

    // Initial brain position. Desktop = right-half of hero, slightly below
    // vertical center. Mobile = centered horizontally, shifted up ~22% of
    // viewport height. Recomputed on resize. The render loop overrides this
    // each frame; setting it here ensures the first frame (and reduced-
    // motion single-render) shows the brain at the right place.
    function setInitialBrainPosition() {
      visibleH = 2 * Math.tan(vFov / 2) * camera.position.z
      visibleW = visibleH * camera.aspect
      if (isMobile) {
        // Nudged right ~0.5" (visibleW * 0.10) for better visual balance.
        brainGroup.position.x = visibleW * 0.10
        brainGroup.position.y = visibleH * 0.18
      } else {
        brainGroup.position.x = visibleW * 0.22
        brainGroup.position.y = -visibleH * 0.04
      }
    }
    setInitialBrainPosition()

    // --- Static connector lines (anatomical net within the brain) --------
    const lineCount = isMobile ? MOBILE_STATIC_LINES : STATIC_LINES
    const threadCount = isMobile ? MOBILE_GHOST_THREADS : GHOST_THREADS

    // Spatial proximity mesh: each node connects to up to 5 nearest
    // neighbours within a distance threshold. With n≈500 this O(n²) pass
    // runs in <5 ms and creates the triangular network of the reference image.
    const maxD2 = (worldScale * 0.20) * (worldScale * 0.20)
    const connCap = 5
    const connCount = new Int32Array(actualCount)
    const linesArr = []
    for (let i = 0; i < actualCount; i++) {
      if (connCount[i] >= connCap) continue
      const ix = targetPositions[i * 3], iy = targetPositions[i * 3 + 1], iz = targetPositions[i * 3 + 2]
      for (let j = i + 1; j < actualCount; j++) {
        if (connCount[i] >= connCap) break
        if (connCount[j] >= connCap) continue
        const dx = targetPositions[j * 3] - ix, dy = targetPositions[j * 3 + 1] - iy
        if (dx * dx + dy * dy < maxD2) {
          linesArr.push(ix, iy, iz, targetPositions[j * 3], targetPositions[j * 3 + 1], targetPositions[j * 3 + 2])
          connCount[i]++; connCount[j]++
        }
      }
    }
    const linePositions = new Float32Array(linesArr)
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(C_CYAN[0], C_CYAN[1], C_CYAN[2]),
      transparent: true,
      opacity: 0.30,
      depthWrite: false,
    })
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial)
    brainGroup.add(lineSegments)

    // --- Ghost threads: gold radial lines radiating from brain edge ------
    const threadPositions = new Float32Array(threadCount * 2 * 3)
    for (let t = 0; t < threadCount; t++) {
      const angle = (t / threadCount) * Math.PI * 2
      // Scaled to match worldScale=1.2 brain radius.
      const innerR = 1.06
      const outerR = 2.35 + Math.random() * 0.85
      const i6 = t * 6
      threadPositions[i6 + 0] = Math.cos(angle) * innerR
      threadPositions[i6 + 1] = Math.sin(angle) * innerR
      threadPositions[i6 + 2] = 0
      threadPositions[i6 + 3] = Math.cos(angle) * outerR
      threadPositions[i6 + 4] = Math.sin(angle) * outerR
      threadPositions[i6 + 5] = 0
    }
    const threadGeometry = new THREE.BufferGeometry()
    threadGeometry.setAttribute('position', new THREE.BufferAttribute(threadPositions, 3))
    const threadMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(C_GOLD[0], C_GOLD[1], C_GOLD[2]),
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
    const ghostThreads = new THREE.LineSegments(threadGeometry, threadMaterial)
    brainGroup.add(ghostThreads)

    // --- Scroll progress -------------------------------------------------
    // pHide: 0 in hero, 1 at §02 anatomy — fades the hero brain out before
    // the MiniOrbitBrain (anchored to the chips graphic) takes over at §02.
    // The hero brain no longer drifts position — it stays in the right-half
    // of the hero so it doesn't visually compete with the orbit brain.
    const sectionIds = ['shop-os-top', 'shop-anatomy']
    const sectionTops = {}
    function cacheSectionOffsets() {
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        sectionTops[id] = el ? el.getBoundingClientRect().top + window.scrollY : 0
      }
    }
    cacheSectionOffsets()

    function lerpProgress(y, start, end) {
      if (end <= start) return y >= start ? 1 : 0
      return Math.max(0, Math.min(1, (y - start) / (end - start)))
    }

    let pHide = 0
    function recomputeProgress() {
      const y = window.scrollY
      pHide = lerpProgress(y, sectionTops['shop-os-top'] || 0, sectionTops['shop-anatomy'] || 1)
    }

    window.addEventListener('scroll', recomputeProgress, { passive: true })
    recomputeProgress()

    // --- Render loop -----------------------------------------------------
    let rafId = 0
    const startTime = performance.now()

    function renderFrame() {
      const elapsed = (performance.now() - startTime) / 1000
      // Drive per-particle vertex-shader drift.
      material.uniforms.uTime.value = elapsed
      // Brain position + motion. Both desktop and mobile use a slow circular
      // orbit with an undulating radius (sin-modulated) so the path is an
      // organic breathing ellipse rather than a rigid circle. Desktop orbit
      // is ~8× larger than the old subtle sway.
      if (isMobile) {
        const baseX = visibleW * 0.10
        const baseY = visibleH * 0.18
        const orbitAngle = elapsed * 0.28
        const undulate = Math.sin(elapsed * 0.11) * 0.10
        brainGroup.position.x = baseX + Math.cos(orbitAngle) * (0.22 + undulate)
        brainGroup.position.y = baseY + Math.sin(orbitAngle * 1.3) * (0.15 + undulate * 0.6)
        brainGroup.rotation.z = Math.sin(elapsed * 0.19) * 0.05
      } else {
        const initialX = visibleW * 0.22
        const initialY = -visibleH * 0.04
        const orbitAngle = elapsed * 0.20
        const undulate = Math.sin(elapsed * 0.11) * 0.18
        brainGroup.position.x = initialX + Math.cos(orbitAngle) * (0.42 + undulate)
        brainGroup.position.y = initialY + Math.sin(orbitAngle * 1.3) * (0.28 + undulate * 0.6)
        brainGroup.rotation.z = Math.sin(elapsed * 0.17) * 0.06
      }

      // Fade out as user scrolls from hero (§00) into §02 anatomy so the
      // MiniOrbitBrain is the only brain visible at the orbit center.
      const hideT = pHide * pHide * (3 - 2 * pHide)
      const a = Math.max(0, 1 - hideT)
      material.uniforms.uAlpha.value = a
      lineMaterial.opacity = 0.30 * a
      threadMaterial.opacity = 0.35 * a

      renderer.render(scene, camera)
    }

    function loop() {
      if (!document.hidden) renderFrame()
      rafId = requestAnimationFrame(loop)
    }

    if (reducedMotion) {
      // Static frame: brain assembled, slight transparency, no per-particle
      // drift so the image is perfectly still.
      material.uniforms.uAlpha.value = 0.7
      material.uniforms.uDrift.value = 0
      lineMaterial.opacity = 0.12
      threadMaterial.opacity = 0.25
      renderer.render(scene, camera)
    } else {
      rafId = requestAnimationFrame(loop)
    }

    // --- Resize handling (debounced) -------------------------------------
    let resizeTimer = 0
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
      setInitialBrainPosition()
      cacheSectionOffsets()
      recomputeProgress()
    }
    function debouncedResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(onResize, 150)
    }
    window.addEventListener('resize', debouncedResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', debouncedResize)
      window.removeEventListener('scroll', recomputeProgress)
      geometry.dispose()
      material.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      threadGeometry.dispose()
      threadMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="bp-canvas" />
}
