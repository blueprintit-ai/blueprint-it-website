import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { licenseServer } from '@/lib/license-server'

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST
const PAYPAL_CID = import.meta.env.VITE_PAYPAL_CLIENT_ID ?? import.meta.env.VITE_PAYPAL_CLIENT_ID_TEST
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null

function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`
}

export default function PurchaseSection() {
  const [couponInput, setCouponInput] = useState('')
  const [validating, setValidating] = useState(false)
  const [coupon, setCoupon] = useState(null)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(null) // null | 'stripe' | 'paypal'
  const [error, setError] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const c = params.get('code')
    if (c) {
      setCouponInput(c)
      applyCoupon(c)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const basePrice = 50000
  const finalPrice = coupon?.finalPrice ?? basePrice
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  async function applyCoupon(code = couponInput) {
    setError(null)
    setValidating(true)
    try {
      const r = await licenseServer.validateCoupon(code)
      if (!r.valid) {
        setError(r.error || 'Code not recognized.')
        setCoupon(null)
      } else {
        setCoupon(r)
      }
    } catch (e) {
      setError(e.message)
      setCoupon(null)
    } finally {
      setValidating(false)
    }
  }

  function clearCoupon() {
    setCoupon(null)
    setCouponInput('')
    setError(null)
  }

  async function payWithStripe() {
    if (!emailValid) { setError('Enter a valid email first.'); return }
    setSubmitting('stripe'); setError(null)
    try {
      const { checkoutUrl } = await licenseServer.createStripeSession({
        email,
        code: coupon?.code,
      })
      window.location.href = checkoutUrl
    } catch (e) {
      setError(e.message)
      setSubmitting(null)
    }
  }

  return (
    <section id="purchase" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] mb-4">
          Get Shop OS Foundation
        </h2>
        <p className="text-lg text-[color:var(--ink-soft)] mb-10">
          $500 one-time. Lifetime license. Install in 15 minutes.
        </p>

        <div className="border border-[color:var(--border)] rounded-sm p-8 bg-white/40 backdrop-blur-sm">
          <div className="mb-6">
            {coupon ? (
              <div>
                <div className="text-[color:var(--ink-soft)] line-through text-sm">
                  Base: {formatCents(basePrice)}
                </div>
                <div className="text-4xl font-display">{formatCents(finalPrice)}</div>
                <div className="text-sm text-[color:var(--rust)] mt-1">{coupon.label}</div>
              </div>
            ) : (
              <div className="text-4xl font-display">{formatCents(basePrice)}</div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-[color:var(--ink-soft)] mb-2">
              Have a code?
            </label>
            {coupon ? (
              <div className="flex items-center gap-2">
                <code className="px-3 py-2 bg-[color:var(--bg-soft,#ebe5d3)] border border-[color:var(--border)] flex-1 text-sm">
                  {coupon.code}
                </code>
                <button
                  type="button"
                  onClick={clearCoupon}
                  className="text-sm underline text-[color:var(--ink-soft)]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="FOUNDING50"
                  className="flex-1 px-3 py-2 border border-[color:var(--border)] bg-white"
                />
                <button
                  type="button"
                  onClick={() => applyCoupon()}
                  disabled={!couponInput || validating}
                  className="px-4 py-2 border border-[color:var(--ink)] disabled:opacity-50"
                >
                  {validating ? '...' : 'Apply'}
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-[color:var(--ink-soft)] mb-2">
              Your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourshop.com"
              className="w-full px-3 py-2 border border-[color:var(--border)] bg-white"
            />
            <p className="text-xs text-[color:var(--ink-soft)] mt-1">
              We send your license key here.
            </p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-[color:var(--rust)]">{error}</div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={payWithStripe}
              disabled={!emailValid || submitting !== null}
              className="px-6 py-3 bg-[color:var(--ink)] text-white disabled:opacity-50"
            >
              {submitting === 'stripe' ? 'Loading...' : `Pay with Card  ·  ${formatCents(finalPrice)}`}
            </button>

            <div>
              {PAYPAL_CID && emailValid ? (
                <PayPalScriptProvider options={{
                  clientId: PAYPAL_CID,
                  currency: 'USD',
                  components: 'buttons',
                  intent: 'capture',
                  enableFunding: 'venmo,paylater',
                }}>
                  <PayPalButtons
                    style={{ layout: 'horizontal', height: 45, label: 'pay', tagline: false }}
                    createOrder={async () => {
                      const { orderId } = await licenseServer.createPayPalOrder({
                        email, code: coupon?.code,
                      })
                      return orderId
                    }}
                    onApprove={async (data) => {
                      try {
                        await licenseServer.capturePayPalOrder({
                          orderId: data.orderID, email,
                        })
                        window.location.href = `/shop-ossi/thank-you?paypal_order_id=${data.orderID}`
                      } catch (e) {
                        setError(e.message)
                      }
                    }}
                    onError={(err) => setError(err.message || 'PayPal error')}
                    onCancel={() => setSubmitting(null)}
                  />
                </PayPalScriptProvider>
              ) : (
                <div className="px-6 py-3 border border-[color:var(--border)] text-center text-sm text-[color:var(--ink-soft)]">
                  {emailValid ? 'PayPal loading...' : 'Enter email to pay with PayPal / Venmo'}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-[color:var(--ink-soft)] mt-6 text-center">
          Payments are processed by Stripe and PayPal. We never see your card details.
        </p>
      </div>
    </section>
  )
}
