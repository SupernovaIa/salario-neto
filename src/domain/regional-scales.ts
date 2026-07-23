/**
 * Regional income-tax scales (escala autonómica del IRPF) for 2025, for the 15
 * common-regime autonomous communities. País Vasco and Navarra are excluded
 * (foral regime with their own income tax).
 *
 * Source: AEAT "Manual práctico de Renta 2025", Capítulo 15 (Gravamen
 * autonómico) — one official sede.agenciatributaria.gob.es page per community.
 * Rates are marginal (proportion); `upTo` is the upper bound of each bracket,
 * `null` meaning no upper limit.
 *
 * Notes: Cataluña uses the new 8-bracket scale (Decret-llei 5/2025). Asturias
 * was updated by Ley 3/2025. Several communities use deflated, non-round
 * thresholds (Aragón, Galicia, Canarias, Madrid).
 */

import type { Bracket } from "./types";

export interface RegionInfo {
  id: string;
  name: string;
}

/** Community display names, in the order shown in the selector. */
export const REGION_NAMES: RegionInfo[] = [
  { id: "andalucia", name: "Andalucía" },
  { id: "aragon", name: "Aragón" },
  { id: "asturias", name: "Principado de Asturias" },
  { id: "illes-balears", name: "Illes Balears" },
  { id: "canarias", name: "Canarias" },
  { id: "cantabria", name: "Cantabria" },
  { id: "castilla-la-mancha", name: "Castilla-La Mancha" },
  { id: "castilla-y-leon", name: "Castilla y León" },
  { id: "cataluna", name: "Cataluña" },
  { id: "extremadura", name: "Extremadura" },
  { id: "galicia", name: "Galicia" },
  { id: "la-rioja", name: "La Rioja" },
  { id: "madrid", name: "Comunidad de Madrid" },
  { id: "murcia", name: "Región de Murcia" },
  { id: "comunitat-valenciana", name: "Comunitat Valenciana" },
];

