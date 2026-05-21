import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Mini particle brain locked at the OrbitDiagram center. Faithful small-
// canvas copy of the hero ParticleBrainCanvas (same rasterization, same
// particle attributes, same per-particle drift) so the result looks like
// a recognizable brain at the smaller scale. Only differences from hero:
//  - lives inside a contained WebGL canvas (not full-viewport fixed)
//  - no scroll-linked drift (locked in place)
//  - horizontal cool→warm color gradient by X position (matches benaios)

const PARTICLE_COUNT = 13000
const MOBILE_PARTICLE_COUNT = 7000

const C_CYAN = [0x1c / 255, 0x6e / 255, 0xa4 / 255]
const C_CYAN_SOFT = [0x2e / 255, 0x8f / 255, 0xc9 / 255]
const C_GOLD = [0xb6 / 255, 0x8a / 255, 0x2c / 255]
// Rust amped 50% beyond brand --rust (#c2461f → #ff692f) for stronger
// warm/cool contrast against the cool blues in the brain palette.
const C_RUST = [0xff / 255, 0x69 / 255, 0x2f / 255]

// Generate particles uniformly distributed in a circle with a slight
// organic-edge overshoot (some particles veer just outside the nominal
// radius). Replaces the brain-emoji rasterization since the user prefers
// a clean circular cluster.
function buildCircleCluster(count, worldScale) {
  const positions = new Float32Array(count * 3)
  const layers = new Float32Array(count)
  const baseRadius = worldScale

  for (let i = 0; i < count; i++) {
    // sqrt(uniform) gives uniform area distribution (no center pile-up).
    // The (1 + jitter) factor lets ~15% of particles drift slightly beyond
    // the nominal radius for an organic, slightly-feathered edge.
    const u = Math.random()
    const angle = Math.random() * Math.PI * 2
    const jitter = (Math.random() - 0.35) * 0.18 // mostly inward, occasional outward
    const r = Math.sqrt(u) * baseRadius * (1 + jitter)
    const wx = Math.cos(angle) * r
    const wy = Math.sin(angle) * r
    const wz = (Math.random() - 0.5) * 0.08 * worldScale

    positions[i * 3 + 0] = wx
    positions[i * 3 + 1] = wy
    positions[i * 3 + 2] = wz
    // Silhouette flag = outer ring (warm-edge glow). Inner = body gradient.
    layers[i] = r > baseRadius * 0.82 ? 1 : 0
  }

  return { positions, layers, count }
}

