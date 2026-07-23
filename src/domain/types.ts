/**
 * Tipos del dominio de cálculo bruto → neto.
 * Todo el motor trabaja con euros anuales salvo que el nombre indique lo contrario.
 */

/** Tipo de contrato: afecta al tipo de cotización por desempleo. */
export type TipoContrato = "indefinido" | "temporal";

/** Número de pagas anuales (12 o 14). */
export type NumeroPagas = 12 | 14;

/** Datos que introduce el usuario. */
export interface DatosEntrada {
  /** Salario bruto anual en euros. */
  brutoAnual: number;
  /** Número de pagas (12 o 14). Solo afecta al reparto mensual, no al total. */
  numPagas: NumeroPagas;
  /** Tipo de contrato. */
  tipoContrato: TipoContrato;
  /** Año fiscal cuyos parámetros se aplican. */
  anio: number;
}

/** Tramo de una escala progresiva. `hasta = null` representa "sin límite superior". */
export interface Tramo {
  hasta: number | null;
  tipo: number; // proporción, p.ej. 0.19 = 19 %
}

/** Tipos de cotización del trabajador a la Seguridad Social (proporciones). */
export interface TiposCotizacion {
  contingenciasComunes: number;
  desempleoIndefinido: number;
  desempleoTemporal: number;
  formacionProfesional: number;
  /** Mecanismo de Equidad Intergeneracional (cuota del trabajador). */
  mei: number;
}

/** Parámetros fiscales de un año concreto. */
export interface ParametrosFiscales {
  anio: number;
  /** Base máxima de cotización anual (tope superior). */
  baseMaximaCotizacionAnual: number;
  cotizacion: TiposCotizacion;
  /** Escala general de IRPF (estatal + autonómica de referencia). */
  escalaIRPF: Tramo[];
  /** Mínimo personal y familiar general. */
  minimoPersonal: number;
  /** "Otros gastos" deducibles del rendimiento del trabajo (art. 19.2.f LIRPF). */
  gastosDeducibles: number;
  /** Parámetros de la reducción por obtención de rendimientos del trabajo (art. 20). */
  reduccionTrabajo: {
    limiteMaximo: number; // por debajo => reducción plena
    limiteSuperior: number; // por encima => reducción 0
    reduccionPlena: number;
    coeficiente: number; // pendiente de decremento en el tramo intermedio
  };
}

/** Desglose de la cotización a la Seguridad Social. */
export interface DesgloseSeguridadSocial {
  baseCotizacion: number;
  contingenciasComunes: number;
  desempleo: number;
  formacionProfesional: number;
  mei: number;
  total: number;
}

/** Desglose del cálculo de IRPF. */
export interface DesgloseIRPF {
  rendimientoNetoPrevio: number;
  reduccionTrabajo: number;
  baseLiquidable: number;
  cuotaLiquida: number;
  /** Tipo de retención resultante (proporción sobre el bruto). */
  tipoRetencion: number;
  retencionAnual: number;
}

/** Resultado completo del cálculo. */
export interface Resultado {
  brutoAnual: number;
  brutoMensual: number;
  seguridadSocial: DesgloseSeguridadSocial;
  irpf: DesgloseIRPF;
  netoAnual: number;
  netoMensual: number;
  /** Proporción del bruto que se queda el trabajador. */
  tipoNetoEfectivo: number;
}
