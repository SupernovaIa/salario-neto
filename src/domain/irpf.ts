import { aplicarEscala } from "./scale";
import type { DesgloseIRPF, ParametrosFiscales } from "./types";

/**
 * Reducción por obtención de rendimientos del trabajo (art. 20 LIRPF).
 *
 * - Rendimiento neto previo <= límite máximo => reducción plena.
 * - Entre el límite máximo y el superior => reducción decreciente lineal.
 * - Por encima del límite superior => 0.
 */
export function reduccionPorTrabajo(
  rendimientoNetoPrevio: number,
  parametros: ParametrosFiscales,
): number {
  const { limiteMaximo, limiteSuperior, reduccionPlena, coeficiente } =
    parametros.reduccionTrabajo;

  if (rendimientoNetoPrevio <= limiteMaximo) return reduccionPlena;
  if (rendimientoNetoPrevio > limiteSuperior) return 0;

  const reduccion =
    reduccionPlena - coeficiente * (rendimientoNetoPrevio - limiteMaximo);
  return Math.max(0, reduccion);
}

/**
 * Calcula la retención anual de IRPF.
 *
 * Sigue el método en dos cuotas que usa la AEAT: se aplica la escala a la base
 * liquidable completa y se le resta la cuota correspondiente al mínimo personal
 * (así el mínimo tributa al tipo 0 pero respetando la progresividad).
 *
 * `cotizacionSS` es la cotización anual del trabajador, que es gasto deducible
 * del rendimiento del trabajo.
 */
export function calcularIRPF(
  brutoAnual: number,
  cotizacionSS: number,
  parametros: ParametrosFiscales,
): DesgloseIRPF {
  const { escalaIRPF, minimoPersonal, gastosDeducibles } = parametros;

  // Rendimiento neto previo = ingresos - gastos deducibles - cotización SS.
  const rendimientoNetoPrevio = Math.max(
    0,
    brutoAnual - cotizacionSS - gastosDeducibles,
  );

  const reduccionTrabajo = reduccionPorTrabajo(
    rendimientoNetoPrevio,
    parametros,
  );

  const baseLiquidable = Math.max(0, rendimientoNetoPrevio - reduccionTrabajo);

  // Método de las dos cuotas: el mínimo personal no reduce la base, sino que
  // resta la cuota que le correspondería a su tramo.
  const cuotaBase = aplicarEscala(baseLiquidable, escalaIRPF);
  const cuotaMinimo = aplicarEscala(
    Math.min(baseLiquidable, minimoPersonal),
    escalaIRPF,
  );
  const cuotaLiquida = Math.max(0, cuotaBase - cuotaMinimo);

  const tipoRetencion = brutoAnual > 0 ? cuotaLiquida / brutoAnual : 0;
  const retencionAnual = cuotaLiquida;

  return {
    rendimientoNetoPrevio,
    reduccionTrabajo,
    baseLiquidable,
    cuotaLiquida,
    tipoRetencion,
    retencionAnual,
  };
}
