import { useMemo, useState } from "react";
import { SalaryForm } from "./components/SalaryForm";
import { ResultBreakdown } from "./components/ResultBreakdown";
import { calculateNet, DEFAULT_YEAR, type SalaryInput } from "./domain";

const INITIAL_INPUT: SalaryInput = {
  grossAnnual: 30000,
  payments: 14,
  contractType: "permanent",
  year: DEFAULT_YEAR,
};

export function App() {
  const [input, setInput] = useState<SalaryInput>(INITIAL_INPUT);

  // The calculation is pure and cheap; memoize in case the result is reused.
  const result = useMemo(() => calculateNet(input), [input]);

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

        <SalaryForm input={input} onChange={setInput} />
        <ResultBreakdown result={result} />

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
