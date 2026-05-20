import { useState, useEffect } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function SiteNav({ onCtaClick, navItems, ctaLabel = 'Discovery Call' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Live clock — editorial flourish from the original nav
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/New_York',
    })
  )
  useEffect(() => {
    const t = setInterval(() => {
      setClock(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'America/New_York',
        })
      )
    }, 15_000)
    return () => clearInterval(t)
  }, [])

  return (
    <nav className="sticky top-0 z-40 bg-[color:var(--paper)]/92 backdrop-blur border-b border-[color:var(--ink)]">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10">
        <a
          href="#top"
          className="flex items-baseline gap-3"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <span className="font-display text-2xl leading-none tracking-tight">
            Blueprint
            <span className="font-display-italic text-[color:var(--rust)]">IT</span>
          </span>
          <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-mute)]">
            / est. 2024 / Wake Forest · NC
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} onAfterClick={() => setIsMenuOpen(false)} />
          ))}
          <span className="font-mono text-[11px] text-[color:var(--ink-mute)] tabular-nums">
            {clock} EST
          </span>
          <button onClick={onCtaClick} className="btn-ink btn-rust">
            {ctaLabel}
            <ArrowUpRight size={14} strokeWidth={2} />
          </button>
        </div>

        <button
          className="md:hidden text-[color:var(--ink)]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-[color:var(--paper-line)] bg-[color:var(--paper)]">
          <div className="px-6 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                mobile
                onAfterClick={() => setIsMenuOpen(false)}
              />
            ))}
            <button
              onClick={() => {
                setIsMenuOpen(false)
                onCtaClick()
              }}
              className="btn-ink btn-rust mt-2 w-full justify-center"
            >
              {ctaLabel} <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavItem({ item, mobile, onAfterClick }) {
  const location = useLocation()
  const activeClass = 'text-[color:var(--ink)]'
  const inactiveClass = 'text-[color:var(--ink-soft)]'

  // Determine active: route matches current path; "/" matches both "/" and "/#..."
  let isActive = false
  if (item.kind === 'route' && location.pathname === item.to) isActive = true
  // For 'button' or 'link' kinds, active state is implied by being on the home route
  // and the item targeting the home route's sections — we leave them inactive (subtle).

  const colorClass = isActive ? activeClass : inactiveClass

  const baseClass = mobile
    ? `text-left font-mono text-xs uppercase tracking-[0.18em] py-2 ${colorClass}`
    : `font-mono text-[11px] uppercase tracking-[0.18em] ${colorClass} hover:text-[color:var(--ink)] transition-colors`

  if (item.kind === 'button') {
    return (
      <button
        onClick={() => {
          item.onClick()
          onAfterClick?.()
        }}
        className={baseClass}
      >
        {item.label}
      </button>
    )
  }

  if (item.kind === 'route') {
    return (
      <Link to={item.to} onClick={() => onAfterClick?.()} className={baseClass}>
        {item.label}
      </Link>
    )
  }

  // kind === 'link' — plain anchor (used for cross-page hash links like /#services).
  // We use a plain <a> on purpose: browser handles scroll-to-hash automatically after
  // the home page loads, which avoids needing a custom ScrollToHash router helper.
  return (
    <a
      href={item.href}
      onClick={(e) => {
        if (item.onAnchor) {
          e.preventDefault()
          item.onAnchor()
        }
        onAfterClick?.()
      }}
      className={baseClass}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
    >
      {item.label}
    </a>
  )
}
