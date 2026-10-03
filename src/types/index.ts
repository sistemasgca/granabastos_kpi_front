export type KpiStatus = 'Crítico' | 'En riesgo' | 'En meta' | 'Superado';
export type ActionStatus = 'Pendiente' | 'En progreso' | 'Completada' | 'Retrasada';
export type AlertPriority = 'Alta' | 'Media' | 'Informativa';
export type AlertType = 'kpi_critical' | 'kpi_risk' | 'action_overdue' | 'action_due_soon' | 'kpi_outdated' | 'kpi_task_overdue';
export type KpiDirection = 'higher_is_better' | 'lower_is_better';
export type Periodicity = 'Mensual' | 'Bimestral' | 'Trimestral' | 'Semestral' | 'Anual';
export type Quarter = 'T1' | 'T2' | 'T3' | 'T4';

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  driveFolderTarget: string;
  dataUrl?: string; // Base64 data for local download/preview
  externalUrl?: string; // Optional direct link to drive/cloud
}

export interface HistoricalMeasurement {
  id: string;
  quarter: Quarter;
  year: number;
  date: string; // YYYY-MM-DD
  targetQuarter: number;
  value: number;
  compliancePercentage: number;
  note?: string;
  registeredBy?: string;
  inputA?: number;
  inputB?: number;
  attachedFiles: AttachedFile[];
  driveFolderDestination?: string;
}

export interface StrategicTargets2028 {
  baseline2023: number;
  target2024: number;
  target2025: number;
  target2026: number;
  target2027: number;
  target2028: number;
  strategyNotes?: string;
}

export interface KPI {
  id: string;
  code: string; // e.g. KPI-COM-01
  name: string;
  objective: string;
  area: string;
  targetValue: number; // Current operating target
  currentValue: number;
  unit: string;
  direction: KpiDirection;
  compliancePercentage: number;
  responsible: string;
  responsibleEmail: string;
  periodicity: Periodicity;
  lastUpdated: string; // YYYY-MM-DD
  status: KpiStatus;
  observations: string;
  strategicPlanning2028: StrategicTargets2028;
  history: HistoricalMeasurement[];
  targetDriveFolder?: string; // Google Drive folder destination for measurements
}

// Módulo 2: Tareas Operativas de Recolección y Medición del KPI
export interface KpiTask {
  id: string;
  kpiId: string;
  kpiCode: string;
  kpiName: string;
  stepNumber: number;
  title: string;
  description: string;
  scheduledFrequency: string; // e.g. 'Mensual', 'Cada trimestre', 'Semanal'
  scheduledMonth?: string;
  dueDate: string;
  completedDate?: string;
  responsible: string;
  status: 'Pendiente' | 'En curso' | 'Completada' | 'Retrasada';
  observations?: string;
  evidenceFile?: AttachedFile;
}

// Módulo 3: Planes de Acción de Mejora que apuntan a que los KPI se den
export interface ActionPlan {
  id: string;
  code: string; // e.g. PLA-FIN-01
  kpiId: string;
  kpiCode: string;
  kpiName: string;
  name: string;
  activity: string;
  responsible: string;
  responsibleEmail: string;
  startDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  progress: number; // 0 - 100
  status: ActionStatus;
  observations: string;
  evidenceUrl?: string;
  evidenceNotes?: string;
  attachedFiles?: AttachedFile[];
}

// Módulo 4: Plan y Cronograma de las Acciones de la Gestión de las Áreas (POA)
export interface AreaManagementTask {
  id: string;
  code: string; // e.g. POA-OPE-01
  area: string;
  processName: string;
  activity: string;
  responsible: string;
  responsibleEmail: string;
  quarter: Quarter;
  year: number;
  startDate: string;
  dueDate: string;
  progress: number;
  status: ActionStatus;
  deliverables: string;
  linkedKpiCode?: string;
  observations?: string;
  evidenceUrl?: string;
}

export interface AlertItem {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  targetId: string;
  targetType: 'kpi' | 'action' | 'kpi_task' | 'area_task';
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface DatabaseMetadata {
  lastSync: string;
  version: string;
  totalKpis: number;
  totalKpiTasks: number;
  totalActions: number;
  totalAreaTasks: number;
  organization: string;
  googleDriveRootFolder: string;
}
