import { describe, expect, it } from "vitest";
import { calcularNeto } from "../calculate-net";
import type { DatosEntrada } from "../types";

const base: DatosEntrada = {
  brutoAnual: 30000,
  numPagas: 14,
  tipoContrato: "indefinido",
  anio: 2025,
};

describe("calcularNeto", () => {
  it("calcula un caso de referencia (30.000 €, indefinido, 2025)", () => {
    const r = calcularNeto(base);

    // Seguridad Social: 6,48 % de 30.000 = 1.944 €.
    expect(r.seguridadSocial.total).toBeCloseTo(1944, 2);
    expect(r.seguridadSocial.baseCotizacion).toBe(30000);

    // IRPF: retención anual calculada por el método de las dos cuotas.
    expect(r.irpf.retencionAnual).toBeCloseTo(4927.8, 1);
    expect(r.irpf.tipoRetencion).toBeCloseTo(0.16426, 4);

    // Neto.
    expect(r.netoAnual).toBeCloseTo(23128.2, 1);
    expect(r.netoMensual).toBeCloseTo(1652.01, 1);
    expect(r.tipoNetoEfectivo).toBeCloseTo(0.7709, 3);
  });

  it("reparte el mismo neto anual entre 12 o 14 pagas", () => {
    const con14 = calcularNeto({ ...base, numPagas: 14 });
    const con12 = calcularNeto({ ...base, numPagas: 12 });

    expect(con14.netoAnual).toBeCloseTo(con12.netoAnual, 6);
    expect(con12.netoMensual).toBeGreaterThan(con14.netoMensual);
    expect(con14.netoMensual * 14).toBeCloseTo(con14.netoAnual, 6);
    expect(con12.netoMensual * 12).toBeCloseTo(con12.netoAnual, 6);
  });

  it("topa la base de cotización en la base máxima", () => {
    const r = calcularNeto({ ...base, brutoAnual: 80000 });
    expect(r.seguridadSocial.baseCotizacion).toBeCloseTo(58914, 2);
    // Aunque el bruto sube, la cotización se topa.
    expect(r.seguridadSocial.total).toBeCloseTo(58914 * 0.0648, 2);
  });

  it("aplica un desempleo más caro en contrato temporal", () => {
    const indefinido = calcularNeto(base);
    const temporal = calcularNeto({ ...base, tipoContrato: "temporal" });
    expect(temporal.seguridadSocial.desempleo).toBeGreaterThan(
      indefinido.seguridadSocial.desempleo,
    );
  });

  it("no aplica IRPF a rentas bajas (reducción por trabajo plena)", () => {
    const r = calcularNeto({ ...base, brutoAnual: 15000 });
    expect(r.irpf.retencionAnual).toBeCloseTo(0, 2);
    expect(r.netoAnual).toBeCloseTo(15000 - 972, 2);
  });

  it("la retención crece con el bruto (progresividad)", () => {
    const tipos = [20000, 40000, 80000].map(
      (brutoAnual) => calcularNeto({ ...base, brutoAnual }).irpf.tipoRetencion,
    );
    expect(tipos[0]).toBeLessThan(tipos[1]);
    expect(tipos[1]).toBeLessThan(tipos[2]);
  });

  it("es robusto ante entradas cero o negativas", () => {
    const cero = calcularNeto({ ...base, brutoAnual: 0 });
    expect(cero.netoAnual).toBe(0);
    expect(cero.tipoNetoEfectivo).toBe(0);

    const negativo = calcularNeto({ ...base, brutoAnual: -5000 });
    expect(negativo.netoAnual).toBe(0);
  });

  it("usa el MEI de 2026 cuando se pide ese año", () => {
    const r2025 = calcularNeto({ ...base, anio: 2025 });
    const r2026 = calcularNeto({ ...base, anio: 2026 });
    // El MEID del trabajador sube de 0,13 % a 0,15 %.
    expect(r2026.seguridadSocial.mei).toBeGreaterThan(r2025.seguridadSocial.mei);
  });
});
