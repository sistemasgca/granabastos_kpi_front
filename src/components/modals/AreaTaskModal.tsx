import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { AreaManagementTask, Quarter } from '../../types';
import { GRANABASTOS_AREAS, QUARTERS, YEARS_HORIZON_2028 } from '../../data/initialData';
import { CalendarRange, X, Target } from 'lucide-react';

interface AreaTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<AreaManagementTask, 'id' | 'status'>) => void | Promise<boolean>;
  onUpdate?: (id: string, task: Partial<AreaManagementTask>) => void | Promise<boolean>;
  editingTask?: AreaManagementTask | null;
  defaultArea?: string;
}

export const AreaTaskModal: React.FC<AreaTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingTask,
  defaultArea,
}) => {
  const { kpis } = useData();

  const [code, setCode] = useState('');
  const [area, setArea] = useState(defaultArea || GRANABASTOS_AREAS[0]);
  const [processName, setProcessName] = useState('');
  const [activity, setActivity] = useState('');
  const [responsible, setResponsible] = useState('');
  const [responsibleEmail, setResponsibleEmail] = useState('');
  const [quarter, setQuarter] = useState<Quarter>('T3');
  const [year, setYear] = useState<number>(2026);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [deliverables, setDeliverables] = useState('');
  const [linkedKpiCode, setLinkedKpiCode] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  useEffect(() => {
    if (editingTask) {
      setCode(editingTask.code);
      setArea(editingTask.area);
      setProcessName(editingTask.processName);
      setActivity(editingTask.activity);
      setResponsible(editingTask.responsible);
      setResponsibleEmail(editingTask.responsibleEmail);
      setQuarter(editingTask.quarter);
      setYear(editingTask.year);
      setStartDate(editingTask.startDate);
      setDueDate(editingTask.dueDate);
      setProgress(editingTask.progress);
      setDeliverables(editingTask.deliverables || '');
      setLinkedKpiCode(editingTask.linkedKpiCode || '');
      setEvidenceUrl(editingTask.evidenceUrl || '');
    } else {
      setCode(`POA-${Math.floor(100 + Math.random() * 900)}`);
      setArea(defaultArea || GRANABASTOS_AREAS[0]);
      setProcessName('');
      setActivity('');
      setResponsible('');
      setResponsibleEmail('sec_gerencia@granabastos.com.co');
      setQuarter('T3');
      setYear(2026);
      setStartDate(new Date().toISOString().split('T')[0]);
      const in30Days = new Date();
      in30Days.setDate(in30Days.getDate() + 30);
      setDueDate(in30Days.toISOString().split('T')[0]);
      setProgress(0);
      setDeliverables('');
      setLinkedKpiCode('');
      setEvidenceUrl('');
    }
  }, [editingTask, isOpen, defaultArea]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) {
      alert('La actividad de gestión es obligatoria.');
      return;
    }
    if (!dueDate) {
      alert('La fecha límite es obligatoria.');
      return;
    }

    if (editingTask && onUpdate) {
      const saved = await onUpdate(editingTask.id, {
        code,
        area,
        processName,
        activity,
        responsible,
        responsibleEmail,
        quarter,
        year,
        startDate,
        dueDate,
        progress,
        deliverables,
        linkedKpiCode,
        evidenceUrl,
      });
      if (saved === false) return;
    } else {
      const saved = await onSave({
        code,
        area,
        processName: processName || 'Operación Misional',
        activity,
        responsible: responsible || 'Equipo del Área',
        responsibleEmail: responsibleEmail || 'sec_gerencia@granabastos.com.co',
        quarter,
        year,
        startDate,
        dueDate,
        progress,
        deliverables,
        linkedKpiCode,
        evidenceUrl,
      });
      if (saved === false) return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-900 text-white rounded-t-xl">
          <div className="flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold">
              {editingTask ? 'Editar Actividad de Gestión de Área (POA)' : 'Registrar Actividad del Plan Operativo de Área (POA)'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Código POA *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Área Institucional *</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
              >
                {GRANABASTOS_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Proceso o Subproceso</label>
            <input
              type="text"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder="Ej. Comercialización y Arrendamientos, Cadena de Frío, Calidad..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Actividad de Gestión *</label>
            <textarea
              rows={2}
              required
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Descripción de la actividad o meta operativa del área..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Trimestre</label>
              <select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value as Quarter)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md font-mono font-bold"
              >
                {QUARTERS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Año</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md font-mono font-bold"
              >
                {YEARS_HORIZON_2028.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fecha Inicio</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fecha Límite</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Responsable</label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Nombre del líder de la actividad"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">KPI Vinculado (Opcional)</label>
              <select
                value={linkedKpiCode}
                onChange={(e) => setLinkedKpiCode(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
              >
                <option value="">(Ninguno / Gestión transversal)</option>
                {kpis.map((k) => (
                  <option key={k.id} value={k.code}>{k.code} - {k.name.slice(0, 30)}...</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Porcentaje de Avance: <strong className="font-mono">{progress}%</strong>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Entregables y Productos Esperados</label>
            <textarea
              rows={2}
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              placeholder="Ej. Acta de comité, informe de interventoría, software calibrado, certificados..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Enlace a Carpeta o Evidencia</label>
            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-blue-600"
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors"
            >
              {editingTask ? 'Guardar Cambios' : 'Registrar Actividad POA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
