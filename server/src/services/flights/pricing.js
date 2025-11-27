/**
 * Pricing helpers:
 * - compute base price (if provider doesn't supply it)
 * - apply promo discounts
 */
export function computeBasePriceForSegment(providerOffer) {
  // If provider has price, use it. Otherwise create a deterministic price:
  if (providerOffer && providerOffer.price) return Number(providerOffer.price);
  // fallback: price by distance/duration heuristics (simple)
  const durationMinutes =
    parseDurationToMinutes(providerOffer?.duration) || 120;
  const base = 2000 + durationMinutes * 20; // ₹20/min
  return Math.round(base);
}

function parseDurationToMinutes(isoDur) {
  // isoDur like "PT2H30M" or "PT2H"
  if (!isoDur) return null;
  const m = isoDur.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return null;
  const h = parseInt(m[1] || 0, 10);
  const mm = parseInt(m[2] || 0, 10);
  return h * 60 + mm;
}

export function applyPromoToPrice(price, promo) {
  if (!promo) return { final: price, discount: 0 };
  if (promo.type === "fixed") {
    const discount = Math.min(promo.value, price);
    return { final: price - discount, discount };
  } else if (promo.type === "percent") {
    const discount = Math.round((price * promo.value) / 100);
    return { final: price - discount, discount };
  }
  return { final: price, discount: 0 };
}
