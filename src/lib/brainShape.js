// Shared brain silhouette rasterizer. Uses only the 2D canvas API so it
// works even when WebGL is unavailable (Brave Shields strict, RDP, VMs).
// Consumed by ParticleBrainCanvas (WebGL) and ParticleBrainFallback (SVG).

// Rasterize 🧠 emoji to an offscreen canvas; return brain particle targets.
// Captures silhouette edges + interior gradient edges (gyri/sulci) for
// anatomical recognizability at any density.
export function buildPointillistBrain(maxTargets, worldScale = 2.4) {
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
      const wz = 0
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
