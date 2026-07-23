import { describe, expect, it } from "vitest";
import { aplicarEscala } from "../scale";
import type { Tramo } from "../types";

const escala: Tramo[] = [
  { hasta: 100, tipo: 0.1 },
  { hasta: 200, tipo: 0.2 },
  { hasta: null, tipo: 0.3 },
];

describe("aplicarEscala", () => {
  it("devuelve 0 para bases no positivas", () => {
    expect(aplicarEscala(0, escala)).toBe(0);
    expect(aplicarEscala(-50, escala)).toBe(0);
  });

  it("aplica solo el primer tramo dentro de su límite", () => {
    expect(aplicarEscala(50, escala)).toBeCloseTo(5); // 50 * 0.1
  });

  it("aplica la progresividad por tramos, no un tipo plano", () => {
    // 100*0.1 + 50*0.2 = 10 + 10 = 20
    expect(aplicarEscala(150, escala)).toBeCloseTo(20);
  });

  it("aplica el último tramo sin límite superior", () => {
    // 100*0.1 + 100*0.2 + 100*0.3 = 10 + 20 + 30 = 60
    expect(aplicarEscala(300, escala)).toBeCloseTo(60);
  });

  it("tributa exactamente en el borde de un tramo", () => {
    expect(aplicarEscala(100, escala)).toBeCloseTo(10);
    expect(aplicarEscala(200, escala)).toBeCloseTo(30);
  });
});
