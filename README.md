# Salario neto

Calculadora de salario **bruto → neto** para España. Introduces el bruto anual
y te dice el neto mensual, con el desglose de Seguridad Social e IRPF.

Solo frontend: todo el cálculo corre en el navegador, sin backend.

## Stack

- **React + TypeScript + Vite**
- **Vitest** para los tests del motor de cálculo

## Arquitectura

El cálculo está aislado de la interfaz en `src/domain/`, como funciones puras y
testeables:

```
src/
  domain/
    types.ts           Tipos del dominio
    tax-data.ts        Parámetros fiscales versionados por año (tramos, tipos SS)
    scale.ts           Escala progresiva por tramos
    social-security.ts Cotización del trabajador
    irpf.ts            Retención de IRPF (método de las dos cuotas)
    calculate-net.ts   Orquestador: entrada → resultado
    __tests__/         Tests con casos de referencia
  components/          UI
  lib/format.ts        Formateo de euros y porcentajes
```

Actualizar de un año a otro es añadir una entrada en `tax-data.ts`; la lógica no
cambia.

## Uso

```bash
npm install
npm run dev        # desarrollo
npm test           # tests del motor
npm run build      # build de producción
```

## Alcance

Es un **cálculo aproximado**. Usa la escala general de IRPF y no contempla
mínimos por hijos, situación familiar, discapacidad ni la escala autonómica.
Sirve para estimar, no para cuadrar la nómina al céntimo.

### Siguientes pasos

- [ ] Escala de IRPF por comunidad autónoma
- [ ] Circunstancias personales (hijos, situación familiar, edad, discapacidad)
- [ ] Acercarse al algoritmo de retención exacto de la AEAT
