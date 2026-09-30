import { useEffect, useState } from 'react'
import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
import PurchaseSection from '@/components/PurchaseSection.jsx'
import ParticleBrainCanvas from '@/components/ParticleBrainCanvas.jsx'
import MiniOrbitBrain from '@/components/MiniOrbitBrain.jsx'
import { motion, MotionConfig } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SectionTag, Plate } from '@/components/blueprint.jsx'

const scrollToPurchase = () => {
  document.getElementById('purchase')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const CALENDLY_URL = 'https://calendly.com/blueprintit/15-ai-shop-os-discovery'
const openCalendly = () => window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')

function BlueprintOS() {
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Blueprint OS · AI Operating System · Tailored For Your Business · Blueprint IT'

    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc = document.querySelector('meta[property="og:description"]')
    const prevOgTitle = ogTitle?.getAttribute('content')
    const prevOgDesc = ogDesc?.getAttribute('content')
    ogTitle?.setAttribute('content', 'Blueprint OS · AI Operating System · Tailored For Your Business · Blueprint IT')
    ogDesc?.setAttribute('content', 'A living Shop Brain for your business. One hour of guided setup, $2,000 one time, yours from day one.')

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
          ctaLabel="Book a Demo"
          onCtaClick={openCalendly}
          navItems={[
            { kind: 'link', label: 'Services', href: '/#services' },
            { kind: 'route', to: '/products', label: 'Products' },
            { kind: 'route', to: '/blueprint-os', label: 'Blueprint OS' },
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
                    className="font-display mt-8 text-[clamp(1.3rem,3.85vw,3.43rem)] leading-[0.92] tracking-[-0.03em]"
                  >
                    The{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">
                      brain
                    </span>{' '}
                    your business{' '}
                    <span className="font-display-italic text-[color:var(--rust)]">
                      runs on.
                    </span>
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.8 }}
                    className="mt-8 max-w-2xl text-[18.5px] md:text-[20.1px] leading-[1.55] text-[color:var(--ink-soft)]"
                  >
                    <p>
                      AI is only as useful as what it knows about your shop.
                      Today it knows very little. Every prompt essentially
                      starts from zero, and every real answer still routes
                      through you.
                    </p>
                    <p className="mt-5">
                      Blueprint OS is the Shop Brain for your business. It turns what
                      you and your team know &mdash; customers, quotes, SOPs, how
                      you actually do things &mdash; into a living knowledge base
                      your crew can ask directly, and that every automation,
                      agent, and AI tool you add builds on top of.
                    </p>
                    <p className="mt-5 text-[color:var(--ink)]">
                      Build the brain first. Everything else compounds on it.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-10 flex flex-wrap items-center gap-5"
                  >
                    <div className="w-full font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                      One hour of guided setup · Yours from day one
                    </div>
                    <button onClick={scrollToPurchase} className="btn-ink btn-rust">
                      Get Blueprint OS
                      <ArrowRight size={14} strokeWidth={2.2} />
                    </button>
                    <a
                      href="#whats-in-the-box"
                      className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] transition-colors underline-offset-[6px] hover:underline"
                    >
                      ↓ See what&apos;s in the box
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
                        ['Format', 'Guided setup · Done With You'],
                        ['Deliverable', 'Shop Brain Foundation'],
                        ['Skills bundled', '28'],
                        ['Onboarding', '30 min setup + 30 min training'],
                        ['Ownership', 'Yours from day one'],
                        ['Price', '$2,000'],
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
                  <h2 className="font-display text-4xl md:text-5xl leading-[0.95] mt-6 tracking-[-0.02em]">
                    Everything your team knows,{' '}
                    <span className="font-display-italic text-[color:var(--rust)]">
                      structured for AI.
                    </span>
                  </h2>
                  <p className="mt-6 text-[color:var(--ink-soft)] leading-relaxed text-lg">
                    Without your shop&apos;s context, AI is guessing. Blueprint OS
                    builds that context in, so every answer is grounded in how
                    your business actually runs.
                  </p>
                  <p className="mt-4 text-[color:var(--ink-soft)] leading-relaxed text-lg">
                    The answers already exist inside your business — scattered
                    across inboxes, spreadsheets, and the heads of the few
                    people who know how things work. They&apos;re just nowhere
                    you can ask.
                  </p>
                  <p className="mt-4 text-[color:var(--ink-soft)] leading-relaxed text-lg">
                    Every business will use AI in the future. The advantage
                    will go to the businesses whose AI knows their business.
                  </p>
                </div>

                <div className="md:col-span-7 md:col-start-6">
                  <Plate accent="cyan" className="bg-[color:var(--paper-2)]">
                    <div className="label label-cyan mb-4">Fig. 02-A · Your Shop&apos;s Knowledge, Organized for AI</div>
                    <ContextConvergence />
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] text-center">
                      The answers already exist. Blueprint OS gives them structure — and gives your team a place to ask.
                    </p>
                  </Plate>
                </div>
              </div>

              {/* Why Build Blueprint OS Now callout */}
              <div className="mt-16 md:mt-20">
                <Plate accent="rust">
                  <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
                    <div className="md:col-span-4">
                      <div className="label label-rust mb-3">Drawing № 02-B · Timing</div>
                      <h3 className="font-display text-3xl md:text-4xl leading-[1.0] tracking-[-0.015em]">
                        Why Build Blueprint OS{' '}
                        <span className="font-display-italic text-[color:var(--rust)]">Now?</span>
                      </h3>
                      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                        The Brain compounds. Start the clock early.
                      </p>
                    </div>
                    <div className="md:col-span-8">
                      <p className="text-[color:var(--ink-soft)] leading-relaxed mb-5">
                        The Brain starts empty. Context flows in over time —
                        every quote, meeting, and walk-through — and there is
                        no install button for institutional memory. Your
                        processes need the same runway: written down, used,
                        refined, until the system answers questions your team
                        used to walk across the shop to ask. There is no
                        shortcut to compounding. The only variable is when you
                        start the clock.
                      </p>
                      <div className="pt-5 border-t border-[color:var(--paper-line)]">
                        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[color:var(--ink)] leading-relaxed">
                          ↳ Every week you wait is a week of context that doesn&apos;t get captured, processes that don&apos;t get encoded, and twenty-minute answers that stay twenty minutes.
                        </p>
                      </div>
                    </div>
                  </div>
                </Plate>
              </div>

              {/* Category validation callout */}
              <div className="mt-8">
                <Plate accent="cyan">
                  <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
                    <div className="md:col-span-4">
                      <div className="label label-cyan mb-3">Drawing № 02-C · Proof of category</div>
                      <h3 className="font-display text-3xl md:text-4xl leading-[1.0] tracking-[-0.015em]">
                        Fortune 500s are{' '}
                        <span className="font-display-italic text-[color:var(--cyan)]">building this.</span>
                      </h3>
                    </div>
                    <div className="md:col-span-8">
                      <p className="text-[color:var(--ink-soft)] leading-relaxed mb-5">
                        The biggest companies in the world are paying enterprise
                        AI-transformation platforms to build exactly this: a
                        &ldquo;Company Brain&rdquo; that maps how their people
                        actually work, so AI can work alongside them. Same
                        thesis.
                      </p>
                      <div className="pt-5 border-t border-[color:var(--paper-line)]">
                        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[color:var(--ink)] leading-relaxed">
                          ↳ Blueprint OS is the same foundation, sized and priced for your shop. One hour. $2,000. Yours from day one.
                        </p>
                      </div>
                    </div>
                  </div>
                </Plate>
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
                  <h2 className="font-display text-4xl md:text-5xl leading-[0.95] mt-6 tracking-[-0.02em]">
                    The{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">anatomy</span>{' '}
                    of your AI Operating System.
                  </h2>
                </div>
                <div className="md:col-span-5 md:col-start-8 md:pt-8">
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                    One deliverable: the Shop Brain Foundation. An Obsidian vault that
                    holds your business context, 28 pre-wired skills that act on it,
                    and a custom chat your team can use locally. All running on
                    your machine, on your existing Claude Code subscription.
                  </p>
                </div>
              </div>

              {/* Orbit diagram */}
              <OrbitDiagram />

              {/* Deliverable plate */}
              <div className="mt-16 md:mt-20">
                <Plate accent="cyan">
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="font-display text-5xl leading-none">01</span>
                    <span className="label label-cyan">Deliverable</span>
                  </div>
                  <div className="label mb-3">context · queryable · operator-owned</div>
                  <h3 className="font-display text-[2rem] leading-[1.05] tracking-[-0.015em] mb-4">
                    Shop Brain Foundation
                  </h3>
                  <p className="text-[color:var(--ink-soft)] leading-relaxed mb-4">
                    Blueprint OS organizes your scattered knowledge —
                    customer history, SOPs, brand voice, internal policies —
                    into one centralized Brain, readable by every person on
                    your team and assists with every automation. You choose
                    what knowledge to provide it.
                  </p>
                  <p className="text-[color:var(--ink-soft)] leading-relaxed mb-6">
                    Your team uses it through Blueprint OS Chat, running locally on
                    the shop computer. Ask anything, get answers grounded in
                    how your business actually runs. Every conversation saves
                    back automatically, so the Brain gets smarter every day.
                  </p>
                  <div className="pt-5 border-t border-[color:var(--paper-line)]">
                    <div className="label label-cyan mb-3">What your team gets</div>
                    <ul className="space-y-2 mb-5">
                      {[
                        'One source of truth for every AI interaction',
                        'Custom chat your team uses locally at the shop computer. Employees ask, they can’t break anything.',
                        'Runs on your existing Claude Code subscription. No API keys, no per-seat bills.',
                      ].map((d) => (
                        <li key={d} className="flex items-center gap-3 font-mono text-[12px]">
                          <span className="inline-block h-1.5 w-4 bg-[color:var(--cyan)]" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="label mb-3">From day one</div>
                    <ul className="space-y-2">
                      {[
                        'System owned by your team, not ours',
                        'Extend and grow it yourself, indefinitely',
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

              {/* Skills bundled plate */}
              <div className="mt-8">
                <Plate accent="cyan">
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="font-display text-5xl leading-none">02</span>
                    <span className="label label-cyan">Skills bundled</span>
                  </div>
                  <div className="label mb-3">pre-wired · zero config · one install</div>
                  <h3 className="font-display text-[2rem] leading-[1.05] tracking-[-0.015em] mb-4">
                    Twenty-eight Foundation Skills
                  </h3>
                  <p className="text-[color:var(--ink-soft)] leading-relaxed mb-6">
                    Twenty-eight skills, wired at install. The six below run
                    your shop directly. The other twenty-two work underneath
                    them, so the Brain can plan, research, integrate, and
                    check its own work.
                  </p>
                  <div className="pt-5 border-t border-[color:var(--paper-line)]">
                    <div className="label label-cyan mb-4">Primary skills · run these directly</div>
                    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                      {[
                        ['/bp-setup', 'Onboarding interview that personalizes your vault with shop name, owner, key staff, services, and daily routines.'],
                        ['/bp-digest', 'Reads PDFs, Excel spreadsheets, Word docs, images, and voice memos. Routes each file to the right vault folder with a structured summary — no manual sorting needed.'],
                        ['/assistant', 'Everyday vault helper for note creation, task tracking, and daily updates.'],
                        ['/bp-operator', 'Schedules recurring routines like Monday briefings, customer follow-up sweeps, and inbox triage.'],
                        ['/bp-optimizer', "Run it weekly. Surfaces what's drifting, what's broken, and what to clean up first."],
                        ['/bp-evolver', "Runs in the background. As your vault grows, it spots patterns and connections you'd miss reading note by note."],
                      ].map(([cmd, desc]) => (
                        <li key={cmd} className="flex items-start gap-3">
                          <span className="inline-block h-1.5 w-4 mt-2.5 bg-[color:var(--cyan)] flex-shrink-0" />
                          <div className="leading-relaxed">
                            <span className="font-mono text-[12px] text-[color:var(--ink)] font-semibold">{cmd}</span>
                            <span className="text-[color:var(--ink-soft)] text-[13px] block mt-1">{desc}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-5 border-t border-[color:var(--paper-line)]">
                      <div className="label mb-3">Plus twenty-two more · running underneath</div>
                      <p className="text-[color:var(--ink-soft)] leading-relaxed text-[14px] mb-4">
                        The Brain calls these automatically. You&apos;ll never run
                        them by name — you&apos;ll feel them every time it
                        plans a multi-step task, audits its own work, or asks
                        the right question before acting.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'brainstorming',
                          'multi-step planning',
                          'self-verification',
                          'fact-checking',
                          'structured research',
                          'web research',
                          'voice transcription',
                          'file auto-routing',
                          'decision frameworks',
                          'workflow automation',
                          'custom integrations',
                          'external app access',
                          'parallel task execution',
                          'systematic troubleshooting',
                          'checkpoint reviews',
                          'format enforcement',
                          'meeting summaries',
                          'context capture',
                          'quality audits',
                          'task delegation',
                          'documentation drafting',
                          'knowledge upkeep',
                        ].map((s) => (
                          <span
                            key={s}
                            className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[color:var(--ink-soft)] border border-[color:var(--paper-line)] bg-[color:var(--paper)] px-2.5 py-1"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Plate>
              </div>

              {/* Seed Imports strip */}
              <div className="mt-12 border-t border-[color:var(--paper-line)] pt-8">
                <div className="flex items-baseline gap-4 mb-5">
                  <div className="label label-cyan">Seed Imports</div>
                  <div className="font-mono text-[11px] text-[color:var(--ink-mute)] uppercase tracking-[0.18em]">
                    one-time at setup
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    'Past Quotes',
                    'Email Threads',
                    'Voice Memos',
                    'Shared Drives',
                    'Spreadsheets',
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
              §03 — Drawing № 04 · How To Run Blueprint OS
          ==========================================================*/}
          <section id="shop-operator" className="relative bg-[color:var(--paper-2)]/60">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-10 md:gap-16 mb-14 md:mb-20">
                <div className="md:col-span-6">
                  <SectionTag id="03">Drawing № 04 · The Journey</SectionTag>
                  <h2 className="font-display text-4xl md:text-5xl leading-[0.95] mt-6 tracking-[-0.02em]">
                    Seed. Ask. Automate.{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">
                      Compound.
                    </span>
                  </h2>
                </div>
                <div className="md:col-span-6">
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                    One hour of guided setup with us gets you live. From there,
                    four moves turn a folder of scattered files into the brain
                    your shop runs on.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {[
                  {
                    n: '01',
                    title: 'Seed the Brain',
                    body: 'Two 30-minute screen shares with us — setup, then training — and your Brain is live on your machine. Then you feed it: drop past quotes, email threads, voice memos, and SOPs into the Raw inbox, and /bp-digest files each one where it belongs. The more you seed, the smarter every answer.',
                  },
                  {
                    n: '02',
                    title: 'Ask it anything',
                    body: 'Double-click the Blueprint OS Chat icon and your custom chat opens locally in your browser. Anyone in the shop can ask — what you quoted last spring, how that job was run, what the SOP actually says — and get answers grounded in your business, not the internet’s.',
                  },
                  {
                    n: '03',
                    title: 'Automate the routine',
                    body: 'Use /bp-operator to put recurring work on a schedule: Monday-morning briefings, customer follow-up sweeps, inbox triage, the weekly brief. Set them once, they run on their own.',
                  },
                  {
                    n: '04',
                    title: 'Let it compound',
                    body: 'Every conversation saves back to the vault. Every file adds context. /bp-optimizer keeps it healthy, and /bp-evolver spots patterns you’d miss. The Brain at month six answers questions the day-one Brain couldn’t.',
                  },
                ].map((step, i) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="grid grid-cols-12 gap-4 md:gap-6 border-b border-[color:var(--paper-line)] pb-8 last:border-b-0 md:border-b-0 md:p-8 md:min-h-[300px] md:items-center md:bg-[color:var(--card)] md:border md:border-[color:var(--paper-line)]"
                  >
                    <div className="col-span-2">
                      <div className="font-display text-4xl leading-none">{step.n}</div>
                    </div>
                    <div className="col-span-10">
                      <h3 className="font-display text-2xl md:text-3xl leading-[1.1] tracking-[-0.015em]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[color:var(--ink-soft)] leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* =========================================================
              §04 — Drawing № 05 · What's in the box
          ==========================================================*/}
          <section id="whats-in-the-box" className="relative">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20">
                <div className="md:col-span-6">
                  <SectionTag id="04">Drawing № 05 · What&apos;s in the box</SectionTag>
                  <h2 className="font-display text-4xl md:text-5xl leading-[0.95] mt-6 tracking-[-0.02em]">
                    One hour.{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">
                      Everything you need.
                    </span>
                  </h2>
                </div>
                <div className="md:col-span-5 md:col-start-8 md:pt-8">
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                    Blueprint OS Foundation is a one-time purchase. Setup session,
                    training session, license, twenty-eight pre-wired skills, and
                    the custom chat your team can use locally.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <Plate accent="cyan">
                  <div className="label label-cyan mb-3">Setup, training &amp; license</div>
                  <h3 className="font-display text-2xl leading-[1.1] tracking-[-0.015em] mb-4">
                    One hour with us. Your machine.
                  </h3>
                  <ul className="space-y-2 font-mono text-[12px]">
                    {[
                      '30-minute setup session, Mac or Windows',
                      '30-minute training session for you and your team',
                      'License key delivered by email',
                      'Double-clickable chat launcher',
                    ].map((d) => (
                      <li key={d} className="flex items-start gap-3">
                        <span className="inline-block h-1.5 w-4 mt-2 bg-[color:var(--cyan)]" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </Plate>

                <Plate accent="cyan">
                  <div className="label label-cyan mb-3">28 skills, wired and ready</div>
                  <h3 className="font-display text-2xl leading-[1.1] tracking-[-0.015em] mb-4">
                    Bundled at install.
                  </h3>
                  <ul className="space-y-2 font-mono text-[12px]">
                    {[
                      '/assistant for everyday vault work',
                      '/bp-operator for scheduled routines',
                      '/bp-digest for inbox processing',
                      '/bp-optimizer for vault health',
                      'Plus 24 more: transcription, file organization, decision toolkit, MCP builder',
                    ].map((d) => (
                      <li key={d} className="flex items-start gap-3">
                        <span className="inline-block h-1.5 w-4 mt-2 bg-[color:var(--cyan)]" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </Plate>

                <Plate accent="cyan">
                  <div className="label label-cyan mb-3">Yours, forever</div>
                  <h3 className="font-display text-2xl leading-[1.1] tracking-[-0.015em] mb-4">
                    One time. No subscription.
                  </h3>
                  <ul className="space-y-2 font-mono text-[12px]">
                    {[
                      'One-time $2,000. No monthly bill from us.',
                      'Runs on your existing Claude Code subscription',
                      'Data in plain markdown in your own cloud',
                    ].map((d) => (
                      <li key={d} className="flex items-start gap-3">
                        <span className="inline-block h-1.5 w-4 mt-2 bg-[color:var(--cyan)]" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </Plate>
              </div>

            </div>
          </section>

          {/* =========================================================
              §05 — Drawing № 06 · Objections
          ==========================================================*/}
          <section id="shop-objections" className="relative bg-[color:var(--paper-2)]/60">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20">
                <div className="md:col-span-6">
                  <SectionTag id="05">Drawing № 06 · Honest answers</SectionTag>
                  <h2 className="font-display text-4xl md:text-5xl leading-[0.95] mt-6 tracking-[-0.02em]">
                    The three questions{' '}
                    <span className="font-display-italic text-[color:var(--rust)]">
                      every operator asks.
                    </span>
                  </h2>
                </div>
                <div className="md:col-span-5 md:col-start-8 md:pt-8">
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                    We&apos;ve heard them on every call. The honest answers are
                    below.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    q: 'I’m not technical. Is this going to be over my head?',
                    a: 'You do not have to do the setup alone. We can set it up with you on a screen share, then train your team on running it. You don’t need to know what a terminal is.',
                  },
                  {
                    q: 'What does it cost per month?',
                    a: 'Nothing from Blueprint IT. Blueprint OS runs on your existing Claude subscription — Claude Pro ($20/month) is plenty to start. Upgrade to Claude Max ($100/month) only if daily use outgrows it.',
                  },
                  {
                    q: 'What if Blueprint IT disappears?',
                    a: 'Your vault, the installer, the skills, and the chat are all yours after install. Your operating system doesn’t depend on us being around.',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.q}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <Plate accent="cyan" className="h-full">
                      <div className="label label-cyan mb-3">Question {String(i + 1).padStart(2, '0')}</div>
                      <h3 className="font-display text-xl md:text-2xl leading-[1.15] tracking-[-0.015em] mb-4">
                        {item.q}
                      </h3>
                      <p className="text-[color:var(--ink-soft)] leading-relaxed text-[15px]">
                        {item.a}
                      </p>
                    </Plate>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* =========================================================
              Who's behind this
          ==========================================================*/}
          <section id="shop-founder" className="relative">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-20 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-3">
                  <div className="label label-cyan">Who&apos;s behind this</div>
                </div>
                <div className="md:col-span-9 space-y-5 max-w-3xl">
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                    Blueprint OS was built by{' '}
                    <span className="text-[color:var(--ink)] font-medium">
                      Glenn Chua
                    </span>{' '}
                    at Blueprint IT, developed from inside the trade community
                    it serves.
                  </p>
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                    He owns and operates Obsessed Closets in Wake Forest,
                    North Carolina, providing custom closet design, fabrication,
                    and installation. His background bridges the shop floor and
                    the server rack: years at Verizon Managed Services and
                    Cisco Systems gave him the technical foundation he later
                    turned inward, automating his own operations at Obsessed
                    Closets. What started as building tools to run his own shop
                    better became Blueprint IT, a consultancy helping other
                    businesses integrate technology and AI into their
                    day-to-day operations. He now consults and develops for
                    shops ranging from one-person operations to thirty-five-person
                    teams.
                  </p>
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                    Blueprint OS exists because every business needs a foundational
                    knowledge base, your custom Shop Operating System, to
                    capture and leverage everything currently trapped in
                    inboxes, scattered files, and the heads of veteran
                    employees. Whatever tools you run today and whatever AI
                    breakthrough lands tomorrow, none of it compounds without a
                    well-organized Blueprint OS underneath. It&apos;s the foundation
                    that truly makes AI useful in your business.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              Final CTA — Drawing № 07 · Ready
          ==========================================================*/}
          <section id="shop-ready" className="relative">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-36 border-t border-[color:var(--ink)] text-center">
              <SectionTag id="06">Drawing № 07 · Ready</SectionTag>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.8 }}
                className="font-display mt-8 text-[clamp(2rem,5vw,4rem)] leading-[0.92] tracking-[-0.03em]"
              >
                Get your{' '}
                <span className="font-display-italic text-[color:var(--rust)]">Blueprint OS.</span>
              </motion.h2>
              <p className="mt-8 mx-auto max-w-2xl text-lg md:text-xl text-[color:var(--ink-soft)] leading-relaxed">
                One hour. $2,000. A Foundation Shop Brain your team owns from day one.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4">
                <button onClick={openCalendly} className="btn-ink btn-cyan">
                  Book a Demo
                  <ArrowUpRight size={14} strokeWidth={2.2} />
                </button>
                <button onClick={scrollToPurchase} className="btn-ink btn-rust">
                  Get Blueprint OS · $2,000
                  <ArrowUpRight size={14} strokeWidth={2.2} />
                </button>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                  Setup + training included. Lifetime license. Yours from day one.
                </div>
              </div>

              {/* Trust strip */}
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {[
                  'Runs locally on your machine',
                  'Your data · plain markdown',
                  'No per-seat fees',
                  'Doesn’t depend on us existing',
                ].map((t) => (
                  <div
                    key={t}
                    className="border border-[color:var(--paper-line)] bg-[color:var(--paper)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-soft)]"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <PurchaseSection />
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

// iOS/iPadOS detection. Every iPad browser (Chrome and Firefox included) is
// WebKit under the hood, and Framer Motion's `whileInView` reveal never fires
// for this figure's SVG children there — leaving all 40+ elements stuck at
// their `initial` opacity 0, i.e. a blank panel. On those devices we skip
// Framer Motion entirely and render the finished frame as a static graphic.
// iPadOS 13+ reports itself as "MacIntel", hence the maxTouchPoints check.
function isIOSDevice() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod/.test(ua)) return true
  return navigator.platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1
}

function ContextConvergence() {
  // Resolved once, before first paint, so the static branch never flashes.
  const [isStatic] = useState(isIOSDevice)

  const NODE = { x: 337, y: 170 }
  const HUB_IN = { x: 318, y: 170 }
  const HUB_OUT = { x: 356, y: 170 }
  const viewport = { once: true, amount: 0.15 }

  // Static mode swaps every motion.* element for its plain SVG tag and drops
  // the animation props, so the figure paints in its completed state.
  const T = isStatic ? 'text' : motion.text
  const L = isStatic ? 'line' : motion.line
  const G = isStatic ? 'g' : motion.g
  const R = isStatic ? 'rect' : motion.rect
  const reveal = (initial, whileInView, transition) =>
    isStatic ? {} : { initial, whileInView, viewport, transition }

  const chips = [
    { label: 'EMAIL THREADS', x: 62, y: 58, w: 116, rot: -7 },
    { label: 'QUOTE #1042', x: 38, y: 118, w: 104, rot: 5 },
    { label: 'SPREADSHEET', x: 153, y: 98, w: 104, rot: -4 },
    { label: 'VOICE MEMO', x: 96, y: 173, w: 108, rot: 8 },
    { label: 'SOP (DRAFT)', x: 46, y: 228, w: 108, rot: -9 },
    { label: 'JOB PHOTOS', x: 157, y: 243, w: 116, rot: 4 },
    { label: 'IN DAVE’S HEAD', x: 104, y: 278, w: 132, rot: -5, rust: true },
  ].map((c) => ({ ...c, cx: c.x + c.w / 2, cy: c.y + 11 }))

  const rows = [
    { label: 'CUSTOMERS', y: 72, count: 6 },
    { label: 'QUOTES', y: 142, count: 5 },
    { label: 'SOPS', y: 212, count: 4 },
    { label: 'DECISIONS', y: 282, count: 3 },
  ]
  const tileOpacity = [1, 0.85, 0.7, 0.55, 0.4, 0.25]

  return (
    <div className="relative w-full" style={{ aspectRatio: '660 / 340' }}>
      <svg viewBox="0 0 660 340" className="w-full h-auto block">
        {/* Column headers */}
        <T
          x="20" y="26" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="2"
          fill="var(--ink-mute)"
          {...reveal({ opacity: 0 }, { opacity: 1 }, { duration: 0.5 })}
        >
          TODAY · SCATTERED
        </T>
        <T
          x="640" y="26" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="2"
          fill="var(--cyan)" textAnchor="end"
          {...reveal({ opacity: 0 }, { opacity: 1 }, { duration: 0.5, delay: 1.5 })}
        >
          WITH BLUEPRINT OS · ANSWERS
        </T>

        {/* Dashed convergence lines: scattered → node */}
        {chips.map((c, i) => (
          <L
            key={`in-${c.label}`}
            x1={c.cx} y1={c.cy} x2={HUB_IN.x} y2={HUB_IN.y}
            stroke="var(--paper-line)" strokeWidth="1" strokeDasharray="3 3"
            {...reveal(
              { pathLength: 0, opacity: 0 },
              { pathLength: 1, opacity: 1 },
              { duration: 0.45, delay: 0.7 + i * 0.06, ease: 'easeOut' }
            )}
          />
        ))}

        {/* Cyan fan-out lines: node → rows */}
        {rows.map((r, i) => (
          <L
            key={`out-${r.label}`}
            x1={HUB_OUT.x} y1={HUB_OUT.y} x2="420" y2={r.y + 6}
            stroke="var(--cyan)" strokeWidth="1.2"
            {...reveal(
              { pathLength: 0, opacity: 0 },
              { pathLength: 1, opacity: 1 },
              { duration: 0.4, delay: 1.35 + i * 0.07, ease: 'easeOut' }
            )}
          />
        ))}

        {/* Scattered chips */}
        {chips.map((c, i) => (
          <G
            key={c.label}
            {...reveal(
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0 },
              { duration: 0.5, delay: 0.1 + i * 0.08 }
            )}
          >
            <g transform={`rotate(${c.rot} ${c.cx} ${c.cy})`}>
              <rect
                x={c.x} y={c.y} width={c.w} height="22"
                fill="var(--paper)"
                stroke={c.rust ? 'var(--rust)' : 'var(--ink-mute)'}
              />
              <text
                x={c.cx} y={c.cy + 3.5} textAnchor="middle"
                fontFamily="JetBrains Mono" fontSize="9"
                fill={c.rust ? 'var(--rust)' : 'var(--ink-soft)'}
              >
                {c.label}
              </text>
            </g>
          </G>
        ))}

        {/* Blueprint OS node */}
        <G {...reveal({ opacity: 0 }, { opacity: 1 }, { duration: 0.5, delay: 1.1 })}>
          <circle cx={NODE.x} cy={NODE.y} r="24" fill="var(--card)" stroke="var(--rust)" strokeWidth="1.5" />
          <circle cx={NODE.x} cy={NODE.y} r="17" fill="none" stroke="var(--rust)" strokeWidth="0.75" strokeDasharray="2 3" />
          <text
            x={NODE.x} y={NODE.y + 42} fontFamily="JetBrains Mono" fontSize="9"
            letterSpacing="1.5" fill="var(--rust)" textAnchor="middle"
          >
            BLUEPRINT OS
          </text>
        </G>

        {/* Structured rows */}
        {rows.map((r, ri) => (
          <g key={r.label}>
            <T
              x="428" y={r.y - 6} fontFamily="JetBrains Mono" fontSize="9"
              letterSpacing="1" fill="var(--ink)"
              {...reveal({ opacity: 0 }, { opacity: 1 }, { duration: 0.4, delay: 1.45 + ri * 0.15 })}
            >
              {r.label}
            </T>
            {Array.from({ length: r.count }).map((_, ci) => (
              <R
                key={ci}
                x={428 + ci * 30} y={r.y} width="26" height="13" fill="var(--cyan)"
                {...(isStatic ? { opacity: tileOpacity[ci] } : {})}
                {...reveal(
                  { opacity: 0 },
                  { opacity: tileOpacity[ci] },
                  { duration: 0.35, delay: 1.55 + ri * 0.15 + ci * 0.05 }
                )}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  )
}

function OrbitDiagram() {
  const chips = [
    'Notes', 'Meetings', 'SOPs', 'Customers', 'Decisions',
    'Audio', 'Files', 'Inbox', 'Tasks', 'Daily Brief',
  ]
  const VBW = 800
  const VBH = 560
  const cx = VBW / 2
  const cy = VBH / 2
  const r = 220

  // The reveal is triggered by the wrapping HTML div, not by each SVG <g>.
  // WebKit on iOS/iPadOS never fires `whileInView` for SVG children (see
  // isIOSDevice above), which left every chip stuck at opacity 0 on iPad.
  const chipVariants = {
    hidden: { opacity: 0 },
    show: (i) => ({
      opacity: 1,
      transition: { duration: 0.5, delay: 0.1 + i * 0.08 },
    }),
  }

  return (
    <>
      {/* Desktop orbit */}
      <motion.div
        className="hidden md:block relative"
        style={{ aspectRatio: `${VBW} / ${VBH}` }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <svg viewBox={`0 0 ${VBW} ${VBH}`} className="w-full h-auto block">
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--paper-line)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {chips.map((chip, i) => {
            const angle = (i / chips.length) * Math.PI * 2 - Math.PI / 2
            const x = cx + Math.cos(angle) * r
            const y = cy + Math.sin(angle) * r
            const innerR = 165
            const ix = cx + Math.cos(angle) * innerR
            const iy = cy + Math.sin(angle) * innerR
            return (
              <motion.g key={chip} custom={i} variants={chipVariants}>
                <line
                  x1={ix}
                  y1={iy}
                  x2={x}
                  y2={y}
                  stroke="var(--cyan)"
                  strokeWidth="1"
                  opacity="0.5"
                />
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

        <div
          className="absolute pointer-events-none"
          style={{ left: '25%', right: '25%', top: '15%', bottom: '15%' }}
        >
          <MiniOrbitBrain className="w-full h-full" />
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="font-display-italic text-[color:var(--rust)] text-[3.225rem] leading-none tracking-[-0.02em]"
            style={{
              opacity: 0.9,
              textShadow:
                '0 0 18px rgba(244,239,227,0.85), 0 1px 0 rgba(244,239,227,0.6)',
            }}
          >
            Your Blueprint OS
          </div>
        </div>
      </motion.div>

      {/* Mobile fallback */}
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

export default BlueprintOS
