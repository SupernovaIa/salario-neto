import type { Tramo } from "./types";

/**
 * Aplica una escala progresiva por tramos a una base.
 *
 * Cada tramo tributa solo por la parte de la base que cae dentro de él, no por
 * el total (progresividad real). Devuelve la cuota total.
 */
export function aplicarEscala(base: number, escala: Tramo[]): number {
  if (base <= 0) return 0;

  let cuota = 0;
  let limiteInferior = 0;

  for (const tramo of escala) {
    const limiteSuperior = tramo.hasta ?? Infinity;
    if (base <= limiteInferior) break;

    const baseEnTramo = Math.min(base, limiteSuperior) - limiteInferior;
    cuota += baseEnTramo * tramo.tipo;
    limiteInferior = limiteSuperior;
  }

  return cuota;
}
