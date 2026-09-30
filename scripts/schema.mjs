// Builds the JSON-LD graph. Every field sourced from scripts/site.config.mjs;
// anything still null there is dropped rather than emitted as a placeholder,
// so the published schema never asserts a fact we do not have.
import { SITE, BUSINESS as B, CATALOG } from './site.config.mjs'

const drop = (o) => {
  if (Array.isArray(o)) return o.map(drop).filter((v) => v != null)
  if (o && typeof o === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(o)) {
      const c = drop(v)
      if (c == null) continue
      if (Array.isArray(c) && c.length === 0) continue
      out[k] = c
    }
    return Object.keys(out).length ? out : null
  }
  return o
}

export const ORG_ID = `${SITE}/#business`
export const SITE_ID = `${SITE}/#website`

export const organization = () =>
  drop({
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: B.name,
    legalName: B.legalName,
    url: SITE,
    description:
      'Boutique IT consulting and AI automation for small businesses, based in Wake Forest, NC.',
    slogan: 'Schematics for the AI-Native Business',
    email: B.email,
    telephone: B.telephone,
    foundingDate: B.foundingDate,
    priceRange: B.priceRange,
    logo: {
      '@type': 'ImageObject',
      url: B.logo,
      width: B.logoWidth,
      height: B.logoHeight,
    },
    image: B.ogImage,
    sameAs: B.sameAs,
    founder: { '@type': 'Person', name: B.founder, jobTitle: 'Principal' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: B.streetAddress,
      addressLocality: B.addressLocality,
      addressRegion: B.addressRegion,
      postalCode: B.postalCode,
      addressCountry: B.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: B.latitude,
      longitude: B.longitude,
    },
    areaServed: B.areaServed.map((n) => ({ '@type': 'Place', name: n })),
    knowsAbout: B.knowsAbout,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: B.openingHours.days,
        opens: B.openingHours.opens,
        closes: B.openingHours.closes,
      },
    ],
    contactPoint: [
      drop({
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: B.email,
        telephone: B.telephone,
        areaServed: 'US',
        availableLanguage: 'English',
      }),
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Products & Services',
      itemListElement: CATALOG.map((p) => ({
        '@type': 'Offer',
        price: p.price,
        priceCurrency: 'USD',
        url: p.url,
        availability: 'https://schema.org/InStock',
        itemOffered: {
          '@type': 'Service',
          name: p.name,
          description: p.description,
          provider: { '@id': ORG_ID },
        },
      })),
    },
  })

export const website = () => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: SITE,
  name: B.name,
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-US',
})

// crumbs: [{ name, path }] — path '' is the homepage.
export const breadcrumbs = (crumbs) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: c.path ? `${SITE}/${c.path}` : `${SITE}/`,
  })),
})

export const graph = (nodes) => ({ '@context': 'https://schema.org', '@graph': nodes })
