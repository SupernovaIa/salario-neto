import { calcularIRPF } from "./irpf";
import { calcularSeguridadSocial } from "./social-security";
import { parametrosDe } from "./tax-data";
import type { DatosEntrada, Resultado } from "./types";

/**
 * Calcula el salario neto a partir del bruto.
 *
 * Punto de entrada del motor: orquesta la cotización a la Seguridad Social y la
 * retención de IRPF, y reparte el neto anual entre el número de pagas.
 *
 * NOTA: es un cálculo aproximado. No contempla mínimos por descendientes,
 * situación familiar, discapacidad, ni las regularizaciones del algoritmo
 * exacto de la AEAT. Sirve para estimar, no para cuadrar la nómina al céntimo.
 */
export function calcularNeto(datos: DatosEntrada): Resultado {
  const parametros = parametrosDe(datos.anio);
  const brutoAnual = Math.max(0, datos.brutoAnual);

  const seguridadSocial = calcularSeguridadSocial(
    { ...datos, brutoAnual },
    parametros,
  );

  const irpf = calcularIRPF(brutoAnual, seguridadSocial.total, parametros);

  const netoAnual = brutoAnual - seguridadSocial.total - irpf.retencionAnual;

  return {
    brutoAnual,
    brutoMensual: brutoAnual / datos.numPagas,
    seguridadSocial,
    irpf,
    netoAnual,
    netoMensual: netoAnual / datos.numPagas,
    tipoNetoEfectivo: brutoAnual > 0 ? netoAnual / brutoAnual : 0,
  };
}
