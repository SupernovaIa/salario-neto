import type {
  DatosEntrada,
  DesgloseSeguridadSocial,
  ParametrosFiscales,
} from "./types";

/**
 * Calcula la cotización anual del trabajador a la Seguridad Social.
 *
 * La base de cotización se topa en la base máxima: por encima de ella no se
 * cotiza más (salvo el MEI, que en este modelo simplificado también se topa).
 */
export function calcularSeguridadSocial(
  datos: DatosEntrada,
  parametros: ParametrosFiscales,
): DesgloseSeguridadSocial {
  const { cotizacion, baseMaximaCotizacionAnual } = parametros;

  const baseCotizacion = Math.min(datos.brutoAnual, baseMaximaCotizacionAnual);

  const tipoDesempleo =
    datos.tipoContrato === "temporal"
      ? cotizacion.desempleoTemporal
      : cotizacion.desempleoIndefinido;

  const contingenciasComunes =
    baseCotizacion * cotizacion.contingenciasComunes;
  const desempleo = baseCotizacion * tipoDesempleo;
  const formacionProfesional =
    baseCotizacion * cotizacion.formacionProfesional;
  const mei = baseCotizacion * cotizacion.mei;

  const total = contingenciasComunes + desempleo + formacionProfesional + mei;

  return {
    baseCotizacion,
    contingenciasComunes,
    desempleo,
    formacionProfesional,
    mei,
    total,
  };
}
