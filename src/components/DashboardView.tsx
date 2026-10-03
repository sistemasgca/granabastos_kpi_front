import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Target, 
  CalendarClock, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: 'kpis' | 'actions' | 'alerts' | 'powerbi') => void;
  onOpenNewMeasurement: (kpiId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenNewMeasurement }) => {
  const { kpis, actionPlans, alerts } = useData();

  // Aggregate stats
  const totalKpis = kpis.length;
  const criticalKpis = kpis.filter(k => k.status === 'Crítico');
  const riskKpis = kpis.filter(k => k.status === 'En riesgo');
  const onTargetKpis = kpis.filter(k => k.status === 'En meta' || k.status === 'Superado');

  const avgCompliance = totalKpis > 0 
    ? Math.round((kpis.reduce((acc, k) => acc + k.compliancePercentage, 0) / totalKpis) * 10) / 10
    : 0;

  const totalActions = actionPlans.length;
  const completedActions = actionPlans.filter(a => a.status === 'Completada').length;
  const overdueActions = actionPlans.filter(a => a.status === 'Retrasada');
  const inProgressActions = actionPlans.filter(a => a.status === 'En progreso').length;
  const avgActionProgress = totalActions > 0
    ? Math.round(actionPlans.reduce((acc, a) => acc + a.progress, 0) / totalActions)
    : 0;

  // Group KPIs by Area
  const areasSummary = React.useMemo(() => {
    const map = new Map<string, { total: number; sumCompliance: number; critical: number }>();
    kpis.forEach(k => {
      const current = map.get(k.area) || { total: 0, sumCompliance: 0, critical: 0 };
      current.total += 1;
      current.sumCompliance += k.compliancePercentage;
      if (k.status === 'Crítico') current.critical += 1;
      map.set(k.area, current);
    });
    return Array.from(map.entries()).map(([area, data]) => ({
      area,
      avg: Math.round(data.sumCompliance / data.total),
      count: data.total,
      critical: data.critical
    }));
  }, [kpis]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Granabastos Institutional Headline */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Gran Central de Abastos del Caribe S.A. · Gerencia General</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Tablero de Control Estratégico & Desempeño
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Monitoreo en tiempo real de indicadores clave de gestión (KPIs), avance de planes de acción y alertas tempranas para la toma de decisiones gerenciales.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('powerbi')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors border border-emerald-500/30 text-white"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Conexión Power BI
          </button>
          <button
            onClick={() => onNavigate('alerts')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            {alerts.length} Alertas Activas
          </button>
        </div>
      </div>

      {/* Critical Alerts Bar if any */}
      {alerts.some(a => a.priority === 'Alta') && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center justify-between gap-3 text-rose-900 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-md shrink-0">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
            </div>
            <div>
              <p className="font-semibold text-rose-950">Atención Gerencial Inmediata Requerida</p>
              <p className="text-rose-800">
                Se registran {criticalKpis.length} KPIs en estado crítico y {overdueActions.length} planes de acción con retrasos respecto a la fecha límite.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-medium rounded-md whitespace-nowrap transition-colors shrink-0"
          >
            Ver Alertas
          </button>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Compliance */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Cumplimiento Global</span>
            <Target className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {avgCompliance}%
            </span>
            <span className={`text-xs font-semibold ${avgCompliance >= 90 ? 'text-emerald-700' : avgCompliance >= 70 ? 'text-amber-700' : 'text-rose-700'}`}>
              {avgCompliance >= 90 ? 'En Meta' : avgCompliance >= 70 ? 'En Riesgo' : 'Crítico'}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full ${avgCompliance >= 90 ? 'bg-emerald-600' : avgCompliance >= 70 ? 'bg-amber-500' : 'bg-rose-600'}`}
              style={{ width: `${Math.min(100, avgCompliance)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Promedio ponderado de {totalKpis} indicadores</p>
        </div>

        {/* Metric 2: KPI Status Distribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Estado de Indicadores</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="grid grid-cols-3 gap-1 text-center font-mono">
            <div className="bg-emerald-50 rounded p-1.5">
              <span className="block text-lg font-bold text-emerald-800 tabular-nums">{onTargetKpis.length}</span>
              <span className="text-[10px] text-emerald-700 font-sans">En Meta</span>
            </div>
            <div className="bg-amber-50 rounded p-1.5">
              <span className="block text-lg font-bold text-amber-800 tabular-nums">{riskKpis.length}</span>
              <span className="text-[10px] text-amber-700 font-sans">Riesgo</span>
            </div>
            <div className="bg-rose-50 rounded p-1.5">
              <span className="block text-lg font-bold text-rose-800 tabular-nums">{criticalKpis.length}</span>
              <span className="text-[10px] text-rose-700 font-sans">Crítico</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Semáforo de cumplimiento institucional</p>
        </div>

        {/* Metric 3: Action Plans Summary */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Planes de Acción</span>
            <CalendarClock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {completedActions}/{totalActions}
            </span>
            <span className="text-xs text-slate-500 font-sans">
              ({avgActionProgress}% avance gral)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="h-full bg-emerald-700 rounded-full"
              style={{ width: `${avgActionProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>{inProgressActions} en curso</span>
            {overdueActions.length > 0 && (
              <span className="text-rose-700 font-medium">{overdueActions.length} retrasadas</span>
            )}
          </div>
        </div>

        {/* Metric 4: System Alerts & Sync */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Alertas Tempranas</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {alerts.length}
            </span>
            <span className="text-xs font-semibold text-rose-700">
              {alerts.filter(a => a.priority === 'Alta').length} de alta prioridad
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">Integración Power BI:</span>
            <span className="text-emerald-700 font-medium">Lista para exportar</span>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="w-full mt-2 text-center text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            Revisar panel de notificaciones →
          </button>
        </div>
      </div>

      {/* Middle Section: Areas Breakdown & Critical KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fulfillment by Area (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Cumplimiento Estratégico por Área</h2>
              <p className="text-xs text-slate-500">Rendimiento promedio de los indicadores según la dirección operativa</p>
            </div>
            <button
              onClick={() => onNavigate('kpis')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
            >
              <span>Ver todos los KPIs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {areasSummary.map(item => (
              <div key={item.area} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{item.area}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({item.count} {item.count === 1 ? 'KPI' : 'KPIs'})</span>
                    {item.critical > 0 && (
                      <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        {item.critical} crítico
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {item.avg}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.avg >= 90 ? 'bg-emerald-600' : item.avg >= 70 ? 'bg-amber-500' : 'bg-rose-600'
                    }`}
                    style={{ width: `${Math.min(100, item.avg)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Action Items & Overdue Tasks */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Acciones Prioritarias</h2>
              <button
                onClick={() => onNavigate('actions')}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                Cronograma →
              </button>
            </div>

            <div className="space-y-3">
              {actionPlans
                .filter(a => a.status === 'Retrasada' || (a.status === 'En progreso' && a.progress < 50))
                .slice(0, 3)
                .map(action => (
                  <div key={action.id} className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-slate-500">{action.code} · {action.kpiCode}</span>
                      <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                        action.status === 'Retrasada' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {action.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">{action.name}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Vence: <strong className="font-mono text-slate-700">{action.dueDate}</strong></span>
                      <span className="font-mono font-bold text-slate-900">{action.progress}% avance</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1 mt-1 overflow-hidden">
                      <div 
                        className={`h-full ${action.status === 'Retrasada' ? 'bg-rose-600' : 'bg-amber-500'}`}
                        style={{ width: `${action.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigate('actions')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors text-center"
            >
              Ver Cronograma Completo de Planes de Acción
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Executive KPI Table Summary */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Resumen Ejecutivo de Indicadores</h2>
            <p className="text-xs text-slate-500">Corte más reciente y nivel de cumplimiento por indicador</p>
          </div>
          <button
            onClick={() => onNavigate('kpis')}
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
          >
            Administrar y Registrar Mediciones
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Código</th>
                <th className="py-2.5 px-3">Indicador</th>
                <th className="py-2.5 px-3">Área</th>
                <th className="py-2.5 px-3 text-right">Meta</th>
                <th className="py-2.5 px-3 text-right">Actual</th>
                <th className="py-2.5 px-3 text-center">% Cumplimiento</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
                <th className="py-2.5 px-3">Responsable</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kpis.slice(0, 6).map((kpi) => (
                <tr key={kpi.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-600 whitespace-nowrap">
                    {kpi.code}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    <p className="line-clamp-1">{kpi.name}</p>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                    {kpi.area}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600 tabular-nums whitespace-nowrap">
                    {kpi.targetValue.toLocaleString('es-CO')} {kpi.unit}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                    {kpi.currentValue.toLocaleString('es-CO')} {kpi.unit}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-semibold tabular-nums whitespace-nowrap">
                    <span className={
                      kpi.compliancePercentage >= 90 
                        ? 'text-emerald-700' 
                        : kpi.compliancePercentage >= 70 
                        ? 'text-amber-700' 
                        : 'text-rose-700'
                    }>
                      {kpi.compliancePercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full ${
                      kpi.status === 'Superado'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : kpi.status === 'En meta'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : kpi.status === 'En riesgo'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {kpi.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 line-clamp-1 max-w-[180px]">
                    {kpi.responsible}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onOpenNewMeasurement(kpi.id)}
                      className="px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded transition-colors"
                    >
                      + Medir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
