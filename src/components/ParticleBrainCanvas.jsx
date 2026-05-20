import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Faithful benaios.com-style particle brain background.
// Phase A (this task): scatter cloud only. Future tasks add brain assembly,
// scroll choreography, migration lines, ghost threads, fades.

const TOTAL_PARTICLES = 9000
const MOBILE_PARTICLES = 4000
const MIGRATION_LINES = 1100
const MOBILE_MIGRATION_LINES = 400
const GHOST_THREADS = 32
const MOBILE_GHOST_THREADS = 12

// Brand stops (sRGB normalized 0..1).
const C_SLATE = [0x6a / 255, 0x77 / 255, 0x88 / 255]
const C_RUST = [0xc2 / 255, 0x46 / 255, 0x1f / 255]
const C_CYAN = [0x1c / 255, 0x6e / 255, 0xa4 / 255]
const C_GOLD = [0xb6 / 255, 0x8a / 255, 0x2c / 255]

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

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // WebGL detection via throwaway canvas
    const probe = document.createElement('canvas')
    const hasWebgl = !!(
      probe.getContext('webgl2') || probe.getContext('webgl')
    )

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

    // --- Brain targets (this task: snap particles directly to brain) -----
    const brain = buildPointillistBrain(count)
    const positions = brain.positions
    const actualCount = brain.count
    // (actualCount may be slightly less than `count` due to emoji edge density.
    //  Use actualCount when sizing buffers below.)

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

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(livePositions, 3))
    geometry.setAttribute('aLayer', new THREE.BufferAttribute(brain.layers, 1))

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

    const points = new THREE.Points(geometry, material)
    const brainGroup = new THREE.Group()
    brainGroup.add(points)
    scene.add(brainGroup)

    const lineCount = isMobile ? MOBILE_MIGRATION_LINES : MIGRATION_LINES
    const threadCount = isMobile ? MOBILE_GHOST_THREADS : GHOST_THREADS

    // --- Migration lines: pick nearest-neighbor pairs --------------------
    const linePositions = new Float32Array(lineCount * 2 * 3)
    const linePairs = new Array(lineCount)
    for (let l = 0; l < lineCount; l++) {
      const a = Math.floor(Math.random() * actualCount)
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

    // Map a DOM bounding rect center to world coords at z=0.
    function domCenterToWorld(elementId) {
      const el = document.getElementById(elementId)
      if (!el) return new THREE.Vector3(0, 0, 0)
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const ndcX = (cx / window.innerWidth) * 2 - 1
      const ndcY = -((cy / window.innerHeight) * 2 - 1)
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5)
      vec.unproject(camera)
      const dir = vec.sub(camera.position).normalize()
      const distance = -camera.position.z / dir.z
      return camera.position.clone().add(dir.multiplyScalar(distance))
    }

    let driftTarget = new THREE.Vector3(0, 0, 0)
    function cacheDriftTarget() {
      driftTarget = domCenterToWorld('shop-anatomy')
    }
    cacheDriftTarget()

    function lerpProgress(y, start, end) {
      if (end <= start) return y >= start ? 1 : 0
      return Math.max(0, Math.min(1, (y - start) / (end - start)))
    }

    // pA (scatter intensity, = 1 - pB) is not currently consumed by any
    // render code — material alpha and position interpolation both use pB
    // directly. Drop the binding to keep lint clean; reintroduce if a
    // future effect (e.g. scatter-only haze) needs the explicit signal.
    let pB = 0, pC = 0, pD = 0
    function recomputeProgress() {
      const y = window.scrollY
      pB = lerpProgress(y, sectionTops['shop-os-top'] || 0, sectionTops['shop-anatomy'] || 1)
      pC = lerpProgress(y, sectionTops['shop-anatomy'] || 0, sectionTops['shop-14-days'] || 1)
      pD = lerpProgress(y, sectionTops['shop-14-days'] || 0, sectionTops['shop-ready'] || 1)
    }

    window.addEventListener('scroll', recomputeProgress, { passive: true })
    recomputeProgress()

    // --- Render loop -----------------------------------------------------
    const positionAttr = geometry.getAttribute('position')

    let rafId = 0
    function loop() {
      if (!document.hidden) {
        // Smoothstep pB for nicer easing
        const t = pB * pB * (3 - 2 * pB)
        material.uniforms.uProgress.value = t
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
        const lineFade = Math.sin(Math.min(1, pB) * Math.PI) * 0.35
        lineMaterial.opacity = lineFade * material.uniforms.uAlpha.value

        const threadFade =
          Math.max(0, Math.min(1, (pB - 0.7) / 0.3)) *
          material.uniforms.uAlpha.value *
          0.4
        threadMaterial.opacity = threadFade

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

        renderer.render(scene, camera)
      }
      rafId = requestAnimationFrame(loop)
    }
    if (reducedMotion) {
      pB = 1; pC = 0; pD = 0
      material.uniforms.uProgress.value = 1
      material.uniforms.uAlpha.value = 0.7
      lineMaterial.opacity = 0
      threadMaterial.opacity = 0
      livePositions.set(targetPositions)
      const positionAttr = geometry.getAttribute('position')
      positionAttr.needsUpdate = true
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
      cacheSectionOffsets()
      recomputeProgress()
      cacheDriftTarget()
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
