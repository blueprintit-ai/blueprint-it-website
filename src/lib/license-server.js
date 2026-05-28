const BASE = import.meta.env.VITE_LICENSE_SERVER_URL || "https://shop-os-license-server.glenn-15d.workers.dev";

async function call(path, init = {}) {
  const resp = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data.error || `HTTP ${resp.status}`);
  }
  return data;
}

export const licenseServer = {
  async validateCoupon(code) {
    return call("/validate-coupon", { method: "POST", body: JSON.stringify({ code }) });
  },
  async createStripeSession({ email, code, productType }) {
    // productType is optional. The Worker defaults to "foundation" so the
    // existing PurchaseSection on /shop-ossi (which never sends it) keeps
    // working unchanged. /products and /consultation pass "consultation" to
    // hit the $150 SKU with no coupon flow.
    return call("/create-stripe-checkout-session", {
      method: "POST",
      body: JSON.stringify({ email, code, productType }),
    });
  },
  async createPayPalOrder({ email, code }) {
    return call("/create-paypal-order", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  },
  async capturePayPalOrder({ orderId, email }) {
    return call("/capture-paypal-order", {
      method: "POST",
      body: JSON.stringify({ orderId, email }),
    });
  },
  async paymentStatus({ sessionId, paypalOrderId }) {
    const qs = new URLSearchParams();
    if (sessionId) qs.set("session_id", sessionId);
    if (paypalOrderId) qs.set("paypal_order_id", paypalOrderId);
    return call(`/payment-status?${qs.toString()}`);
  },
};
