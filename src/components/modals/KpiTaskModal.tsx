import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { KpiTask } from '../../types';
import { CheckSquare, X } from 'lucide-react';

interface KpiTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<KpiTask, 'id' | 'kpiCode' | 'kpiName'>) => void | Promise<boolean>;
  onUpdate?: (id: string, task: Partial<KpiTask>) => void | Promise<boolean>;
  editingTask?: KpiTask | null;
  defaultKpiId?: string;
}

export const KpiTaskModal: React.FC<KpiTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingTask,
  defaultKpiId,
}) => {
  const { kpis, kpiTasks } = useData();

  const [kpiId, setKpiId] = useState('');
  const [stepNumber, setStepNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledFrequency, setScheduledFrequency] = useState('Cada trimestre');
  const [scheduledMonth, setScheduledMonth] = useState('Mes 1 del trimestre');
  const [dueDate, setDueDate] = useState('');
  const [responsible, setResponsible] = useState('');
  const [status, setStatus] = useState<'Pendiente' | 'En curso' | 'Completada' | 'Retrasada'>('Pendiente');
  const [observations, setObservations] = useState('');

  useEffect(() => {
    if (editingTask) {
      setKpiId(editingTask.kpiId);
      setStepNumber(editingTask.stepNumber);
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setScheduledFrequency(editingTask.scheduledFrequency);
      setScheduledMonth(editingTask.scheduledMonth || '');
      setDueDate(editingTask.dueDate);
      setResponsible(editingTask.responsible);
      setStatus(editingTask.status);
      setObservations(editingTask.observations || '');
    } else {
      const selected = defaultKpiId 
        ? (kpis.find(k => k.id === defaultKpiId || k.code === defaultKpiId)?.id || (kpis.length > 0 ? kpis[0].id : ''))
        : (kpis.length > 0 ? kpis[0].id : '');

      setKpiId(selected);
      // count steps already in this kpi
      const currentTasksForKpi = kpiTasks.filter(t => t.kpiId === selected);
      setStepNumber(currentTasksForKpi.length + 1);
      setTitle('');
      setDescription('');
      setScheduledFrequency('Cada trimestre');
      setScheduledMonth('Mes 1 del trimestre');
      const in20Days = new Date();
      in20Days.setDate(in20Days.getDate() + 20);
      setDueDate(in20Days.toISOString().split('T')[0]);
      setResponsible(kpis.find(k => k.id === selected)?.responsible || 'Coordinación Calidad Granabastos');
      setStatus('Pendiente');
      setObservations('');
    }
  }, [editingTask, isOpen, defaultKpiId, kpis, kpiTasks]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('El título del paso/tarea de medición es obligatorio.');
      return;
    }
    if (!dueDate) {
      alert('La fecha límite es obligatoria.');
      return;
    }

    if (editingTask && onUpdate) {
      const saved = await onUpdate(editingTask.id, {
        kpiId,
        stepNumber,
        title,
        description,
        scheduledFrequency,
        scheduledMonth,
        dueDate,
        responsible,
        status,
        observations,
      });
      if (saved === false) return;
    } else {
      const saved = await onSave({
        kpiId,
        stepNumber,
        title,
        description,
        scheduledFrequency,
        scheduledMonth,
        dueDate,
        responsible,
        status,
        observations,
      });
      if (saved === false) return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-amber-900 text-white rounded-t-xl">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-300" />
            <h2 className="text-sm font-bold">
              {editingTask ? 'Editar Tarea Operativa de Medición' : 'Registrar Paso / Tarea Operativa para Medir el KPI'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-amber-200 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <label className="font-semibold text-slate-700 block mb-1">KPI que se va a Medir *</label>
              <select
                value={kpiId}
                onChange={(e) => {
                  setKpiId(e.target.value);
                  const parent = kpis.find(k => k.id === e.target.value);
                  if (parent && !editingTask) {
                    setResponsible(parent.responsible);
                  }
                }}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600 font-semibold"
              >
                {kpis.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.code} - {k.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Paso No. *</label>
              <input
                type="number"
                min="1"
                required
                value={stepNumber}
                onChange={(e) => setStepNumber(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md font-mono font-bold text-center focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Nombre de la Tarea de Medición *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Estructurar las preguntas de la encuesta / Aplicar encuesta a los 121 clientes"
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Metodología y Procedimiento de Recolección *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explicar cómo se ejecuta este paso (ej. número de clientes a encuestar, pabellones a visitar, software o matriz a utilizar)..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Frecuencia / Momento de Aplicación</label>
              <input
                type="text"
                value={scheduledFrequency}
                onChange={(e) => setScheduledFrequency(e.target.value)}
                placeholder="Ej. Cada trimestre, Mensual, Al inicio del corte..."
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mes o Período Programado</label>
              <input
                type="text"
                value={scheduledMonth}
                onChange={(e) => setScheduledMonth(e.target.value)}
                placeholder="Ej. Enero, Febrero, Trimestre 1..."
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fecha Límite *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Responsable</label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Nombre o cargo"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600 font-semibold"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En curso">En curso</option>
                <option value="Completada">Completada</option>
                <option value="Retrasada">Retrasada</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Observaciones / Notas de Ejecución</label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Hallazgos, ajustes al instrumento o novedades durante la aplicación..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md transition-colors"
            >
              {editingTask ? 'Guardar Cambios' : 'Registrar Tarea de Medición'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
