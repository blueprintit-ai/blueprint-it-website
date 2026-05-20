// Shared "blueprint drawing" primitives used across pages.
// Lifted verbatim from the original App.jsx so both Home and Shop OS can import.

export const SectionTag = ({ id, children }) => (
  <div className="flex items-center gap-4">
    <span className="label label-cyan">§{id}</span>
    <span className="h-px w-12 bg-[color:var(--cyan)] opacity-60" />
    <span className="label">{children}</span>
  </div>
)

export const RegMark = ({ position = 'top-left' }) => {
  const map = {
    'top-left': 'left-[-10px] top-[-10px]',
    'top-right': 'right-[-10px] top-[-10px]',
    'bottom-left': 'left-[-10px] bottom-[-10px]',
    'bottom-right': 'right-[-10px] bottom-[-10px]',
  }
  return <span aria-hidden className={`reg-mark ${map[position]}`} />
}

export const Plate = ({ accent = 'cyan', children, className = '' }) => (
  <div
    className={`plate ${accent === 'rust' ? 'plate-rust' : 'plate-cyan'} ${className}`}
  >
    <RegMark position="top-left" />
    <RegMark position="top-right" />
    <RegMark position="bottom-left" />
    <RegMark position="bottom-right" />
    {children}
  </div>
)
