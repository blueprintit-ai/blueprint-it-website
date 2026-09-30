import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
import ParticleBrainCanvas from '@/components/ParticleBrainCanvas.jsx'
// eslint-disable-next-line no-unused-vars
import { motion, MotionConfig } from 'framer-motion'
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { SectionTag, Plate } from '@/components/blueprint.jsx'
import { licenseServer } from '@/lib/license-server'

// Install-call booking links. Keep in sync with CALENDLY_LEAD_HANDLER_URL /
// CALENDLY_AI_ASSISTANT_URL on the license server (the same links go out in
// the post-purchase email).
const LEAD_HANDLER_BOOKING_URL = 'https://calendly.com/blueprintit/automated-lead-handler-setup'
const AI_ASSISTANT_BOOKING_URL = 'https://calendly.com/blueprintit/ai-assistant-setup'

export default function ProductsThankYou() {
  // 'checking' | 'succeeded' | 'pending' | 'failed'
  const [status, setStatus] = useState('checking')
  // 'consultation' | 'foundation' | 'lead-handler' | 'bundle' | 'ai-assistant' | null — from ?product=...
  const [product, setProduct] = useState(null)

  useEffect(() => {
    document.title = 'Thanks for buying · Blueprint IT'

    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    const productParam = params.get('product')
    setProduct(productParam)

    // Foundation purchases that somehow land here (URL typo, copy-paste, etc.)
    // should be redirected to the canonical Foundation thank-you page where the
    // license key UI lives.
    if (productParam === 'foundation' && sessionId) {
      window.location.replace(`/blueprint-os/thank-you?session_id=${encodeURIComponent(sessionId)}`)
      return
    }

    if (!sessionId) {
      setStatus('failed')
      return
    }

    let cancelled = false
    let attempts = 0
    const poll = async () => {
      if (cancelled) return
      if (attempts >= 15) {
        setStatus('pending')
        return
      }
      attempts++
      try {
        const r = await licenseServer.paymentStatus({ sessionId })
        if (r.status === 'succeeded') {
          setStatus('succeeded')
          return
        }
      } catch {
        // swallow — try again
      }
      setTimeout(poll, 2000)
    }
    poll()
    return () => { cancelled = true }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="bp-grid bp-grain min-h-screen text-[color:var(--ink)] relative">
        <ParticleBrainCanvas />

        <SiteNav
          ctaLabel="Home"
          onCtaClick={() => { window.location.href = '/' }}
          navItems={[
            { kind: 'link', label: 'Home', href: '/' },
            { kind: 'link', label: 'Products', href: '/products' },
          ]}
        />

        <main className="relative z-[2]">
          <section className="relative">
            <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-28">
              <SectionTag id="00">Drawing № 00 · Order received</SectionTag>

              {status === 'checking' && (
                <div className="mt-8">
                  <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="font-display text-[clamp(2rem,5.6vw,4.8rem)] leading-[0.95] tracking-[-0.03em] max-w-3xl"
                  >
                    Confirming your payment…
                  </motion.h1>
                  <p className="mt-8 text-[19px] text-[color:var(--ink-soft)] max-w-2xl">
                    This usually takes a few seconds. Don&apos;t close this tab.
                  </p>
                </div>
              )}

              {status === 'succeeded' && (product === 'lead-handler' || product === 'bundle') && (
                <div className="mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle2 size={32} strokeWidth={1.8} className="text-[color:var(--cyan)]" />
                      <span className="label label-cyan">Payment confirmed</span>
                    </div>
                    <h1 className="font-display text-[clamp(2rem,5.6vw,4.8rem)] leading-[0.95] tracking-[-0.03em] max-w-3xl">
                      {product === 'bundle' ? 'The full stack is yours.' : 'Your Lead Handler is on the way.'}{' '}
                      <span className="font-display-italic text-[color:var(--cyan)]">
                        Book your install call.
                      </span>
                    </h1>
                  </motion.div>

                  <div className="mt-12 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-7">
                      <Plate accent="cyan">
                        <div className="label label-cyan mb-4">Next · Book the install call</div>
                        <p className="text-[color:var(--ink-soft)] leading-relaxed text-[15px] mb-6">
                          {product === 'bundle'
                            ? 'Pick a time for your Lead Handler install call below. Two emails also just hit your inbox: your Blueprint OS license key with the welcome guide, and this same booking link. Start with the install call — we set everything up together.'
                            : 'Pick a time for your install call below — the same booking link just hit your inbox too. On that call we wire the Lead Handler into your business — you approve AI-drafted replies from your phone within days.'}
                        </p>
                        <a
                          href={LEAD_HANDLER_BOOKING_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-ink inline-flex items-center justify-center w-full mb-6"
                        >
                          Book your install call
                          <ArrowUpRight size={14} strokeWidth={2.2} />
                        </a>
                        <div className="pt-5 border-t border-[color:var(--paper-line)] font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                          Don&apos;t see the email{product === 'bundle' ? 's' : ''} after 60 seconds?
                          Check spam, or email{' '}
                          <a
                            href="mailto:glenn@blueprintit.ai"
                            className="underline underline-offset-[4px] hover:text-[color:var(--ink)]"
                          >
                            glenn@blueprintit.ai
                          </a>
                          .
                        </div>
                      </Plate>
                    </div>
                    <div className="md:col-span-5">
                      <Plate accent="rust" className="bg-[rgba(251,248,239,0.65)] backdrop-blur-[2px]">
                        <div className="label label-cyan mb-4">Have ready for the call</div>
                        <ul className="space-y-3 text-[color:var(--ink-soft)] text-[15px] leading-relaxed">
                          <li className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--cyan)] shrink-0">01</span>
                            <span>Where your leads come from — website form, Google Sheets, or Facebook Lead Ads.</span>
                          </li>
                          <li className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--cyan)] shrink-0">02</span>
                            <span>The email account replies should send from.</span>
                          </li>
                          <li className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--cyan)] shrink-0">03</span>
                            <span>Your phone, with Telegram installed — that&apos;s where approvals happen.</span>
                          </li>
                        </ul>
                      </Plate>
                    </div>
                  </div>
                </div>
              )}

              {status === 'succeeded' && product === 'ai-assistant' && (
                <div className="mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle2 size={32} strokeWidth={1.8} className="text-[color:var(--cyan)]" />
                      <span className="label label-cyan">Payment confirmed</span>
                    </div>
                    <h1 className="font-display text-[clamp(2rem,5.6vw,4.8rem)] leading-[0.95] tracking-[-0.03em] max-w-3xl">
                      Your AI Assistant is on the way.{' '}
                      <span className="font-display-italic text-[color:var(--cyan)]">
                        Book your setup call.
                      </span>
                    </h1>
                  </motion.div>

                  <div className="mt-12 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-7">
                      <Plate accent="cyan">
                        <div className="label label-cyan mb-4">Next · Book the setup call</div>
                        <p className="text-[color:var(--ink-soft)] leading-relaxed text-[15px] mb-6">
                          Pick a time for your setup call below — the same
                          booking link just hit your inbox too. On that call we
                          finish the install, wire up your email and calendar
                          integration, and run through 30 minutes of training.
                        </p>
                        <a
                          href={AI_ASSISTANT_BOOKING_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-ink inline-flex items-center justify-center w-full mb-6"
                        >
                          Book your setup call
                          <ArrowUpRight size={14} strokeWidth={2.2} />
                        </a>
                        <div className="pt-5 border-t border-[color:var(--paper-line)] font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                          Don&apos;t see the email after 60 seconds?
                          Check spam, or email{' '}
                          <a
                            href="mailto:glenn@blueprintit.ai"
                            className="underline underline-offset-[4px] hover:text-[color:var(--ink)]"
                          >
                            glenn@blueprintit.ai
                          </a>
                          .
                        </div>
                      </Plate>
                    </div>
                    <div className="md:col-span-5">
                      <Plate accent="rust" className="bg-[rgba(251,248,239,0.65)] backdrop-blur-[2px]">
                        <div className="label label-cyan mb-4">Have ready for the call</div>
                        <ul className="space-y-3 text-[color:var(--ink-soft)] text-[15px] leading-relaxed">
                          <li className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--cyan)] shrink-0">01</span>
                            <span>An OpenRouter account, funded with $50 to start.</span>
                          </li>
                          <li className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--cyan)] shrink-0">02</span>
                            <span>A Hostinger account (any plan, $8&ndash;$24.49/mo).</span>
                          </li>
                          <li className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--cyan)] shrink-0">03</span>
                            <span>The one email address and one calendar you want integrated.</span>
                          </li>
                        </ul>
                      </Plate>
                    </div>
                  </div>
                </div>
              )}

              {status === 'succeeded' && product === 'consultation' && (
                <div className="mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle2 size={32} strokeWidth={1.8} className="text-[color:var(--cyan)]" />
                      <span className="label label-cyan">Payment confirmed</span>
                    </div>
                    <h1 className="font-display text-[clamp(2rem,5.6vw,4.8rem)] leading-[0.95] tracking-[-0.03em] max-w-3xl">
                      Thanks for booking.{' '}
                      <span className="font-display-italic text-[color:var(--cyan)]">
                        Pick a time.
                      </span>
                    </h1>
                  </motion.div>

                  <div className="mt-12 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-7">
                      <Plate accent="cyan">
                        <div className="label label-cyan mb-4">Next · Pick a time</div>
                        <p className="text-[color:var(--ink-soft)] leading-relaxed text-[15px] mb-6">
                          A confirmation with the Calendly booking link just hit
                          your inbox. You can also open the calendar right now:
                        </p>
                        <Link
                          to="/consultation#book-call"
                          className="btn-ink inline-flex items-center"
                        >
                          Open the calendar
                          <ArrowRight size={14} strokeWidth={2.2} />
                        </Link>
                        <div className="mt-6 pt-5 border-t border-[color:var(--paper-line)] font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                          Don&apos;t see the email after 60 seconds? Check spam,
                          or email{' '}
                          <a
                            href="mailto:glenn@blueprintit.ai"
                            className="underline underline-offset-[4px] hover:text-[color:var(--ink)]"
                          >
                            glenn@blueprintit.ai
                          </a>
                          .
                        </div>
                      </Plate>
                    </div>
                    <div className="md:col-span-5">
                      <Plate accent="rust" className="bg-[rgba(251,248,239,0.65)] backdrop-blur-[2px]">
                        <div className="label label-cyan mb-4">What to prep</div>
                        <ul className="space-y-3 text-[color:var(--ink-soft)] text-[15px] leading-relaxed">
                          <li className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--cyan)] shrink-0">01</span>
                            <span>What you&apos;re hoping to walk away with.</span>
                          </li>
                          <li className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--cyan)] shrink-0">02</span>
                            <span>One specific bottleneck or decision you&apos;re stuck on.</span>
                          </li>
                          <li className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--cyan)] shrink-0">03</span>
                            <span>Any tools or systems already in play.</span>
                          </li>
                        </ul>
                      </Plate>
                    </div>
                  </div>
                </div>
              )}

              {status === 'pending' && (
                <div className="mt-8">
                  <h1 className="font-display text-[clamp(2rem,5.6vw,4.8rem)] leading-[0.95] tracking-[-0.03em] max-w-3xl">
                    Still confirming…
                  </h1>
                  <p className="mt-8 text-[19px] text-[color:var(--ink-soft)] max-w-2xl">
                    Stripe is taking a little longer than usual. Your payment
                    did go through. The confirmation email may take an extra
                    minute. If nothing arrives in 5 minutes, email{' '}
                    <a
                      href="mailto:glenn@blueprintit.ai"
                      className="underline underline-offset-[4px]"
                    >
                      glenn@blueprintit.ai
                    </a>
                    {' '}with your name and we&apos;ll sort it.
                  </p>
                </div>
              )}

              {status === 'failed' && (
                <div className="mt-8">
                  <h1 className="font-display text-[clamp(2rem,5.6vw,4.8rem)] leading-[0.95] tracking-[-0.03em] max-w-3xl">
                    No order found.
                  </h1>
                  <p className="mt-8 text-[19px] text-[color:var(--ink-soft)] max-w-2xl">
                    This page expects a checkout session in the URL. If you
                    arrived here from a Stripe receipt, the link may have been
                    truncated. Head back to{' '}
                    <Link to="/products" className="underline underline-offset-[4px]">
                      products
                    </Link>
                    {' '}or email{' '}
                    <a
                      href="mailto:glenn@blueprintit.ai"
                      className="underline underline-offset-[4px]"
                    >
                      glenn@blueprintit.ai
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        <SiteFooter
          links={[
            { label: 'Products', href: '/products' },
            { label: 'Studio', href: '/#about' },
            { label: 'Contact', href: '/#contact' },
          ]}
        />
      </div>
    </MotionConfig>
  )
}
