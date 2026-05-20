import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
import BlueprintCanvas from '@/components/BlueprintCanvas.jsx'
import { motion, MotionConfig } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SectionTag, Plate } from '@/components/blueprint.jsx'

const CALENDLY_URL = 'https://calendly.com/blueprintit/15-ai-shop-os-discovery'
const openCalendly = () => window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')

function ShopOS() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="bp-grid bp-grain min-h-screen text-[color:var(--ink)] relative">
        <BlueprintCanvas />

        <SiteNav
          ctaLabel="Start install"
          onCtaClick={openCalendly}
          navItems={[
            { kind: 'link', label: 'Services', href: '/#services' },
            { kind: 'route', to: '/shop-os', label: 'Shop OS' },
            { kind: 'link', label: 'Studio', href: '/#about' },
            { kind: 'link', label: 'Case', href: '/#workflow' },
            { kind: 'link', label: 'Contact', href: '/#contact' },
          ]}
        />

        <main className="relative z-[2]">
          {/* =========================================================
              HERO — Drawing № 01
          ==========================================================*/}
          <section id="shop-os-top" className="relative overflow-hidden">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-14 md:pt-24 pb-20 md:pb-32">
              <div className="grid md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-8">
                  <SectionTag id="00">Drawing № 01 · Introduction</SectionTag>

                  <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                    className="font-display mt-8 text-[clamp(2.6rem,8vw,7.2rem)] leading-[0.92] tracking-[-0.03em]"
                  >
                    An{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">AI</span>{' '}
                    operating system for your small business —{' '}
                    <span className="font-display-italic text-[color:var(--rust)]">
                      installed in 14 days.
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.8 }}
                    className="mt-8 max-w-2xl text-lg md:text-xl leading-[1.55] text-[color:var(--ink-soft)]"
                  >
                    Your team has ChatGPT. Your company has nothing. Blueprint IT installs
                    Shop OS in two weeks: a shared context layer wired into your stack,
                    two proof automations running on top, and a tuned-up team that owns
                    it on day one.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-10 flex flex-wrap items-center gap-5"
                  >
                    <button onClick={openCalendly} className="btn-ink">
                      Start the 14-day install
                      <ArrowRight size={14} strokeWidth={2.2} />
                    </button>
                    <a
                      href="#shop-anatomy"
                      className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] transition-colors underline-offset-[6px] hover:underline"
                    >
                      ↓ See what gets installed
                    </a>
                  </motion.div>
                </div>

                {/* Right spec plate */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="md:col-span-4"
                >
                  <Plate accent="cyan">
                    <div className="label label-cyan mb-4">Spec sheet</div>
                    <dl className="divide-y divide-[color:var(--paper-line)] font-mono text-xs">
                      {[
                        ['Practice', 'AI Operating System'],
                        ['Duration', '14 days, kickoff to live'],
                        ['Includes', 'Shop Brain + 2 automations'],
                        ['Stack', 'Plugs into yours'],
                        ['Handoff', 'Owned by your team'],
                        ['Discovery', '15 minutes, free'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-baseline justify-between py-2.5">
                          <dt className="uppercase tracking-[0.14em] text-[color:var(--ink-mute)]">
                            {k}
                          </dt>
                          <dd className="text-[color:var(--ink)] font-medium">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </Plate>
                </motion.div>
              </div>
            </div>
          </section>

          {/* =========================================================
              §01 — Drawing № 02 · The Gap
          ==========================================================*/}
          <section id="shop-gap" className="relative">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
                <div className="md:col-span-5">
                  <SectionTag id="01">Drawing № 02 · The Gap</SectionTag>
                  <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
                    Your team has AI.{' '}
                    <span className="font-display-italic text-[color:var(--rust)]">
                      Your company has scattered context.
                    </span>
                  </h2>
                  <p className="mt-6 text-[color:var(--ink-soft)] leading-relaxed text-lg">
                    Knowledge lives in inboxes, Slack threads, Drive folders, CRM notes,
                    and the heads of three people who joined before anyone wrote things
                    down. Every new project re-discovers what the company already knows.
                  </p>
                  <p className="mt-4 text-[color:var(--ink-soft)] leading-relaxed text-lg">
                    The businesses pulling ahead aren&apos;t the ones with more AI seats.
                    They&apos;re the ones who built shared institutional intelligence on
                    top of the AI — and let it compound.
                  </p>
                </div>

                <div className="md:col-span-7 md:col-start-6">
                  <Plate accent="cyan" className="bg-[color:var(--paper-2)]">
                    <div className="label label-cyan mb-4">Fig. 02-A · Intelligence accumulated over time</div>
                    <GrowthChart />
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] text-center">
                      Scattered context stays flat. Institutional intelligence compounds.
                    </p>
                  </Plate>
                </div>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter
          links={[
            { label: 'Services', href: '/#services' },
            { label: 'Studio', href: '/#about' },
            { label: 'Contact', href: '/#contact' },
          ]}
        />
      </div>
    </MotionConfig>
  )
}

function GrowthChart() {
  const VBW = 600
  const VBH = 320
  const padL = 50
  const padR = 24
  const padT = 24
  const padB = 50
  const innerW = VBW - padL - padR
  const innerH = VBH - padT - padB

  // X positions for tick labels
  const ticks = [
    { x: 0.0, label: 'Day 0' },
    { x: 0.18, label: 'Day 14' },
    { x: 0.34, label: 'Mo 1' },
    { x: 0.56, label: 'Mo 3' },
    { x: 0.78, label: 'Mo 6' },
    { x: 1.0, label: 'Yr 1' },
  ]
  // Y for institutional intelligence — compounds: y = e^(2.4x) - 1 normalized
  function instY(x) {
    const raw = Math.pow(Math.E, 2.4 * x) - 1
    const max = Math.pow(Math.E, 2.4) - 1
    return raw / max
  }
  // Y for scattered context — flat with small noise
  function scatY(x) {
    return 0.08 + 0.06 * Math.sin(x * 6)
  }

  // Build SVG paths
  const samples = 60
  const instPath = ['M']
  const scatPath = ['M']
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const px = padL + t * innerW
    const py1 = padT + innerH * (1 - instY(t))
    const py2 = padT + innerH * (1 - scatY(t))
    instPath.push(`${px.toFixed(1)},${py1.toFixed(1)}`)
    scatPath.push(`${px.toFixed(1)},${py2.toFixed(1)}`)
    if (i === 0) {
      instPath.push('L')
      scatPath.push('L')
    }
  }
  // Remove trailing "L"
  const instD = instPath.join(' ').replace(/L$/, '').trim()
  const scatD = scatPath.join(' ').replace(/L$/, '').trim()

  return (
    <svg viewBox={`0 0 ${VBW} ${VBH}`} className="w-full h-auto">
      {/* dotted grid background */}
      <defs>
        <pattern id="dotgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="rgba(28, 110, 164, 0.18)" />
        </pattern>
      </defs>
      <rect
        x={padL}
        y={padT}
        width={innerW}
        height={innerH}
        fill="url(#dotgrid)"
      />

      {/* Axes */}
      <line x1={padL} y1={padT + innerH} x2={padL + innerW} y2={padT + innerH} stroke="var(--ink)" strokeWidth="1" />
      <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke="var(--ink)" strokeWidth="1" />

      {/* Day 14 vertical guide (rust dashed) */}
      <line
        x1={padL + innerW * 0.18}
        y1={padT}
        x2={padL + innerW * 0.18}
        y2={padT + innerH}
        stroke="var(--rust)"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.7"
      />
      <text
        x={padL + innerW * 0.18 + 6}
        y={padT + 14}
        fontFamily="JetBrains Mono"
        fontSize="9"
        fill="var(--rust)"
        textTransform="uppercase"
      >
        Day 14 · handoff
      </text>

      {/* Scattered context curve (dashed, ink-soft) */}
      <motion.path
        d={scatD}
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.7 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />

      {/* Institutional intelligence curve (solid cyan, thicker) */}
      <motion.path
        d={instD}
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
      />

      {/* X-axis ticks */}
      {ticks.map((t) => (
        <g key={t.label}>
          <line
            x1={padL + t.x * innerW}
            y1={padT + innerH}
            x2={padL + t.x * innerW}
            y2={padT + innerH + 4}
            stroke="var(--ink-soft)"
            strokeWidth="1"
          />
          <text
            x={padL + t.x * innerW}
            y={padT + innerH + 18}
            fontFamily="JetBrains Mono"
            fontSize="9"
            fill="var(--ink-soft)"
            textAnchor="middle"
          >
            {t.label}
          </text>
        </g>
      ))}

      {/* Y-axis label */}
      <text
        x={14}
        y={padT + innerH / 2}
        fontFamily="JetBrains Mono"
        fontSize="9"
        fill="var(--ink-soft)"
        textAnchor="middle"
        transform={`rotate(-90 14 ${padT + innerH / 2})`}
      >
        Company intelligence accumulated
      </text>

      {/* Curve labels at right edge */}
      <text
        x={padL + innerW - 6}
        y={padT + innerH * (1 - instY(1)) - 8}
        fontFamily="JetBrains Mono"
        fontSize="10"
        fill="var(--cyan)"
        textAnchor="end"
      >
        With Shop OS
      </text>
      <text
        x={padL + innerW - 6}
        y={padT + innerH * (1 - scatY(1)) - 8}
        fontFamily="JetBrains Mono"
        fontSize="10"
        fill="var(--ink-soft)"
        textAnchor="end"
      >
        Scattered Context
      </text>
    </svg>
  )
}

export default ShopOS
