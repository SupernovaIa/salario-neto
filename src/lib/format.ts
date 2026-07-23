const euros = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const eurosCentimos = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const porcentaje = new Intl.NumberFormat("es-ES", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Formatea un importe en euros sin decimales (para cifras grandes). */
export const formatoEuros = (valor: number) => euros.format(valor);

/** Formatea un importe en euros con dos decimales (para la cifra destacada). */
export const formatoEurosCentimos = (valor: number) =>
  eurosCentimos.format(valor);

/** Formatea una proporción (0-1) como porcentaje. */
export const formatoPorcentaje = (valor: number) => porcentaje.format(valor);
