import type { Result } from "../domain";
import { formatEuros, formatEurosWithCents, formatPercent } from "../lib/format";

interface Props {
  result: Result;
}

export function ResultBreakdown({ result }: Props) {
  const { socialSecurity, employerCost, incomeTax, netAnnual, grossAnnual } =
    result;

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
              title={`Neto · ${formatEuros(netAnnual)} (${formatPercent(netPct)})`}
            />
            <span
              className="split-bar__seg split-bar__seg--ss"
              style={{ width: `${ssPct * 100}%` }}
              title={`Seguridad Social · ${formatEuros(
                socialSecurity.total,
              )} (${formatPercent(ssPct)})`}
            />
            <span
              className="split-bar__seg split-bar__seg--tax"
              style={{ width: `${taxPct * 100}%` }}
              title={`Retención IRPF · ${formatEuros(
                incomeTax.annualWithholding,
              )} (${formatPercent(taxPct)})`}
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

          {/* Different denominator from the bar above: this one is on top of
              the gross, not a slice of it. Monthly is over 12, since the
              employer pays contributions monthly whatever the payment count. */}
          <div className="employer">
            <div className="employer__row">
              <span className="employer__label">Coste total empresa</span>
              <strong className="employer__value">
                {formatEuros(employerCost.totalCost)}
              </strong>
            </div>
            <p className="employer__hint">
              {formatEuros(employerCost.totalCost / 12)}/mes en 12 meses ·{" "}
              {formatEuros(employerCost.total)} de cuota patronal (
              {formatPercent(employerCost.overheadRate)} sobre el bruto)
            </p>
          </div>

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
              <Detail label="IRPF estatal" value={incomeTax.stateTax} />
              <Detail label="IRPF autonómico" value={incomeTax.regionalTax} />
              <Detail
                label="Mínimo personal y familiar"
                value={incomeTax.personalAndFamilyMinimum}
              />
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
              <Detail
                label="Cuota patronal total"
                value={employerCost.total}
              />
              <Detail
                label="Cont. comunes (empresa)"
                value={employerCost.commonContingencies}
              />
              <Detail
                label="Desempleo (empresa)"
                value={employerCost.unemployment}
              />
              <Detail label="FOGASA" value={employerCost.wageGuaranteeFund} />
              <Detail
                label="Formación prof. (empresa)"
                value={employerCost.vocationalTraining}
              />
              <Detail label="MEI (empresa)" value={employerCost.mei} />
              <Detail
                label="AT/EP (estimado)"
                value={employerCost.occupationalRisk}
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
