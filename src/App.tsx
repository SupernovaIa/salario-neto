import { useEffect, useMemo, useState } from "react";
import { SalaryForm } from "./components/SalaryForm";
import { PersonalForm } from "./components/PersonalForm";
import { ResultBreakdown } from "./components/ResultBreakdown";
import { ThemeToggle } from "./components/ThemeToggle";
import { calculateNet, DEFAULT_INPUT, type SalaryInput } from "./domain";
import { getInitialTheme, storeTheme, type Theme } from "./lib/theme";

export function App() {
  const [input, setInput] = useState<SalaryInput>(DEFAULT_INPUT);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Reflect the theme on the root so `color-scheme` (and light-dark()) follows.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      storeTheme(next);
      return next;
    });
  };

  // The calculation is pure and cheap; memoize in case the result is reused.
  const result = useMemo(() => calculateNet(input), [input]);

  return (
    <div className="page">
      <main className="card">
        <section className="card__panel card__panel--form">
          <header className="card__header">
            <div className="card__header-text">
              <h1>Del bruto al neto</h1>
              <p>
                Calcula tu salario neto mensual a partir del bruto anual, con el
                desglose de Seguridad Social e IRPF.
              </p>
            </div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </header>

          <SalaryForm input={input} onChange={setInput} />
          <PersonalForm
            personal={input.personal}
            onChange={(personal) => setInput({ ...input, personal })}
          />
        </section>

        <section className="card__panel card__panel--result">
          <ResultBreakdown result={result} />

          <footer className="card__footer">
            <p>
              <strong>Cálculo aproximado.</strong> Aplica la escala estatal y la
              autonómica de las 15 comunidades de régimen común (datos AEAT
              2025); no incluye País Vasco ni Navarra (régimen foral) ni las
              regularizaciones exactas de la AEAT, así que no sustituye a tu
              nómina real.
            </p>
            <p className="card__credit">
              Hecho por{" "}
              <a
                href="https://www.linkedin.com/in/javier-carreira-c/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Javier Carreira
              </a>{" "}
              ·{" "}
              <a
                href="https://github.com/SupernovaIa/salario-neto"
                target="_blank"
                rel="noopener noreferrer"
              >
                Código
              </a>
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}
