import type { SalaryInput, PaymentCount, ContractType } from "../domain";
import { AVAILABLE_YEARS } from "../domain";

interface Props {
  input: SalaryInput;
  onChange: (input: SalaryInput) => void;
}

export function SalaryForm({ input, onChange }: Props) {
  const set = <K extends keyof SalaryInput>(key: K, value: SalaryInput[K]) =>
    onChange({ ...input, [key]: value });

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <label className="field field--gross">
        <span className="field__label">Salario bruto anual</span>
        <div className="field__input-group">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={input.grossAnnual || ""}
            onChange={(e) => set("grossAnnual", Number(e.target.value))}
            placeholder="30000"
            aria-label="Salario bruto anual en euros"
          />
          <span className="field__suffix">€ / año</span>
        </div>
      </label>

      <div className="field-row">
        <label className="field">
          <span className="field__label">Número de pagas</span>
          <div className="segmented" role="group" aria-label="Número de pagas">
            {([12, 14] as PaymentCount[]).map((n) => (
              <button
                key={n}
                type="button"
                className={input.payments === n ? "is-active" : ""}
                onClick={() => set("payments", n)}
              >
                {n}
              </button>
            ))}
          </div>
        </label>

        <label className="field">
          <span className="field__label">Tipo de contrato</span>
          <div className="segmented" role="group" aria-label="Tipo de contrato">
            {(
              [
                ["permanent", "Indefinido"],
                ["temporary", "Temporal"],
              ] as [ContractType, string][]
            ).map(([value, text]) => (
              <button
                key={value}
                type="button"
                className={input.contractType === value ? "is-active" : ""}
                onClick={() => set("contractType", value)}
              >
                {text}
              </button>
            ))}
          </div>
        </label>

        <label className="field field--year">
          <span className="field__label">Año</span>
          <select
            value={input.year}
            onChange={(e) => set("year", Number(e.target.value))}
          >
            {AVAILABLE_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>
    </form>
  );
}
