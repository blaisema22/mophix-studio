export default function formatPrice(rawPrice, decimalsOrFallback = 0) {
  const fallback = typeof decimalsOrFallback === 'string' ? decimalsOrFallback : null;
  const decimals = typeof decimalsOrFallback === 'number' ? decimalsOrFallback : 0;

  if (rawPrice === null || rawPrice === undefined) return fallback;

  const normalize = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
      return Number.isFinite(parsed) ? parsed : NaN;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : NaN;
  };

  const value = normalize(rawPrice);
  if (!Number.isFinite(value)) return fallback;

  if (value >= 1_000_000) {
    return `${parseFloat((value / 1_000_000).toFixed(decimals))}M`;
  }

  if (value >= 1_000) {
    return `${parseFloat((value / 1_000).toFixed(decimals))}k`;
  }

  return parseFloat(value.toFixed(decimals)).toString();
}
