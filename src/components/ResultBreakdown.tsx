import type { Resultado } from "../domain";
import {
  formatoEuros,
  formatoEurosCentimos,
  formatoPorcentaje,
} from "../lib/format";

interface Props {
  resultado: Resultado;
}

export function ResultBreakdown({ resultado }: Props) {
  const { seguridadSocial, irpf, netoAnual, brutoAnual } = resultado;

  // Proporciones para la barra de reparto del bruto.
  const pctSS = brutoAnual > 0 ? seguridadSocial.total / brutoAnual : 0;
  const pctIRPF = brutoAnual > 0 ? irpf.retencionAnual / brutoAnual : 0;
  const pctNeto = brutoAnual > 0 ? netoAnual / brutoAnual : 0;

  return (
    <section className="result" aria-live="polite">
      <div className="result__hero">
        <span className="result__hero-label">Neto mensual</span>
        <span className="result__hero-value">
          {formatoEurosCentimos(resultado.netoMensual)}
        </span>
        <span className="result__hero-sub">
          {formatoEuros(netoAnual)} netos al año ·{" "}
          {resultado.brutoMensual > 0 &&
            `${formatoEuros(resultado.brutoMensual)} brutos/mes`}
        </span>
      </div>

      {brutoAnual > 0 && (
        <>
          <div
            className="split-bar"
            role="img"
            aria-label={`Reparto del bruto: ${formatoPorcentaje(
              pctNeto,
            )} neto, ${formatoPorcentaje(pctSS)} Seguridad Social, ${formatoPorcentaje(
              pctIRPF,
            )} IRPF`}
          >
            <span
              className="split-bar__seg split-bar__seg--neto"
              style={{ width: `${pctNeto * 100}%` }}
            />
            <span
              className="split-bar__seg split-bar__seg--ss"
              style={{ width: `${pctSS * 100}%` }}
            />
            <span
              className="split-bar__seg split-bar__seg--irpf"
              style={{ width: `${pctIRPF * 100}%` }}
            />
          </div>

          <dl className="breakdown">
            <Row
              swatch="neto"
              label="Neto"
              valor={netoAnual}
              pct={pctNeto}
            />
            <Row
              swatch="ss"
              label="Seguridad Social"
              valor={seguridadSocial.total}
              pct={pctSS}
            />
            <Row
              swatch="irpf"
              label="Retención IRPF"
              valor={irpf.retencionAnual}
              pct={pctIRPF}
            />
          </dl>

          <details className="detalle">
            <summary>Ver desglose completo</summary>
            <dl className="detalle__grid">
              <Detalle
                label="Base de cotización"
                valor={seguridadSocial.baseCotizacion}
              />
              <Detalle
                label="Contingencias comunes"
                valor={seguridadSocial.contingenciasComunes}
              />
              <Detalle label="Desempleo" valor={seguridadSocial.desempleo} />
              <Detalle
                label="Formación profesional"
                valor={seguridadSocial.formacionProfesional}
              />
              <Detalle label="MEI" valor={seguridadSocial.mei} />
              <Detalle
                label="Base liquidable IRPF"
                valor={irpf.baseLiquidable}
              />
              <Detalle
                label="Tipo de retención"
                valor={formatoPorcentaje(irpf.tipoRetencion)}
              />
              <Detalle
                label="Tipo neto efectivo"
                valor={formatoPorcentaje(resultado.tipoNetoEfectivo)}
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
  valor,
  pct,
}: {
  swatch: string;
  label: string;
  valor: number;
  pct: number;
}) {
  return (
    <div className="breakdown__row">
      <dt>
        <span className={`swatch swatch--${swatch}`} />
        {label}
      </dt>
      <dd>
        <strong>{formatoEuros(valor)}</strong>
        <span className="breakdown__pct">{formatoPorcentaje(pct)}</span>
      </dd>
    </div>
  );
}

function Detalle({ label, valor }: { label: string; valor: number | string }) {
  return (
    <div className="detalle__item">
      <dt>{label}</dt>
      <dd>{typeof valor === "number" ? formatoEuros(valor) : valor}</dd>
    </div>
  );
}