export default function MiniOrbitBrain({ className = '' }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const probe = document.createElement('canvas')
    const hasWebgl = !!(probe.getContext('webgl2') || probe.getContext('webgl'))
    if (!hasWebgl) return () => {}

    const isMobile = window.innerWidth < 768
    const count = isMobile ? MOBILE_PARTICLE_COUNT : PARTICLE_COUNT

    const { width: w0, height: h0 } = wrap.getBoundingClientRect()
    if (w0 === 0 || h0 === 0) return () => {}
    const pxRatio = Math.min(window.devicePixelRatio, 2)

    const FOV_DEG = 35
    const CAM_Z = 4.2
    const aspect0 = w0 / h0
    const fovRad = (FOV_DEG * Math.PI) / 180
    const visibleH = 2 * Math.tan(fovRad / 2) * CAM_Z

    // Auto-fit: circle radius set so the cluster's diameter fills ~85% of
    // the shorter visible axis. With buildCircleCluster, worldScale IS the
    // radius (cluster spans [-worldScale, +worldScale]).
    const TARGET_FILL = 0.85
    const shorterAxisWorld = visibleH * Math.min(1, aspect0)
    const worldScale = (TARGET_FILL * shorterAxisWorld) / 2

    const camera = new THREE.PerspectiveCamera(FOV_DEG, aspect0, 0.1, 100)
    camera.position.set(0, 0, CAM_Z)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setPixelRatio(pxRatio)
    renderer.setSize(w0, h0, false)
    renderer.setClearColor(0x000000, 0)

    const brain = buildCircleCluster(count, worldScale)
    const actualCount = brain.count

    // Per-particle phase seed for vertex-shader drift.
    const orderSeeds = new Float32Array(actualCount)
    for (let i = 0; i < actualCount; i++) orderSeeds[i] = Math.random()

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(brain.positions, 3))
    geometry.setAttribute('aLayer', new THREE.BufferAttribute(brain.layers, 1))
    geometry.setAttribute('aOrder', new THREE.BufferAttribute(orderSeeds, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uAlpha: { value: 1 },
        // 2× larger than the previous 0.024 — chunky, very visible particles.
        uSize: { value: 0.048 },
        uPixelRatio: { value: pxRatio },
        uTime: { value: 0 },
        uDrift: { value: reducedMotion ? 0 : 1 },
        // Circle radius — used to normalize position.x to [-1, 1] for the
        // horizontal color gradient.
        uBrainExtent: { value: worldScale },
        uColorCyan: { value: new THREE.Color(C_CYAN[0], C_CYAN[1], C_CYAN[2]) },
        uColorCyanSoft: { value: new THREE.Color(C_CYAN_SOFT[0], C_CYAN_SOFT[1], C_CYAN_SOFT[2]) },
        uColorGold: { value: new THREE.Color(C_GOLD[0], C_GOLD[1], C_GOLD[2]) },
        uColorRust: { value: new THREE.Color(C_RUST[0], C_RUST[1], C_RUST[2]) },
      },
      vertexShader: `
        uniform float uSize;
        uniform float uPixelRatio;
        uniform float uTime;
        uniform float uDrift;
        uniform float uBrainExtent;
        uniform vec3 uColorCyan;
        uniform vec3 uColorCyanSoft;
        uniform vec3 uColorGold;
        uniform vec3 uColorRust;
        attribute float aLayer;
        attribute float aOrder;
        varying vec3 vColor;

        const float TAU = 6.2831853;

        void main() {
          // Per-particle drift — amplitudes 2× the previous (now 0.080/0.080/
          // 0.050) for very obvious shimmer/breathing.
          float seed = aOrder * TAU;
          vec3 drift = vec3(
            sin(uTime * 0.32 + seed * 1.0) * 0.080,
            sin(uTime * 0.37 + seed * 1.7) * 0.080,
            sin(uTime * 0.24 + seed * 2.3) * 0.050
          ) * uDrift;
          vec3 driftedPos = position + drift;

          vec4 mvPosition = modelViewMatrix * vec4(driftedPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = uSize * (300.0 / -mvPosition.z) * uPixelRatio;

          // Horizontal cool→warm gradient by X position (benaios style).
          // Normalize position.x to [-1, 1] using brain half-width.
          float xn = clamp(position.x / uBrainExtent * 0.5 + 0.5, 0.0, 1.0);
          vec3 cool = mix(uColorCyanSoft, uColorCyan, smoothstep(0.0, 0.5, xn));
          vec3 warm = mix(uColorGold, uColorRust, smoothstep(0.5, 1.0, xn));
          vec3 gradient = mix(cool, warm, smoothstep(0.45, 0.55, xn));

          vec3 col;
          if (aLayer > 0.5) {
            // Silhouette particles glow warm (gold→rust biased by position)
            col = mix(uColorGold, uColorRust, smoothstep(0.3, 0.85, xn + (aOrder - 0.5) * 0.3));
          } else {
            col = gradient;
          }
          vColor = col;
        }
      `,
      fragmentShader: `
        uniform float uAlpha;
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float edge = smoothstep(0.5, 0.25, d);
          // Peak particle opacity 40%.
          gl_FragColor = vec4(vColor, edge * uAlpha * 0.40);
        }
      `,
      transparent: true,
      depthWrite: false,
    })

    const scene = new THREE.Scene()
    const points = new THREE.Points(geometry, material)
    const brainGroup = new THREE.Group()
    brainGroup.add(points)
    scene.add(brainGroup)

    let rafId = 0
    const startTime = performance.now()

    function renderFrame() {
      const elapsed = (performance.now() - startTime) / 1000
      material.uniforms.uTime.value = elapsed
      // Whole-group sway 2× previous — the cluster visibly rocks/floats.
      brainGroup.position.y = Math.sin(elapsed * 0.42) * 0.110
      brainGroup.position.x = Math.cos(elapsed * 0.31) * 0.060
      brainGroup.rotation.z = Math.sin(elapsed * 0.27) * 0.090
      renderer.render(scene, camera)
    }
    function loop() {
      if (!document.hidden) renderFrame()
      rafId = requestAnimationFrame(loop)
    }

    if (reducedMotion) {
      renderer.render(scene, camera)
    } else {
      rafId = requestAnimationFrame(loop)
    }

    let resizeTimer = 0
    function onResize() {
      const r = wrap.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      camera.aspect = r.width / r.height
      camera.updateProjectionMatrix()
      renderer.setSize(r.width, r.height, false)
    }
    function debouncedResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(onResize, 120)
    }
    window.addEventListener('resize', debouncedResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', debouncedResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
