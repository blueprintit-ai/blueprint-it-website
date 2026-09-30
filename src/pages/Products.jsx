import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { licenseServer } from '@/lib/license-server'
import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
import ParticleBrainCanvas from '@/components/ParticleBrainCanvas.jsx'
// eslint-disable-next-line no-unused-vars
import { motion, MotionConfig } from 'framer-motion'
import { ArrowUpRight, Clock, Box, Zap, Bot } from 'lucide-react'
import { SectionTag, Plate } from '@/components/blueprint.jsx'

function Products() {
  // null | 'lead-handler' | 'ai-assistant' — which card's checkout is in flight.
  const [submitting, setSubmitting] = useState(null)
  const [checkoutError, setCheckoutError] = useState(null)

  async function startCheckout(productType) {
    setCheckoutError(null)
    setSubmitting(productType)
    try {
      const r = await licenseServer.createStripeSession({ productType })
      if (r.checkoutUrl) {
        window.location.href = r.checkoutUrl
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (e) {
      setCheckoutError(e.message || 'Could not start checkout. Please try again or email glenn@blueprintit.ai.')
      setSubmitting(null)
    }
  }

  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Products & Services · Blueprint IT'

    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc = document.querySelector('meta[property="og:description"]')
    const prevOgTitle = ogTitle?.getAttribute('content')
    const prevOgDesc = ogDesc?.getAttribute('content')
    ogTitle?.setAttribute('content', 'Products & Services · Blueprint IT')
    ogDesc?.setAttribute(
      'content',
      'AI Automation and Technology Assessment for shops that run lean. 1-Hour Consultation ($150), Blueprint OS Foundation ($2,000), Automated Lead Handler ($1,500), or AI Assistant ($1,500 setup).'
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
          ctaLabel="Discovery Call"
          onCtaClick={() => { window.location.href = '/#contact' }}
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
          {/* ============================================================
              HERO · Drawing № 00 · The practice
          =============================================================*/}
          <section id="products-top" className="relative overflow-hidden">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-14 md:pt-24 pb-10 md:pb-14">
              <SectionTag id="00">Drawing № 00 · Products & Services</SectionTag>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                className="font-display mt-8 text-[clamp(1.6rem,4.5vw,3.85rem)] leading-[0.95] tracking-[-0.03em] max-w-4xl"
              >
                AI Automation and Technology Assessment,{' '}
                <span className="font-display-italic text-[color:var(--cyan)]">
                  built for shops that run lean.
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                className="mt-8 max-w-2xl text-[19px] md:text-[21px] leading-[1.55] text-[color:var(--ink-soft)]"
              >
                We wire AI into the tools you already use and audit the tech
                underneath it — so your shop runs on systems, not memory.
              </motion.p>
            </div>
          </section>

          {/* ============================================================
              PRODUCT CARDS
          =============================================================*/}
          <section id="catalog" className="relative">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 pb-20 md:pb-28 border-t border-[color:var(--ink)] pt-12 md:pt-16">
              <div className="grid md:grid-cols-2 gap-8">
                {/* === Consultation card === */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <Plate accent="cyan" className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="label label-cyan mb-3">Drawing № 01 · Service</div>
                        <h2 className="font-display text-3xl md:text-4xl leading-[0.98] tracking-[-0.015em]">
                          1-Hour Consultation
                        </h2>
                      </div>
                      <Clock size={28} strokeWidth={1.6} className="text-[color:var(--ink-soft)] shrink-0 ml-4" />
                    </div>

                    <p className="text-[color:var(--ink-soft)] leading-relaxed text-[15px] mb-6 flex-1">
                      60 minutes one-on-one with Glenn. Bring whatever you&apos;re
                      stuck on. Operations, automation, AI integration, web app
                      strategy. You leave with concrete next actions and the
                      recording.
                    </p>

                    <div className="border-t border-[color:var(--paper-line)] pt-5 mb-6">
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-5xl">$150</span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                          flat, one-time
                        </span>
                      </div>
                    </div>

                    <Link to="/consultation" className="btn-ink inline-flex items-center justify-center w-full">
                      Book a Consultation
                      <ArrowUpRight size={14} strokeWidth={2.2} />
                    </Link>
                  </Plate>
                </motion.div>

                {/* === Blueprint OS Foundation card === */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.7 }}
                >
                  <Plate accent="rust" className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="label label-cyan mb-3">Drawing № 02 · Product</div>
                        <h2 className="font-display text-3xl md:text-4xl leading-[0.98] tracking-[-0.015em]">
                          Blueprint OS Foundation
                        </h2>
                      </div>
                      <Box size={28} strokeWidth={1.6} className="text-[color:var(--ink-soft)] shrink-0 ml-4" />
                    </div>

                    <p className="text-[color:var(--ink-soft)] leading-relaxed text-[15px] mb-6 flex-1">
                      The AI Operating System for small businesses. Lifetime
                      license. Includes a 30-minute setup session and a 30-minute
                      training session with us. Vault, plugins, guide, and license
                      key in your inbox right after purchase.
                    </p>

                    <div className="border-t border-[color:var(--paper-line)] pt-5 mb-6">
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-5xl">$2,000</span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                          lifetime, one-time
                        </span>
                      </div>
                    </div>

                    <a href="/blueprint-os" className="btn-ink inline-flex items-center justify-center w-full">
                      Blueprint OS Foundation
                      <ArrowUpRight size={14} strokeWidth={2.2} />
                    </a>
                  </Plate>
                </motion.div>

                {/* === Automated Lead Handler card === */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                >
                  <Plate accent="cyan" className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="label label-cyan mb-3">Drawing № 03 · Product</div>
                        <h2 className="font-display text-3xl md:text-4xl leading-[0.98] tracking-[-0.015em]">
                          Automated Lead Handler
                        </h2>
                      </div>
                      <Zap size={28} strokeWidth={1.6} className="text-[color:var(--ink-soft)] shrink-0 ml-4" />
                    </div>

                    <p className="text-[color:var(--ink-soft)] leading-relaxed text-[15px] mb-6 flex-1">
                      Every lead answered in minutes, not days. AI drafts a
                      personalized reply the moment a lead comes in — from your
                      website, Google Sheets, or Facebook ads. You approve it
                      with one tap from your phone, it sends from your own
                      email, and you get an alert the moment they open or
                      click. Runs 24/7. We install and maintain it.
                    </p>

                    <div className="border-t border-[color:var(--paper-line)] pt-5 mb-6">
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-5xl">$1,500</span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                          lifetime, one-time
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => startCheckout('lead-handler')}
                      disabled={submitting !== null}
                      className="btn-ink inline-flex items-center justify-center w-full disabled:opacity-60"
                    >
                      {submitting === 'lead-handler' ? 'Loading…' : 'Get the Lead Handler'}
                      <ArrowUpRight size={14} strokeWidth={2.2} />
                    </button>
                  </Plate>
                </motion.div>

                {/* === AI Assistant card === */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.7 }}
                >
                  <Plate accent="cyan" className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="label label-cyan mb-3">Drawing № 04 · Product</div>
                        <h2 className="font-display text-3xl md:text-4xl leading-[0.98] tracking-[-0.015em]">
                          AI Assistant
                        </h2>
                      </div>
                      <Bot size={28} strokeWidth={1.6} className="text-[color:var(--ink-soft)] shrink-0 ml-4" />
                    </div>

                    <p className="text-[color:var(--ink-soft)] leading-relaxed text-[15px] mb-6 flex-1">
                      A dedicated AI assistant for your shop — answers
                      questions, pulls up information, and handles tasks
                      around the clock. A customized implementation of{' '}
                      <a
                        href="https://nousresearch.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-[3px] hover:text-[color:var(--ink)] transition-colors"
                      >
                        Hermes Agent
                      </a>{' '}
                      by Nous Research, configured and hardened for shop use.
                      Setup includes 1 email address and 1 calendar
                      integration, plus 30 minutes of training. Additional
                      integrations are quoted case-by-case. Runs on your own
                      OpenRouter account (fund with $50 to start) and a
                      Hostinger account ($8–$24.49/mo depending on plan),
                      billed directly to you.
                    </p>

                    <div className="border-t border-[color:var(--paper-line)] pt-5 mb-6">
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-5xl">$1,500</span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                          lifetime, one-time
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => startCheckout('ai-assistant')}
                      disabled={submitting !== null}
                      className="btn-ink inline-flex items-center justify-center w-full disabled:opacity-60"
                    >
                      {submitting === 'ai-assistant' ? 'Loading…' : 'Get the AI Assistant'}
                      <ArrowUpRight size={14} strokeWidth={2.2} />
                    </button>
                  </Plate>
                </motion.div>

              </div>

              {checkoutError && (
                <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.14em] text-[color:var(--rust)] text-center">
                  {checkoutError}
                </p>
              )}

              {/* footer note */}
              <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] text-center">
                Questions before you buy?&nbsp;
                <a
                  href="mailto:glenn@blueprintit.ai"
                  className="underline underline-offset-[4px] hover:text-[color:var(--ink)] transition-colors"
                >
                  Email Glenn
                </a>
              </p>
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

export default Products
