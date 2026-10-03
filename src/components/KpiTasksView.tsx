import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { KpiTask } from '../types';
import { 
  CheckSquare, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  User, 
  Calendar, 
  Target,
  ArrowRight,
  HelpCircle,
  Layers,
  Sparkles
} from 'lucide-react';

interface KpiTasksViewProps {
  onOpenNewKpiTaskModal: (kpiId?: string) => void;
  onOpenEditKpiTaskModal: (task: KpiTask) => void;
  onOpenMeasurementModal?: (kpiId: string) => void;
  initialFilterKpiCode?: string;
}

export const KpiTasksView: React.FC<KpiTasksViewProps> = ({
  onOpenNewKpiTaskModal,
  onOpenEditKpiTaskModal,
  onOpenMeasurementModal,
  initialFilterKpiCode,
}) => {
  const { kpiTasks, kpis, updateKpiTask, deleteKpiTask } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKpiCode, setSelectedKpiCode] = useState<string>(initialFilterKpiCode || 'Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

  const filteredTasks = useMemo(() => {
    return kpiTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.kpiCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.kpiName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesKpi = selectedKpiCode === 'Todos' || task.kpiCode === selectedKpiCode;
      const matchesStatus = selectedStatus === 'Todos' || task.status === selectedStatus;

      return matchesSearch && matchesKpi && matchesStatus;
    });
  }, [kpiTasks, searchTerm, selectedKpiCode, selectedStatus]);

  // Group tasks by KPI code
  const groupedByKpi = useMemo(() => {
    const map = new Map<string, { kpi: typeof kpis[0] | undefined; tasks: KpiTask[] }>();

    filteredTasks.forEach((task) => {
      if (!map.has(task.kpiCode)) {
        const parentKpi = kpis.find((k) => k.code === task.kpiCode);
        map.set(task.kpiCode, { kpi: parentKpi, tasks: [] });
      }
      map.get(task.kpiCode)!.tasks.push(task);
    });

    // Sort tasks in each KPI by stepNumber
    map.forEach((entry) => {
      entry.tasks.sort((a, b) => a.stepNumber - b.stepNumber);
    });

    return Array.from(map.entries());
  }, [filteredTasks, kpis]);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`¿Está seguro de eliminar la tarea de medición "${title}"?`)) {
      deleteKpiTask(id);
    }
  };

  const handleToggleComplete = (task: KpiTask) => {
    const newStatus = task.status === 'Completada' ? 'En curso' : 'Completada';
    const completedDate = newStatus === 'Completada' ? new Date().toISOString().split('T')[0] : undefined;
    updateKpiTask(task.id, { status: newStatus, completedDate });
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Banner & Clarification of Module 2 */}
      <div className="bg-amber-900/90 text-white rounded-xl p-5 shadow-sm border border-amber-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <CheckSquare className="w-4 h-4" />
              <span>Módulo 2 · Metodología Operativa para la Medición del Indicador</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Tareas Operativas de Recolección & Aplicación de KPIs
            </h1>
            <p className="text-xs md:text-sm text-amber-100 mt-1 max-w-3xl">
              Aquí se gestionan las actividades y pasos sistemáticos necesarios para <strong>medir y construir el dato del KPI</strong> (ej. estructurar las preguntas, establecer cronograma, aplicar encuestas a los <strong>121 clientes comerciales</strong>, tabular resultados y emitir el informe).
            </p>
          </div>

          <button
            onClick={() => onOpenNewKpiTaskModal(selectedKpiCode !== 'Todos' ? selectedKpiCode : undefined)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea de Medición</span>
          </button>
        </div>
      </div>

      {/* Distinction Explanatory Pill */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-start gap-3 text-xs text-amber-900">
        <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-bold text-amber-950">
            Diferenciación conceptual clave en la gestión de Granabastos:
          </p>
          <p className="mt-0.5 text-amber-800">
            • <strong>Tareas de Medición (este módulo):</strong> Los pasos para obtener la cifra (ej. estructurar encuesta, fijar fechas, encuestar a los 121 clientes).<br />
            • <strong>Planes de Acción (Módulo 3):</strong> Las acciones de mejora para que el indicador se cumpla (ej. modernizar la infraestructura de locales para elevar la satisfacción).<br />
            • <strong>Cronograma de Áreas / POA (Módulo 4):</strong> El plan operativo institucional de cada dirección de área de Granabastos.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar tarea de medición, responsable o metodología..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600 focus:bg-white"
            />
          </div>

          {/* KPI Selector */}
          <div className="w-full md:w-64">
            <select
              value={selectedKpiCode}
              onChange={(e) => setSelectedKpiCode(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600 font-medium"
            >
              <option value="Todos">Todos los KPIs</option>
              {kpis.map((k) => (
                <option key={k.id} value={k.code}>
                  {k.code} - {k.name.slice(0, 36)}...
                </option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div className="w-full md:w-44">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En curso">En curso</option>
              <option value="Completada">Completada</option>
              <option value="Retrasada">Retrasada</option>
            </select>
          </div>
        </div>

        {/* Quick summary counts */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span>Mostrando <strong>{filteredTasks.length}</strong> tareas de medición</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold">
              {kpiTasks.filter((t) => t.status === 'Completada').length} completadas
            </span>
            <span className="text-amber-700 font-semibold">
              {kpiTasks.filter((t) => t.status === 'En curso').length} en curso
            </span>
          </div>
          {(searchTerm || selectedKpiCode !== 'Todos' || selectedStatus !== 'Todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedKpiCode('Todos');
                setSelectedStatus('Todos');
              }}
              className="text-xs text-amber-700 hover:text-amber-900 font-medium"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* Grouped by KPI View */}
      {groupedByKpi.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No se encontraron tareas de medición</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No hay tareas registradas que coincidan con los filtros aplicados.
          </p>
          <button
            onClick={() => onOpenNewKpiTaskModal()}
            className="px-3.5 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            Registrar Primer Paso de Medición
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByKpi.map(([kpiCode, { kpi, tasks }]) => {
            const completedCount = tasks.filter((t) => t.status === 'Completada').length;
            const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

            return (
              <div key={kpiCode} className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                {/* KPI Header Box */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {kpiCode.slice(4, 7)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-emerald-800">{kpiCode}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs font-medium text-slate-500">{kpi?.area || 'Área'}</span>
                      </div>
                      <h2 className="text-sm font-bold text-slate-900 mt-0.5">{kpi?.name || kpiCode}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Flujo de Recolección</span>
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {completedCount}/{tasks.length} pasos ({progressPct}%)
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenNewKpiTaskModal(kpi?.id || kpiCode)}
                      className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Paso</span>
                    </button>

                    {onOpenMeasurementModal && kpi && (
                      <button
                        onClick={() => onOpenMeasurementModal(kpi.id)}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors whitespace-nowrap shadow-xs"
                      >
                        Registrar Medición
                      </button>
                    )}
                  </div>
                </div>

                {/* Steps List */}
                <div className="divide-y divide-slate-100">
                  {tasks.map((task) => {
                    const isDone = task.status === 'Completada';
                    const isOverdue = task.status !== 'Completada' && task.dueDate < todayStr;

                    return (
                      <div
                        key={task.id}
                        className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isDone ? 'bg-slate-50/50' : 'bg-white hover:bg-amber-50/20'
                        }`}
                      >
                        {/* Step Number + Title + Description */}
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => handleToggleComplete(task)}
                            title={isDone ? 'Marcar como pendiente' : 'Marcar como completada'}
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-all ${
                              isDone
                                ? 'bg-emerald-600 text-white ring-2 ring-emerald-200'
                                : 'border-2 border-slate-300 hover:border-emerald-600 text-slate-500'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : task.stepNumber}
                          </button>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">
                                Paso {task.stepNumber}: {task.title}
                              </span>

                              <span
                                className={`px-2 py-0.2 text-[10px] font-bold rounded-full ${
                                  isDone
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : isOverdue
                                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                    : task.status === 'En curso'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {isOverdue ? 'Retrasada' : task.status}
                              </span>

                              {task.scheduledFrequency && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                                  {task.scheduledFrequency}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                              {task.description}
                            </p>

                            {task.observations && (
                              <p className="text-[11px] text-slate-500 bg-amber-50/70 p-1.5 rounded border border-amber-100 italic">
                                <strong className="text-amber-950 font-medium">Nota:</strong> {task.observations}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Metadata & Actions */}
                        <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 text-xs text-slate-500 shrink-0">
                          <div className="space-y-1 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-medium text-slate-700">{task.responsible}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-mono">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>Límite: <strong className={isOverdue ? 'text-rose-700' : 'text-slate-800'}>{task.dueDate}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenEditKpiTaskModal(task)}
                              className="p-1.5 text-slate-600 hover:text-amber-900 hover:bg-slate-100 rounded transition-colors"
                              title="Editar tarea de medición"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id, task.title)}
                              className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                              title="Eliminar tarea"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
