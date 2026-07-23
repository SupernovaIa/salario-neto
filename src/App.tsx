import { useMemo, useState } from "react";
import { SalaryForm } from "./components/SalaryForm";
import { ResultBreakdown } from "./components/ResultBreakdown";
import { calcularNeto, type DatosEntrada } from "./domain";
import { ANIO_POR_DEFECTO } from "./domain";

const DATOS_INICIALES: DatosEntrada = {
  brutoAnual: 30000,
  numPagas: 14,
  tipoContrato: "indefinido",
  anio: ANIO_POR_DEFECTO,
};

export function App() {
  const [datos, setDatos] = useState<DatosEntrada>(DATOS_INICIALES);

  // El cálculo es puro y barato: lo memoizamos por si el resultado se reusa.
  const resultado = useMemo(() => calcularNeto(datos), [datos]);

  return (
    <div className="page">
      <main className="card">
        <header className="card__header">
          <h1>Del bruto al neto</h1>
          <p>
            Calcula tu salario neto mensual a partir del bruto anual, con el
            desglose de Seguridad Social e IRPF.
          </p>
        </header>

        <SalaryForm datos={datos} onChange={setDatos} />
        <ResultBreakdown resultado={resultado} />

        <footer className="card__footer">
          <p>
            <strong>Cálculo aproximado.</strong> No contempla mínimos por hijos,
            situación familiar, discapacidad ni las particularidades de cada
            comunidad autónoma. Usa la escala general de IRPF y no sustituye a tu
            nómina real.
          </p>
        </footer>
      </main>
    </div>
  );
}
