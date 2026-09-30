import { useEffect, useRef } from 'react'
import { buildPointillistBrain } from '@/lib/brainShape.js'

// SVG/JS fallback for ParticleBrainCanvas, used when WebGL is unavailable.
// Real-world trigger: Brave Shields with fingerprinting set to Strict (or
// Shields "Aggressive") returns null from canvas.getContext('webgl'), as do
// Remote Desktop sessions, VMs, and blocklisted GPU drivers on Windows.
//
// Mirrors the WebGL version's look: same brain silhouette (buildPointillist-
// Brain is 2D-canvas only, so it still works), same palette rules, same
// proximity-line mesh, same per-node drift + group orbit, same scroll fade
// between #shop-os-top and #shop-anatomy. Fewer nodes than WebGL (SVG DOM
// elements cost more than GPU points) and the loop is capped at ~30 fps.

const NODES_DESKTOP = 480
const NODES_MOBILE = 220
const FRAME_MS = 1000 / 30

// Camera constants from ParticleBrainCanvas — used to convert world units
// to CSS pixels so the fallback lands at the same screen position/size.
const FOV_DEG = 38
const CAM_Z = 6.4

const CYAN = [0x1c, 0x6e, 0xa4]
const CYAN_SOFT = [0x2e, 0x8f, 0xc9]
const GOLD = [0xb6, 0x8a, 0x2c]
const RUST = [0xff, 0x69, 0x2f]
const INK_SOFT = [0x2a, 0x3f, 0x55]

