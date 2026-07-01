const CURRENCY_SYMBOLS = {
  UGX: "UGX ",
  NGN: "₦",
  KES: "KSh ",
  GHS: "GH₵",
  USD: "$",
  INR: "₹",
};

export const formatMoney = (amount, currency = "UGX") => {
  const symbol = CURRENCY_SYMBOLS[currency?.toUpperCase()] || `${currency} `;
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return `${symbol}0`;
  }

  const zeroDecimal = new Set(["UGX", "RWF", "JPY", "KRW"]).has(
    currency?.toUpperCase()
  );

  const formatted = zeroDecimal
    ? Math.round(value).toLocaleString()
    : value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  return `${symbol}${formatted}`;
};
