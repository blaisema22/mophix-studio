export const formatPrice = (price, fallback = 'Contact') => {
  const value = Number(price);
  return Number.isFinite(value) ? `RWF ${value.toFixed(0)}k` : fallback;
};
