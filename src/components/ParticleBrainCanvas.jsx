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
