import { useMemo, useState } from "react";
import { SalaryForm } from "./components/SalaryForm";
import { PersonalForm } from "./components/PersonalForm";
import { ResultBreakdown } from "./components/ResultBreakdown";
import { calculateNet, DEFAULT_INPUT, type SalaryInput } from "./domain";

export function App() {
  const [input, setInput] = useState<SalaryInput>(DEFAULT_INPUT);

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
        <PersonalForm
          personal={input.personal}
          onChange={(personal) => setInput({ ...input, personal })}
        />
        <ResultBreakdown result={result} />

        <footer className="card__footer">
          <p>
            <strong>Cálculo aproximado.</strong> Aplica la escala estatal y la
            autonómica de las 15 comunidades de régimen común (datos AEAT 2025);
            no incluye País Vasco ni Navarra (régimen foral) ni las
            regularizaciones exactas de la AEAT, así que no sustituye a tu nómina
            real.
          </p>
        </footer>
      </main>
    </div>
  );
}
