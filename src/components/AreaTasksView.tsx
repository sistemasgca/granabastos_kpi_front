import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { AreaManagementTask, ActionStatus, Quarter } from '../types';
import { GRANABASTOS_AREAS, QUARTERS } from '../data/initialData';
import { 
  CalendarRange, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Building2, 
  Calendar, 
  User, 
  FileText, 
  BarChart2, 
  ListFilter,
  ExternalLink,
  Target
} from 'lucide-react';

interface AreaTasksViewProps {
  onOpenNewAreaTaskModal: (area?: string) => void;
  onOpenEditAreaTaskModal: (task: AreaManagementTask) => void;
}

export const AreaTasksView: React.FC<AreaTasksViewProps> = ({
  onOpenNewAreaTaskModal,
  onOpenEditAreaTaskModal,
}) => {
  const { areaTasks, updateAreaTask, deleteAreaTask } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('Todas');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');

  const filteredTasks = useMemo(() => {
    return areaTasks.filter((task) => {
      const matchesSearch =
        task.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.processName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.deliverables && task.deliverables.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesArea = selectedArea === 'Todas' || task.area === selectedArea;
      const matchesQuarter = selectedQuarter === 'Todos' || task.quarter === selectedQuarter;
      const matchesStatus = selectedStatus === 'Todos' || task.status === selectedStatus;

      return matchesSearch && matchesArea && matchesQuarter && matchesStatus;
    });
  }, [areaTasks, searchTerm, selectedArea, selectedQuarter, selectedStatus]);

  const handleDelete = (id: string, activity: string) => {
    if (window.confirm(`¿Está seguro de eliminar la actividad de gestión "${activity}"?`)) {
      deleteAreaTask(id);
    }
  };

  const handleQuickProgress = (id: string, progress: number) => {
    updateAreaTask(id, { progress });
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              <CalendarRange className="w-4 h-4" />
              <span>Módulo 4 · Plan Operativo Institucional (POA)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Plan & Cronograma de las Acciones de Gestión de las Áreas
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl">
              Cronograma consolidado de metas operativas y proyectos misionales por cada área directiva (Operaciones, Financiera, Comercial, Calidad, Ambiental y Gerencia) estructurado por trimestres hacia 2028.
            </p>
            <div className="mt-3 flex items-start sm:items-center gap-2 p-2.5 bg-blue-950/80 rounded-lg border border-blue-400/30 text-xs text-blue-200">
              <span className="font-bold text-amber-300 shrink-0">Distinción Institucional:</span>
              <span>
                Este módulo reúne actividades administrativas del <strong>POA interno</strong> de las dependencias. En contraste, los <strong>Planes de Acción (Módulo 3)</strong> responden a los KPIs de Gerencia y cuentan con el <strong>motor automático de alertas preventivas y críticas</strong>.
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenNewAreaTaskModal(selectedArea !== 'Todas' ? selectedArea : undefined)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Actividad de Área</span>
          </button>
        </div>
      </div>

      {/* Filter and View mode switcher */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar actividad, proceso, área, entregable o responsable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          {/* Area filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="Todas">Todas las Áreas</option>
              {GRANABASTOS_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Quarter filter */}
          <div className="w-full md:w-36">
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="Todos">Trimestre</option>
              {QUARTERS.map((q) => (
                <option key={q} value={q}>{q} (Trimestre {q.slice(1)})</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="w-full md:w-36">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="En progreso">En progreso</option>
              <option value="Completada">Completada</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Retrasada">Retrasada</option>
            </select>
          </div>

          {/* View switcher */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-md p-0.5 bg-slate-50 self-start md:self-auto">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded ${
                viewMode === 'timeline' ? 'bg-white shadow-xs text-blue-900' : 'text-slate-600'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Cronograma</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded ${
                viewMode === 'list' ? 'bg-white shadow-xs text-blue-900' : 'text-slate-600'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
          </div>
        </div>

        {/* Counts summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Mostrando <strong>{filteredTasks.length}</strong> actividades institucionales</span>
          {(searchTerm || selectedArea !== 'Todas' || selectedQuarter !== 'Todos' || selectedStatus !== 'Todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedArea('Todas');
                setSelectedQuarter('Todos');
                setSelectedStatus('Todos');
              }}
              className="text-xs text-blue-700 hover:text-blue-900 font-medium"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <CalendarRange className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No hay actividades de área encontradas</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No se encontraron actividades del Plan Operativo que coincidan con la búsqueda.
          </p>
          <button
            onClick={() => onOpenNewAreaTaskModal()}
            className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Registrar Actividad del Área
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completada';
            const isOverdue = task.status === 'Retrasada' || (task.status !== 'Completada' && task.dueDate < todayStr);

            return (
              <div
                key={task.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 transition-all space-y-3"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {task.code}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-xs text-slate-700">{task.area}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] text-slate-500 italic">{task.processName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 text-slate-800 rounded">
                      {task.quarter} {task.year}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isOverdue
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isOverdue && !isCompleted ? 'Retrasada' : task.status}
                    </span>
                    <button
                      onClick={() => onOpenEditAreaTaskModal(task)}
                      className="p-1 text-slate-500 hover:text-blue-800 rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id, task.activity)}
                      className="p-1 text-slate-400 hover:text-rose-700 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Activity Description */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">{task.activity}</h3>
                  {task.deliverables && (
                    <p className="text-[11px] text-slate-600 mt-1 bg-slate-50 p-2 rounded border border-slate-100">
                      <strong className="text-slate-800">Entregables / Productos:</strong> {task.deliverables}
                    </p>
                  )}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 text-[11px]">Progreso de Ejecución:</span>
                    <span className="font-mono font-bold text-slate-900">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-600'
                          : isOverdue
                          ? 'bg-rose-600'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.max(4, task.progress)}%` }}
                    />
                  </div>
                </div>

                {/* Footer metadata & Quick buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.responsible}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Inicio: {task.startDate} → Límite: <strong className={isOverdue ? 'text-rose-700' : 'text-slate-800'}>{task.dueDate}</strong></span>
                    </span>
                    {task.linkedKpiCode && (
                      <span className="flex items-center gap-1 text-emerald-800 font-mono font-semibold">
                        <Target className="w-3 h-3" />
                        <span>KPI: {task.linkedKpiCode}</span>
                      </span>
                    )}
                  </div>

                  {!isCompleted && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 mr-1">Avance rápido:</span>
                      {[25, 50, 75, 100].map((step) => (
                        <button
                          key={step}
                          onClick={() => handleQuickProgress(task.id, step)}
                          className={`px-1.5 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                            task.progress >= step
                              ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {step}%
                        </button>
                      ))}
                    </div>
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
