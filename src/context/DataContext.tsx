import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  KPI, 
  ActionPlan, 
  KpiTask, 
  AreaManagementTask, 
  AlertItem, 
  KpiStatus, 
  ActionStatus, 
  KpiDirection, 
  Periodicity, 
  Quarter, 
  HistoricalMeasurement,
  AttachedFile
} from '../types';
import { 
  apiDownload,
  apiRequest,
  ApiActionPlan,
  ApiAlert,
  ApiAreaTask,
  ApiKpi,
  ApiKpiTask,
  ApiMeasurement,
  ApiUser,
  ManagedUser,
  loginRequest,
} from '../services/api';

interface DataContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  apiError: string | null;
  clearApiError: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  managedUsers: ManagedUser[];
  loadManagedUsers: () => Promise<boolean>;
  createManagedUser: (data: Pick<ManagedUser, 'email' | 'name' | 'role'> & { password: string }) => Promise<boolean>;
  updateManagedUser: (id: string, data: Partial<Pick<ManagedUser, 'name' | 'role' | 'isActive'>>) => Promise<boolean>;
  downloadAttachment: (file: AttachedFile) => Promise<boolean>;
  kpis: KPI[];
  kpiTasks: KpiTask[];
  actionPlans: ActionPlan[];
  areaTasks: AreaManagementTask[];
  alerts: AlertItem[];
  unreadAlertsCount: number;
  googleDriveFolder: string;
  setGoogleDriveFolder: (url: string) => void;

  // KPIs
  addKpi: (kpi: Omit<KPI, 'id' | 'compliancePercentage' | 'status' | 'history'>) => Promise<boolean>;
  updateKpi: (id: string, kpi: Partial<KPI>) => Promise<boolean>;
  deleteKpi: (id: string) => Promise<boolean>;
  addQuarterlyMeasurement: (
    kpiId: string, 
    measurement: Omit<HistoricalMeasurement, 'id' | 'compliancePercentage'>
  ) => Promise<boolean>;

  // KPI Tasks (Módulo 2: Tareas Operativas de Recolección / Medición)
  addKpiTask: (task: Omit<KpiTask, 'id' | 'kpiCode' | 'kpiName'>) => Promise<boolean>;
  updateKpiTask: (id: string, task: Partial<KpiTask>) => Promise<boolean>;
  deleteKpiTask: (id: string) => Promise<boolean>;

  // Action Plans (Módulo 3: Planes de Acción de Mejora que apuntan a que el KPI se cumpla)
  addActionPlan: (plan: Omit<ActionPlan, 'id' | 'status' | 'kpiCode' | 'kpiName'>) => Promise<boolean>;
  updateActionPlan: (id: string, plan: Partial<ActionPlan>) => Promise<boolean>;
  deleteActionPlan: (id: string) => Promise<boolean>;

  // Area Management Tasks (Módulo 4: Plan y Cronograma de las Acciones de Gestión de las Áreas)
  addAreaTask: (task: Omit<AreaManagementTask, 'id' | 'status'>) => Promise<boolean>;
  updateAreaTask: (id: string, task: Partial<AreaManagementTask>) => Promise<boolean>;
  deleteAreaTask: (id: string) => Promise<boolean>;

  // Alerts
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;

  // Backup & Reset
  resetToDemoData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonString: string) => boolean;
  exportCSV: (type: 'kpis' | 'kpi_tasks' | 'actions' | 'area_tasks' | 'powerbi_star_schema') => void;
  importCSV: (csvText: string, type: 'kpis' | 'actions' | 'kpi_tasks' | 'area_tasks') => { success: boolean; count: number; error?: string };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DRIVE_FOLDER_STORAGE_KEY = 'granabastos_drive_folder_v3';
const ALERTS_READ_KEY = 'granabastos_alerts_read_2028_v3';
const AUTH_TOKEN_KEY = 'granabastos_api_token';

function dateOnly(value: string | Date | null | undefined): string {
  if (!value) return '';
  return typeof value === 'string' ? value.slice(0, 10) : value.toISOString().slice(0, 10);
}

function fromKpiStatus(status: ApiKpi['status']): KpiStatus {
  return ({ CRITICO: 'Crítico', EN_RIESGO: 'En riesgo', EN_META: 'En meta', SUPERADO: 'Superado' } as const)[status];
}

function fromActionStatus(status: ApiActionPlan['status']): ActionStatus {
  return ({ PENDIENTE: 'Pendiente', EN_PROGRESO: 'En progreso', COMPLETADA: 'Completada', RETRASADA: 'Retrasada' } as const)[status];
}

function fromPeriodicity(value: ApiKpi['periodicity']): Periodicity {
  return ({ MENSUAL: 'Mensual', BIMESTRAL: 'Bimestral', TRIMESTRAL: 'Trimestral', SEMESTRAL: 'Semestral', ANUAL: 'Anual' } as const)[value];
}

