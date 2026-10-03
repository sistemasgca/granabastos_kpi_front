import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { ActionPlan } from '../../types';
import { CalendarClock, X, Link } from 'lucide-react';

interface ActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ActionPlan, 'id' | 'status' | 'kpiCode' | 'kpiName'>) => void | Promise<boolean>;
  onUpdate?: (id: string, data: Partial<ActionPlan>) => void | Promise<boolean>;
  editingPlan?: ActionPlan | null;
}

export const ActionPlanModal: React.FC<ActionPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingPlan,
}) => {
  const { kpis } = useData();

  const [code, setCode] = useState('');
  const [kpiId, setKpiId] = useState('');
  const [name, setName] = useState('');
  const [activity, setActivity] = useState('');
  const [responsible, setResponsible] = useState('');
  const [responsibleEmail, setResponsibleEmail] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [observations, setObservations] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');

  useEffect(() => {
    if (editingPlan) {
      setCode(editingPlan.code);
      setKpiId(editingPlan.kpiId);
      setName(editingPlan.name);
      setActivity(editingPlan.activity);
      setResponsible(editingPlan.responsible);
      setResponsibleEmail(editingPlan.responsibleEmail);
      setStartDate(editingPlan.startDate);
      setDueDate(editingPlan.dueDate);
      setProgress(editingPlan.progress);
      setObservations(editingPlan.observations || '');
      setEvidenceUrl(editingPlan.evidenceUrl || '');
      setEvidenceNotes(editingPlan.evidenceNotes || '');
    } else {
      setCode(`ACT-${Math.floor(100 + Math.random() * 900)}`);
      setKpiId(kpis.length > 0 ? kpis[0].id : '');
      setName('');
      setActivity('');
      setResponsible('');
      setResponsibleEmail('');
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
      // default due date: 30 days from now
      const in30Days = new Date();
      in30Days.setDate(in30Days.getDate() + 30);
      setDueDate(in30Days.toISOString().split('T')[0]);
      setProgress(0);
      setObservations('');
      setEvidenceUrl('');
      setEvidenceNotes('');
    }
  }, [editingPlan, isOpen, kpis]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('El nombre del plan de acción es obligatorio.');
      return;
    }
    if (!dueDate) {
      alert('La fecha límite es obligatoria.');
      return;
    }

    if (editingPlan && onUpdate) {
      const saved = await onUpdate(editingPlan.id, {
        code,
        kpiId,
        name,
        activity,
        responsible,
        responsibleEmail,
        startDate,
        dueDate,
        progress,
        observations,
        evidenceUrl,
        evidenceNotes,
      });
      if (saved === false) return;
    } else {
      const saved = await onSave({
        code,
        kpiId: kpiId || (kpis.length > 0 ? kpis[0].id : ''),
        name,
        activity,
        responsible: responsible || 'Equipo Operativo',
        responsibleEmail: responsibleEmail || 'sec_gerencia@granabastos.com.co',
        startDate,
        dueDate,
        progress,
        observations,
        evidenceUrl,
        evidenceNotes,
      });
      if (saved === false) return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900">
              {editingPlan ? 'Editar Plan de Acción' : 'Crear Nuevo Plan de Acción & Cronograma'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Código de Acción *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej. PLA-COM-02"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">KPI Asociado *</label>
              <select
                value={kpiId}
                onChange={(e) => setKpiId(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {kpis.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.code} - {k.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nombre del Plan de Acción *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Plan de Renovación de Básculas y Control de Acceso"
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Actividad o Acción Requerida *</label>
            <textarea
              rows={2}
              required
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Detalle puntual de la tarea o acción a ejecutar..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Responsable</label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Nombre y cargo del responsable"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email del Responsable</label>
              <input
                type="email"
                value={responsibleEmail}
                onChange={(e) => setResponsibleEmail(e.target.value)}
                placeholder="responsable@granabastos.com.co"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fecha de Inicio *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fecha Límite *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Avance: <span className="font-mono font-bold text-slate-900">{progress}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-700 mt-2 cursor-pointer"
              />
            </div>
          </div>

          {/* Evidence Section */}
          <div className="space-y-2 bg-slate-50/70 p-3 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-emerald-700" />
              <span>Evidencias y Soporte Documental (Google Drive / OneDrive / Enlace)</span>
            </span>

            <div>
              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/... o https://granabastos.sharepoint.com/..."
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs font-mono"
              />
            </div>

            <div>
              <input
                type="text"
                value={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.value)}
                placeholder="Descripción corta de la evidencia (ej. Acta No. 42 firmada, Fotos de obra, Informe de calibración...)"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Observaciones</label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Comentarios adicionales, causas de retraso o acuerdos de seguimiento..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
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
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-md transition-colors"
            >
              {editingPlan ? 'Guardar Cambios' : 'Crear Plan de Acción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
