import { useEffect } from 'react'
import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
import ParticleBrainCanvas from '@/components/ParticleBrainCanvas.jsx'
import MiniOrbitBrain from '@/components/MiniOrbitBrain.jsx'
// eslint-disable-next-line no-unused-vars -- motion is used via JSX member access (<motion.div>, etc.)
import { motion, MotionConfig } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SectionTag, Plate } from '@/components/blueprint.jsx'

const CALENDLY_URL = 'https://calendly.com/blueprintit/15-ai-shop-os-discovery'
const openCalendly = () => window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')

function ShopOS() {
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Shop OS — AI Operating System Installed in 10 Days · Blueprint IT'

    // Update og:title and og:description meta tags if present
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc = document.querySelector('meta[property="og:description"]')
    const prevOgTitle = ogTitle?.getAttribute('content')
    const prevOgDesc = ogDesc?.getAttribute('content')
    ogTitle?.setAttribute('content', 'Shop OS — AI Operating System Installed in 10 Days · Blueprint IT')
    ogDesc?.setAttribute('content', 'Blueprint IT installs your Shop OS in 10 days — a Shop Brain wired into your stack, two proof automations, and a team that owns it on day one.')

    return () => {
      document.title = prevTitle
      if (prevOgTitle) ogTitle?.setAttribute('content', prevOgTitle)
      if (prevOgDesc) ogDesc?.setAttribute('content', prevOgDesc)
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="bp-grid bp-grain min-h-screen text-[color:var(--ink)] relative">
        <ParticleBrainCanvas />

        <SiteNav
          ctaLabel="Start install"
          onCtaClick={openCalendly}
          navItems={[
            { kind: 'link', label: 'Services', href: '/#services' },
            !import.meta.env.PROD && { kind: 'route', to: '/shop-os', label: 'Shop OS' },
            { kind: 'link', label: 'Studio', href: '/#about' },
            { kind: 'link', label: 'Case', href: '/#workflow' },
            { kind: 'link', label: 'Contact', href: '/#contact' },
          ].filter(Boolean)}
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
                    className="font-display mt-8 text-[clamp(2.08rem,6.4vw,5.76rem)] leading-[0.92] tracking-[-0.03em]"
                  >
                    Your{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">
                      Shop Operating System
                    </span>{' '}
                    —{' '}
                    <span className="font-display-italic text-[color:var(--rust)]">
                      Installed in 10 Days.
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.8 }}
                    className="mt-8 max-w-2xl text-lg md:text-xl leading-[1.55] text-[color:var(--ink-soft)]"
                  >
                    Stop being the answer to every question in your shop. Every quote
                    follow-up. Every client update. Every new hire question. Every job
                    handoff. Still all going through you? That&apos;s a systems problem,
                    not a staffing problem. Blueprint IT installs Shop OS in 10 days:
                    a brain for your business connected to the tools you use today.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-10 flex flex-wrap items-center gap-5"
                  >
                    <button onClick={openCalendly} className="btn-ink">
                      Start the 10-day install
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
                  <Plate accent="cyan" className="bg-[rgba(251,248,239,0.65)] backdrop-blur-[2px]">
                    <div className="label label-cyan mb-4">Spec sheet</div>
                    <dl className="divide-y divide-[color:var(--paper-line)] font-mono text-xs">
                      {[
                        ['Practice', 'AI Operating System'],
                        ['Duration', '10 days, kickoff to live'],
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
                    You and your team have the knowledge.{' '}
                    <span className="font-display-italic text-[color:var(--rust)]">
                      Your company needs a copy.
                    </span>
                  </h2>
                  <p className="mt-6 text-[color:var(--ink-soft)] leading-relaxed text-lg">
                    Your company already knows the answer. It&apos;s just buried — in
                    inboxes, Slack threads, Drive folders, CRM notes, and the heads of
                    the one or two people who were here before anyone wrote things down.
                    Every new project starts by re-discovering what&apos;s already in the
                    building.
                  </p>
                  <p className="mt-4 text-[color:var(--ink-soft)] leading-relaxed text-lg">
                    The businesses pulling ahead aren&apos;t the ones with more AI tools.
                    They&apos;re the ones who built shared institutional intelligence on
                    top of those tools — and let it compound.
                  </p>
                </div>

                <div className="md:col-span-7 md:col-start-6">
                  <Plate accent="cyan" className="bg-[color:var(--paper-2)]">
                    <div className="label label-cyan mb-4">Fig. 02-A · Your company&apos;s context, mapped</div>
                    <KnowledgeMosaic />
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] text-center">
                      Every project adds tiles. The map fills in — and compounds.
                    </p>
                  </Plate>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              §02 — Drawing № 03 · The Anatomy
          ==========================================================*/}
          <section id="shop-anatomy" className="relative bg-[color:var(--paper-2)]/60">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20">
                <div className="md:col-span-6">
                  <SectionTag id="02">Drawing № 03 · The Anatomy</SectionTag>
                  <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
                    The{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">anatomy</span>{' '}
                    of your AI Operating System.
                  </h2>
                </div>
                <div className="md:col-span-5 md:col-start-8 md:pt-8">
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                    Two deliverables, installed in 10 days. A Shop Brain that plugs into
                    your stack, and two proof automations running on top. Owned by you
                    on day one of handoff.
                  </p>
                </div>
              </div>

              {/* Orbit diagram */}
              <OrbitDiagram />

              {/* Two deliverable plates */}
              <div className="grid md:grid-cols-2 gap-8 mt-16 md:mt-20">
                <Plate accent="cyan" className="h-full">
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="font-display text-5xl leading-none">01</span>
                    <span className="label label-cyan">Deliverable</span>
                  </div>
                  <div className="label mb-3">context · queryable · operator-owned</div>
                  <h3 className="font-display text-[2rem] leading-[1.05] tracking-[-0.015em] mb-4">
                    Working Shop Brain
                  </h3>
                  <p className="text-[color:var(--ink-soft)] leading-relaxed mb-6">
                    Every AI interaction on your team reads from one centralized place:
                    customer history, SOPs, brand voice, commercial rules. The
                    institutional knowledge that lives in ten people&apos;s heads,
                    queryable by every person and every automation. Plugs into your
                    existing stack without replacing anything.
                  </p>
                  <div className="pt-5 border-t border-[color:var(--paper-line)]">
                    <div className="label label-cyan mb-3">What your team gets</div>
                    <ul className="space-y-2 mb-5">
                      {[
                        'One source of truth for every AI interaction',
                        'Auto-ingestion from calls, email, and docs',
                        'Connects to your CRM, calendar, and tools',
                      ].map((d) => (
                        <li key={d} className="flex items-center gap-3 font-mono text-[12px]">
                          <span className="inline-block h-1.5 w-4 bg-[color:var(--cyan)]" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="label mb-3">At handoff</div>
                    <ul className="space-y-2">
                      {[
                        'Operator trained to extend the Brain',
                        'System owned by your team, not ours',
                      ].map((d) => (
                        <li key={d} className="flex items-center gap-3 font-mono text-[12px]">
                          <span className="inline-block h-1.5 w-4 bg-[color:var(--ink-soft)]" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Plate>

                <Plate accent="rust" className="h-full">
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="font-display text-5xl leading-none">02</span>
                    <span className="label label-rust">Deliverable</span>
                  </div>
                  <div className="label mb-3">scheduled · autonomous · template for the rest</div>
                  <h3 className="font-display text-[2rem] leading-[1.05] tracking-[-0.015em] mb-4">
                    Two proof automations.
                  </h3>
                  <p className="text-[color:var(--ink-soft)] leading-relaxed mb-6">
                    End-to-end automations built on top of the Shop Brain in week two.
                    Picked from your highest-leverage repetitive workflows. They run on
                    real systems, unprompted, and they become the template your Operator
                    uses to build the next ten without us.
                  </p>
                  <div className="pt-5 border-t border-[color:var(--paper-line)]">
                    <div className="label label-rust mb-3">Example automations</div>
                    <ul className="space-y-2 mb-5">
                      {[
                        'Automated Lead Handling → Human-in-the-Loop → CRM Update + Follow-Up Tasks',
                        'Weekly ops digest auto-sent to leadership',
                        'Deal qualification and routing on autopilot',
                      ].map((d) => (
                        <li key={d} className="flex items-center gap-3 font-mono text-[12px]">
                          <span className="inline-block h-1.5 w-4 bg-[color:var(--rust)]" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="label mb-3">Why two</div>
                    <ul className="space-y-2">
                      {[
                        'One proves the Brain works on real data',
                        'One proves the pattern repeats',
                      ].map((d) => (
                        <li key={d} className="flex items-center gap-3 font-mono text-[12px]">
                          <span className="inline-block h-1.5 w-4 bg-[color:var(--ink-soft)]" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Plate>
              </div>

              {/* Seed Imports strip */}
              <div className="mt-12 border-t border-[color:var(--paper-line)] pt-8">
                <div className="flex items-baseline gap-4 mb-5">
                  <div className="label label-cyan">Seed Imports</div>
                  <div className="font-mono text-[11px] text-[color:var(--ink-mute)] uppercase tracking-[0.18em]">
                    one-time at onboarding
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    'Past Contracts',
                    'Email Archives',
                    'Call Library',
                    'Slack / Teams History',
                    'Spreadsheets & CSVs',
                    'PDF Library',
                  ].map((chip) => (
                    <div
                      key={chip}
                      className="border border-dashed border-[color:var(--ink-soft)] bg-[color:var(--paper)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-soft)]"
                    >
                      {chip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              §03 — Drawing № 04 · The 10 Days
          ==========================================================*/}
          <section id="shop-10-days" className="relative">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20">
                <div className="md:col-span-6">
                  <SectionTag id="03">Drawing № 04 · The 10 Days</SectionTag>
                  <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
                    Three phases. 10 Days.{' '}
                    <span className="font-display-italic text-[color:var(--rust)]">
                      One Handoff.
                    </span>
                  </h2>
                </div>
                <div className="md:col-span-5 md:col-start-8 md:pt-8">
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                    Every engagement runs the same playbook. By day 10, the system is
                    live, the proof automations are running, and your internal Operator
                    owns it without us in the room.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 items-stretch">
                {[
                  {
                    tag: 'Phase 01 · Days 1–3',
                    range: '01',
                    title: 'Discovery',
                    body: 'Live screen-share sessions. We watch how the business actually runs, not how the docs say it runs. Real workflows, real friction, real handoffs between tools and people.',
                    outputs: [
                      'Operational map grounded in observation',
                      'Two proof automations scoped and confirmed',
                    ],
                    accent: 'cyan',
                  },
                  {
                    tag: 'Phase 02 · Days 4–9',
                    range: '02',
                    title: 'Shop Brain Setup',
                    body: 'We build the Shop Brain: project structure, knowledge base, decision log, modular connectors. The substrate every future automation will run on.',
                    outputs: [
                      'Centralized context layer, populated and wired',
                      'Connector layer live with your stack',
                    ],
                    accent: 'cyan',
                  },
                  {
                    tag: 'Phase 03 · Day 10',
                    range: '03',
                    title: 'Proof + Handoff',
                    body: 'Two end-to-end automations shipped on top of the Shop Brain. Operator trained to grow and maintain the brain and introduced to the skills required to start building without us.',
                    outputs: [
                      'Two proof automations running on real data',
                      'System fully owned by your team',
                    ],
                    accent: 'rust',
                  },
                ].map((phase, i) => (
                  <motion.div
                    key={phase.range}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.7, delay: i * 0.12 }}
                    className="h-full"
                  >
                    <Plate accent={phase.accent} className="h-full flex flex-col">
                      <div className="flex items-baseline justify-between mb-6">
                        <span className="font-display text-5xl leading-none">{phase.range}</span>
                        <span className={`label ${phase.accent === 'rust' ? 'label-rust' : 'label-cyan'}`}>
                          {phase.tag}
                        </span>
                      </div>
                      <h3 className="font-display text-[2rem] leading-[1.05] tracking-[-0.015em] mb-4">
                        {phase.title}
                      </h3>
                      <p className="text-[color:var(--ink-soft)] leading-relaxed mb-6 flex-1">
                        {phase.body}
                      </p>
                      <div className="pt-5 border-t border-[color:var(--paper-line)]">
                        <div className={`label ${phase.accent === 'rust' ? 'label-rust' : 'label-cyan'} mb-3`}>
                          Output
                        </div>
                        <ul className="space-y-2">
                          {phase.outputs.map((o) => (
                            <li key={o} className="flex items-center gap-3 font-mono text-[12px]">
                              <span
                                className={`inline-block h-1.5 w-4 ${phase.accent === 'rust' ? 'bg-[color:var(--rust)]' : 'bg-[color:var(--cyan)]'}`}
                              />
                              <span>{o}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Plate>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* =========================================================
              §04 — Drawing № 05 · The Operator
          ==========================================================*/}
          <section id="shop-operator" className="relative bg-[color:var(--paper-2)]/60">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-10 md:gap-16 mb-14 md:mb-20">
                <div className="md:col-span-6">
                  <SectionTag id="04">Drawing № 05 · The Operator</SectionTag>
                  <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
                    Who runs Shop OS{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">
                      after we leave.
                    </span>
                  </h2>
                </div>
                <div className="md:col-span-6">
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                    Every successful implementation has one thing in common. An internal
                    owner who runs the Shop Brain after we leave and rallies the entire
                    team to assist with growing the brain.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {[
                  {
                    n: '01',
                    title: 'Maintains the Shop Brain',
                    body: 'Updates context as strategy shifts, products change, people join. The Shop Brain stays current, so every output stays accurate. Minutes a day, not hours.',
                  },
                  {
                    n: '02',
                    title: 'Ships New Automations',
                    body: 'Takes the patterns from the two proof builds and applies them to the next workflow. And the next. The Shop Brain compounds because the Operator keeps building.',
                  },
                  {
                    n: '03',
                    title: 'Onboards Teammates',
                    body: 'Shows teammates how the Shop Brain works on day one. Captures their ideas and includes them in the adoption.',
                  },
                  {
                    n: '04',
                    title: 'Internal Point of Contact',
                    body: 'When a teammate has an AI question, the Operator is the first stop. Not IT. Not the CEO. Real position, not a side gig.',
                  },
                ].map((op, i) => (
                  <motion.div
                    key={op.n}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="grid grid-cols-12 gap-4 md:gap-6 border-b border-[color:var(--paper-line)] pb-8 last:border-b-0 md:border-b-0 md:p-8 md:min-h-[300px] md:items-center md:bg-[color:var(--card)] md:border md:border-[color:var(--paper-line)]"
                  >
                    <div className="col-span-2">
                      <div className="font-display text-4xl leading-none">{op.n}</div>
                    </div>
                    <div className="col-span-10">
                      <h3 className="font-display text-2xl md:text-3xl leading-[1.1] tracking-[-0.015em]">
                        {op.title}
                      </h3>
                      <p className="mt-2 text-[color:var(--ink-soft)] leading-relaxed">
                        {op.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* =========================================================
              Final CTA — Drawing № 06 · Ready
          ==========================================================*/}
          <section id="shop-ready" className="relative">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-36 border-t border-[color:var(--ink)] text-center">
              <SectionTag id="05">Drawing № 06 · Ready</SectionTag>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.8 }}
                className="font-display mt-8 text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-[-0.03em]"
              >
                Install your{' '}
                <span className="font-display-italic text-[color:var(--rust)]">Shop OS.</span>
              </motion.h2>
              <p className="mt-8 mx-auto max-w-2xl text-lg md:text-xl text-[color:var(--ink-soft)] leading-relaxed">
                10 days from kickoff to a working system your team owns. One call to
                scope it. One handoff to run it.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4">
                <button onClick={openCalendly} className="btn-ink btn-rust">
                  Start the 10-day install
                  <ArrowUpRight size={14} strokeWidth={2.2} />
                </button>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                  Straight to a real call. No funnel. No email gauntlet.
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

function KnowledgeMosaic() {
  // A grid of tiles representing your company's institutional knowledge,
  // filled in by milestone. Compound growth is shown by accelerating tile
  // counts per phase (each milestone adds ~2× the previous), and each
  // milestone gets its own brand color so the layers of accumulated
  // context are visible as a layered map rather than as a curve.
  const VBW = 600
  const VBH = 320
  const padL = 14
  const padR = 14
  const padT = 16
  const padB = 60
  const innerW = VBW - padL - padR
  const innerH = VBH - padT - padB
  const COLS = 16
  const ROWS = 8
  const totalCells = COLS * ROWS // 128
  const cellW = innerW / COLS
  const cellH = innerH / ROWS
  const gap = 2

  // Cumulative tile counts at each milestone — each adds ~2× the prior.
  const milestones = [
    { label: 'Day 10', upto: 5,   color: 'var(--rust)' },
    { label: 'Mo 1',   upto: 15,  color: 'var(--gold)' },
    { label: 'Mo 3',   upto: 36,  color: 'var(--cyan-soft)' },
    { label: 'Mo 6',   upto: 70,  color: 'var(--cyan)' },
    { label: 'Yr 1',   upto: 128, color: 'var(--ink-soft)' },
  ]

  function milestoneFor(i) {
    for (let mi = 0; mi < milestones.length; mi++) {
      if (i < milestones[mi].upto) return mi
    }
    return milestones.length - 1
  }

  const cells = []
  for (let i = 0; i < totalCells; i++) {
    const row = Math.floor(i / COLS)
    const col = i % COLS
    const x = padL + col * cellW + gap / 2
    const y = padT + row * cellH + gap / 2
    const w = cellW - gap
    const h = cellH - gap
    const mIdx = milestoneFor(i)
    const fill = milestones[mIdx].color
    // Stagger reveal: each milestone block fades in together, with a tiny
    // sub-stagger within so the milestone "waves" across the grid.
    const milestoneStart = mIdx > 0 ? milestones[mIdx - 1].upto : 0
    const localProgress = (i - milestoneStart) / Math.max(1, milestones[mIdx].upto - milestoneStart)
    const delay = 0.3 + mIdx * 0.22 + localProgress * 0.12
    cells.push({ key: i, x, y, w, h, fill, delay })
  }

  // Legend layout — five color swatches with labels along the bottom.
  const legendY = VBH - 36
  const legendItemW = innerW / milestones.length

  return (
    <svg viewBox={`0 0 ${VBW} ${VBH}`} className="w-full h-auto">
      {/* Faint grid outline so unfilled cells (during animation) are visible */}
      {cells.map((c) => (
        <rect
          key={`bg-${c.key}`}
          x={c.x}
          y={c.y}
          width={c.w}
          height={c.h}
          fill="none"
          stroke="var(--paper-line)"
          strokeWidth="0.5"
          opacity="0.5"
        />
      ))}

      {/* Filled milestone cells (animated in by phase) */}
      {cells.map((c) => (
        <motion.rect
          key={c.key}
          x={c.x}
          y={c.y}
          width={c.w}
          height={c.h}
          fill={c.fill}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.92 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: c.delay }}
        />
      ))}

      {/* Legend strip */}
      {milestones.map((m, i) => {
        const cx = padL + i * legendItemW + legendItemW / 2
        return (
          <g key={m.label}>
            <rect
              x={cx - 36}
              y={legendY}
              width="10"
              height="10"
              fill={m.color}
              opacity="0.92"
            />
            <text
              x={cx - 22}
              y={legendY + 9}
              fontFamily="JetBrains Mono"
              fontSize="10"
              fill="var(--ink-soft)"
              textAnchor="start"
            >
              {m.label}
            </text>
          </g>
        )
      })}

      {/* Day 10 marker — first install tile color */}
      <text
        x={padL}
        y={legendY + 26}
        fontFamily="JetBrains Mono"
        fontSize="9"
        fill="var(--rust)"
        textTransform="uppercase"
      >
        Install → Day 10 handoff. From there, the company&apos;s context map compounds.
      </text>
    </svg>
  )
}

function OrbitDiagram() {
  // 10 chips arranged at 36° intervals on a ring around the brain.
  const chips = [
    'Email', 'Calls', 'Calendar', 'Docs', 'Telegram',
    'CRM', 'Sheets', 'Messaging', 'Contracts', 'Mozaik',
  ]
  const VBW = 800
  const VBH = 560
  const cx = VBW / 2
  const cy = VBH / 2
  const r = 220

  return (
    <>
      {/* Desktop orbit */}
      <div className="hidden md:block relative" style={{ aspectRatio: `${VBW} / ${VBH}` }}>
        <svg viewBox={`0 0 ${VBW} ${VBH}`} className="w-full h-auto block">
          {/* Orbit ring */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--paper-line)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          {/* Center card removed — replaced by MiniOrbitBrain overlay below. */}

          {/* Chips with connecting lines */}
          {chips.map((chip, i) => {
            const angle = (i / chips.length) * Math.PI * 2 - Math.PI / 2
            const x = cx + Math.cos(angle) * r
            const y = cy + Math.sin(angle) * r
            // Inner endpoint sits at the MiniOrbitBrain's silhouette radius
            // (~165 vbu in the 50%×70% brain area) so the chip connector
            // lines visually reach the brain instead of floating in space.
            const innerR = 165
            const ix = cx + Math.cos(angle) * innerR
            const iy = cy + Math.sin(angle) * innerR
            return (
              <motion.g
                key={chip}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              >
                {/* Connection line */}
                <line
                  x1={ix}
                  y1={iy}
                  x2={x}
                  y2={y}
                  stroke="var(--cyan)"
                  strokeWidth="1"
                  opacity="0.5"
                />
                {/* Chip background */}
                <rect
                  x={x - 50}
                  y={y - 14}
                  width="100"
                  height="28"
                  fill="var(--paper)"
                  stroke="var(--cyan)"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={y + 4}
                  fontFamily="JetBrains Mono"
                  fontSize="11"
                  letterSpacing="1.5"
                  fill="var(--cyan)"
                  textAnchor="middle"
                  style={{ textTransform: 'uppercase' }}
                >
                  {chip}
                </text>
              </motion.g>
            )
          })}
        </svg>

        {/* Independent polychrome brain at the orbit center. Larger area
            (50% × 70% of the viewBox) so the brain silhouette is big enough
            to read as a brain rather than a blob. Chip lines (innerR=150)
            terminate at the brain's silhouette edge. */}
        <div
          className="absolute pointer-events-none"
          style={{ left: '25%', right: '25%', top: '15%', bottom: '15%' }}
        >
          <MiniOrbitBrain className="w-full h-full" />
        </div>
      </div>

      {/* Mobile fallback — vertical stack. Keeps the original editorial
          plate (The Shop Brain / LIVE · CONNECTED) instead of the particle
          cluster — cleaner on small screens. */}
      <div className="md:hidden">
        <Plate accent="cyan" className="text-center mb-4">
          <div className="font-display italic text-2xl mb-1">The Shop Brain</div>
          <div className="label label-cyan">LIVE · CONNECTED</div>
        </Plate>
        <div className="grid grid-cols-2 gap-2">
          {chips.map((chip) => (
            <div
              key={chip}
              className="border border-[color:var(--cyan)] bg-[color:var(--paper)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--cyan)] text-center"
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ShopOS