function mapMeasurement(row: ApiMeasurement): HistoricalMeasurement {
  return {
    id: row.id,
    quarter: row.quarter,
    year: row.year,
    date: dateOnly(row.date),
    targetQuarter: Number(row.targetQuarter),
    value: Number(row.value),
    compliancePercentage: Number(row.compliancePercentage),
    note: row.note ?? undefined,
    registeredBy: row.registeredBy ?? undefined,
    inputA: row.inputA == null ? undefined : Number(row.inputA),
    inputB: row.inputB == null ? undefined : Number(row.inputB),
    attachedFiles: (row.attachments ?? []).map((file) => ({
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.mimeType,
      uploadDate: dateOnly(file.createdAt),
      driveFolderTarget: row.driveFolderDestination ?? '',
      externalUrl: `/api/attachments/${file.id}/download`,
    })),
    driveFolderDestination: row.driveFolderDestination ?? undefined,
  };
}

function mapKpi(row: ApiKpi, history: HistoricalMeasurement[]): KPI {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    objective: row.objective,
    area: row.area,
    targetValue: Number(row.targetValue),
    currentValue: Number(row.currentValue),
    unit: row.unit,
    direction: row.direction,
    compliancePercentage: Number(row.compliancePercentage),
    responsible: row.responsible,
    responsibleEmail: row.responsibleEmail,
    periodicity: fromPeriodicity(row.periodicity),
    lastUpdated: dateOnly(row.lastUpdated),
    status: fromKpiStatus(row.status),
    observations: row.observations ?? '',
    targetDriveFolder: row.targetDriveFolder ?? undefined,
    strategicPlanning2028: {
      baseline2023: Number(row.baseline2023 ?? 0),
      target2024: Number(row.target2024 ?? 0),
      target2025: Number(row.target2025 ?? 0),
      target2026: Number(row.target2026 ?? 0),
      target2027: Number(row.target2027 ?? 0),
      target2028: Number(row.target2028 ?? 0),
      strategyNotes: row.strategyNotes ?? undefined,
    },
    history,
  };
}

function mapKpiTask(row: ApiKpiTask): KpiTask {
  if (!isKpiTaskStatus(row.status)) {
    throw new Error(`Estado no reconocido en la tarea ${row.id}: ${row.status}.`);
  }
  return {
    id: row.id,
    kpiId: row.kpiId,
    kpiCode: row.kpi.code,
    kpiName: row.kpi.name,
    stepNumber: row.stepNumber,
    title: row.title,
    description: row.description,
    scheduledFrequency: row.scheduledFrequency,
    scheduledMonth: row.scheduledMonth ?? undefined,
    dueDate: dateOnly(row.dueDate),
    completedDate: row.completedDate ? dateOnly(row.completedDate) : undefined,
    responsible: row.responsible,
    status: row.status,
    observations: row.observations ?? undefined,
  };
}

function isKpiTaskStatus(value: string): value is KpiTask['status'] {
  return value === 'Pendiente' || value === 'En curso' || value === 'Completada' || value === 'Retrasada';
}

function mapActionPlan(row: ApiActionPlan): ActionPlan {
  return {
    id: row.id,
    code: row.code,
    kpiId: row.kpiId,
    kpiCode: row.kpi.code,
    kpiName: row.kpi.name,
    name: row.name,
    activity: row.activity,
    responsible: row.responsible,
    responsibleEmail: row.responsibleEmail,
    startDate: dateOnly(row.startDate),
    dueDate: dateOnly(row.dueDate),
    progress: row.progress,
    status: fromActionStatus(row.status),
    observations: row.observations ?? '',
    evidenceUrl: row.evidenceUrl ?? undefined,
    evidenceNotes: row.evidenceNotes ?? undefined,
    attachedFiles: [],
  };
}

function mapAreaTask(row: ApiAreaTask): AreaManagementTask {
  return {
    id: row.id,
    code: row.code,
    area: row.area,
    processName: row.processName,
    activity: row.activity,
    responsible: row.responsible,
    responsibleEmail: row.responsibleEmail,
    quarter: row.quarter,
    year: row.year,
    startDate: dateOnly(row.startDate),
    dueDate: dateOnly(row.dueDate),
    progress: row.progress,
    status: fromActionStatus(row.status),
    deliverables: row.deliverables,
    linkedKpiCode: row.linkedKpi?.code,
    observations: row.observations ?? undefined,
    evidenceUrl: row.evidenceUrl ?? undefined,
  };
}

function mapAlert(row: ApiAlert, readIds: string[]): AlertItem {
  return { ...row, read: readIds.includes(row.id) };
}

export function calculateCompliance(current: number, target: number, direction: KpiDirection): number {
  if (target === 0) return 100;
  if (direction === 'higher_is_better') {
    return Math.round((current / target) * 10000) / 100;
  } else {
    if (current === 0) return 100;
    return Math.round((target / current) * 10000) / 100;
  }
}

export function determineKpiStatus(compliance: number): KpiStatus {
  if (compliance >= 100) return 'Superado';
  if (compliance >= 90) return 'En meta';
  if (compliance >= 70) return 'En riesgo';
  return 'Crítico';
}