const clamp01 = (v) => Math.max(0, Math.min(1, v))
function smoothstep(e0, e1, x) {
  const t = clamp01((x - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}
function mix(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}
function rgb(c) {
  return `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`
}

// Same per-particle colour rules as the WebGL vertex shader.
function nodeColor(x, y, layer, order) {
  if (layer > 0.5) return mix(GOLD, RUST, smoothstep(0.3, 0.8, order))
  if (order < 0.4) return RUST
  const xf = clamp01((x + 1.2) / 2.4)
  const yf = clamp01((y + 1.2) / 2.4)
  const cool = mix(INK_SOFT, CYAN, yf)
  const warm = mix(CYAN, CYAN_SOFT, yf)
  return mix(cool, warm, xf)
}

const SVG_NS = 'http://www.w3.org/2000/svg'

export default function ParticleBrainFallback() {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    const worldScale = isMobile ? 0.85 : 1.7
    const count = isMobile ? NODES_MOBILE : NODES_DESKTOP

    // --- Geometry ---------------------------------------------------------
    const brain = buildPointillistBrain(count, worldScale)
    const pos = brain.positions
    const n = brain.count
    const seeds = new Float32Array(n)
    for (let i = 0; i < n; i++) seeds[i] = Math.random()

    // Proximity mesh. Sparser node set than WebGL → wider reach so the mesh
    // density looks similar.
    const maxD2 = (worldScale * 0.26) ** 2
    const connCap = 4
    const connCount = new Int32Array(n)
    const pairs = []
    for (let i = 0; i < n; i++) {
      if (connCount[i] >= connCap) continue
      const ix = pos[i * 3], iy = pos[i * 3 + 1]
      for (let j = i + 1; j < n; j++) {
        if (connCount[i] >= connCap) break
        if (connCount[j] >= connCap) continue
        const dx = pos[j * 3] - ix, dy = pos[j * 3 + 1] - iy
        if (dx * dx + dy * dy < maxD2) {
          pairs.push(i, j)
          connCount[i]++; connCount[j]++
        }
      }
    }

    // --- DOM ---------------------------------------------------------------
    // World → px scale: the WebGL camera shows `visibleH` world units across
    // the viewport height. Y is flipped (SVG y-down).
    const vFov = (FOV_DEG * Math.PI) / 180
    const visibleH = 2 * Math.tan(vFov / 2) * CAM_Z
    let visibleW = visibleH * (window.innerWidth / window.innerHeight)
    let scale = window.innerHeight / visibleH

    const group = document.createElementNS(SVG_NS, 'g')
    const lines = document.createElementNS(SVG_NS, 'path')
    lines.setAttribute('stroke', rgb(CYAN))
    lines.setAttribute('stroke-width', '1')
    lines.setAttribute('fill', 'none')
    group.appendChild(lines)

    const nodesG = document.createElementNS(SVG_NS, 'g')
    const circles = new Array(n)
    // gl_PointSize ≈ uSize(0.110) * 300 / CAM_Z ≈ 5.2 CSS px diameter.
    const radius = isMobile ? 2.2 : 2.8
    for (let i = 0; i < n; i++) {
      const c = document.createElementNS(SVG_NS, 'circle')
      c.setAttribute('r', String(radius))
      c.setAttribute('fill', rgb(nodeColor(pos[i * 3], pos[i * 3 + 1], brain.layers[i], seeds[i])))
      nodesG.appendChild(c)
      circles[i] = c
    }
    group.appendChild(nodesG)
    svg.appendChild(group)

    function setViewport() {
      svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`)
      visibleW = visibleH * (window.innerWidth / window.innerHeight)
      scale = window.innerHeight / visibleH
    }
    setViewport()

    // --- Scroll fade (identical to WebGL version) -------------------------
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
      return clamp01((y - start) / (end - start))
    }
    let pHide = 0
    function recomputeProgress() {
      pHide = lerpProgress(window.scrollY, sectionTops['shop-os-top'] || 0, sectionTops['shop-anatomy'] || 1)
    }
    window.addEventListener('scroll', recomputeProgress, { passive: true })
    recomputeProgress()

    // --- Frame -------------------------------------------------------------
    const TAU = Math.PI * 2
    const drifted = new Float32Array(n * 2)
    const mobileMul = isMobile ? 0.1 : 1

    function renderFrame(elapsed, drift) {
      // Group orbit — same math as WebGL renderFrame.
      let gx, gy, rot
      if (isMobile) {
        const a = elapsed * 0.28
        const u = Math.sin(elapsed * 0.11) * 0.10
        gx = visibleW * 0.10 + Math.cos(a) * (0.22 + u) * drift
        gy = visibleH * 0.18 + Math.sin(a * 1.3) * (0.15 + u * 0.6) * drift
        rot = Math.sin(elapsed * 0.19) * 0.05 * drift
      } else {
        const a = elapsed * 0.20
        const u = Math.sin(elapsed * 0.11) * 0.18
        gx = visibleW * 0.22 + Math.cos(a) * (0.42 + u) * drift
        gy = -visibleH * 0.04 + Math.sin(a * 1.3) * (0.28 + u * 0.6) * drift
        rot = Math.sin(elapsed * 0.17) * 0.06 * drift
      }
      const cx = window.innerWidth / 2 + gx * scale
      const cy = window.innerHeight / 2 - gy * scale
      group.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${(-rot * 180 / Math.PI).toFixed(2)})`)

      // Per-node drift (matches vertex shader), in px.
      for (let i = 0; i < n; i++) {
        const s = seeds[i] * TAU
        const x = pos[i * 3] + Math.sin(elapsed * 0.52 + s) * 0.045 * drift
        const y = pos[i * 3 + 1] + Math.sin(elapsed * 0.61 + s * 1.73) * 0.045 * drift
        drifted[i * 2] = x * scale
        drifted[i * 2 + 1] = -y * scale
        circles[i].setAttribute('transform', `translate(${drifted[i * 2].toFixed(1)} ${drifted[i * 2 + 1].toFixed(1)})`)
      }
      // Lines as one path so endpoints stay flush with drifting nodes.
      let d = ''
      for (let p = 0; p < pairs.length; p += 2) {
        const a = pairs[p] * 2, b = pairs[p + 1] * 2
        d += `M${drifted[a].toFixed(1)} ${drifted[a + 1].toFixed(1)}L${drifted[b].toFixed(1)} ${drifted[b + 1].toFixed(1)}`
      }
      lines.setAttribute('d', d)

      const hideT = pHide * pHide * (3 - 2 * pHide)
      const alpha = Math.max(0, 1 - hideT) * mobileMul
      nodesG.setAttribute('opacity', String((reducedMotion ? 0.49 : 0.63) * alpha))
      lines.setAttribute('opacity', String((reducedMotion ? 0.08 : 0.10) * alpha))
    }

    let rafId = 0
    let lastFrame = 0
    let removeScroll = null
    const startTime = performance.now()
    function loop(now) {
      rafId = requestAnimationFrame(loop)
      if (document.hidden || now - lastFrame < FRAME_MS) return
      lastFrame = now
      renderFrame((now - startTime) / 1000, 1)
    }

    if (reducedMotion) {
      // Single still frame; re-render on scroll so the §02 fade still works.
      renderFrame(0, 0)
      const onScroll = () => renderFrame(0, 0)
      window.addEventListener('scroll', onScroll, { passive: true })
      removeScroll = () => window.removeEventListener('scroll', onScroll)
    } else {
      rafId = requestAnimationFrame(loop)
    }

    let resizeTimer = 0
    function onResize() {
      setViewport()
      cacheSectionOffsets()
      recomputeProgress()
      if (reducedMotion) renderFrame(0, 0)
    }
    function debouncedResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(onResize, 150)
    }
    window.addEventListener('resize', debouncedResize)

    return () => {
      cancelAnimationFrame(rafId)
      if (removeScroll) removeScroll()
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', debouncedResize)
      window.removeEventListener('scroll', recomputeProgress)
      svg.removeChild(group)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="bp-canvas"
      data-render="svg-fallback"
      preserveAspectRatio="none"
    />
  )
}
