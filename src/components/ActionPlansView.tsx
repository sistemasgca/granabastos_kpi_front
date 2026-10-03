import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { ActionPlan, AreaManagementTask, ActionStatus, Quarter } from '../types';
import { GRANABASTOS_AREAS, QUARTERS } from '../data/initialData';
import { 
  CalendarClock, 
  Search, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  FileText, 
  Calendar, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Bell, 
  AlertCircle, 
  CalendarRange, 
  Wrench, 
  Layers, 
  Building2, 
  LayoutGrid, 
  CheckSquare,
  Sparkles,
  Target
} from 'lucide-react';

export type UnifiedItemKind = 'plan_accion' | 'cronograma_area';

export interface UnifiedItem {
  id: string;
  kind: UnifiedItemKind;
  code: string;
  title: string;
  description: string;
  area: string;
  categoryOrProcess: string;
  responsible: string;
  responsibleEmail?: string;
  startDate: string;
  dueDate: string;
  progress: number;
  status: ActionStatus;
  kpiCode?: string;
  kpiName?: string;
  quarter?: Quarter;
  year?: number;
  deliverables?: string;
  evidenceUrl?: string;
  rawAction?: ActionPlan;
  rawAreaTask?: AreaManagementTask;
}

interface ActionPlansViewProps {
  onOpenNewActionModal: (kpiId?: string) => void;
  onOpenEditActionModal: (plan: ActionPlan) => void;
  onOpenNewAreaTaskModal?: (area?: string) => void;
  onOpenEditAreaTaskModal?: (task: AreaManagementTask) => void;
}

