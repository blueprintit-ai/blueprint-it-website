// ---------------------------------------------------------------------------
// Single source of truth for everything the crawlers read about the business.
// EDIT THE VALUES MARKED "TODO" — they are the only fabricated-if-left-alone
// facts on the site. Anything still set to null is omitted from the schema
// rather than published as a placeholder.
// ---------------------------------------------------------------------------

export const SITE = 'https://blueprintit.ai'

export const BUSINESS = {
  name: 'Blueprint IT',
  legalName: 'Blueprint IT',
  email: 'glenn@blueprintit.ai',

  // TODO: street address for the full LocalBusiness record.
  streetAddress: null, // e.g. '123 S Main St, Suite 200'
  addressLocality: 'Wake Forest',
  addressRegion: 'NC',
  postalCode: '27587',
  addressCountry: 'US',

  // Wake Forest, NC town centroid.
  latitude: 35.9799,
  longitude: -78.5103,

  // TODO: public business phone in E.164, e.g. '+1-919-555-0123'.
  telephone: null,

  // Taken from the wordmark itself: "EST. 2024 / WAKE FOREST / NC".
  foundingDate: '2024',

  // TODO: profile URLs — LinkedIn company page, YouTube, X, GitHub, etc.
  sameAs: [],

  founder: 'Glenn Chua',
  priceRange: '$$',
  logo: `${SITE}/logo/logo-square.png`,
  logoWidth: 2400,
  logoHeight: 2400,
  ogImage: `${SITE}/og/og-default.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Blueprint IT — schematics for the AI-native business',

  areaServed: [
    'Wake Forest, NC',
    'Raleigh, NC',
    'Durham, NC',
    'Cary, NC',
    'Chapel Hill, NC',
    'Wake County, NC',
    'Research Triangle, NC',
  ],

  knowsAbout: [
    'AI automation for small business',
    'IT consulting',
    'Business process automation',
    'Lead response automation',
    'Knowledge base systems',
  ],

  openingHours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
  },
}

// Products as shown on the pages — prices here must match visible page copy.
export const CATALOG = [
  { name: '1-Hour Consultation', price: '150.00', url: `${SITE}/consultation`,
    description: '60 minutes one-on-one with Glenn to work through an operations, automation or AI integration bottleneck.' },
  { name: 'Blueprint OS Foundation', price: '2000.00', url: `${SITE}/blueprint-os`,
    description: 'A living Shop Brain for your business: local knowledge base, custom chat, and 28 pre-wired AI skills. Guided setup and training included.' },
  { name: 'Automated Lead Handler', price: '1500.00', url: `${SITE}/products`,
    description: 'Every lead answered in minutes, with AI drafting a personalized reply the moment a lead comes in.' },
]
