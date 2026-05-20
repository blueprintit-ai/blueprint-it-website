import { useEffect, useRef } from 'react'

// Fixed-viewport, low-opacity animated background.
// Four layers, all drawn with the existing palette (cyan, rust, ink-soft).
// 2D canvas only — no WebGL, no extra deps. Honors prefers-reduced-motion.

const COLORS = {
  cyan: '28, 110, 164', // var(--cyan) as rgb triplet
  rust: '194, 70, 31', // var(--rust)
  inkSoft: '42, 63, 85', // var(--ink-soft)
}

const NODE_LABELS = [
  'POS', 'INVENTORY', 'EMAIL', 'CRM', 'SHEETS',
  'STOCK', 'BRAIN', 'OPS', 'BOOKINGS',
]
const DIM_LABEL_POOL = [
  '240mm', '1.4s', '§07', '180mm', '0.6s', '320mm',
  '§02', '14d', '500mm', '24px', '§14',
]

export default function BlueprintCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let mobileScale = 1

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      mobileScale = width < 768 ? 0.5 : 1
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Re-seed node positions on resize so the graph stays distributed.
      seedNodes()
    }

    // --- Layer state -------------------------------------------------------
    let gridOffsetX = 0
    let gridOffsetY = 0
    let dimLines = [] // { x, y, length, axis: 'h'|'v', label, color, age, ttl }
    let dimSpawnTimer = 0
    let scanlineY = 0
    let nodes = [] // { x, y, label }
    let edges = [] // { a, b, drawn }  drawn 0..1
    let edgeSpawnTimer = 0
    let graphFadeOut = 0 // 0..1
    let graphResetTimer = 0

    function seedNodes() {
      nodes = []
      const count = 8
      const cols = 4
      const rows = 2
      const padX = width * 0.12
      const padY = height * 0.18
      const colW = (width - padX * 2) / (cols - 1)
      const rowH = (height - padY * 2) / (rows - 1)
      for (let i = 0; i < count; i++) {
        const c = i % cols
        const r = Math.floor(i / cols)
        const jitterX = (Math.random() - 0.5) * 60
        const jitterY = (Math.random() - 0.5) * 60
        nodes.push({
          x: padX + c * colW + jitterX,
          y: padY + r * rowH + jitterY,
          label: NODE_LABELS[i % NODE_LABELS.length],
        })
      }
      edges = []
      graphFadeOut = 0
      graphResetTimer = 0
    }

    function spawnDimLine() {
      const axis = Math.random() < 0.5 ? 'h' : 'v'
      const minLen = 120
      const maxLen = axis === 'h' ? Math.min(360, width * 0.35) : Math.min(220, height * 0.32)
      const length = minLen + Math.random() * (maxLen - minLen)
      const margin = 60
      const x = margin + Math.random() * (width - margin * 2 - (axis === 'h' ? length : 0))
      const y = margin + Math.random() * (height - margin * 2 - (axis === 'v' ? length : 0))
      dimLines.push({
        x, y, length, axis,
        label: DIM_LABEL_POOL[Math.floor(Math.random() * DIM_LABEL_POOL.length)],
        color: Math.random() < 0.18 ? COLORS.rust : COLORS.cyan,
        age: 0,
        ttl: 5.0, // seconds total: 0.8 draw + 3.0 dwell + 1.2 fade
      })
    }

    function spawnEdge() {
      // Pick a node that has < 2 edges, connect to its nearest unconnected neighbor.
      const degree = (i) => edges.filter((e) => e.a === i || e.b === i).length
      const candidates = nodes.map((_, i) => i).filter((i) => degree(i) < 3)
      if (candidates.length === 0) return false
      const a = candidates[Math.floor(Math.random() * candidates.length)]
      let bestB = -1
      let bestD = Infinity
      for (let b = 0; b < nodes.length; b++) {
        if (b === a) continue
        if (edges.some((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))) continue
        const dx = nodes[a].x - nodes[b].x
        const dy = nodes[a].y - nodes[b].y
        const d = dx * dx + dy * dy
        if (d < bestD) {
          bestD = d
          bestB = b
        }
      }
      if (bestB === -1) return false
      edges.push({ a, b: bestB, drawn: 0 })
      return true
    }

    // --- Draw helpers ------------------------------------------------------
    function drawGrid() {
      const step = 24
      const cellOpacity = 0.08 * mobileScale
      ctx.fillStyle = `rgba(${COLORS.cyan}, ${cellOpacity})`
      const ox = ((gridOffsetX % step) + step) % step
      const oy = ((gridOffsetY % step) + step) % step
      for (let y = -step; y < height + step; y += step) {
        for (let x = -step; x < width + step; x += step) {
          ctx.fillRect(x - ox, y - oy, 1, 1)
        }
      }
    }

    function drawDimLines() {
      ctx.font = '10px "JetBrains Mono", ui-monospace, Menlo, monospace'
      ctx.textBaseline = 'middle'
      for (const d of dimLines) {
        // Compute alpha across age phases
        let alpha = 0
        let drawProgress = 0
        if (d.age < 0.8) {
          drawProgress = d.age / 0.8
          alpha = drawProgress
        } else if (d.age < 0.8 + 3.0) {
          drawProgress = 1
          alpha = 1
        } else {
          drawProgress = 1
          alpha = Math.max(0, 1 - (d.age - 3.8) / 1.2)
        }
        const peakAlpha = 0.16 * mobileScale
        ctx.strokeStyle = `rgba(${d.color}, ${alpha * peakAlpha})`
        ctx.lineWidth = 1
        if (d.axis === 'h') {
          const len = d.length * drawProgress
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x + len, d.y)
          ctx.stroke()
          // tick marks at each end
          ctx.beginPath()
          ctx.moveTo(d.x, d.y - 4); ctx.lineTo(d.x, d.y + 4)
          ctx.moveTo(d.x + len, d.y - 4); ctx.lineTo(d.x + len, d.y + 4)
          ctx.stroke()
          if (drawProgress > 0.95) {
            ctx.fillStyle = `rgba(${d.color}, ${alpha * peakAlpha * 1.4})`
            ctx.textAlign = 'center'
            ctx.fillText(d.label, d.x + d.length / 2, d.y - 8)
          }
        } else {
          const len = d.length * drawProgress
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x, d.y + len)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(d.x - 4, d.y); ctx.lineTo(d.x + 4, d.y)
          ctx.moveTo(d.x - 4, d.y + len); ctx.lineTo(d.x + 4, d.y + len)
          ctx.stroke()
          if (drawProgress > 0.95) {
            ctx.save()
            ctx.translate(d.x + 8, d.y + d.length / 2)
            ctx.rotate(-Math.PI / 2)
            ctx.fillStyle = `rgba(${d.color}, ${alpha * peakAlpha * 1.4})`
            ctx.textAlign = 'center'
            ctx.fillText(d.label, 0, 0)
            ctx.restore()
          }
        }
      }
    }

    function drawNodeGraph() {
      const fade = 1 - graphFadeOut
      const baseAlpha = 0.18 * mobileScale * fade
      // edges
      ctx.lineWidth = 1
      for (const e of edges) {
        const a = nodes[e.a]
        const b = nodes[e.b]
        // Axis-aligned L-shaped polyline (drafting style): cardinal only.
        const midX = a.x + (b.x - a.x) * e.drawn
        const midY = a.y + (b.y - a.y) * e.drawn
        ctx.strokeStyle = `rgba(${COLORS.cyan}, ${baseAlpha * 0.7})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        // First leg horizontal, second leg vertical
        ctx.lineTo(midX, a.y)
        ctx.lineTo(midX, midY)
        ctx.stroke()
      }
      // nodes — small registration crosshairs
      ctx.strokeStyle = `rgba(${COLORS.cyan}, ${baseAlpha})`
      ctx.fillStyle = `rgba(${COLORS.cyan}, ${baseAlpha * 1.2})`
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        ctx.beginPath()
        ctx.moveTo(n.x - 6, n.y); ctx.lineTo(n.x + 6, n.y)
        ctx.moveTo(n.x, n.y - 6); ctx.lineTo(n.x, n.y + 6)
        ctx.stroke()
        // Label only on connected nodes
        const isConnected = edges.some((e) => e.a === i || e.b === i)
        if (isConnected) {
          ctx.font = '9px "JetBrains Mono", ui-monospace, Menlo, monospace'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText(n.label, n.x + 10, n.y + 1)
        }
      }
    }

    function drawScanline() {
      const alpha = 0.10 * mobileScale
      ctx.fillStyle = `rgba(${COLORS.cyan}, ${alpha})`
      ctx.fillRect(0, scanlineY, width, 1)
    }

    // --- Main loop ---------------------------------------------------------
    function drawFrame(dt) {
      ctx.clearRect(0, 0, width, height)
      drawGrid()
      drawDimLines()
      drawNodeGraph()
      drawScanline()
    }

    function tick(dt) {
      // Grid pan
      gridOffsetX += 5 * dt
      gridOffsetY += 3 * dt

      // Dim lines
      dimSpawnTimer -= dt
      if (dimSpawnTimer <= 0 && dimLines.length < 5) {
        spawnDimLine()
        dimSpawnTimer = 4 + Math.random() * 4
      }
      for (const d of dimLines) d.age += dt
      dimLines = dimLines.filter((d) => d.age < d.ttl)

      // Node graph
      if (graphFadeOut === 0) {
        edgeSpawnTimer -= dt
        if (edgeSpawnTimer <= 0) {
          const ok = spawnEdge()
          edgeSpawnTimer = ok ? 6 + Math.random() * 4 : 0
          if (!ok && edges.length >= nodes.length - 1) {
            graphFadeOut = 0.0001 // start fade
          }
        }
        for (const e of edges) e.drawn = Math.min(1, e.drawn + dt / 1.2)
      } else {
        graphFadeOut = Math.min(1, graphFadeOut + dt / 2.0)
        if (graphFadeOut >= 1) {
          graphResetTimer += dt
          if (graphResetTimer > 0.6) seedNodes()
        }
      }

      // Scanline
      scanlineY += (height / 20) * dt
      if (scanlineY > height) scanlineY = -1
    }

    // 30fps cap. dt is seconds since last frame.
    let last = performance.now()
    let rafId = 0
    const frameInterval = 1000 / 30

    function loop(now) {
      const elapsed = now - last
      if (elapsed >= frameInterval) {
        const dt = Math.min(0.1, elapsed / 1000)
        last = now - (elapsed % frameInterval)
        if (!document.hidden) {
          tick(dt)
          drawFrame(dt)
        }
      }
      rafId = requestAnimationFrame(loop)
    }

    function drawStaticFrame() {
      // Seed once, draw once. No animation.
      seedNodes()
      // Pre-populate a few edges and dim lines for visual interest
      for (let i = 0; i < 4; i++) spawnEdge()
      for (const e of edges) e.drawn = 1
      for (let i = 0; i < 3; i++) {
        spawnDimLine()
        dimLines[dimLines.length - 1].age = 1.0 // hold in dwell phase
      }
      drawFrame(0)
    }

    // 150ms debounce on resize per spec.
    let resizeTimer = 0
    function debouncedResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 150)
    }

    resize()
    window.addEventListener('resize', debouncedResize)

    if (reducedMotion) {
      drawStaticFrame()
    } else {
      seedNodes()
      rafId = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', debouncedResize)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="bp-canvas" />
}
