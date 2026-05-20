import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Particle brain background — benaios.com-style WebGL effect retuned to
// Blueprint IT palette. ~14k particles render an assembled 🧠 silhouette
// in the right half of the hero from page load. On scroll, the brain
// drifts from right-half to the §02 OrbitDiagram center, then scales down
// and fades by §05. Cyan body, gold edge accents.

const TOTAL_PARTICLES = 14000
const MOBILE_PARTICLES = 6000
const STATIC_LINES = 1100
const MOBILE_STATIC_LINES = 400
const GHOST_THREADS = 32
const MOBILE_GHOST_THREADS = 12

// Brand stops (sRGB normalized 0..1).
const C_CYAN = [0x1c / 255, 0x6e / 255, 0xa4 / 255]
const C_GOLD = [0xb6 / 255, 0x8a / 255, 0x2c / 255]
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
  ctx2d.font =
    '1080px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
  ctx2d.textAlign = 'center'
  ctx2d.textBaseline = 'middle'
  ctx2d.fillText('\u{1F9E0}', SIZE / 2, SIZE / 2 + 40)

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
      // Silhouette: at least one background neighbor
      const onSilhouette =
        isBackground(px - STRIDE, py) ||
        isBackground(px + STRIDE, py) ||
        isBackground(px, py - STRIDE) ||
        isBackground(px, py + STRIDE)
      // Interior gradient edge: high local pixel-sum variance (gyri / sulci)
      let isGradientEdge = false
      if (!onSilhouette) {
        const here = pxSum(px, py)
        const maxFine = Math.max(
          Math.abs(pxSum(px - 2, py) - here),
          Math.abs(pxSum(px + 2, py) - here),
          Math.abs(pxSum(px, py - 2) - here),
          Math.abs(pxSum(px, py + 2) - here)
        )
        const maxMid = Math.max(
          Math.abs(pxSum(px - 6, py) - here),
          Math.abs(pxSum(px + 6, py) - here),
          Math.abs(pxSum(px, py - 6) - here),
          Math.abs(pxSum(px, py + 6) - here)
        )
        isGradientEdge = maxFine > 70 || maxMid > 100
      }
      if (!onSilhouette && !isGradientEdge) continue
      const wx = ((px - SIZE / 2) / worldRadiusPx) * worldScale
      const wy = -((py - SIZE / 2) / worldRadiusPx) * worldScale
      const wz = (Math.random() - 0.5) * 0.06 * worldScale
      positions.push(wx, wy, wz)
      layers.push(onSilhouette ? 1 : 0)
    }
  }

  // Fallback if no emoji font available — draw simple brain ellipse + stem.
  if (positions.length / 3 < 500) {
    positions.length = 0
    layers.length = 0
    ctx2d.fillStyle = '#ffffff'
    ctx2d.fillRect(0, 0, SIZE, SIZE)
    ctx2d.strokeStyle = '#000'
    ctx2d.lineWidth = 4
    ctx2d.beginPath()
    ctx2d.ellipse(SIZE / 2, SIZE / 2, 280, 220, 0, 0, Math.PI * 2)
    ctx2d.stroke()
    ctx2d.beginPath()
    ctx2d.moveTo(SIZE / 2 - 260, SIZE / 2 + 30)
    ctx2d.quadraticCurveTo(SIZE / 2, SIZE / 2 + 60, SIZE / 2 + 260, SIZE / 2 + 30)
    ctx2d.stroke()
    const img2 = ctx2d.getImageData(0, 0, SIZE, SIZE).data
    for (let py = 0; py < SIZE; py += STRIDE) {
      for (let px = 0; px < SIZE; px += STRIDE) {
        const i = (py * SIZE + px) * 4
        if (img2[i] < 100) {
          positions.push(
            ((px - SIZE / 2) / worldRadiusPx) * worldScale,
            -((py - SIZE / 2) / worldRadiusPx) * worldScale,
            (Math.random() - 0.5) * 0.06 * worldScale
          )
          layers.push(1)
        }
      }
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
    const brain = buildPointillistBrain(count, 2.4)
    const targetPositions = brain.positions
    const actualCount = brain.count
    const livePositions = new Float32Array(actualCount * 3)
    livePositions.set(targetPositions)

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(livePositions, 3))
    geometry.setAttribute('aLayer', new THREE.BufferAttribute(brain.layers, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uAlpha: { value: 1 },
        uSize: { value: 0.022 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColorCyan: { value: new THREE.Color(C_CYAN[0], C_CYAN[1], C_CYAN[2]) },
        uColorGold: { value: new THREE.Color(C_GOLD[0], C_GOLD[1], C_GOLD[2]) },
        uColorMute: { value: new THREE.Color(C_INK_MUTE[0], C_INK_MUTE[1], C_INK_MUTE[2]) },
      },
      vertexShader: `
        uniform float uSize;
        uniform float uPixelRatio;
        attribute float aLayer;
        varying float vLayer;
        varying vec3 vWorldPos;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = uSize * (300.0 / -mvPosition.z) * uPixelRatio;
          vLayer = aLayer;
          vWorldPos = position;
        }
      `,
      fragmentShader: `
        uniform float uAlpha;
        uniform vec3 uColorCyan;
        uniform vec3 uColorGold;
        uniform vec3 uColorMute;
        varying float vLayer;
        varying vec3 vWorldPos;

        void main() {
          // Circular sprite with soft edge
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float edge = smoothstep(0.5, 0.25, d);

          // Silhouette = warm gold-cyan blend (anatomical edges glow).
          // Interior = cool cyan body with a hint of mute haze on lower particles
          // for subtle depth shading.
          vec3 col;
          if (vLayer > 0.5) {
            col = mix(uColorGold, uColorCyan, 0.3);
          } else {
            float yFactor = clamp((vWorldPos.y + 1.5) / 3.0, 0.0, 1.0);
            col = mix(uColorMute, uColorCyan, 0.55 + 0.35 * yFactor);
          }
          float alpha = edge * uAlpha * 0.9;
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

    // Initial brain position: right-half of hero, slightly below vertical center.
    // Recomputed on resize.
    function setInitialBrainPosition() {
      visibleH = 2 * Math.tan(vFov / 2) * camera.position.z
      visibleW = visibleH * camera.aspect
      brainGroup.position.x = visibleW * 0.22
      brainGroup.position.y = -visibleH * 0.04
    }
    setInitialBrainPosition()

    // --- Static connector lines (anatomical net within the brain) --------
    const lineCount = isMobile ? MOBILE_STATIC_LINES : STATIC_LINES
    const threadCount = isMobile ? MOBILE_GHOST_THREADS : GHOST_THREADS

    const linePositions = new Float32Array(lineCount * 2 * 3)
    for (let l = 0; l < lineCount; l++) {
      const a = Math.floor(Math.random() * actualCount)
      let b = a + Math.floor((Math.random() - 0.5) * 80)
      b = Math.max(0, Math.min(actualCount - 1, b))
      if (b === a) b = (a + 1) % actualCount
      const i6 = l * 6
      linePositions[i6 + 0] = targetPositions[a * 3 + 0]
      linePositions[i6 + 1] = targetPositions[a * 3 + 1]
      linePositions[i6 + 2] = targetPositions[a * 3 + 2]
      linePositions[i6 + 3] = targetPositions[b * 3 + 0]
      linePositions[i6 + 4] = targetPositions[b * 3 + 1]
      linePositions[i6 + 5] = targetPositions[b * 3 + 2]
    }
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(C_CYAN[0], C_CYAN[1], C_CYAN[2]),
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    })
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial)
    brainGroup.add(lineSegments)

    // --- Ghost threads: gold radial lines radiating from brain edge ------
    const threadPositions = new Float32Array(threadCount * 2 * 3)
    for (let t = 0; t < threadCount; t++) {
      const angle = (t / threadCount) * Math.PI * 2
      const innerR = 1.8
      const outerR = 4.0 + Math.random() * 1.5
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
    // pDrift: 0 in hero, 1 at §02 anatomy — drives drift from right-half toward §02 center
    // pFade:  0 at §03 14-days, 1 at §05 final CTA — drives scale-down + fade-out
    const sectionIds = [
      'shop-os-top',
      'shop-gap',
      'shop-anatomy',
      'shop-14-days',
      'shop-operator',
      'shop-ready',
    ]
    const sectionTops = {}
    function cacheSectionOffsets() {
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        sectionTops[id] = el ? el.getBoundingClientRect().top + window.scrollY : 0
      }
    }
    cacheSectionOffsets()

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

    let pDrift = 0, pFade = 0
    function recomputeProgress() {
      const y = window.scrollY
      pDrift = lerpProgress(y, sectionTops['shop-os-top'] || 0, sectionTops['shop-anatomy'] || 1)
      pFade = lerpProgress(y, sectionTops['shop-14-days'] || 0, sectionTops['shop-ready'] || 1)
    }

    window.addEventListener('scroll', recomputeProgress, { passive: true })
    recomputeProgress()

    // --- Render loop -----------------------------------------------------
    let rafId = 0
    const startTime = performance.now()

    function renderFrame() {
      const elapsed = (performance.now() - startTime) / 1000
      // Subtle idle motion so the brain feels alive even without scrolling
      const idleRot = Math.sin(elapsed * 0.3) * 0.025
      const idleFloat = Math.sin(elapsed * 0.5) * 0.05

      // Drift: right-half initial → §02 center as pDrift ramps 0→1
      const driftT = pDrift * pDrift * (3 - 2 * pDrift)
      const initialX = visibleW * 0.22
      const initialY = -visibleH * 0.04
      brainGroup.position.x = initialX * (1 - driftT) + driftTarget.x * driftT
      brainGroup.position.y = initialY * (1 - driftT) + driftTarget.y * driftT + idleFloat
      brainGroup.rotation.z = pDrift * 0.12 + idleRot

      // Fade + scale near the end
      const scale = 1.0 - 0.7 * (pFade * pFade * (3 - 2 * pFade))
      brainGroup.scale.set(scale, scale, scale)
      const a = Math.max(0, 1 - pFade)
      material.uniforms.uAlpha.value = a
      lineMaterial.opacity = 0.18 * a
      threadMaterial.opacity = 0.35 * a

      renderer.render(scene, camera)
    }

    function loop() {
      if (!document.hidden) renderFrame()
      rafId = requestAnimationFrame(loop)
    }

    if (reducedMotion) {
      // Static frame: brain assembled, slight transparency
      material.uniforms.uAlpha.value = 0.7
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
      cacheDriftTarget()
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
