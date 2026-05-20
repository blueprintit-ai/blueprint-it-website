import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Faithful benaios.com-style particle brain background.
// Phase A (this task): scatter cloud only. Future tasks add brain assembly,
// scroll choreography, migration lines, ghost threads, fades.

const TOTAL_PARTICLES = 9000
const MOBILE_PARTICLES = 4000

// Brand stops (sRGB normalized 0..1).
const C_SLATE = [0x6a / 255, 0x77 / 255, 0x88 / 255]
const C_RUST = [0xc2 / 255, 0x46 / 255, 0x1f / 255]

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

    // --- Brain targets (this task: snap particles directly to brain) -----
    const brain = buildPointillistBrain(count)
    const positions = brain.positions
    const actualCount = brain.count
    // (actualCount may be slightly less than `count` due to emoji edge density.
    //  Use actualCount when sizing buffers below.)

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(C_RUST[0], C_RUST[1], C_RUST[2]),
      size: 0.018,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
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