export const REGIONAL_SCALES_2025: Record<string, Bracket[]> = {
  andalucia: [
    { upTo: 13000, rate: 0.095 },
    { upTo: 21100, rate: 0.12 },
    { upTo: 35200, rate: 0.15 },
    { upTo: 60000, rate: 0.185 },
    { upTo: null, rate: 0.225 },
  ],
  aragon: [
    { upTo: 13072.5, rate: 0.095 },
    { upTo: 21210, rate: 0.12 },
    { upTo: 36960, rate: 0.15 },
    { upTo: 52500, rate: 0.185 },
    { upTo: 60000, rate: 0.205 },
    { upTo: 80000, rate: 0.23 },
    { upTo: 90000, rate: 0.24 },
    { upTo: 130000, rate: 0.25 },
    { upTo: null, rate: 0.255 },
  ],
  asturias: [
    { upTo: 12450, rate: 0.09 },
    { upTo: 17707.2, rate: 0.12 },
    { upTo: 33007.2, rate: 0.14 },
    { upTo: 53407.2, rate: 0.192 },
    { upTo: 70000, rate: 0.215 },
    { upTo: 90000, rate: 0.225 },
    { upTo: 175000, rate: 0.25 },
    { upTo: null, rate: 0.26 },
  ],
  "illes-balears": [
    { upTo: 10000, rate: 0.09 },
    { upTo: 18000, rate: 0.1125 },
    { upTo: 30000, rate: 0.1425 },
    { upTo: 48000, rate: 0.175 },
    { upTo: 70000, rate: 0.19 },
    { upTo: 90000, rate: 0.2175 },
    { upTo: 120000, rate: 0.2275 },
    { upTo: 175000, rate: 0.2375 },
    { upTo: null, rate: 0.2475 },
  ],
  canarias: [
    { upTo: 13748, rate: 0.09 },
    { upTo: 19422, rate: 0.115 },
    { upTo: 35924, rate: 0.14 },
    { upTo: 57566, rate: 0.185 },
    { upTo: 93268, rate: 0.235 },
    { upTo: 123745, rate: 0.25 },
    { upTo: null, rate: 0.26 },
  ],
  cantabria: [
    { upTo: 13000, rate: 0.085 },
    { upTo: 21000, rate: 0.11 },
    { upTo: 35200, rate: 0.145 },
    { upTo: 60000, rate: 0.18 },
    { upTo: 90000, rate: 0.225 },
    { upTo: null, rate: 0.245 },
  ],
  "castilla-la-mancha": [
    { upTo: 12450, rate: 0.095 },
    { upTo: 20200, rate: 0.12 },
    { upTo: 35200, rate: 0.15 },
    { upTo: 60000, rate: 0.185 },
    { upTo: null, rate: 0.225 },
  ],
  "castilla-y-leon": [
    { upTo: 12450, rate: 0.09 },
    { upTo: 20200, rate: 0.12 },
    { upTo: 35200, rate: 0.14 },
    { upTo: 53407.2, rate: 0.185 },
    { upTo: null, rate: 0.215 },
  ],
  cataluna: [
    { upTo: 12500, rate: 0.095 },
    { upTo: 22000, rate: 0.125 },
    { upTo: 33000, rate: 0.16 },
    { upTo: 53000, rate: 0.19 },
    { upTo: 90000, rate: 0.215 },
    { upTo: 120000, rate: 0.235 },
    { upTo: 175000, rate: 0.245 },
    { upTo: null, rate: 0.255 },
  ],
  extremadura: [
    { upTo: 12450, rate: 0.08 },
    { upTo: 20200, rate: 0.1 },
    { upTo: 24200, rate: 0.16 },
    { upTo: 35200, rate: 0.175 },
    { upTo: 60000, rate: 0.21 },
    { upTo: 80200, rate: 0.235 },
    { upTo: 99200, rate: 0.24 },
    { upTo: 120200, rate: 0.245 },
    { upTo: null, rate: 0.25 },
  ],
  galicia: [
    { upTo: 12985.35, rate: 0.09 },
    { upTo: 21068.6, rate: 0.1165 },
    { upTo: 35200, rate: 0.149 },
    { upTo: 60000, rate: 0.184 },
    { upTo: null, rate: 0.225 },
  ],
  "la-rioja": [
    { upTo: 12450, rate: 0.08 },
    { upTo: 20200, rate: 0.106 },
    { upTo: 35200, rate: 0.136 },
    { upTo: 40000, rate: 0.178 },
    { upTo: 50000, rate: 0.183 },
    { upTo: 60000, rate: 0.19 },
    { upTo: 120000, rate: 0.245 },
    { upTo: null, rate: 0.27 },
  ],
  madrid: [
    { upTo: 13362.22, rate: 0.085 },
    { upTo: 19004.63, rate: 0.107 },
    { upTo: 35425.68, rate: 0.128 },
    { upTo: 57320.4, rate: 0.174 },
    { upTo: null, rate: 0.205 },
  ],
  murcia: [
    { upTo: 12450, rate: 0.095 },
    { upTo: 20200, rate: 0.112 },
    { upTo: 34000, rate: 0.133 },
    { upTo: 60000, rate: 0.179 },
    { upTo: null, rate: 0.225 },
  ],
  "comunitat-valenciana": [
    { upTo: 12000, rate: 0.09 },
    { upTo: 22000, rate: 0.12 },
    { upTo: 32000, rate: 0.15 },
    { upTo: 42000, rate: 0.175 },
    { upTo: 52000, rate: 0.2 },
    { upTo: 62000, rate: 0.225 },
    { upTo: 72000, rate: 0.25 },
    { upTo: 100000, rate: 0.265 },
    { upTo: 150000, rate: 0.275 },
    { upTo: 200000, rate: 0.285 },
    { upTo: null, rate: 0.295 },
  ],
};
