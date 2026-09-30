// SSR entry used only at build time by scripts/prerender-meta.mjs.
// Renders each route to static HTML so crawlers and AI answer engines get the
// real page text instead of an empty <div id="root">. The client still boots
// with createRoot and replaces this markup, so there is no hydration contract
// to keep — browser-only effects stay untouched.
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
}