export function determineActionStatus(dueDate: string, progress: number): ActionStatus {
  if (progress >= 100) return 'Completada';
  const today = new Date().toISOString().split('T')[0];
  if (dueDate < today) return 'Retrasada';
  if (progress > 0) return 'En progreso';
  return 'Pendiente';
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string>(() => localStorage.getItem(AUTH_TOKEN_KEY) || '');
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [googleDriveFolder, setGoogleDriveFolderState] = useState<string>(() => {
    return localStorage.getItem(DRIVE_FOLDER_STORAGE_KEY) || 'https://drive.google.com/drive/folders/Granabastos-Evidencias-SGC-2028';
  });
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [kpiTasks, setKpiTasks] = useState<KpiTask[]>([]);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [areaTasks, setAreaTasks] = useState<AreaManagementTask[]>([]);
  const [apiAlerts, setApiAlerts] = useState<ApiAlert[]>([]);
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([]);

  const setGoogleDriveFolder = (url: string) => {
    setGoogleDriveFolderState(url);
    localStorage.setItem(DRIVE_FOLDER_STORAGE_KEY, url);
  };

  const [readAlertIds, setReadAlertIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(ALERTS_READ_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ALERTS_READ_KEY, JSON.stringify(readAlertIds));
    } catch (e) {
      console.error('Error saving read alerts to localStorage', e);
    }
  }, [readAlertIds]);

  const loadRemoteData = useCallback(async (accessToken: string) => {
    const [apiKpis, measurements, apiKpiTasks, apiActions, apiAreaTasks, apiAlerts] = await Promise.all([
      apiRequest<ApiKpi[]>('/kpis', accessToken),
      apiRequest<ApiMeasurement[]>('/measurements', accessToken),
      apiRequest<ApiKpiTask[]>('/kpi-tasks', accessToken),
      apiRequest<ApiActionPlan[]>('/action-plans', accessToken),
      apiRequest<ApiAreaTask[]>('/area-tasks', accessToken),
      apiRequest<ApiAlert[]>('/alerts', accessToken),
    ]);
    const historyByKpi = new Map<string, HistoricalMeasurement[]>();
    measurements.forEach((row) => {
      const history = historyByKpi.get(row.kpiId) ?? [];
      history.push(mapMeasurement(row));
      historyByKpi.set(row.kpiId, history);
    });
    setKpis(apiKpis.map((row) => mapKpi(row, historyByKpi.get(row.id) ?? [])));
    setKpiTasks(apiKpiTasks.map(mapKpiTask));
    setActionPlans(apiActions.map(mapActionPlan));
    setAreaTasks(apiAreaTasks.map(mapAreaTask));
    setApiAlerts(apiAlerts);
  }, []);

  useEffect(() => {
    let active = true;
    const initializeSession = async () => {
      setIsLoading(true);
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const currentUser = await apiRequest<ApiUser>('/auth/me', token);
        if (!active) return;
        setUser(currentUser);
        await loadRemoteData(token);
      } catch (error) {
        if (!active) return;
        if (error instanceof Error && 'status' in error && error.status === 401) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setToken('');
          setUser(null);
          setKpis([]);
          setKpiTasks([]);
          setActionPlans([]);
          setAreaTasks([]);
        } else {
          setApiError(error instanceof Error ? error.message : 'No fue posible cargar los datos.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void initializeSession();
    return () => { active = false; };
  }, [token, loadRemoteData]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setApiError(null);
    setIsLoading(true);
    try {
      const response = await loginRequest(email, password);
      localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
      setUser(response.user);
      setToken(response.accessToken);
      return true;
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'No fue posible iniciar sesión.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken('');
    setUser(null);
    setKpis([]);
    setKpiTasks([]);
    setActionPlans([]);
    setAreaTasks([]);
    setApiAlerts([]);
    setManagedUsers([]);
    setApiError(null);
  }, []);

  const loadManagedUsers = useCallback(async (): Promise<boolean> => {
    if (!token || user?.role !== 'ADMIN') {
      setApiError('Se requiere una sesión de administrador para consultar usuarios.');
      return false;
    }
    setApiError(null);
    try {
      const users = await apiRequest<ManagedUser[]>('/auth/users', token);
      setManagedUsers(users);
      return true;
    } catch (error) {
      if (error instanceof Error && 'status' in error && error.status === 401) logout();
      setApiError(error instanceof Error ? error.message : 'No fue posible consultar los usuarios.');
      return false;
    }
  }, [token, user, logout]);

  const createManagedUser = async (
    data: Pick<ManagedUser, 'email' | 'name' | 'role'> & { password: string },
  ): Promise<boolean> => {
    if (!token) {
      setApiError('Tu sesión expiró. Inicia sesión nuevamente.');
      logout();
      return false;
    }
    setApiError(null);
    try {
      await apiRequest<ManagedUser>('/auth/users', token, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return loadManagedUsers();
    } catch (error) {
      if (error instanceof Error && 'status' in error && error.status === 401) logout();
      setApiError(error instanceof Error ? error.message : 'No fue posible crear el usuario.');
      return false;
    }
  };

  const updateManagedUser = async (
    id: string,
    data: Partial<Pick<ManagedUser, 'name' | 'role' | 'isActive'>>,
  ): Promise<boolean> => {
    if (!token) {
      setApiError('Tu sesión expiró. Inicia sesión nuevamente.');
      logout();
      return false;
    }
    setApiError(null);
    try {
      await apiRequest<ManagedUser>(`/auth/users/${id}`, token, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      if (id === user?.id) {
        const currentUser = await apiRequest<ApiUser>('/auth/me', token);
        setUser(currentUser);
      }
      return loadManagedUsers();
    } catch (error) {
      if (error instanceof Error && 'status' in error && error.status === 401) logout();
      setApiError(error instanceof Error ? error.message : 'No fue posible actualizar el usuario.');
      return false;
    }
  };

  const downloadAttachment = async (file: AttachedFile): Promise<boolean> => {
    if (!token) {
      setApiError('Tu sesión expiró. Inicia sesión nuevamente.');
      logout();
      return false;
    }
    try {
      const blob = await apiDownload(`/attachments/${file.id}/download`, token);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      return true;
    } catch (error) {
      if (error instanceof Error && 'status' in error && error.status === 401) logout();
      setApiError(error instanceof Error ? error.message : 'No fue posible descargar la evidencia.');
      return false;
    }
  };

  const runMutation = async (request: () => Promise<unknown>): Promise<boolean> => {
    if (!token) {
      setApiError('Tu sesión expiró. Inicia sesión nuevamente.');
      logout();
      return false;
    }
    setApiError(null);
    try {
      await request();
    } catch (error) {
      if (error instanceof Error && 'status' in error && error.status === 401) logout();
      setApiError(error instanceof Error ? error.message : 'No fue posible guardar los cambios.');
      return false;
    }
    try {
      await loadRemoteData(token);
    } catch (error) {
      if (error instanceof Error && 'status' in error && error.status === 401) logout();
      setApiError(error instanceof Error
        ? `Los cambios se guardaron, pero no fue posible actualizar la vista: ${error.message}`
        : 'Los cambios se guardaron, pero no fue posible actualizar la vista.');
    }
    return true;
  };

  // Compute Alerts dynamically
  const alerts = useMemo<AlertItem[]>(() => {
    if (user) {
      return apiAlerts.map((alert) => mapAlert(alert, readAlertIds));
    }
    const list: AlertItem[] = [];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // 1. Critical and at-risk KPIs
    kpis.forEach((kpi) => {
      if (kpi.compliancePercentage < 70) {
        const id = `alert-kpi-crit-${kpi.id}`;
        list.push({
          id,
          type: 'kpi_critical',
          priority: 'Alta',
          title: `KPI Crítico: ${kpi.code}`,
          message: `${kpi.name} tiene un cumplimiento de solo ${kpi.compliancePercentage.toFixed(1)}% (Meta: ${kpi.targetValue} ${kpi.unit}, Actual: ${kpi.currentValue} ${kpi.unit}). Responsable: ${kpi.responsible}`,
          targetId: kpi.id,
          targetType: 'kpi',
          date: kpi.lastUpdated,
          read: readAlertIds.includes(id),
        });
      } else if (kpi.compliancePercentage < 90) {
        const id = `alert-kpi-risk-${kpi.id}`;
        list.push({
          id,
          type: 'kpi_risk',
          priority: 'Media',
          title: `KPI En Riesgo: ${kpi.code}`,
          message: `${kpi.name} se encuentra en ${kpi.compliancePercentage.toFixed(1)}% de cumplimiento, por debajo del umbral óptimo (90%).`,
          targetId: kpi.id,
          targetType: 'kpi',
          date: kpi.lastUpdated,
          read: readAlertIds.includes(id),
        });
      }

      // Check quarterly reporting freshness (more than 90 days = outdated quarter)
      const lastUpdateDate = new Date(kpi.lastUpdated);
      const diffDays = Math.floor((today.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 90) {
        const id = `alert-kpi-outdate-${kpi.id}`;
        list.push({
          id,
          type: 'kpi_outdated',
          priority: 'Media',
          title: `Corte Trimestral Pendiente: ${kpi.code}`,
          message: `El indicador "${kpi.name}" no registra medición desde hace ${diffDays} días (${kpi.lastUpdated}). Por favor cargue el corte con sus evidencias a la carpeta designada.`,
          targetId: kpi.id,
          targetType: 'kpi',
          date: kpi.lastUpdated,
          read: readAlertIds.includes(id),
        });
      }
    });

    // 2. Overdue KPI Tasks (Operational Measurement Tasks)
    kpiTasks.forEach((kt) => {
      if (kt.status !== 'Completada') {
        if (kt.dueDate < todayStr) {
          const id = `alert-kt-overdue-${kt.id}`;
          list.push({
            id,
            type: 'kpi_task_overdue',
            priority: 'Alta',
            title: `Tarea de Medición Retrasada: ${kt.kpiCode}`,
            message: `"${kt.title}" venció el ${kt.dueDate} (Paso ${kt.stepNumber} de ${kt.kpiCode}). Responsable: ${kt.responsible}`,
            targetId: kt.id,
            targetType: 'kpi_task',
            date: kt.dueDate,
            read: readAlertIds.includes(id),
          });
        }
      }
    });

    // 3. Action Plans (Improvement actions) - Alert Generator for Every Action Plan
    actionPlans.forEach((action) => {
      if (action.progress < 100) {
        const dueDate = new Date(action.dueDate);
        const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // 1. Alerta Crítica: Plan Vencido
        if (action.dueDate < todayStr) {
          const id = `alert-act-overdue-${action.id}`;
          list.push({
            id,
            type: 'action_overdue',
            priority: 'Alta',
            title: `Plan de Acción Vencido: ${action.code}`,
            message: `"${action.name}" venció el ${action.dueDate} (${Math.abs(diffDays)} días de retraso) y reporta solo ${action.progress}% de avance. KPI: ${action.kpiCode}. Responsable: ${action.responsible}`,
            targetId: action.id,
            targetType: 'action',
            date: action.dueDate,
            read: readAlertIds.includes(id),
          });
        } 
        // 2. Alerta Preventiva: Próximo a Vencer (faltan 15 días o menos)
        else if (diffDays <= 15) {
          const id = `alert-act-due-soon-${action.id}`;
          const isUrgent = diffDays <= 5;
          list.push({
            id,
            type: 'action_due_soon',
            priority: isUrgent ? 'Alta' : 'Media',
            title: `Plan de Acción Próximo a Vencer: ${action.code} (${diffDays} días)`,
            message: `"${action.name}" tiene fecha límite el ${action.dueDate} (${diffDays} días restantes). Avance actual: ${action.progress}%. Responsable: ${action.responsible}`,
            targetId: action.id,
            targetType: 'action',
            date: action.dueDate,
            read: readAlertIds.includes(id),
          });
        }
        // 3. Alerta por Riesgo Operativo / Estancamiento (falta menos de 30 días y 0% de avance)
        else if (diffDays <= 30 && action.progress === 0) {
          const id = `alert-act-stalled-${action.id}`;
          list.push({
            id,
            type: 'action_due_soon',
            priority: 'Media',
            title: `Plan de Acción Sin Iniciar: ${action.code}`,
            message: `"${action.name}" aún reporta 0% de avance y faltan ${diffDays} días para la entrega (${action.dueDate}). Responsable: ${action.responsible}`,
            targetId: action.id,
            targetType: 'action',
            date: action.dueDate,
            read: readAlertIds.includes(id),
          });
        }
      }
    });

    // 4. Area Tasks & Cronograma Operativo
    areaTasks.forEach((at) => {
      if (at.progress < 100) {
        const dueDate = new Date(at.dueDate);
        const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (at.dueDate < todayStr) {
          const id = `alert-poa-overdue-${at.id}`;
          list.push({
            id,
            type: 'action_overdue',
            priority: 'Alta',
            title: `Actividad de Cronograma Vencida: ${at.code}`,
            message: `"${at.activity}" (${at.area}) venció el ${at.dueDate} (${Math.abs(diffDays)} días de retraso) con ${at.progress}% de avance. Responsable: ${at.responsible}`,
            targetId: at.id,
            targetType: 'area_task',
            date: at.dueDate,
            read: readAlertIds.includes(id),
          });
        } else if (diffDays <= 15) {
          const id = `alert-poa-due-soon-${at.id}`;
          const isUrgent = diffDays <= 5;
          list.push({
            id,
            type: 'action_due_soon',
            priority: isUrgent ? 'Alta' : 'Media',
            title: `Actividad de Cronograma Próxima a Vencer: ${at.code} (${diffDays} días)`,
            message: `"${at.activity}" (${at.area}) vence el ${at.dueDate} (${diffDays} días restantes). Avance: ${at.progress}%. Responsable: ${at.responsible}`,
            targetId: at.id,
            targetType: 'area_task',
            date: at.dueDate,
            read: readAlertIds.includes(id),
          });
        } else if (diffDays <= 30 && at.progress === 0) {
          const id = `alert-poa-stalled-${at.id}`;
          list.push({
            id,
            type: 'action_due_soon',
            priority: 'Media',
            title: `Actividad de Cronograma Sin Iniciar: ${at.code}`,
            message: `"${at.activity}" (${at.area}) está en 0% de avance y faltan ${diffDays} días (${at.dueDate}). Responsable: ${at.responsible}`,
            targetId: at.id,
            targetType: 'area_task',
            date: at.dueDate,
            read: readAlertIds.includes(id),
          });
        }
      }
    });

    // Sort by priority
    const priorityWeight: Record<AlertItem['priority'], number> = {
      Alta: 3,
      Media: 2,
      Informativa: 1,
    };
    return list.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  }, [apiAlerts, user, kpis, kpiTasks, actionPlans, areaTasks, readAlertIds]);

  const unreadAlertsCount = useMemo(() => {
    return alerts.filter((a) => !a.read).length;
  }, [alerts]);

  // Methods for KPIs
  const addKpi = (data: Omit<KPI, 'id' | 'compliancePercentage' | 'status' | 'history'>) =>
    runMutation(() => apiRequest('/kpis', token, {
      method: 'POST',
      body: JSON.stringify({
        code: data.code,
        name: data.name,
        objective: data.objective,
        area: data.area,
        targetValue: data.targetValue,
        currentValue: data.currentValue,
        unit: data.unit,
        direction: data.direction,
        responsible: data.responsible,
        responsibleEmail: data.responsibleEmail,
        periodicity: data.periodicity.toUpperCase().replace('Á', 'A'),
        lastUpdated: data.lastUpdated,
      }),
    }));

  const updateKpi = (id: string, updates: Partial<KPI>) => {
    const body: Record<string, unknown> = {};
    for (const field of ['code', 'name', 'objective', 'area', 'targetValue', 'currentValue', 'unit', 'direction', 'responsible', 'responsibleEmail', 'lastUpdated'] as const) {
      if (updates[field] !== undefined) body[field] = updates[field];
    }
    if (updates.periodicity) body.periodicity = updates.periodicity.toUpperCase().replace('Á', 'A');
    return runMutation(() => apiRequest(`/kpis/${id}`, token, { method: 'PATCH', body: JSON.stringify(body) }));
  };

  const deleteKpi = async (_id: string) => {
    setApiError('La API no ofrece eliminación de KPIs; la acción no se ejecutó.');
    return false;
  };

  const addQuarterlyMeasurement = (
    kpiId: string,
    measurement: Omit<HistoricalMeasurement, 'id' | 'compliancePercentage'>
  ) => runMutation(async () => {
    const created = await apiRequest<ApiMeasurement>('/measurements', token, {
      method: 'POST',
      body: JSON.stringify({
        kpiId,
        quarter: measurement.quarter,
        year: measurement.year,
        date: measurement.date,
        value: measurement.value,
        inputA: measurement.inputA,
        inputB: measurement.inputB,
        note: measurement.note,
      }),
    });
    try {
      for (const attachment of measurement.attachedFiles) {
        if (!attachment.dataUrl) continue;
        const fileBlob = await fetch(attachment.dataUrl).then((response) => response.blob());
        const formData = new FormData();
        formData.append('file', fileBlob, attachment.name);
        await apiRequest(`/measurements/${created.id}/attachments`, token, {
          method: 'POST',
          body: formData,
        });
      }
    } catch (error) {
      const uploadError = error instanceof Error ? error.message : 'Error desconocido';
      try {
        await loadRemoteData(token);
        setApiError(`La medición quedó guardada, pero no se pudo cargar una evidencia: ${uploadError}`);
      } catch (refreshError) {
        const refreshMessage = refreshError instanceof Error ? refreshError.message : 'error desconocido';
        setApiError(`La medición quedó guardada, pero falló la carga de evidencia (${uploadError}) y la actualización de la vista (${refreshMessage}).`);
      }
    }
  });

  // Methods for KPI Tasks (Módulo 2)
  const addKpiTask = (data: Omit<KpiTask, 'id' | 'kpiCode' | 'kpiName'>) =>
    runMutation(() => {
      const { evidenceFile: _evidenceFile, ...body } = data;
      return apiRequest('/kpi-tasks', token, { method: 'POST', body: JSON.stringify(body) });
    });

  const updateKpiTask = (id: string, updates: Partial<KpiTask>) => {
    const { kpiCode: _kpiCode, kpiName: _kpiName, evidenceFile: _evidenceFile, ...body } = updates;
    return runMutation(() => apiRequest(`/kpi-tasks/${id}`, token, { method: 'PATCH', body: JSON.stringify(body) }));
  };

  const deleteKpiTask = (id: string) =>
    runMutation(() => apiRequest(`/kpi-tasks/${id}`, token, { method: 'DELETE' }));

  // Methods for Action Plans (Módulo 3)
  const addActionPlan = (data: Omit<ActionPlan, 'id' | 'status' | 'kpiCode' | 'kpiName'>) =>
    runMutation(() => {
      const { attachedFiles: _attachedFiles, ...body } = data;
      return apiRequest('/action-plans', token, { method: 'POST', body: JSON.stringify(body) });
    });

  const updateActionPlan = (id: string, updates: Partial<ActionPlan>) => {
    const { attachedFiles: _attachedFiles, kpiCode: _kpiCode, kpiName: _kpiName, status: _status, ...body } = updates;
    return runMutation(() => apiRequest(`/action-plans/${id}`, token, { method: 'PATCH', body: JSON.stringify(body) }));
  };

  const deleteActionPlan = (id: string) =>
    runMutation(() => apiRequest(`/action-plans/${id}`, token, { method: 'DELETE' }));

  // Methods for Area Tasks (Módulo 4: POA)
  const serializeAreaTask = (data: Partial<AreaManagementTask>) => {
    const { linkedKpiCode, status: _status, ...rest } = data;
    return linkedKpiCode === undefined
      ? rest
      : {
          ...rest,
          linkedKpiId: linkedKpiCode
            ? kpis.find((kpi) => kpi.code === linkedKpiCode)?.id ?? null
            : null,
        };
  };

  const addAreaTask = (data: Omit<AreaManagementTask, 'id' | 'status'>) =>
    runMutation(() => apiRequest('/area-tasks', token, { method: 'POST', body: JSON.stringify(serializeAreaTask(data)) }));

  const updateAreaTask = (id: string, updates: Partial<AreaManagementTask>) =>
    runMutation(() => apiRequest(`/area-tasks/${id}`, token, { method: 'PATCH', body: JSON.stringify(serializeAreaTask(updates)) }));

  const deleteAreaTask = (id: string) =>
    runMutation(() => apiRequest(`/area-tasks/${id}`, token, { method: 'DELETE' }));

  // Alerts
  const markAlertAsRead = (id: string) => {
    setReadAlertIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const markAllAlertsAsRead = () => {
    setReadAlertIds(alerts.map((a) => a.id));
  };

  // Reset & Backup
  const resetToDemoData = () => {
    setApiError('La API no ofrece una acción para restaurar datos de demostración; no se modificó la información.');
  };

  const exportDatabaseJSON = () => {
    const dbPayload = {
      metadata: {
        organization: 'Gran Central de Abastos del Caribe S.A. - Granabastos',
        exportDate: new Date().toISOString(),
        version: '3.0.0-Plan2028-PowerBI',
        strategicHorizon: 'Planeación Estratégica 2024 - 2028',
        googleDriveFolder,
        totalKpis: kpis.length,
        totalKpiTasks: kpiTasks.length,
        totalActions: actionPlans.length,
        totalAreaTasks: areaTasks.length,
      },
      kpis,
      kpiTasks,
      actionPlans,
      areaTasks,
    };
    return JSON.stringify(dbPayload, null, 2);
  };

  const importDatabaseJSON = (_jsonString: string): boolean => {
    setApiError('La API no ofrece importación masiva JSON; no se modificó la información.');
    return false;
  };

  const exportCSV = (type: 'kpis' | 'kpi_tasks' | 'actions' | 'area_tasks' | 'powerbi_star_schema') => {
    if (type === 'kpis') {
      const headers = [
        'ID',
        'Codigo',
        'Nombre_KPI',
        'Area',
        'Objetivo',
        'Meta_Operativa',
        'Resultado_Actual',
        'Unidad',
        'Direccion',
        'Porcentaje_Cumplimiento',
        'Responsable',
        'Email_Responsable',
        'Periodicidad',
        'Fecha_Actualizacion',
        'Estado',
        'Linea_Base_2023',
        'Meta_2024',
        'Meta_2025',
        'Meta_2026',
        'Meta_2027',
        'Meta_2028',
        'Carpeta_Google_Drive',
        'Observaciones',
      ];
      const rows = kpis.map((k) => [
        `"${k.id}"`,
        `"${k.code}"`,
        `"${k.name.replace(/"/g, '""')}"`,
        `"${k.area}"`,
        `"${k.objective.replace(/"/g, '""')}"`,
        k.targetValue,
        k.currentValue,
        `"${k.unit}"`,
        `"${k.direction}"`,
        k.compliancePercentage,
        `"${k.responsible.replace(/"/g, '""')}"`,
        `"${k.responsibleEmail}"`,
        `"${k.periodicity}"`,
        `"${k.lastUpdated}"`,
        `"${k.status}"`,
        k.strategicPlanning2028?.baseline2023 || 0,
        k.strategicPlanning2028?.target2024 || 0,
        k.strategicPlanning2028?.target2025 || 0,
        k.strategicPlanning2028?.target2026 || 0,
        k.strategicPlanning2028?.target2027 || 0,
        k.strategicPlanning2028?.target2028 || 0,
        `"${(k.targetDriveFolder || '').replace(/"/g, '""')}"`,
        `"${(k.observations || '').replace(/"/g, '""')}"`,
      ]);
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      downloadBlob(csvContent, 'Granabastos_KPIs_Planeacion_2028.csv', 'text/csv;charset=utf-8;');
    } else if (type === 'kpi_tasks') {
      const headers = [
        'ID_Tarea',
        'Codigo_KPI',
        'Nombre_KPI',
        'Paso_Numero',
        'Titulo_Tarea_Medicion',
        'Descripcion_Metodologia',
        'Frecuencia_Programada',
        'Mes_Programado',
        'Fecha_Limite',
        'Fecha_Completada',
        'Responsable',
        'Estado',
        'Observaciones',
      ];
      const rows = kpiTasks.map((t) => [
        `"${t.id}"`,
        `"${t.kpiCode}"`,
        `"${t.kpiName.replace(/"/g, '""')}"`,
        t.stepNumber,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${t.description.replace(/"/g, '""')}"`,
        `"${t.scheduledFrequency}"`,
        `"${t.scheduledMonth || ''}"`,
        `"${t.dueDate}"`,
        `"${t.completedDate || ''}"`,
        `"${t.responsible.replace(/"/g, '""')}"`,
        `"${t.status}"`,
        `"${(t.observations || '').replace(/"/g, '""')}"`,
      ]);
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      downloadBlob(csvContent, 'Granabastos_Tareas_Operativas_Medicion_KPI.csv', 'text/csv;charset=utf-8;');
    } else if (type === 'actions') {
      const headers = [
        'ID',
        'Codigo_Accion',
        'Codigo_KPI',
        'Nombre_KPI',
        'Plan_Accion',
        'Actividad_Requerida',
        'Responsable',
        'Email_Responsable',
        'Fecha_Inicio',
        'Fecha_Limite',
        'Porcentaje_Avance',
        'Estado',
        'Observaciones',
        'Evidencia_URL',
      ];
      const rows = actionPlans.map((a) => [
        `"${a.id}"`,
        `"${a.code}"`,
        `"${a.kpiCode}"`,
        `"${a.kpiName.replace(/"/g, '""')}"`,
        `"${a.name.replace(/"/g, '""')}"`,
        `"${a.activity.replace(/"/g, '""')}"`,
        `"${a.responsible.replace(/"/g, '""')}"`,
        `"${a.responsibleEmail}"`,
        `"${a.startDate}"`,
        `"${a.dueDate}"`,
        a.progress,
        `"${a.status}"`,
        `"${(a.observations || '').replace(/"/g, '""')}"`,
        `"${(a.evidenceUrl || '').replace(/"/g, '""')}"`,
      ]);
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      downloadBlob(csvContent, 'Granabastos_Planes_Accion_Estrategicos.csv', 'text/csv;charset=utf-8;');
    } else if (type === 'area_tasks') {
      const headers = [
        'ID_POA',
        'Codigo',
        'Area',
        'Proceso',
        'Actividad_Gestion_Area',
        'Trimestre',
        'Ano',
        'Fecha_Inicio',
        'Fecha_Limite',
        'Porcentaje_Avance',
        'Estado',
        'Entregables',
        'KPI_Vinculado',
        'Responsable',
      ];
      const rows = areaTasks.map((t) => [
        `"${t.id}"`,
        `"${t.code}"`,
        `"${t.area}"`,
        `"${t.processName}"`,
        `"${t.activity.replace(/"/g, '""')}"`,
        `"${t.quarter}"`,
        t.year,
        `"${t.startDate}"`,
        `"${t.dueDate}"`,
        t.progress,
        `"${t.status}"`,
        `"${t.deliverables.replace(/"/g, '""')}"`,
        `"${t.linkedKpiCode || ''}"`,
        `"${t.responsible.replace(/"/g, '""')}"`,
      ]);
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      downloadBlob(csvContent, 'Granabastos_Plan_Gestion_Areas_POA.csv', 'text/csv;charset=utf-8;');
    } else if (type === 'powerbi_star_schema') {
      // Unified star schema with measurements, plan 2028 targets and actions
      const flatRows: string[] = [];
      const headers = [
        'KPI_Code',
        'KPI_Name',
        'Area',
        'Periodicity',
        'Target_2024',
        'Target_2025',
        'Target_2026',
        'Target_2027',
        'Target_2028',
        'Current_Target',
        'Current_Actual',
        'Unit',
        'Compliance_Pct',
        'Status',
        'Quarter_Measurement',
        'Year_Measurement',
        'Measurement_Value',
        'Measurement_Target',
        'Measurement_Compliance',
        'Measurement_Date',
        'Measurement_Has_Evidence',
        'KPI_Responsible',
        'Drive_Folder_URL',
      ];
      flatRows.push(headers.join(','));

      kpis.forEach((kpi) => {
        kpi.history.forEach((hist) => {
          flatRows.push(
            [
              `"${kpi.code}"`,
              `"${kpi.name.replace(/"/g, '""')}"`,
              `"${kpi.area}"`,
              `"${kpi.periodicity}"`,
              kpi.strategicPlanning2028?.target2024 || 0,
              kpi.strategicPlanning2028?.target2025 || 0,
              kpi.strategicPlanning2028?.target2026 || 0,
              kpi.strategicPlanning2028?.target2027 || 0,
              kpi.strategicPlanning2028?.target2028 || 0,
              kpi.targetValue,
              kpi.currentValue,
              `"${kpi.unit}"`,
              kpi.compliancePercentage,
              `"${kpi.status}"`,
              `"${hist.quarter}"`,
              hist.year,
              hist.value,
              hist.targetQuarter,
              hist.compliancePercentage,
              `"${hist.date}"`,
              hist.attachedFiles.length > 0 ? '"SI"' : '"NO"',
              `"${kpi.responsible.replace(/"/g, '""')}"`,
              `"${(kpi.targetDriveFolder || googleDriveFolder).replace(/"/g, '""')}"`,
            ].join(',')
          );
        });
      });

      const csvContent = '\uFEFF' + flatRows.join('\r\n');
      downloadBlob(csvContent, 'Granabastos_PowerBI_Star_Schema_Planeacion2028.csv', 'text/csv;charset=utf-8;');
    }
  };

  const importCSV = (_csvText: string, _type: 'kpis' | 'actions' | 'kpi_tasks' | 'area_tasks') => {
    const error = 'La API no ofrece importación masiva CSV; no se modificó la información.';
    setApiError(error);
    return { success: false, count: 0, error };
  };

  return (
    <DataContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user && token),
        isLoading,
        apiError,
        clearApiError: () => setApiError(null),
        login,
        logout,
        managedUsers,
        loadManagedUsers,
        createManagedUser,
        updateManagedUser,
        downloadAttachment,
        kpis,
        kpiTasks,
        actionPlans,
        areaTasks,
        alerts,
        unreadAlertsCount,
        googleDriveFolder,
        setGoogleDriveFolder,
        addKpi,
        updateKpi,
        deleteKpi,
        addQuarterlyMeasurement,
        addKpiTask,
        updateKpiTask,
        deleteKpiTask,
        addActionPlan,
        updateActionPlan,
        deleteActionPlan,
        addAreaTask,
        updateAreaTask,
        deleteAreaTask,
        markAlertAsRead,
        markAllAlertsAsRead,
        resetToDemoData,
        exportDatabaseJSON,
        importDatabaseJSON,
        exportCSV,
        importCSV,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
