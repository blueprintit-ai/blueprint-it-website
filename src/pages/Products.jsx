import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
import ParticleBrainCanvas from '@/components/ParticleBrainCanvas.jsx'
// eslint-disable-next-line no-unused-vars
import { motion, MotionConfig } from 'framer-motion'
import { ArrowUpRight, Clock, Box } from 'lucide-react'
import { SectionTag, Plate } from '@/components/blueprint.jsx'

function Products() {
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
      'Buy directly: 1-Hour Consultation with Glenn for $150, or Shop OS Foundation lifetime license for $1000.'
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
          ctaLabel="Talk to Glenn"
          onCtaClick={() => { window.location.href = 'mailto:glenn@blueprintit.ai?subject=Hello' }}
          navItems={[
            { kind: 'link', label: 'Services', href: '/#services' },
            { kind: 'link', label: 'Studio', href: '/#about' },
            { kind: 'link', label: 'Shop OS', href: '/shop-ossi' },
            { kind: 'link', label: 'Contact', href: '/#contact' },
          ]}
        />

        <main className="relative z-[2]">
          {/* ============================================================
              HERO · Drawing № 00 · Buy direct
          =============================================================*/}
          <section id="products-top" className="relative overflow-hidden">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-14 md:pt-24 pb-10 md:pb-14">
              <SectionTag id="00">Drawing № 00 · Products & Services</SectionTag>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                className="font-display mt-8 text-[clamp(2rem,5.6vw,4.8rem)] leading-[0.95] tracking-[-0.03em] max-w-4xl"
              >
                Buy direct.{' '}
                <span className="font-display-italic text-[color:var(--cyan)]">
                  No discovery call required.
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                className="mt-8 max-w-2xl text-[19px] md:text-[21px] leading-[1.55] text-[color:var(--ink-soft)]"
              >
                Two ways to get help right now. Pick whichever fits where you
                are, pay, and we&apos;ll be in your inbox within seconds.
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

                {/* === Shop OS Foundation card === */}
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
                          Shop OS Foundation
                        </h2>
                      </div>
                      <Box size={28} strokeWidth={1.6} className="text-[color:var(--ink-soft)] shrink-0 ml-4" />
                    </div>

                    <p className="text-[color:var(--ink-soft)] leading-relaxed text-[15px] mb-6 flex-1">
                      The AI Operating System for small businesses. Lifetime
                      license. Installs in 15 minutes. Vault, plugins, install
                      guide, license key in your inbox right after purchase.
                    </p>

                    <div className="border-t border-[color:var(--paper-line)] pt-5 mb-6">
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-5xl">$1,000</span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
                          lifetime, one-time
                        </span>
                      </div>
                      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--cyan)]">
                        $750 with code <span className="text-[color:var(--ink)] font-bold">FOUNDING50</span>
                      </p>
                    </div>

                    <a href="/shop-ossi#purchase" className="btn-ink inline-flex items-center justify-center w-full">
                      Get Shop OS Foundation
                      <ArrowUpRight size={14} strokeWidth={2.2} />
                    </a>
                  </Plate>
                </motion.div>
              </div>

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
