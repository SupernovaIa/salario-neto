import type { DatosEntrada, NumeroPagas, TipoContrato } from "../domain";
import { ANIOS_DISPONIBLES } from "../domain";

interface Props {
  datos: DatosEntrada;
  onChange: (datos: DatosEntrada) => void;
}

export function SalaryForm({ datos, onChange }: Props) {
  const set = <K extends keyof DatosEntrada>(clave: K, valor: DatosEntrada[K]) =>
    onChange({ ...datos, [clave]: valor });

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <label className="field field--bruto">
        <span className="field__label">Salario bruto anual</span>
        <div className="field__input-group">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={datos.brutoAnual || ""}
            onChange={(e) => set("brutoAnual", Number(e.target.value))}
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
            {([12, 14] as NumeroPagas[]).map((n) => (
              <button
                key={n}
                type="button"
                className={datos.numPagas === n ? "is-active" : ""}
                onClick={() => set("numPagas", n)}
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
                ["indefinido", "Indefinido"],
                ["temporal", "Temporal"],
              ] as [TipoContrato, string][]
            ).map(([valor, texto]) => (
              <button
                key={valor}
                type="button"
                className={datos.tipoContrato === valor ? "is-active" : ""}
                onClick={() => set("tipoContrato", valor)}
              >
                {texto}
              </button>
            ))}
          </div>
        </label>

        <label className="field field--anio">
          <span className="field__label">Año</span>
          <select
            value={datos.anio}
            onChange={(e) => set("anio", Number(e.target.value))}
          >
            {ANIOS_DISPONIBLES.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>
        </label>
      </div>
    </form>
  );
}
