import type { DisabilityLevel, PersonalCircumstances } from "../domain";

interface Props {
  personal: PersonalCircumstances;
  onChange: (personal: PersonalCircumstances) => void;
}

const DISABILITY_OPTIONS: [DisabilityLevel, string][] = [
  ["none", "Sin discapacidad"],
  ["standard", "Discapacidad 33 %–65 %"],
  ["severe", "Discapacidad ≥ 65 %"],
];

export function PersonalForm({ personal, onChange }: Props) {
  const set = <K extends keyof PersonalCircumstances>(
    key: K,
    value: PersonalCircumstances[K],
  ) => onChange({ ...personal, [key]: value });

  // Number inputs stay non-negative; under-3 never exceeds total children.
  const setChildren = (value: number) => {
    const children = Math.max(0, Math.floor(value || 0));
    onChange({
      ...personal,
      children,
      childrenUnder3: Math.min(personal.childrenUnder3, children),
    });
  };

  return (
    <details className="personal">
      <summary>Circunstancias personales (opcional)</summary>

      <div className="personal__grid">
        <label className="field">
          <span className="field__label">Edad</span>
          <input
            type="number"
            inputMode="numeric"
            min={16}
            max={120}
            value={personal.age || ""}
            onChange={(e) => set("age", Math.max(0, Number(e.target.value)))}
          />
        </label>

        <label className="field">
          <span className="field__label">Discapacidad</span>
          <select
            value={personal.disability}
            onChange={(e) =>
              set("disability", e.target.value as DisabilityLevel)
            }
          >
            {DISABILITY_OPTIONS.map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Hijos a cargo</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={20}
            value={personal.children || ""}
            onChange={(e) => setChildren(Number(e.target.value))}
          />
        </label>

        <label className="field">
          <span className="field__label">…menores de 3 años</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={personal.children}
            disabled={personal.children === 0}
            value={personal.childrenUnder3 || ""}
            onChange={(e) =>
              set(
                "childrenUnder3",
                Math.min(
                  personal.children,
                  Math.max(0, Math.floor(Number(e.target.value) || 0)),
                ),
              )
            }
          />
        </label>
      </div>

      {personal.children > 0 && (
        <label className="personal__check">
          <input
            type="checkbox"
            checked={personal.sharedCustody}
            onChange={(e) => set("sharedCustody", e.target.checked)}
          />
          <span>El mínimo por hijos se reparte con el otro progenitor</span>
        </label>
      )}

      <p className="personal__hint">
        Solo cuentan los hijos menores de 25 años (o con discapacidad) que
        convivan contigo y con ingresos bajos.
      </p>
    </details>
  );
}
