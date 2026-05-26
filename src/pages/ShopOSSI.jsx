import { useEffect } from 'react'
import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
import ParticleBrainCanvas from '@/components/ParticleBrainCanvas.jsx'
import MiniOrbitBrain from '@/components/MiniOrbitBrain.jsx'
// eslint-disable-next-line no-unused-vars -- motion is used via JSX member access (<motion.div>, etc.)
import { motion, MotionConfig } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SectionTag, Plate } from '@/components/blueprint.jsx'

const scrollToPurchase = () => {
  document.getElementById('purchase')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function ShopOSSI() {
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Shop OS · Self-Install AI Operating System · Blueprint IT'

    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc = document.querySelector('meta[property="og:description"]')
    const prevOgTitle = ogTitle?.getAttribute('content')
    const prevOgDesc = ogDesc?.getAttribute('content')
    ogTitle?.setAttribute('content', 'Shop OS · Self-Install AI Operating System · Blueprint IT')
    ogDesc?.setAttribute('content', 'A Working Shop Brain for your business. One command to install, $500 one time, yours from day one.')

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
          ctaLabel="Get Shop OS"
          onCtaClick={scrollToPurchase}
          navItems={[
            { kind: 'link', label: 'Services', href: '/#services' },
            !import.meta.env.PROD && { kind: 'route', to: '/shop-ossi', label: 'Shop OS SI' },
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
                    </span>
                    .{' '}
                    <span className="font-display-italic text-[color:var(--rust)]">
                      Ready to install.
                    </span>
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.8 }}
                    className="mt-8 max-w-2xl text-[22px] md:text-[24px] leading-[1.55] text-[color:var(--ink-soft)]"
                  >
                    <p>Stop being the answer to every question in your shop.</p>
                    <p className="mt-5">
                      What if your business had a brain of its own. One that briefs
                      your team, remembers every customer, and runs the mundane on a
                      schedule while you sleep.
                    </p>
                    <p className="mt-5">
                      That&apos;s Shop OS. One command installs it. Drag your folder
                      in, and a Working Shop Brain is live on your machine in about
                      ten minutes. You own it from day one.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-10 flex flex-wrap items-center gap-5"
                  >
                    <button onClick={scrollToPurchase} className="btn-ink">
                      Get Shop OS · $500
                      <ArrowRight size={14} strokeWidth={2.2} />
                    </button>
                    <a
                      href="#purchase"
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
                        ['Format', 'Self-install · one command'],
                        ['Deliverable', 'Working Shop Brain'],
                        ['Skills bundled', '28'],
                        ['Install time', '~10 minutes'],
                        ['Ownership', 'Yours from day one'],
                        ['Price', '$500 · Founding 50'],
                        ['Guarantee', '30-day refund'],
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
                      Your business needs a copy.
                    </span>
                  </h2>
                  <p className="mt-6 text-[color:var(--ink-soft)] leading-relaxed text-lg">
                    The answers are already inside your business. They&apos;re just
                    buried. In inboxes, spreadsheets, Slack threads, Trello boards,
                    cloud folders, and the heads of the one or two people who were
                    here before anyone wrote things down.
                  </p>
                  <p className="mt-4 text-[color:var(--ink-soft)] leading-relaxed text-lg">
                    The businesses pulling ahead aren&apos;t the ones with more AI
                    tools. They&apos;re the ones who built shared institutional
                    intelligence on top of them, and let it compound.
                  </p>
                </div>

                <div className="md:col-span-7 md:col-start-6">
                  <Plate accent="cyan" className="bg-[color:var(--paper-2)]">
                    <div className="label label-cyan mb-4">Fig. 02-A · Your company&apos;s context, mapped</div>
                    <KnowledgeMosaic />
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] text-center">
                      Every project adds tiles. The map fills in, and compounds.
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
                    One deliverable: a Working Shop Brain. An Obsidian vault that
                    holds your business context, 28 pre-wired skills that act on it,
                    and a read-only chat your team can walk up to and use. All
                    running on your machine, on your existing Claude Code
                    subscription.
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
                    Working Shop Brain
                  </h3>
                  <p className="text-[color:var(--ink-soft)] leading-relaxed mb-6">
                    Every AI interaction on your team reads from one centralized
                    place: customer history, SOPs, brand voice, internal policies.
                    The institutional knowledge that lives in ten people&apos;s
                    heads, queryable by every person and every automation. Your team
                    accesses it through Shop OS Chat, a read-only browser window at
                    the shop computer. Open it, ask the Brain anything, get an
                    answer grounded in how your business actually runs. Every
                    transcript saves back to the vault automatically.
                  </p>
                  <div className="pt-5 border-t border-[color:var(--paper-line)]">
                    <div className="label label-cyan mb-3">What your team gets</div>
                    <ul className="space-y-2 mb-5">
                      {[
                        'One source of truth for every AI interaction',
                        'Read-only chat at the shop computer. Employees ask, they can’t break anything.',
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
              §03 — Drawing № 04 · How To Run Shop OS
          ==========================================================*/}
          <section id="shop-operator" className="relative bg-[color:var(--paper-2)]/60">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-10 md:gap-16 mb-14 md:mb-20">
                <div className="md:col-span-6">
                  <SectionTag id="03">Drawing № 04 · How To Run Shop OS</SectionTag>
                  <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
                    Up and running{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">
                      in four steps.
                    </span>
                  </h2>
                </div>
                <div className="md:col-span-6">
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                    Shop OS installs itself. Follow the four steps below and your
                    Shop Brain is live, seeded with your business context, and ready
                    for your team by the end of the morning.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {[
                  {
                    n: '01',
                    title: 'Run one command',
                    body: 'Paste the install command from your welcome email into your terminal. The installer wires up your license, creates the Shop OS Vault folder, and drops a chat launcher into it. Drag your vault folder into the terminal when prompted. Eight to ten minutes.',
                  },
                  {
                    n: '02',
                    title: 'Seed your context',
                    body: 'Drop your past quotes, email threads, voice memos, and SOPs into the Raw inbox. Run /os-digest. Every file gets routed to the right vault folder with a structured summary. The more you seed, the smarter every answer.',
                  },
                  {
                    n: '03',
                    title: 'Open the chat',
                    body: 'Double-click the Shop OS Chat icon in your vault. A read-only chat opens in your browser. Anyone in the shop can ask it anything about your business. Transcripts save back to the vault automatically.',
                  },
                  {
                    n: '04',
                    title: 'Let it run on a schedule',
                    body: 'Use /os-operator to schedule the routines you would otherwise do every Monday morning: customer follow-up sweep, inbox triage, weekly brief. Set them once, they run on their own.',
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
              §04 — Drawing № 05 · What's in the box (purchase anchor)
          ==========================================================*/}
          <section id="purchase" className="relative">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20">
                <div className="md:col-span-6">
                  <SectionTag id="04">Drawing № 05 · What&apos;s in the box</SectionTag>
                  <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
                    One install.{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">
                      Everything you need.
                    </span>
                  </h2>
                </div>
                <div className="md:col-span-5 md:col-start-8 md:pt-8">
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                    Shop OS Foundation is a one-time purchase. Installer, license,
                    twenty-eight pre-wired skills, and the read-only chat. Lifetime
                    updates while you&apos;re in the Founding 50 cohort.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <Plate accent="cyan">
                  <div className="label label-cyan mb-3">Installer &amp; license</div>
                  <h3 className="font-display text-2xl leading-[1.1] tracking-[-0.015em] mb-4">
                    One command. Your machine.
                  </h3>
                  <ul className="space-y-2 font-mono text-[12px]">
                    {[
                      'One npx command, Mac or Windows',
                      'Drag-and-drop vault setup',
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
                      '/os-operator for scheduled routines',
                      '/os-digest for inbox processing',
                      '/os-optimizer for vault health',
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
                      'One-time $500. No monthly bill from us.',
                      'Runs on your existing Claude Code subscription',
                      'Data in plain markdown in your own cloud',
                      'Lifetime updates as Founding 50',
                      '30-day refund if it doesn’t earn its keep',
                    ].map((d) => (
                      <li key={d} className="flex items-start gap-3">
                        <span className="inline-block h-1.5 w-4 mt-2 bg-[color:var(--cyan)]" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </Plate>
              </div>

              <div className="mt-12 flex flex-col items-center gap-4">
                <button onClick={scrollToPurchase} className="btn-ink btn-rust">
                  Reserve a Founding 50 seat · $500
                  <ArrowUpRight size={14} strokeWidth={2.2} />
                </button>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                  Limited to the first 50 customers. Price doubles after.
                </div>
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
                  <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
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
                    q: 'I’m not technical. Will I mess up the install?',
                    a: 'We paste the exact command into your welcome email. You paste it back, drag your folder into the window, done. If you can copy-paste, you can install Shop OS.',
                  },
                  {
                    q: 'What does it cost per month?',
                    a: 'Nothing from Blueprint IT. Shop OS uses your existing Claude Code subscription for AI work. If you don’t have one, that’s $20/month from Anthropic directly.',
                  },
                  {
                    q: 'What if Blueprint IT disappears?',
                    a: 'Your vault is plain markdown in your own cloud. The installer, the skills, and the chat are open source on GitHub. Your operation never depends on us being alive.',
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
                className="font-display mt-8 text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-[-0.03em]"
              >
                Get your{' '}
                <span className="font-display-italic text-[color:var(--rust)]">Shop OS.</span>
              </motion.h2>
              <p className="mt-8 mx-auto max-w-2xl text-lg md:text-xl text-[color:var(--ink-soft)] leading-relaxed">
                One install. One $500 payment. A Working Shop Brain your team owns
                from day one, plus lifetime updates as a Founding 50 customer.
                Thirty-day refund if it doesn&apos;t earn its keep.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4">
                <button onClick={scrollToPurchase} className="btn-ink btn-rust">
                  Reserve a Founding 50 seat · $500
                  <ArrowUpRight size={14} strokeWidth={2.2} />
                </button>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                  Self-install. No call required. Yours to own.
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              Footer plate — Who's behind this
          ==========================================================*/}
          <section id="shop-founder" className="relative">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-20 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-3">
                  <div className="label label-cyan">Who&apos;s behind this</div>
                </div>
                <div className="md:col-span-9">
                  <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed max-w-3xl">
                    Shop OS is built by{' '}
                    <span className="text-[color:var(--ink)] font-medium">
                      Glenn Chua
                    </span>{' '}
                    at Blueprint IT, from inside the same trade community it serves.
                    Glenn is an admin of one of the largest cabinet and closet
                    operator communities online, fifty-six thousand strong. He
                    built Shop OS because every conversation in that group
                    eventually circles to the same problem: the owner is the
                    bottleneck.
                  </p>
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
  const VBW = 600
  const VBH = 348
  const padL = 14
  const padR = 14
  const padT = 16
  const padB = 88
  const innerW = VBW - padL - padR
  const innerH = VBH - padT - padB
  const COLS = 16
  const ROWS = 8
  const totalCells = COLS * ROWS
  const cellW = innerW / COLS
  const cellH = innerH / ROWS
  const gap = 2

  const milestones = [
    { label: 'Day 1',  upto: 5,   color: 'var(--rust)' },
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
    const milestoneStart = mIdx > 0 ? milestones[mIdx - 1].upto : 0
    const localProgress = (i - milestoneStart) / Math.max(1, milestones[mIdx].upto - milestoneStart)
    const delay = 0.3 + mIdx * 0.22 + localProgress * 0.12
    cells.push({ key: i, x, y, w, h, fill, delay })
  }

  const legendY = padT + innerH + 16
  const installY = VBH - 14
  const legendItemW = innerW / milestones.length

  return (
    <svg viewBox={`0 0 ${VBW} ${VBH}`} className="w-full h-auto">
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

      <text
        x={padL}
        y={installY}
        fontFamily="JetBrains Mono"
        fontSize="9"
        fill="var(--rust)"
        textTransform="uppercase"
      >
        Install → Day 1 live. From there, the company&apos;s context map compounds.
      </text>
    </svg>
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

  return (
    <>
      {/* Desktop orbit */}
      <div className="hidden md:block relative" style={{ aspectRatio: `${VBW} / ${VBH}` }}>
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
              <motion.g
                key={chip}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              >
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
            Your Shop OS
          </div>
        </div>
      </div>

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

export default ShopOSSI
