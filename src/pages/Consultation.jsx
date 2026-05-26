import { useEffect } from 'react'
import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
import ParticleBrainCanvas from '@/components/ParticleBrainCanvas.jsx'
// eslint-disable-next-line no-unused-vars
import { motion, MotionConfig } from 'framer-motion'
import { ArrowRight, ArrowUpRight, CreditCard, Calendar } from 'lucide-react'
import { SectionTag, Plate } from '@/components/blueprint.jsx'

// =======================================================================
// REPLACE THESE THREE URLS WITH PRODUCTION VALUES BEFORE GOING LIVE
// =======================================================================
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/REPLACE_ME'
const PAYPAL_PAY_LINK = 'https://www.paypal.com/paypalme/REPLACE_ME/150'
const CALENDLY_LINK = 'https://calendly.com/REPLACE_ME/consultation'
// =======================================================================

const scrollToPay = () => {
  document.getElementById('pay-now')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Consultation() {
  useEffect(() => {
    const prevTitle = document.title
    document.title = '1-Hour Consultation · Blueprint IT'

    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc = document.querySelector('meta[property="og:description"]')
    const prevOgTitle = ogTitle?.getAttribute('content')
    const prevOgDesc = ogDesc?.getAttribute('content')
    ogTitle?.setAttribute('content', '1-Hour Consultation · Blueprint IT')
    ogDesc?.setAttribute(
      'content',
      '60 minutes with Glenn. Bring your bottleneck. $150 flat. Pay with Stripe or PayPal, then book your call.'
    )

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
          ctaLabel="Pay $150"
          onCtaClick={scrollToPay}
          navItems={[
            { kind: 'link', label: 'Services', href: '/#services' },
            { kind: 'link', label: 'Studio', href: '/#about' },
            { kind: 'link', label: 'Case', href: '/#workflow' },
            { kind: 'link', label: 'Contact', href: '/#contact' },
          ]}
        />

        <main className="relative z-[2]">
          {/* =========================================================
              HERO · Drawing № 01 · The Consultation
          ==========================================================*/}
          <section id="consultation-top" className="relative overflow-hidden">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-14 md:pt-24 pb-16 md:pb-20">
              <div className="grid md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-7">
                  <SectionTag id="00">Drawing № 01 · The Consultation</SectionTag>

                  <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                    className="font-display mt-8 text-[clamp(2rem,5.6vw,4.8rem)] leading-[0.95] tracking-[-0.03em]"
                  >
                    One hour.{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">
                      One bottleneck.
                    </span>{' '}
                    <span className="font-display-italic text-[color:var(--rust)]">
                      A plan you can act on this week.
                    </span>
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.8 }}
                    className="mt-8 max-w-2xl text-[19px] md:text-[21px] leading-[1.55] text-[color:var(--ink-soft)]"
                  >
                    <p>
                      60 minutes on Zoom with me. Bring whatever you&apos;re stuck on.
                      Operations, automation, AI integration, web app strategy,
                      whatever it is.
                    </p>
                    <p className="mt-5">
                      We work through it together. You leave with concrete next
                      actions and the recording. No deck. No pitch. If a project
                      together makes sense at the end, we talk about that. If not,
                      you still got the plan.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-10 flex flex-wrap items-center gap-5"
                  >
                    <button onClick={scrollToPay} className="btn-ink">
                      Pay $150 below
                      <ArrowRight size={14} strokeWidth={2.2} />
                    </button>
                    <a
                      href="#pay-now"
                      className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] transition-colors underline-offset-[6px] hover:underline"
                    >
                      ↓ Two payment options
                    </a>
                  </motion.div>
                </div>

                {/* Right spec plate */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="md:col-span-5"
                >
                  <Plate accent="cyan" className="bg-[rgba(251,248,239,0.65)] backdrop-blur-[2px]">
                    <div className="label label-cyan mb-4">Spec sheet</div>
                    <dl className="divide-y divide-[color:var(--paper-line)] font-mono text-xs">
                      {[
                        ['Format', 'Zoom video call'],
                        ['Duration', '60 minutes'],
                        ['Deliverable', 'Action plan + recording'],
                        ['Price', '$150 flat'],
                        ['Payment', 'Stripe or PayPal'],
                        ['Scheduling', 'You pick the time after payment'],
                        ['Reschedule', 'Free with 24-hour notice'],
                        ['Refund', "Full refund if we don't finish in 60 min"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-baseline justify-between py-2.5 gap-4">
                          <dt className="uppercase tracking-[0.14em] text-[color:var(--ink-mute)] shrink-0">
                            {k}
                          </dt>
                          <dd className="text-[color:var(--ink)] font-medium text-right">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </Plate>
                </motion.div>
              </div>
            </div>
          </section>

          {/* =========================================================
              §01 · Payment · Step 1
          ==========================================================*/}
          <section id="pay-now" className="relative">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-5">
                  <SectionTag id="01">Drawing № 02 · Step one. Pay $150.</SectionTag>
                  <h2 className="font-display text-4xl md:text-5xl leading-[0.98] mt-6 tracking-[-0.02em]">
                    Pick a payment method.{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">
                      Either works.
                    </span>
                  </h2>
                  <p className="mt-6 text-[color:var(--ink-soft)] leading-relaxed text-lg">
                    Stripe handles cards and Apple Pay. PayPal handles PayPal balance
                    and Venmo. Receipt goes to your email automatically. After
                    payment, scroll down to book your time.
                  </p>
                </div>

                <div className="md:col-span-7">
                  <Plate accent="cyan">
                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Stripe button */}
                      <a
                        href={STRIPE_PAYMENT_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block border border-[color:var(--ink)] bg-[color:var(--paper)] hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] transition-colors p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="label label-cyan group-hover:text-[color:var(--paper)]">
                            Option A
                          </span>
                          <CreditCard size={18} strokeWidth={1.8} />
                        </div>
                        <div className="font-display text-3xl leading-none mb-2">
                          Stripe
                        </div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] group-hover:text-[color:var(--paper)] mb-5">
                          Card · Apple Pay · Google Pay
                        </p>
                        <div className="flex items-baseline justify-between border-t border-[color:var(--paper-line)] pt-4">
                          <span className="font-display text-2xl">$150</span>
                          <span className="font-mono text-[11px] uppercase tracking-[0.18em] flex items-center gap-1">
                            Pay <ArrowUpRight size={12} strokeWidth={2.2} />
                          </span>
                        </div>
                      </a>

                      {/* PayPal button */}
                      <a
                        href={PAYPAL_PAY_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block border border-[color:var(--ink)] bg-[color:var(--paper)] hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] transition-colors p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="label label-cyan group-hover:text-[color:var(--paper)]">
                            Option B
                          </span>
                          <CreditCard size={18} strokeWidth={1.8} />
                        </div>
                        <div className="font-display text-3xl leading-none mb-2">
                          PayPal
                        </div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] group-hover:text-[color:var(--paper)] mb-5">
                          PayPal balance · Venmo
                        </p>
                        <div className="flex items-baseline justify-between border-t border-[color:var(--paper-line)] pt-4">
                          <span className="font-display text-2xl">$150</span>
                          <span className="font-mono text-[11px] uppercase tracking-[0.18em] flex items-center gap-1">
                            Pay <ArrowUpRight size={12} strokeWidth={2.2} />
                          </span>
                        </div>
                      </a>
                    </div>

                    <div className="mt-6 pt-5 border-t border-[color:var(--paper-line)] font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                      Both options take about 30 seconds. Receipt and confirmation
                      arrive by email.
                    </div>
                  </Plate>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              §02 · Book the call · Step 2
          ==========================================================*/}
          <section id="book-call" className="relative bg-[color:var(--paper-2)]/60">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-5">
                  <SectionTag id="02">Drawing № 03 · Step two. Book your call.</SectionTag>
                  <h2 className="font-display text-4xl md:text-5xl leading-[0.98] mt-6 tracking-[-0.02em]">
                    Already paid?{' '}
                    <span className="font-display-italic text-[color:var(--rust)]">
                      Pick a time.
                    </span>
                  </h2>
                  <p className="mt-6 text-[color:var(--ink-soft)] leading-relaxed text-lg">
                    Calendly shows my real availability. Pick whatever works for
                    you. You&apos;ll get a calendar invite and a Zoom link in the
                    confirmation email.
                  </p>
                  <p className="mt-4 text-[color:var(--ink-soft)] leading-relaxed text-base">
                    Before the call, reply to the confirmation email with a sentence
                    or two on what you&apos;d like to cover. The more specific, the
                    more we can get done in the hour.
                  </p>
                </div>

                <div className="md:col-span-7">
                  <Plate accent="rust">
                    <div className="label label-cyan mb-4">Scheduling · Step 2</div>
                    <div className="flex items-baseline justify-between mb-6">
                      <span className="font-display text-5xl leading-none">02</span>
                      <Calendar size={28} strokeWidth={1.6} />
                    </div>
                    <h3 className="font-display text-[1.75rem] leading-[1.1] tracking-[-0.015em] mb-4">
                      Book your 60-minute consultation
                    </h3>
                    <p className="text-[color:var(--ink-soft)] leading-relaxed mb-6 text-[15px]">
                      Click below to open my calendar. Pick a time that works. You
                      keep the slot the moment you book it.
                    </p>
                    <a
                      href={CALENDLY_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ink inline-flex items-center"
                    >
                      Open my calendar
                      <ArrowUpRight size={14} strokeWidth={2.2} />
                    </a>
                    <div className="mt-6 pt-5 border-t border-[color:var(--paper-line)] font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                      Trouble with the calendar?{' '}
                      <a
                        href="mailto:accounts@capitaldiscountfurniture.com?subject=Consultation%20scheduling"
                        className="underline underline-offset-[4px] hover:text-[color:var(--ink)]"
                      >
                        Email me
                      </a>{' '}
                      and we&apos;ll find a time.
                    </div>
                  </Plate>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              Final note · Drawing № 03 · What to expect
          ==========================================================*/}
          <section id="what-to-expect" className="relative">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24 border-t border-[color:var(--ink)]">
              <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-5">
                  <SectionTag id="03">Drawing № 04 · What to expect</SectionTag>
                  <h2 className="font-display text-4xl md:text-5xl leading-[0.98] mt-6 tracking-[-0.02em]">
                    How the hour{' '}
                    <span className="font-display-italic text-[color:var(--cyan)]">
                      actually goes.
                    </span>
                  </h2>
                </div>
                <div className="md:col-span-7">
                  <Plate accent="cyan">
                    <ol className="space-y-5">
                      {[
                        ['Minutes 0-10', 'You tell me the situation. I ask clarifying questions until I understand the bottleneck specifically, not abstractly.'],
                        ['Minutes 10-40', 'We work through it. I share my screen if useful. You leave with a written plan in the chat, not just verbal advice.'],
                        ['Minutes 40-55', 'Concrete next actions. What to do this week. What to do this month. What to stop doing.'],
                        ['Minutes 55-60', "If a project together makes sense, we talk about it. If not, we don't. Either way the hour was useful."],
                      ].map(([when, what]) => (
                        <li key={when} className="grid grid-cols-[110px_1fr] gap-5 items-baseline">
                          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--cyan)]">
                            {when}
                          </span>
                          <span className="text-[color:var(--ink-soft)] leading-relaxed text-[15px]">
                            {what}
                          </span>
                        </li>
                      ))}
                    </ol>
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

export default Consultation