export const ActionPlansView: React.FC<ActionPlansViewProps> = ({
  onOpenNewActionModal,
  onOpenEditActionModal,
  onOpenNewAreaTaskModal,
  onOpenEditAreaTaskModal,
}) => {
  const { 
    actionPlans, 
    areaTasks, 
    kpis, 
    updateActionPlan, 
    deleteActionPlan, 
    updateAreaTask, 
    deleteAreaTask 
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKind, setSelectedKind] = useState<'Todos' | 'plan_accion' | 'cronograma_area'>('Todos');
  const [selectedArea, setSelectedArea] = useState<string>('Todas');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [filterAlertOnly, setFilterAlertOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'cards' | 'quarterly'>('timeline');

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toISOString().split('T')[0], [today]);

  // Map KPI code to its area for quick enrichment
  const kpiAreaMap = useMemo(() => {
    const map = new Map<string, string>();
    kpis.forEach((k) => {
      map.set(k.code, k.area);
      map.set(k.id, k.area);
    });
    return map;
  }, [kpis]);

  // Helper to deduce quarter from a date if not explicitly set
  const deduceQuarter = (dateStr: string): Quarter => {
    if (!dateStr) return 'T3';
    const month = parseInt(dateStr.split('-')[1], 10);
    if (month <= 3) return 'T1';
    if (month <= 6) return 'T2';
    if (month <= 9) return 'T3';
    return 'T4';
  };

  // Build unified items list
  const unifiedItems: UnifiedItem[] = useMemo(() => {
    const list: UnifiedItem[] = [];

    // 1. Strategic Action Plans linked to KPIs
    actionPlans.forEach((plan) => {
      const area = kpiAreaMap.get(plan.kpiCode) || kpiAreaMap.get(plan.kpiId) || 'Estratégica / Gerencia';
      list.push({
        id: plan.id,
        kind: 'plan_accion',
        code: plan.code,
        title: plan.name,
        description: plan.activity,
        area,
        categoryOrProcess: plan.kpiName ? `KPI: ${plan.kpiCode} · ${plan.kpiName}` : `KPI: ${plan.kpiCode}`,
        responsible: plan.responsible,
        responsibleEmail: plan.responsibleEmail,
        startDate: plan.startDate,
        dueDate: plan.dueDate,
        progress: plan.progress,
        status: plan.status,
        kpiCode: plan.kpiCode,
        kpiName: plan.kpiName,
        quarter: deduceQuarter(plan.dueDate),
        year: parseInt(plan.dueDate?.split('-')[0] || '2026', 10),
        deliverables: plan.activity,
        evidenceUrl: plan.evidenceUrl,
        rawAction: plan,
      });
    });

    // 2. Area Cronograma & POA Tasks
    areaTasks.forEach((task) => {
      list.push({
        id: task.id,
        kind: 'cronograma_area',
        code: task.code,
        title: task.activity,
        description: task.deliverables || '',
        area: task.area,
        categoryOrProcess: task.processName,
        responsible: task.responsible,
        responsibleEmail: task.responsibleEmail,
        startDate: task.startDate,
        dueDate: task.dueDate,
        progress: task.progress,
        status: task.status,
        kpiCode: task.linkedKpiCode,
        quarter: task.quarter,
        year: task.year,
        deliverables: task.deliverables,
        evidenceUrl: task.evidenceUrl,
        rawAreaTask: task,
      });
    });

    return list;
  }, [actionPlans, areaTasks, kpiAreaMap]);

  // Unified Alert Evaluator
  const getAlertStatus = (item: UnifiedItem) => {
    if (item.progress >= 100) {
      return {
        type: 'completed',
        hasAlert: false,
        label: '100% Cumplido',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: CheckCircle2,
        diffDays: 0,
      };
    }
    const dueObj = new Date(item.dueDate);
    const diffDays = Math.ceil((dueObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (item.dueDate < todayStr || item.status === 'Retrasada') {
      return {
        type: 'overdue',
        hasAlert: true,
        label: `🚨 Alerta Crítica: Vencido (${Math.abs(diffDays)}d)`,
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-300 font-bold animate-pulse',
        icon: AlertTriangle,
        diffDays,
      };
    }
    if (diffDays <= 5) {
      return {
        type: 'urgent',
        hasAlert: true,
        label: `⚠️ Alerta Urgente: Vence en ${diffDays} días`,
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
        icon: AlertCircle,
        diffDays,
      };
    }
    if (diffDays <= 15) {
      return {
        type: 'preventive',
        hasAlert: true,
        label: `🔔 Alerta Preventiva: Vence en ${diffDays} días`,
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',
        icon: Bell,
        diffDays,
      };
    }
    if (diffDays <= 30 && item.progress === 0) {
      return {
        type: 'stalled',
        hasAlert: true,
        label: `⚡ Alerta: Sin avance (0%) · Faltan ${diffDays}d`,
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Clock,
        diffDays,
      };
    }
    return {
      type: 'normal',
      hasAlert: false,
      label: `En plazo (${diffDays}d restantes)`,
      badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
      icon: Clock,
      diffDays,
    };
  };

  // Filtered Unified Items
  const filteredItems = useMemo(() => {
    return unifiedItems.filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.responsible.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.categoryOrProcess.toLowerCase().includes(q) ||
        (item.kpiCode && item.kpiCode.toLowerCase().includes(q)) ||
        (item.deliverables && item.deliverables.toLowerCase().includes(q));

      const matchesKind = selectedKind === 'Todos' || item.kind === selectedKind;
      const matchesArea = selectedArea === 'Todas' || item.area === selectedArea;
      const matchesQuarter = selectedQuarter === 'Todos' || item.quarter === selectedQuarter;
      const matchesStatus = selectedStatus === 'Todos' || item.status === selectedStatus;

      const alertInfo = getAlertStatus(item);
      const matchesAlertOnly = !filterAlertOnly || alertInfo.hasAlert;

      return matchesSearch && matchesKind && matchesArea && matchesQuarter && matchesStatus && matchesAlertOnly;
    });
  }, [unifiedItems, searchTerm, selectedKind, selectedArea, selectedQuarter, selectedStatus, filterAlertOnly, todayStr]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = unifiedItems.length;
    const plansCount = unifiedItems.filter((i) => i.kind === 'plan_accion').length;
    const areaTasksCount = unifiedItems.filter((i) => i.kind === 'cronograma_area').length;
    const completed = unifiedItems.filter((i) => i.progress >= 100).length;
    const activeAlerts = unifiedItems.filter((i) => getAlertStatus(i).hasAlert).length;
    const inProgress = total - completed;
    const avgProgress = total > 0 ? Math.round(unifiedItems.reduce((acc, i) => acc + i.progress, 0) / total) : 0;

    return { total, plansCount, areaTasksCount, completed, activeAlerts, inProgress, avgProgress };
  }, [unifiedItems, todayStr]);

  // Handlers for edit, delete, and progress
  const handleEdit = (item: UnifiedItem) => {
    if (item.kind === 'plan_accion' && item.rawAction) {
      onOpenEditActionModal(item.rawAction);
    } else if (item.kind === 'cronograma_area' && item.rawAreaTask && onOpenEditAreaTaskModal) {
      onOpenEditAreaTaskModal(item.rawAreaTask);
    }
  };

  const handleDelete = (item: UnifiedItem) => {
    if (window.confirm(`¿Está seguro de eliminar ${item.kind === 'plan_accion' ? 'el plan de acción' : 'la actividad de cronograma'} "${item.title}"?`)) {
      if (item.kind === 'plan_accion') {
        deleteActionPlan(item.id);
      } else {
        deleteAreaTask(item.id);
      }
    }
  };

  const handleQuickProgressUpdate = (item: UnifiedItem, newProgress: number) => {
    if (item.kind === 'plan_accion') {
      updateActionPlan(item.id, { progress: newProgress });
    } else {
      updateAreaTask(item.id, { progress: newProgress });
    }
  };

  // Timeline Gantt range calculation
  const timelineDates = useMemo(() => {
    if (filteredItems.length === 0) return { start: new Date(), end: new Date(), totalDays: 30 };
    const dates = filteredItems.flatMap((p) => [
      new Date(p.startDate || p.dueDate).getTime(), 
      new Date(p.dueDate).getTime()
    ]);
    const minTime = Math.min(...dates);
    const maxTime = Math.max(...dates);
    const start = new Date(minTime);
    start.setDate(start.getDate() - 3);
    const end = new Date(maxTime);
    end.setDate(end.getDate() + 7);
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return { start, end, totalDays };
  }, [filteredItems]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Unified Module */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-xl p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Módulo Unificado · Gestión y Ejecución Institucional Granabastos</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Planes de Acción & Cronograma Operativo de Gestión
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl">
              Consolidación integral de <strong>Planes de Acción</strong> (iniciativas estratégicas para el cumplimiento de KPIs de Gerencia) y el <strong>Cronograma de Gestión por Dependencias</strong> (Operaciones, Financiera, Comercial, Calidad, Ambiental y Gerencia) estructurado por trimestres con <strong>sistema de alertas automáticas</strong>.
            </p>
          </div>

          {/* Quick Registration Actions */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
            <button
              onClick={() => onOpenNewActionModal()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors shadow-xs"
              title="Crear un plan de acción de mejora para que un KPI se cumpla"
            >
              <Wrench className="w-3.5 h-3.5 text-slate-900" />
              <span>+ Plan de Acción (KPI)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Iniciativas</span>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-lg font-bold text-slate-900">{stats.total}</p>
          <span className="text-[10px] text-slate-500">Planes + Cronograma</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Planes de Acción</span>
            <Wrench className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-lg font-bold text-slate-900">{stats.plansCount}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Vinculados a KPIs</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Cronograma Áreas</span>
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-lg font-bold text-slate-900">{stats.areaTasksCount}</p>
          <span className="text-[10px] text-blue-700 font-medium">Gestión Dependencias</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Alertas Activas</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <p className="text-lg font-bold text-rose-700">{stats.activeAlerts}</p>
          <span className="text-[10px] text-rose-600 font-semibold">Críticas & Preventivas</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completadas</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-emerald-700">{stats.completed}</p>
          <span className="text-[10px] text-slate-500">100% de avance</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avance Promedio</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <p className="text-lg font-bold text-slate-900">{stats.avgProgress}%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
            <div 
              className="bg-emerald-600 h-1.5 rounded-full" 
              style={{ width: `${Math.min(stats.avgProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alert Engine Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-400/20 text-amber-300 rounded-md border border-amber-400/30">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              <span>Motor de Alertas Automáticas (Planes de Acción & Cronograma)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono">
                Supervisión Activa
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cada plan y actividad genera alertas automáticas: críticas por vencimiento, preventivas a 15 y 5 días antes, y por estancamiento (0% de avance con entrega cercana).
            </p>
          </div>
        </div>

        <button
          onClick={() => setFilterAlertOnly(!filterAlertOnly)}
          className={`px-3 py-1.5 text-xs rounded-md font-semibold border transition-colors flex items-center gap-1.5 shrink-0 shadow-xs ${
            filterAlertOnly
              ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <AlertCircle className={`w-3.5 h-3.5 ${filterAlertOnly ? 'text-slate-950' : 'text-amber-400'}`} />
          <span>{filterAlertOnly ? 'Ver Todo el Cronograma' : `Filtrar Sólo con Alerta Activa (${stats.activeAlerts})`}</span>
        </button>
      </div>

      {/* Control Panel: Filters & View Modes */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-3">
        {/* Row 1: Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
          {/* Search box */}
          <div className="relative lg:col-span-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar plan, actividad, KPI, área, responsable o entregable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
            />
          </div>

          {/* Type filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedKind}
              onChange={(e) => setSelectedKind(e.target.value as any)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 font-medium"
            >
              <option value="Todos">Tipo: Todos</option>
              <option value="plan_accion">Solo Planes de Acción (KPI)</option>
              <option value="cronograma_area">Solo Cronograma Áreas (POA)</option>
            </select>
          </div>

          {/* Area filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="Todas">Todas las Áreas</option>
              {GRANABASTOS_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Quarter filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="Todos">Todos los Trimestres</option>
              {QUARTERS.map((q) => (
                <option key={q} value={q}>{q} (Trimestre)</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="En progreso">En progreso</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Retrasada">Retrasada</option>
              <option value="Completada">Completada</option>
            </select>
          </div>
        </div>

        {/* Row 2: View Switcher and Results count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>Mostrando <strong>{filteredItems.length}</strong> de <strong>{unifiedItems.length}</strong> registros</span>
            {filterAlertOnly && (
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[10px]">
                Filtro Alertas Activas
              </span>
            )}
          </div>

          {/* View mode buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white font-bold text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span>Cronograma Gantt</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white font-bold text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tarjetas Detalladas</span>
            </button>
            <button
              onClick={() => setViewMode('quarterly')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors ${
                viewMode === 'quarterly'
                  ? 'bg-white font-bold text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Matriz Trimestral (T1-T4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT: 3 VIEW MODES */}

      {/* MODE 1: UNIFIED TIMELINE / GANTT */}
      {viewMode === 'timeline' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-emerald-700" />
                <span>Cronograma Temporal Gantt Consolidado</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Línea de tiempo con inicio, vencimiento y alertas calculadas contra el día de hoy ({todayStr})
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> 100% Cumplido
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Preventivo
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Vencido / Retraso
              </span>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No se encontraron iniciativas con los filtros seleccionados.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedKind('Todos');
                  setSelectedArea('Todas');
                  setSelectedQuarter('Todos');
                  setSelectedStatus('Todos');
                  setFilterAlertOnly(false);
                }}
                className="mt-2 text-xs font-semibold text-emerald-700 hover:underline"
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const alertInfo = getAlertStatus(item);
                const isCompleted = item.progress >= 100;
                
                // Gantt bar position calculations
                const startDateObj = new Date(item.startDate || item.dueDate);
                const dueDateObj = new Date(item.dueDate);
                const totalTimelineMs = timelineDates.end.getTime() - timelineDates.start.getTime();
                
                const leftPercent = Math.max(0, Math.min(100, 
                  ((startDateObj.getTime() - timelineDates.start.getTime()) / totalTimelineMs) * 100
                ));
                const widthPercent = Math.max(4, Math.min(100 - leftPercent, 
                  ((dueDateObj.getTime() - startDateObj.getTime()) / totalTimelineMs) * 100
                ));

                return (
                  <div key={item.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Kind badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded ${
                          item.kind === 'plan_accion'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}>
                          {item.kind === 'plan_accion' ? (
                            <>
                              <Wrench className="w-3 h-3" />
                              <span>Plan Acción (KPI)</span>
                            </>
                          ) : (
                            <>
                              <Building2 className="w-3 h-3" />
                              <span>Cronograma Área</span>
                            </>
                          )}
                        </span>

                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {item.code}
                        </span>

                        <span className="text-xs font-semibold text-slate-600">
                          {item.area}
                        </span>

                        {item.kpiCode && (
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            KPI: {item.kpiCode}
                          </span>
                        )}

                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.quarter || 'T3'} {item.year || 2026}
                        </span>
                      </div>

                      {/* Right alerts & status */}
                      <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded border ${alertInfo.badgeClass}`}>
                          {React.createElement(alertInfo.icon, { className: 'w-3 h-3 shrink-0' })}
                          <span>{alertInfo.label}</span>
                        </span>

                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Retrasada'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>

                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-200 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title and descriptions */}
                    <div className="mb-2.5">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                      {item.description && (
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{item.description}</p>
                      )}
                    </div>

                    {/* Gantt Bar Visualization */}
                    <div className="bg-slate-100 rounded-lg p-2 border border-slate-200">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Inicio: {item.startDate || item.dueDate}</span>
                        </span>
                        <span className="font-bold text-slate-700 font-mono">
                          Avance: {item.progress}%
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Límite: {item.dueDate}</span>
                        </span>
                      </div>

                      {/* Track */}
                      <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="absolute h-full rounded-full transition-all duration-300"
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            backgroundColor: isCompleted
                              ? '#059669' // emerald-600
                              : alertInfo.type === 'overdue'
                              ? '#e11d48' // rose-600
                              : alertInfo.type === 'urgent' || alertInfo.type === 'preventive'
                              ? '#d97706' // amber-600
                              : '#2563eb', // blue-600
                          }}
                        >
                          {/* Inner fill based on progress */}
                          <div 
                            className="h-full bg-white/30"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata & Quick Progress Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-3 text-slate-600 flex-wrap">
                        <span className="flex items-center gap-1 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.responsible}</span>
                        </span>
                        {item.deliverables && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 italic truncate max-w-xs">
                            <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>Entregable: {item.deliverables}</span>
                          </span>
                        )}
                        {item.evidenceUrl && (
                          <a
                            href={item.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-emerald-700 hover:underline text-[11px] font-semibold"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Evidencia en Drive</span>
                          </a>
                        )}
                      </div>

                      {/* Quick progress update */}
                      <div className="flex items-center gap-1 self-end sm:self-auto">
                        <span className="text-[10px] text-slate-400 mr-1">Progreso rápido:</span>
                        {[0, 25, 50, 75, 100].map((p) => (
                          <button
                            key={p}
                            onClick={() => handleQuickProgressUpdate(item, p)}
                            className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
                              item.progress === p
                                ? 'bg-emerald-800 text-white font-bold'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {p}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: CARDS DETAILED VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No se encontraron registros con los filtros seleccionados.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const alertInfo = getAlertStatus(item);
              const isCompleted = item.progress >= 100;

              return (
                <div 
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded ${
                          item.kind === 'plan_accion'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}>
                          {item.kind === 'plan_accion' ? (
                            <>
                              <Wrench className="w-2.5 h-2.5" />
                              <span>Plan Acción (KPI)</span>
                            </>
                          ) : (
                            <>
                              <Building2 className="w-2.5 h-2.5" />
                              <span>Cronograma Área</span>
                            </>
                          )}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.code}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                          {item.quarter || 'T3'} {item.year || 2026}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-slate-400 hover:text-emerald-700 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1 text-slate-400 hover:text-rose-700 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Alert Badge Banner */}
                    <div className="mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded border w-full ${alertInfo.badgeClass}`}>
                        {React.createElement(alertInfo.icon, { className: 'w-3 h-3 shrink-0' })}
                        <span>{alertInfo.label}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                      {item.title}
                    </h3>

                    {/* Area & Process */}
                    <div className="text-[11px] text-slate-500 mb-2 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">{item.area}</span>
                      <span>·</span>
                      <span className="truncate">{item.categoryOrProcess}</span>
                    </div>

                    {/* Description / Deliverable */}
                    {item.description && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mb-3 line-clamp-3">
                        {item.description}
                      </p>
                    )}

                    {/* Deliverables note */}
                    {item.deliverables && (
                      <div className="text-[11px] text-slate-500 mb-2 flex items-start gap-1">
                        <FileText className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <span><strong>Entregable:</strong> {item.deliverables}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom section: Progress, dates, responsible */}
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                    {/* Progress slider bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[11px] text-slate-500 font-medium">Avance</span>
                        <span className="font-mono font-bold text-slate-800">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isCompleted
                              ? 'bg-emerald-600'
                              : alertInfo.type === 'overdue'
                              ? 'bg-rose-600'
                              : alertInfo.type === 'urgent' || alertInfo.type === 'preventive'
                              ? 'bg-amber-500'
                              : 'bg-emerald-600'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      {/* Quick progress buttons */}
                      <div className="flex items-center justify-between gap-1 mt-1.5">
                        {[0, 25, 50, 75, 100].map((p) => (
                          <button
                            key={p}
                            onClick={() => handleQuickProgressUpdate(item, p)}
                            className={`flex-1 py-0.5 text-[9px] font-mono rounded transition-colors text-center ${
                              item.progress === p
                                ? 'bg-emerald-800 text-white font-bold'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {p}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dates & Responsible */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[120px]">{item.responsible}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-slate-600">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.dueDate}</span>
                      </span>
                    </div>

                    {/* Evidence link */}
                    {item.evidenceUrl && (
                      <div className="pt-1">
                        <a
                          href={item.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 py-1 rounded border border-emerald-200 transition-colors w-full"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Abrir Carpeta de Evidencia en Drive</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MODE 3: QUARTERLY MATRIX (T1, T2, T3, T4 HACIA 2028) */}
      {viewMode === 'quarterly' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUARTERS.map((quarter) => {
            const quarterItems = filteredItems.filter((i) => (i.quarter || 'T3') === quarter);
            const quarterCompleted = quarterItems.filter((i) => i.progress >= 100).length;
            const quarterAlerts = quarterItems.filter((i) => getAlertStatus(i).hasAlert).length;

            return (
              <div 
                key={quarter}
                className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col"
              >
                {/* Column Header */}
                <div className="p-3.5 bg-emerald-950 text-white border-b border-emerald-900">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-amber-300">{quarter}</span>
                    <span className="text-xs bg-emerald-900 px-2 py-0.5 rounded font-mono">
                      {quarter === 'T1' && 'Ene - Mar'}
                      {quarter === 'T2' && 'Abr - Jun'}
                      {quarter === 'T3' && 'Jul - Sep'}
                      {quarter === 'T4' && 'Oct - Dic'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-200 mt-2">
                    <span>{quarterItems.length} Iniciativas</span>
                    <span>{quarterCompleted} listos · {quarterAlerts} alertas</span>
                  </div>
                </div>

                {/* Column Items */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[600px] bg-slate-50/50">
                  {quarterItems.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      Sin actividades para {quarter}
                    </div>
                  ) : (
                    quarterItems.map((item) => {
                      const alertInfo = getAlertStatus(item);

                      return (
                        <div
                          key={item.id}
                          className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.code}
                            </span>
                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] rounded border ${alertInfo.badgeClass}`}>
                              {React.createElement(alertInfo.icon, { className: 'w-2.5 h-2.5 shrink-0' })}
                              <span>{alertInfo.label}</span>
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 leading-snug">{item.title}</h4>
                          <p className="text-[11px] text-slate-500">{item.area}</p>

                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                            <span className="text-slate-600 font-medium">{item.responsible}</span>
                            <span className="font-mono font-bold text-emerald-700">{item.progress}%</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
