import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'

const CALENDLY_URL = 'https://calendly.com/blueprintit/15-ai-shop-os-discovery'
const openCalendly = () => window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')

function ShopOS() {
  return (
    <div className="bp-grid bp-grain min-h-screen text-[color:var(--ink)] relative">
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
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-32">
          <h1 className="font-display text-6xl">Shop OS — placeholder</h1>
          <p className="mt-6 text-[color:var(--ink-soft)]">
            Real sections land in subsequent tasks.
          </p>
        </div>
      </main>

      <SiteFooter
        links={[
          { label: 'Services', href: '/#services' },
          { label: 'Studio', href: '/#about' },
          { label: 'Contact', href: '/#contact' },
        ]}
      />
    </div>
  )
}

export default ShopOS
