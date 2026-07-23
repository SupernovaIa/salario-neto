import type { Result } from "../domain";
import { formatEuros, formatEurosWithCents, formatPercent } from "../lib/format";

interface Props {
  result: Result;
}

export function ResultBreakdown({ result }: Props) {
  const { socialSecurity, incomeTax, netAnnual, grossAnnual } = result;

  // Proportions for the gross-split bar.
  const netPct = grossAnnual > 0 ? netAnnual / grossAnnual : 0;
  const ssPct = grossAnnual > 0 ? socialSecurity.total / grossAnnual : 0;
  const taxPct = grossAnnual > 0 ? incomeTax.annualWithholding / grossAnnual : 0;

  return (
    <section className="result" aria-live="polite">
      <div className="result__hero">
        <span className="result__hero-label">Neto mensual</span>
        <span className="result__hero-value">
          {formatEurosWithCents(result.netMonthly)}
        </span>
        <span className="result__hero-sub">
          {formatEuros(netAnnual)} netos al año ·{" "}
          {result.grossMonthly > 0 &&
            `${formatEuros(result.grossMonthly)} brutos/mes`}
        </span>
      </div>

      {grossAnnual > 0 && (
        <>
          <div
            className="split-bar"
            role="img"
            aria-label={`Reparto del bruto: ${formatPercent(
              netPct,
            )} neto, ${formatPercent(ssPct)} Seguridad Social, ${formatPercent(
              taxPct,
            )} IRPF`}
          >
            <span
              className="split-bar__seg split-bar__seg--net"
              style={{ width: `${netPct * 100}%` }}
            />
            <span
              className="split-bar__seg split-bar__seg--ss"
              style={{ width: `${ssPct * 100}%` }}
            />
            <span
              className="split-bar__seg split-bar__seg--tax"
              style={{ width: `${taxPct * 100}%` }}
            />
          </div>

          <dl className="breakdown">
            <Row swatch="net" label="Neto" value={netAnnual} pct={netPct} />
            <Row
              swatch="ss"
              label="Seguridad Social"
              value={socialSecurity.total}
              pct={ssPct}
            />
            <Row
              swatch="tax"
              label="Retención IRPF"
              value={incomeTax.annualWithholding}
              pct={taxPct}
            />
          </dl>

          <details className="detail">
            <summary>Ver desglose completo</summary>
            <dl className="detail__grid">
              <Detail
                label="Base de cotización"
                value={socialSecurity.contributionBase}
              />
              <Detail
                label="Contingencias comunes"
                value={socialSecurity.commonContingencies}
              />
              <Detail label="Desempleo" value={socialSecurity.unemployment} />
              <Detail
                label="Formación profesional"
                value={socialSecurity.vocationalTraining}
              />
              <Detail label="MEI" value={socialSecurity.mei} />
              <Detail
                label="Base liquidable IRPF"
                value={incomeTax.taxableBase}
              />
              <Detail
                label="Tipo de retención"
                value={formatPercent(incomeTax.withholdingRate)}
              />
              <Detail
                label="Tipo neto efectivo"
                value={formatPercent(result.effectiveNetRate)}
              />
            </dl>
          </details>
        </>
      )}
    </section>
  );
}

function Row({
  swatch,
  label,
  value,
  pct,
}: {
  swatch: string;
  label: string;
  value: number;
  pct: number;
}) {
  return (
    <div className="breakdown__row">
      <dt>
        <span className={`swatch swatch--${swatch}`} />
        {label}
      </dt>
      <dd>
        <strong>{formatEuros(value)}</strong>
        <span className="breakdown__pct">{formatPercent(pct)}</span>
      </dd>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="detail__item">
      <dt>{label}</dt>
      <dd>{typeof value === "number" ? formatEuros(value) : value}</dd>
    </div>
  );
}
