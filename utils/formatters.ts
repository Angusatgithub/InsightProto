export const formatCurrency = (value: number): string => {
  return value.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });
};

export const formatDateLong = (date: Date): string => {
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatMonth = (date: Date): string => {
  return date.toLocaleDateString("en-AU", {
    month: "short",
  }).toUpperCase();
};

export const formatCurrencyCompact = (value: number): string => {
  if (value >= 1000) {
    const thousands = value / 1000;
    return `$${thousands.toFixed(1)}k`;
  }
  return `$${value.toFixed(0)}`;
};
