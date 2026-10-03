const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? payload.message
        : `Error de conexión con el servidor (${response.status}).`;
    throw new ApiError(Array.isArray(message) ? message.join(', ') : String(message), response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function apiDownload(path: string, token: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? payload.message
        : `No fue posible descargar el archivo (${response.status}).`;
    throw new ApiError(Array.isArray(message) ? message.join(', ') : String(message), response.status);
  }
  return response.blob();
}

export async function loginRequest(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? payload.message
        : `No fue posible iniciar sesión (${response.status}).`;
    throw new ApiError(Array.isArray(message) ? message.join(', ') : String(message), response.status);
  }
  return response.json() as Promise<LoginResponse>;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: ApiUser;
}

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export interface ManagedUser extends ApiUser {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKpi {
  id: string;
  code: string;
  name: string;
  objective: string;
  area: string;
  targetValue: number | string;
  currentValue: number | string;
  unit: string;
  direction: 'higher_is_better' | 'lower_is_better';
  compliancePercentage: number | string;
  responsible: string;
  responsibleEmail: string;
  periodicity: 'MENSUAL' | 'BIMESTRAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  lastUpdated: string;
  status: 'CRITICO' | 'EN_RIESGO' | 'EN_META' | 'SUPERADO';
  observations?: string | null;
  targetDriveFolder?: string | null;
  baseline2023?: number | string | null;
  target2024?: number | string | null;
  target2025?: number | string | null;
  target2026?: number | string | null;
  target2027?: number | string | null;
  target2028?: number | string | null;
  strategyNotes?: string | null;
}

export interface ApiMeasurement {
  id: string;
  kpiId: string;
  quarter: 'T1' | 'T2' | 'T3' | 'T4';
  year: number;
  date: string;
  targetQuarter: number | string;
  value: number | string;
  compliancePercentage: number | string;
  note?: string | null;
  registeredBy?: string | null;
  driveFolderDestination?: string | null;
  inputA?: number | string | null;
  inputB?: number | string | null;
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    mimeType: string;
    createdAt: string;
  }>;
}

export interface ApiKpiTask {
  id: string;
  kpiId: string;
  stepNumber: number;
  title: string;
  description: string;
  scheduledFrequency: string;
  scheduledMonth?: string | null;
  dueDate: string;
  completedDate?: string | null;
  responsible: string;
  status: string;
  observations?: string | null;
  kpi: { code: string; name: string };
}

export interface ApiActionPlan {
  id: string;
  code: string;
  kpiId: string;
  name: string;
  activity: string;
  responsible: string;
  responsibleEmail: string;
  startDate: string;
  dueDate: string;
  progress: number;
  status: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'RETRASADA';
  observations?: string | null;
  evidenceUrl?: string | null;
  evidenceNotes?: string | null;
  kpi: { code: string; name: string };
}

export interface ApiAreaTask {
  id: string;
  code: string;
  area: string;
  processName: string;
  activity: string;
  responsible: string;
  responsibleEmail: string;
  quarter: 'T1' | 'T2' | 'T3' | 'T4';
  year: number;
  startDate: string;
  dueDate: string;
  progress: number;
  status: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'RETRASADA';
  deliverables: string;
  linkedKpiId?: string | null;
  observations?: string | null;
  evidenceUrl?: string | null;
  linkedKpi?: { id: string; code: string; name: string } | null;
}

export interface ApiAlert {
  id: string;
  type: 'kpi_critical' | 'kpi_risk' | 'action_overdue' | 'action_due_soon' | 'kpi_outdated' | 'kpi_task_overdue';
  priority: 'Alta' | 'Media';
  title: string;
  message: string;
  targetId: string;
  targetType: 'kpi' | 'action' | 'kpi_task' | 'area_task';
  date: string;
  read: boolean;
}
