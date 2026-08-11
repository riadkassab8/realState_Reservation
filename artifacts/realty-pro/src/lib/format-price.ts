const CURRENCY_SYMBOLS: Record<string, string> = {
  SAR: "ر.س",
  EGP: "ج.م",
  AED: "د.إ",
  KWD: "د.ك",
  QAR: "ر.ق",
  OMR: "ر.ع.",
  BHD: "د.ب.",
  JOD: "د.أ",
  USD: "$",
};

function getCurrencyCode(priceUnit: string | null | undefined): string {
  if (!priceUnit) return "SAR";
  const upper = priceUnit.toUpperCase();
  for (const code of Object.keys(CURRENCY_SYMBOLS)) {
    if (upper.includes(code)) return code;
  }
  return "SAR";
}

export function formatPrice(
  price: number,
  priceUnit: string | null | undefined,
  language: string
): string {
  const code = getCurrencyCode(priceUnit);
  const symbol = CURRENCY_SYMBOLS[code] ?? code;
  const locale = language === "ar" ? "ar-EG" : "en-US";
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(price);
  
  // Use EGP for English, ج.م for Arabic
  if (code === "EGP") {
    return language === "ar" ? `${formatted} ج.م` : `${formatted} EGP`;
  }
  
  return language === "ar" ? `${formatted} ${symbol}` : `${symbol} ${formatted}`;
}
