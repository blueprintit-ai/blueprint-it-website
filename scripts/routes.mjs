import { SITE } from './site.config.mjs'
import { ORG_ID, organization, website, breadcrumbs, graph } from './schema.mjs'

const HOME = { name: 'Home', path: '' }

export const routes = [
  {
    path: '',
    title: 'Blueprint IT — Schematics for the AI-Native Business',
    description:
      'Precision IT consulting and AI automation for the AI-native business. Based in Wake Forest, NC, serving Raleigh, Durham, Cary and the Triangle.',
    jsonLd: graph([organization(), website()]),
  },
  {
    path: 'products',
    title: 'Products & Services · Blueprint IT',
    description:
      'AI Automation and Technology Assessment for shops that run lean. 1-Hour Consultation ($150), Blueprint OS Foundation ($2,000), Automated Lead Handler ($1,500), or AI Assistant ($1,500 setup).',
    jsonLd: graph([
      breadcrumbs([HOME, { name: 'Products & Services', path: 'products' }]),
    ]),
  },
  {
    path: 'blueprint-os',
    title: 'Blueprint OS · AI Operating System · Tailored For Your Business · Blueprint IT',
    description:
      'Blueprint OS is the Shop Brain for your business: a living knowledge base your crew can ask directly, with 28 pre-wired AI skills. One hour of guided setup, $2,000 one time, yours from day one.',
    jsonLd: graph([
      breadcrumbs([HOME, { name: 'Blueprint OS', path: 'blueprint-os' }]),
      {
        '@type': 'Product',
        name: 'Blueprint OS Foundation',
        description:
          'A living Shop Brain for your business: local knowledge base, custom chat, and 28 pre-wired AI skills. Guided setup and training included.',
        brand: { '@type': 'Brand', name: 'Blueprint IT' },
        image: `${SITE}/logo/logo-square.png`,
        offers: {
          '@type': 'Offer',
          price: '2000.00',
          priceCurrency: 'USD',
          url: `${SITE}/blueprint-os`,
          availability: 'https://schema.org/InStock',
          seller: { '@id': ORG_ID },
        },
      },
    ]),
  },
  {
    path: 'consultation',
    title: '1-Hour Consultation · Blueprint IT',
    description:
      '60 minutes with Glenn. Bring your bottleneck. $150 flat. Pay with Stripe or PayPal, then book your call.',
    jsonLd: graph([
      breadcrumbs([HOME, { name: '1-Hour Consultation', path: 'consultation' }]),
      {
        '@type': 'Service',
        name: '1-Hour Consultation',
        description:
          '60 minutes one-on-one with Glenn Chua to work through an operations, automation or AI integration bottleneck.',
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'Country', name: 'United States' },
        offers: {
          '@type': 'Offer',
          price: '150.00',
          priceCurrency: 'USD',
          url: `${SITE}/consultation`,
          availability: 'https://schema.org/InStock',
        },
      },
    ]),
  },
  // Transactional endpoints: rendered so the SPA route resolves, but kept out
  // of the index and the sitemap.
  {
    path: 'products/thank-you',
    title: 'Thank You · Blueprint IT',
    description: 'Your Blueprint IT enquiry has been received.',
    noindex: true,
  },
  {
    path: 'blueprint-os/thank-you',
    title: 'Thank You · Blueprint IT',
    description: 'Your Blueprint OS purchase is confirmed.',
    noindex: true,
  },
  // Legacy route. Still built so a stale inbound link renders rather than
  // erroring if the host redirect is ever removed; canonical points at the
  // live page and it is excluded from the sitemap.
  {
    path: 'shop-os',
    title: 'Blueprint OS · Blueprint IT',
    description:
      'Blueprint OS gives your business a brain of its own: a Shop Brain that plugs into your stack, plus proof automations.',
    canonical: `${SITE}/blueprint-os`,
    noindex: true,
  },
]

// Routes that belong in sitemap.xml.
export const indexable = routes.filter((r) => !r.noindex)
