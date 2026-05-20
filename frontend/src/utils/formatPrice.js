export default function formatPrice(rawPrice, decimals = 0) {
  if (rawPrice === null || rawPrice === undefined) return null;

  if (typeof rawPrice === 'number')  {
    return Number.isFinite(rawPrice) ? rawPrice.toFixed(decimals) : null;
  }

  if (typeof rawPrice === 'string') {
    const parsed = parseFloat(rawPrice.replace(/[^\d.-]/g, ''));
    return Number.isFinite(parsed) ? parsed.toFixed(decimals) : null;
  }

  const parsed = Number(rawPrice);
  return Number.isFinite(parsed) ? parsed.toFixed(decimals) : null;
}