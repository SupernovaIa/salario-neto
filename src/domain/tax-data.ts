/**
 * Datos fiscales versionados por año.
 *
 * IMPORTANTE: son parámetros públicos (tramos de IRPF, tipos de cotización,
 * topes de la Seguridad Social). Para actualizar de un año a otro basta con
 * añadir una entrada aquí; la lógica de cálculo no cambia.
 *
 * La escala de IRPF es la escala general de referencia (estatal + tramo
 * autonómico que coincide con el estatal). En la v2 se sustituirá por la
 * escala de cada comunidad autónoma.
 */

import type { ParametrosFiscales } from "./types";

const PARAMETROS_2025: ParametrosFiscales = {
  anio: 2025,
  // Base máxima de cotización: 4.909,50 €/mes × 12.
  baseMaximaCotizacionAnual: 4909.5 * 12,
  cotizacion: {
    contingenciasComunes: 0.047, // 4,70 %
    desempleoIndefinido: 0.0155, // 1,55 %
    desempleoTemporal: 0.016, // 1,60 %
    formacionProfesional: 0.001, // 0,10 %
    mei: 0.0013, // 0,13 % (cuota del trabajador en 2025)
  },
  escalaIRPF: [
    { hasta: 12450, tipo: 0.19 },
    { hasta: 20200, tipo: 0.24 },
    { hasta: 35200, tipo: 0.3 },
    { hasta: 60000, tipo: 0.37 },
    { hasta: 300000, tipo: 0.45 },
    { hasta: null, tipo: 0.47 },
  ],
  minimoPersonal: 5550,
  gastosDeducibles: 2000,
  reduccionTrabajo: {
    limiteMaximo: 14852,
    limiteSuperior: 19747.5,
    reduccionPlena: 7302,
    coeficiente: 1.75,
  },
};

const PARAMETROS_2026: ParametrosFiscales = {
  ...PARAMETROS_2025,
  anio: 2026,
  // La cuota del MEI del trabajador sube 0,02 puntos cada año hasta 2029.
  cotizacion: {
    ...PARAMETROS_2025.cotizacion,
    mei: 0.0015, // 0,15 % en 2026
  },
};

const PARAMETROS_POR_ANIO: Record<number, ParametrosFiscales> = {
  2025: PARAMETROS_2025,
  2026: PARAMETROS_2026,
};

/** Último año con parámetros disponibles (usado como valor por defecto). */
export const ANIO_POR_DEFECTO = 2026;

/** Años disponibles, de más reciente a más antiguo. */
export const ANIOS_DISPONIBLES = Object.keys(PARAMETROS_POR_ANIO)
  .map(Number)
  .sort((a, b) => b - a);

/**
 * Devuelve los parámetros fiscales de un año. Si no existen, cae al año más
 * reciente disponible.
 */
export function parametrosDe(anio: number): ParametrosFiscales {
  return PARAMETROS_POR_ANIO[anio] ?? PARAMETROS_POR_ANIO[ANIO_POR_DEFECTO];
}
