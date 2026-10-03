import { Quarter } from '../types';

export interface KpiFormulaDefinition {
  kpiCode: string;
  formulaTitle: string;
  formulaExpression: string;
  description: string;
  variableALabel: string;
  variableAPlaceholder: string;
  variableAUnit: string;
  variableBLabel: string;
  variableBPlaceholder: string;
  variableBUnit: string;
  calculate: (varA: number, varB: number) => number;
  initialVarA: number;
  initialVarB: number;
  quarterlyTargetsByYear: {
    [year: number]: Record<Quarter, number>;
  };
}

export const KPI_FORMULA_REGISTRY: Record<string, KpiFormulaDefinition> = {
  'KPI-CAL-01': {
    kpiCode: 'KPI-CAL-01',
    formulaTitle: 'Fórmula Oficial de Satisfacción (121 Clientes)',
    formulaExpression: 'Índice (%) = (Clientes Satisfechos / Total Clientes Encuestados [121]) × 100',
    description: 'Medición periódica aplicada al censo de 121 comerciantes y clientes mayoristas de Granabastos.',
    variableALabel: 'Clientes Comerciales Satisfechos (Puntaje ≥ 80)',
    variableAPlaceholder: 'Ej. 102',
    variableAUnit: 'Clientes',
    variableBLabel: 'Total Clientes Encuestados en el Corte (Base institucional: 121)',
    variableBPlaceholder: '121',
    variableBUnit: 'Clientes',
    initialVarA: 102,
    initialVarB: 121,
    calculate: (a, b) => (b > 0 ? parseFloat(((a / b) * 100).toFixed(2)) : 0),
    quarterlyTargetsByYear: {
      2024: { T1: 78.0, T2: 79.5, T3: 80.0, T4: 81.0 },
      2025: { T1: 82.0, T2: 83.0, T3: 84.0, T4: 85.0 },
      2026: { T1: 86.0, T2: 88.0, T3: 88.0, T4: 89.0 },
      2027: { T1: 90.0, T2: 91.0, T3: 92.0, T4: 93.0 },
      2028: { T1: 93.5, T2: 94.0, T3: 94.5, T4: 95.0 },
    },
  },
  'KPI-FIN-02': {
    kpiCode: 'KPI-FIN-02',
    formulaTitle: 'Fórmula Oficial de Cartera Vencida (> 60 días)',
    formulaExpression: 'Índice Cartera (%) = (Saldo Vencido > 60 días / Cartera Total Comercial) × 100',
    description: 'Control riguroso de morosidad en arrendamientos y cuotas de mantenimiento (Sentido: Menor es mejor).',
    variableALabel: 'Saldo Cartera en Mora > 60 días ($ Millones COP)',
    variableAPlaceholder: 'Ej. 68.0',
    variableAUnit: 'Millones COP',
    variableBLabel: 'Saldo Total de Cartera Comercial Facturada ($ Millones COP)',
    variableBPlaceholder: 'Ej. 1000.0',
    variableBUnit: 'Millones COP',
    initialVarA: 68.0,
    initialVarB: 1000.0,
    calculate: (a, b) => (b > 0 ? parseFloat(((a / b) * 100).toFixed(2)) : 0),
    quarterlyTargetsByYear: {
      2024: { T1: 6.8, T2: 6.4, T3: 6.0, T4: 5.5 },
      2025: { T1: 5.5, T2: 5.2, T3: 5.0, T4: 4.8 },
      2026: { T1: 5.0, T2: 4.8, T3: 4.5, T4: 4.0 },
      2027: { T1: 4.0, T2: 3.8, T3: 3.5, T4: 3.2 },
      2028: { T1: 3.2, T2: 3.0, T3: 2.9, T4: 2.8 },
    },
  },
  'KPI-COM-03': {
    kpiCode: 'KPI-COM-03',
    formulaTitle: 'Fórmula Oficial de Ocupación de Bodegas y Locales',
    formulaExpression: 'Tasa Ocupación (%) = (Locales y Bodegas Arrendadas / Total Locales Habilitados [480]) × 100',
    description: 'Proporción de infraestructura comercial en arrendamiento activo sobre los 480 locales del complejo.',
    variableALabel: 'Locales y Bodegas con Contrato Arrendamiento Vigente',
    variableAPlaceholder: 'Ej. 447',
    variableAUnit: 'Locales',
    variableBLabel: 'Total Locales y Bodegas Comerciales Habilitadas (Capacidad: 480)',
    variableBPlaceholder: '480',
    variableBUnit: 'Locales',
    initialVarA: 447,
    initialVarB: 480,
    calculate: (a, b) => (b > 0 ? parseFloat(((a / b) * 100).toFixed(2)) : 0),
    quarterlyTargetsByYear: {
      2024: { T1: 90.0, T2: 91.0, T3: 92.0, T4: 93.0 },
      2025: { T1: 93.0, T2: 93.5, T3: 94.0, T4: 94.5 },
      2026: { T1: 94.0, T2: 95.0, T3: 95.0, T4: 95.5 },
      2027: { T1: 96.0, T2: 96.5, T3: 97.0, T4: 97.5 },
      2028: { T1: 98.0, T2: 98.2, T3: 98.5, T4: 98.5 },
    },
  },
  'KPI-OPE-04': {
    kpiCode: 'KPI-OPE-04',
    formulaTitle: 'Fórmula Oficial de Volumen de Alimentos Movilizados',
    formulaExpression: 'Volumen (Ton) = ∑ Toneladas en Báscula de Entrada (Carga Pesada + Mediana/Liviana)',
    description: 'Registro certificado y acumulado de pesaje de carga que ingresa a Granabastos en el trimestre.',
    variableALabel: 'Carga Pesada / Tractocamiones y Dobletroques (Toneladas)',
    variableAPlaceholder: 'Ej. 65000',
    variableAUnit: 'Toneladas',
    variableBLabel: 'Carga Mediana y Liviana / Camiones y Furgones (Toneladas)',
    variableBPlaceholder: 'Ej. 37400',
    variableBUnit: 'Toneladas',
    initialVarA: 65000,
    initialVarB: 37400,
    calculate: (a, b) => parseFloat((a + b).toFixed(1)),
    quarterlyTargetsByYear: {
      2024: { T1: 94000, T2: 96000, T3: 98000, T4: 100000 },
      2025: { T1: 99000, T2: 100000, T3: 101000, T4: 103000 },
      2026: { T1: 103000, T2: 105000, T3: 105000, T4: 107000 },
      2027: { T1: 108000, T2: 110000, T3: 112000, T4: 115000 },
      2028: { T1: 116000, T2: 118000, T3: 119000, T4: 120000 },
    },
  },
  'KPI-AMB-05': {
    kpiCode: 'KPI-AMB-05',
    formulaTitle: 'Fórmula Oficial de Aprovechamiento de Residuos Orgánicos',
    formulaExpression: 'Tasa Aprovechamiento (%) = (Residuos Orgánicos Recuperados / Residuos Totales Generados) × 100',
    description: 'Residuos transformados en compostaje y entregados al Banco de Alimentos sobre el total generado.',
    variableALabel: 'Residuos Orgánicos Recuperados (Compostaje + Donación) (Ton)',
    variableAPlaceholder: 'Ej. 169.2',
    variableAUnit: 'Toneladas',
    variableBLabel: 'Total de Residuos Sólidos Generados en la Central (Ton)',
    variableBPlaceholder: 'Ej. 300.0',
    variableBUnit: 'Toneladas',
    initialVarA: 169.2,
    initialVarB: 300.0,
    calculate: (a, b) => (b > 0 ? parseFloat(((a / b) * 100).toFixed(2)) : 0),
    quarterlyTargetsByYear: {
      2024: { T1: 48.0, T2: 50.0, T3: 52.0, T4: 55.0 },
      2025: { T1: 55.0, T2: 56.5, T3: 58.0, T4: 60.0 },
      2026: { T1: 62.0, T2: 65.0, T3: 65.0, T4: 68.0 },
      2027: { T1: 70.0, T2: 72.0, T3: 74.0, T4: 78.0 },
      2028: { T1: 78.0, T2: 80.0, T3: 81.0, T4: 82.0 },
    },
  },
};

export const getPreestablishedQuarterTarget = (
  kpiCode: string,
  quarter: Quarter,
  year: number,
  fallbackTarget: number
): number => {
  const meta = KPI_FORMULA_REGISTRY[kpiCode];
  if (meta && meta.quarterlyTargetsByYear[year]?.[quarter] !== undefined) {
    return meta.quarterlyTargetsByYear[year][quarter];
  }
  return fallbackTarget;
};
