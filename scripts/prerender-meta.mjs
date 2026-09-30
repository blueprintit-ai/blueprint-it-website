// Postbuild: emit a real, fully-rendered index.html per route.
//
// Two jobs:
//   1. Per-route <head> — title, description, canonical, OG/Twitter, JSON-LD.
//   2. Per-route <body> — the page rendered to static HTML via the SSR bundle
//      in dist-ssr, so crawlers and AI answer engines that do not execute
//      JavaScript still read the page text. The client boots with createRoot
//      and replaces this markup, so there is no hydration contract to satisfy.
//
// The host serves these real files before applying any SPA rewrite.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE, BUSINESS } from './site.config.mjs'
import { routes, indexable } from './routes.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrEntry = join(root, 'dist-ssr', 'entry-server.js')

if (!existsSync(ssrEntry)) {
  console.error(
    `prerender: missing ${ssrEntry}\n` +
      `Run the SSR build first — "pnpm build" does both steps in order.`
  )
  process.exit(1)
}

const { render } = await import(new URL(`file://${ssrEntry}`).href)

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

// String.replace treats $$, $&, $` and $' specially IN THE REPLACEMENT. Page
// copy and JSON-LD both contain "$" (prices, priceRange "$$"), so every
// dynamic insertion goes through a function replacement, which is literal.
const sub = (haystack, pattern, value) => haystack.replace(pattern, () => value)
const template = readFileSync(join(dist, 'index.html'), 'utf8')

function head(r, url) {
  const canonical = r.canonical || url
  const tags = [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:url" content="${url}" />`,
  ]
  if (r.noindex) tags.push(`<meta name="robots" content="noindex, follow" />`)
  if (r.jsonLd) {
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(r.jsonLd).replace(/</g, '\\u003c')}</script>`
    )
  }
  return tags.map((t) => `    ${t}`).join('\n') + '\n  </head>'
}

function build(r) {
  const url = r.path ? `${SITE}/${r.path}` : `${SITE}/`
  const body = render(r.path ? `/${r.path}` : '/')
  if (!body || body.length < 500) {
    throw new Error(`prerender: /${r.path} rendered only ${body?.length ?? 0} chars`)
  }

  let html = template
  html = sub(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`)
  html = sub(html, /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${esc(r.description)}"`)
  html = sub(html, /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${esc(r.title)}"`)
  html = sub(html, /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${esc(r.description)}"`)
  html = sub(html, /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${esc(r.title)}"`)
  html = sub(html, /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${esc(r.description)}"`)
  html = sub(html, '</head>', head(r, url))
  html = sub(html, '<div id="root"></div>', `<div id="root">${body}</div>`)

  const outDir = r.path ? join(dist, r.path) : dist
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  return { path: r.path, bytes: Buffer.byteLength(html) }
}

// --- 404 -------------------------------------------------------------------
// Unknown URLs previously fell through the SPA catch-all and returned the
// homepage with HTTP 200 — an unbounded set of indexable soft-404s.
function build404() {
  let html = template
  html = sub(html, /<title>[\s\S]*?<\/title>/, '<title>Page not found \u00b7 Blueprint IT</title>')
  html = sub(html, /<meta name="description" content="[^"]*"/,
    '<meta name="description" content="That page does not exist."')
  html = sub(html, '</head>', '    <meta name="robots" content="noindex, nofollow" />\n  </head>')
  html = sub(html, '<div id="root"></div>',
    `<div id="root"><main style="font-family:system-ui;max-width:42rem;margin:20vh auto;padding:0 1.5rem">` +
      `<h1>404 \u2014 page not found</h1>` +
      `<p>That page does not exist. <a href="${SITE}/">Return to Blueprint IT</a>.</p>` +
      `</main></div>`)
  writeFileSync(join(dist, '404.html'), html)
  return Buffer.byteLength(html)
}

// --- sitemap ---------------------------------------------------------------
// Generated from the same route table, so a noindex route can never be listed.
function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    indexable
      .map((r) => {
        const loc = r.path ? `${SITE}/${r.path}` : `${SITE}/`
        return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${r.path ? '0.8' : '1.0'}</priority>\n  </url>`
      })
      .join('\n') +
    `\n</urlset>\n`
  writeFileSync(join(dist, 'sitemap.xml'), xml)
  return indexable.length
}

for (const r of routes) {
  const { path, bytes } = build(r)
  console.log(`prerender: dist/${path ? path + '/' : ''}index.html  (${(bytes / 1024).toFixed(1)} kB)`)
}
console.log(`prerender: dist/404.html  (${(build404() / 1024).toFixed(1)} kB)`)
console.log(`prerender: dist/sitemap.xml  (${buildSitemap()} urls)`)

const missing = Object.entries({
  streetAddress: BUSINESS.streetAddress,
  telephone: BUSINESS.telephone,
  foundingDate: BUSINESS.foundingDate,
  sameAs: BUSINESS.sameAs.length ? BUSINESS.sameAs : null,
})
  .filter(([, v]) => v == null)
  .map(([k]) => k)

if (missing.length) {
  console.warn(
    `\nprerender: WARNING — omitted from LocalBusiness schema (unset in scripts/site.config.mjs):\n  ${missing.join(', ')}`
  )
}
