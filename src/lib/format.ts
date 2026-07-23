const euros = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const eurosWithCents = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("es-ES", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Formats an amount in euros with no decimals (for large figures). */
export const formatEuros = (value: number) => euros.format(value);

/** Formats an amount in euros with two decimals (for the headline figure). */
export const formatEurosWithCents = (value: number) =>
  eurosWithCents.format(value);

/** Formats a proportion (0-1) as a percentage. */
export const formatPercent = (value: number) => percent.format(value);
