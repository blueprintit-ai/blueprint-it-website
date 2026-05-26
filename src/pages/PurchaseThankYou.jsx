import { useEffect, useState } from 'react'
import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
import { licenseServer } from '@/lib/license-server'

const PDF_URL = (import.meta.env.VITE_LICENSE_SERVER_URL || 'https://shop-os-license-server.glenn-15d.workers.dev') + '/welcome.pdf'

export default function PurchaseThankYou() {
  const [status, setStatus] = useState('checking')   // 'checking' | 'succeeded' | 'pending' | 'failed'
  const [licenseKey, setLicenseKey] = useState(null)
  const [copied, setCopied] = useState(false)

  async function copyKey() {
    if (!licenseKey) return
    try {
      await navigator.clipboard.writeText(licenseKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers / non-HTTPS contexts
      const textarea = document.createElement('textarea')
      textarea.value = licenseKey
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
      document.body.removeChild(textarea)
    }
  }

  useEffect(() => {
    document.title = 'Welcome to Shop OS · Blueprint IT'
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    const paypalOrderId = params.get('paypal_order_id')
    if (!sessionId && !paypalOrderId) {
      setStatus('failed')
      return
    }

    let cancelled = false
    let attempts = 0
    const poll = async () => {
      if (cancelled) return
      if (attempts >= 15) {
        setStatus('pending')
        return
      }
      attempts++
      try {
        const r = await licenseServer.paymentStatus({ sessionId, paypalOrderId })
        if (r.status === 'succeeded') {
          setLicenseKey(r.licenseKey || null)
          setStatus('succeeded')
          return
        }
      } catch {}
      setTimeout(poll, 2000)
    }
    poll()
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <SiteNav navItems={[
        { kind: 'link', label: 'Home', href: '/' },
      ]} />
      <main className="mx-auto max-w-2xl px-6 py-20 md:py-28">
        {status === 'checking' && (
          <div>
            <h1 className="font-display text-4xl mb-4">Processing your payment...</h1>
            <p>This usually takes a few seconds. Don't close this tab.</p>
          </div>
        )}
        {status === 'succeeded' && (
          <div>
            <h1 className="font-display text-4xl mb-4">Welcome aboard.</h1>
            <p className="text-lg mb-6">
              Your license key is on its way to your inbox. Check the next minute or two,
              including your spam folder.
            </p>
            {licenseKey && (
              <div className="my-8 p-6 bg-[color:var(--bg-soft,#ebe5d3)] border border-[color:var(--border)] text-center">
                <div className="text-xs uppercase tracking-widest mb-3 text-[color:var(--ink-soft)]">Your license key</div>
                <button
                  type="button"
                  onClick={copyKey}
                  title="Click to copy"
                  className="font-mono text-xl md:text-2xl tracking-[0.15em] px-4 py-2 border border-transparent hover:bg-white/60 hover:border-[color:var(--border)] transition-colors cursor-pointer select-all"
                >
                  {licenseKey}
                </button>
                <div className="text-xs uppercase tracking-widest mt-3 text-[color:var(--ink-soft)] h-4">
                  {copied ? 'Copied to clipboard' : 'Click to copy'}
                </div>
              </div>
            )}
            <p className="mb-4">
              The email includes your install instructions and a 4-page how-to PDF.
              You can also view it now:
            </p>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener"
              className="inline-block px-6 py-3 bg-[color:var(--ink)] text-white"
            >
              View the install guide
            </a>
            <p className="mt-12 text-sm text-[color:var(--ink-soft)]">
              Need help? <a href="mailto:glenn@blueprintit.ai" className="underline">glenn@blueprintit.ai</a>
            </p>
          </div>
        )}
        {status === 'pending' && (
          <div>
            <h1 className="font-display text-4xl mb-4">Payment received.</h1>
            <p className="text-lg mb-4">
              Your license key is being prepared. You'll receive an email within the next
              5 minutes. If it doesn't arrive, reply to your welcome email or contact
              <a href="mailto:glenn@blueprintit.ai" className="underline ml-1">glenn@blueprintit.ai</a>.
            </p>
          </div>
        )}
        {status === 'failed' && (
          <div>
            <h1 className="font-display text-4xl mb-4">Hmm, something's not right.</h1>
            <p>
              We couldn't find your payment. If you just completed checkout, refresh this
              page in a minute. Otherwise <a href="/shop-ossi#purchase" className="underline">return to the purchase page</a>.
            </p>
          </div>
        )}
      </main>
      <SiteFooter
        links={[
          { label: 'Services', href: '/#services' },
          { label: 'Studio', href: '/#about' },
          { label: 'Contact', href: '/#contact' },
        ]}
      />
    </>
  )
}
