export default function SiteFooter({ links }) {
  return (
    <footer className="border-t border-[color:var(--ink)] bg-[color:var(--paper-2)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-baseline gap-4">
          <span className="font-display text-xl">
            Blueprint
            <span className="font-display-italic text-[color:var(--rust)]">IT</span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--ink-mute)]">
            © {new Date().getFullYear()} · All rights reserved
          </span>
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--ink-mute)]">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => {
                if (l.onAnchor) {
                  e.preventDefault()
                  l.onAnchor()
                }
              }}
              className="hover:text-[color:var(--ink)]"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
