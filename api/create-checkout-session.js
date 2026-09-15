// Vercel serverless function: creates a Stripe Checkout session with an exact amount.
// Requires env var STRIPE_SECRET_KEY (set in Vercel dashboard, never in code).
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { amount, description } = req.body || {};
  const total = Math.round(Number(amount));
  if (!Number.isFinite(total) || total < 500 || total > 250000) {
    res.status(400).json({ error: "Invalid amount" });
    return;
  }
  const params = new URLSearchParams({
    mode: "payment",
    success_url: "https://www.gymplusone.com/games?paid=success",
    cancel_url: "https://www.gymplusone.com/games",
    "line_items[0][price_data][currency]": "gbp",
    "line_items[0][price_data][unit_amount]": String(total),
    "line_items[0][price_data][product_data][name]": (description || "The Gym+1 Games").slice(0, 200),
    "line_items[0][quantity]": "1",
    "metadata[source]": "gymplusone-games-page"
  });
  try {
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.STRIPE_SECRET_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(500).json({ error: (data.error && data.error.message) || "Stripe error" });
      return;
    }
    res.status(200).json({ url: data.url });
  } catch (e) {
    res.status(500).json({ error: "Checkout failed" });
  }
}
