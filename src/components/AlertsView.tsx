import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { AlertPriority, AlertType } from '../types';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Filter, 
  ArrowRight, 
  CheckCheck, 
  AlertCircle,
  Activity,
  Flame,
  ShieldCheck,
  CheckSquare,
  CalendarRange
} from 'lucide-react';

interface AlertsViewProps {
  onNavigateToKpi: (kpiId: string) => void;
  onNavigateToAction: (actionId: string) => void;
  onNavigateToKpiTask?: (taskId: string) => void;
  onNavigateToAreaTask?: (taskId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  onNavigateToKpi,
  onNavigateToAction,
  onNavigateToKpiTask,
  onNavigateToAreaTask,
}) => {
  const { alerts, markAlertAsRead, markAllAlertsAsRead } = useData();

  const [selectedPriority, setSelectedPriority] = useState<string>('Todas');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesPriority = selectedPriority === 'Todas' || alert.priority === selectedPriority;
      const matchesType = selectedType === 'Todos' || alert.type === selectedType;
      const matchesUnread = !showUnreadOnly || !alert.read;
      return matchesPriority && matchesType && matchesUnread;
    });
  }, [alerts, selectedPriority, selectedType, showUnreadOnly]);

  const highPriorityCount = alerts.filter((a) => a.priority === 'Alta').length;
  const mediumPriorityCount = alerts.filter((a) => a.priority === 'Media').length;

  const handleActionClick = (alert: typeof alerts[0]) => {
    markAlertAsRead(alert.id);
    if (alert.targetType === 'kpi') {
      onNavigateToKpi(alert.targetId);
    } else if (alert.targetType === 'kpi_task' && onNavigateToKpiTask) {
      onNavigateToKpiTask(alert.targetId);
    } else if (alert.targetType === 'area_task' && onNavigateToAreaTask) {
      onNavigateToAreaTask(alert.targetId);
    } else {
      onNavigateToAction(alert.targetId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-700" />
            <span>Centro de Notificaciones & Alertas Tempranas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Detección automática de desviaciones en metas 2028, cortes trimestrales pendientes, tareas de medición demoradas y planes de acción vencidos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllAlertsAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Marcar todas como leídas</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-rose-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-rose-800 mb-1">
            <span className="font-semibold">Prioridad Alta</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-rose-700 tabular-nums">{highPriorityCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">KPIs críticos (&lt;70%) o tareas vencidas</p>
        </div>

        <div className="bg-white border border-amber-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-800 mb-1">
            <span className="font-semibold">Prioridad Media</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-700 tabular-nums">{mediumPriorityCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Cortes pendientes o próximos vencimientos</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="font-semibold">Total Alertas Vigentes</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{alerts.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Calculadas en tiempo real para Granabastos</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="Todas">Todas las Prioridades</option>
            <option value="Alta">Prioridad Alta</option>
            <option value="Media">Prioridad Media</option>
            <option value="Informativa">Informativa</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="Todos">Todos los Tipos</option>
            <option value="kpi_critical">KPI Crítico (&lt;70%)</option>
            <option value="kpi_risk">KPI En Riesgo (70-89%)</option>
            <option value="action_overdue">Plan de Acción Vencido</option>
            <option value="action_due_soon">Plan de Acción Próximo a Vencer / Alerta Preventiva</option>
            <option value="kpi_task_overdue">Tarea de Medición Retrasada</option>
            <option value="kpi_outdated">Corte Trimestral Pendiente</option>
          </select>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 ml-2">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="rounded text-emerald-700 focus:ring-emerald-600"
            />
            <span>Solo no leídas</span>
          </label>
        </div>

        <span className="text-slate-500">
          Mostrando {filteredAlerts.length} de {alerts.length} alertas
        </span>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No hay alertas pendientes</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            No se han registrado desviaciones graves, actividades vencidas o faltas de reporte con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isHigh = alert.priority === 'Alta';
            const isMedium = alert.priority === 'Media';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all ${
                  alert.read ? 'bg-slate-50/70 border-slate-200' : 'bg-white shadow-xs'
                } ${
                  isHigh
                    ? alert.read ? 'border-rose-200/80' : 'border-rose-300 ring-1 ring-rose-300/30'
                    : isMedium
                    ? alert.read ? 'border-amber-200/80' : 'border-amber-300 ring-1 ring-amber-300/30'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-md shrink-0 mt-0.5 ${
                        isHigh
                          ? 'bg-rose-100 text-rose-700'
                          : isMedium
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {alert.targetType === 'kpi_task' ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : alert.targetType === 'area_task' ? (
                        <CalendarRange className="w-4 h-4" />
                      ) : isHigh ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            isHigh
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : isMedium
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          Prioridad {alert.priority}
                        </span>

                        <span className="font-mono text-[11px] text-slate-400">
                          {alert.date}
                        </span>

                        {!alert.read && (
                          <span className="px-1.5 py-0.2 bg-emerald-700 text-white text-[9px] font-bold rounded">
                            NUEVA
                          </span>
                        )}
                      </div>

                      <h2 className="text-xs font-bold text-slate-900">{alert.title}</h2>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {!alert.read && (
                      <button
                        onClick={() => markAlertAsRead(alert.id)}
                        className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      >
                        Marcar Leída
                      </button>
                    )}

                    <button
                      onClick={() => handleActionClick(alert)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-emerald-800 rounded-md transition-colors whitespace-nowrap"
                    >
                      <span>
                        Gestionar {
                          alert.targetType === 'kpi'
                            ? 'KPI'
                            : alert.targetType === 'kpi_task'
                            ? 'Tarea de Medición'
                            : alert.targetType === 'area_task'
                            ? 'Actividad Área'
                            : 'Plan de Acción'
                        }
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
