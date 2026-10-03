import React from 'react';
import { KPI } from '../../types';
import { KPI_FORMULA_REGISTRY } from '../../data/kpiFormulas';
import { Target, X, Shield, Lock, FolderOpen, Calendar, User, Mail, Award, Activity, ExternalLink, Calculator } from 'lucide-react';

interface KpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (kpiData: Omit<KPI, 'id' | 'compliancePercentage' | 'status' | 'history'>) => void;
  onUpdate?: (id: string, kpiData: Partial<KPI>) => void;
  editingKpi?: KPI | null;
  onOpenMeasurement?: (kpiId: string) => void;
}

export const KpiModal: React.FC<KpiModalProps> = ({
  isOpen,
  onClose,
  editingKpi,
  onOpenMeasurement,
}) => {
  if (!isOpen || !editingKpi) return null;

  const plan2028 = editingKpi.strategicPlanning2028;

  const handleGoToMeasurement = () => {
    onClose();
    if (onOpenMeasurement) {
      onOpenMeasurement(editingKpi.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-emerald-900 text-white rounded-t-xl">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-sm font-bold">Ficha Técnica Oficial del Indicador · Gerencia General</h2>
              <span className="text-[11px] font-mono text-emerald-200">
                {editingKpi.code} · Plan Estratégico 2024 - 2028
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-emerald-200 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Institutional Governance Notice */}
          <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-lg flex items-start gap-3 text-emerald-950">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block font-bold text-xs">
                Indicador Estratégico Establecido por la Gerencia General (Inmodificable)
              </strong>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                Este KPI, su objetivo estratégico, fórmula de cálculo y trayectoria de metas al 2028 han sido 
                establecidos y aprobados formalmente por la <strong>Gerencia General y la Junta Directiva de Granabastos</strong>. 
                Los parámetros institucionales están blindados. La gestión periódica consiste en registrar el corte 
                trimestral del resultado (T1 a T4) y adjuntar las evidencias en Google Drive.
              </p>
            </div>
          </div>

          {/* Main Identifier Box */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                {editingKpi.code}
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-semibold text-slate-700">{editingKpi.area}</span>
              <span className="text-slate-400">·</span>
              <span className="font-medium text-emerald-700">{editingKpi.periodicity}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {editingKpi.name}
            </h3>
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                Objetivo Estratégico Institucional:
              </span>
              <p className="text-slate-700 italic">
                "{editingKpi.objective}"
              </p>
            </div>
          </div>

          {/* Core Measurement Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50/70 p-3 rounded-lg border border-slate-200 text-center">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">Meta Vigente</span>
              <span className="text-sm font-mono font-bold text-slate-900">
                {editingKpi.targetValue.toLocaleString('es-CO')} {editingKpi.unit}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">Último Resultado</span>
              <span className="text-sm font-mono font-bold text-slate-900">
                {editingKpi.currentValue.toLocaleString('es-CO')} {editingKpi.unit}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">Sentido</span>
              <span className="text-xs font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                {editingKpi.direction === 'higher_is_better' ? 'Maximizar (↑)' : 'Minimizar (↓)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">Cumplimiento</span>
              <span className="text-sm font-mono font-bold text-emerald-700">
                {editingKpi.compliancePercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Multi-Year Target Trajectory (Plan Estratégico 2024 - 2028) */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Metas Plurianuales Oficiales · Horizonte 2024 - 2028 (Aprobadas por Gerencia)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Unidad: {editingKpi.unit}</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="block text-[10px] text-slate-500 font-medium">Línea Base 2023</span>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {plan2028?.baseline2023 ?? '-'} {editingKpi.unit}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="block text-[10px] text-slate-500 font-medium">Meta 2024</span>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {plan2028?.target2024 ?? '-'} {editingKpi.unit}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="block text-[10px] text-slate-500 font-medium">Meta 2025</span>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {plan2028?.target2025 ?? '-'} {editingKpi.unit}
                </span>
              </div>
              <div className="p-2 bg-emerald-50 rounded border border-emerald-300 font-bold text-emerald-950">
                <span className="block text-[10px] text-emerald-700 font-medium">Vigencia 2026</span>
                <span className="text-xs font-bold font-mono">
                  {plan2028?.target2026 ?? editingKpi.targetValue} {editingKpi.unit}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="block text-[10px] text-slate-500 font-medium">Meta 2027</span>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {plan2028?.target2027 ?? '-'} {editingKpi.unit}
                </span>
              </div>
              <div className="p-2 bg-amber-50 rounded border border-amber-300 font-bold text-amber-950">
                <span className="block text-[10px] text-amber-700 font-medium">Meta Cierre 2028</span>
                <span className="text-xs font-bold font-mono">
                  {plan2028?.target2028 ?? '-'} {editingKpi.unit}
                </span>
              </div>
            </div>

            {plan2028?.strategyNotes && (
              <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                <strong>Justificación Estratégica:</strong> {plan2028.strategyNotes}
              </p>
            )}
          </div>

          {/* Official Formula Section */}
          {(() => {
            const formula = KPI_FORMULA_REGISTRY[editingKpi.code];
            if (!formula) return null;
            return (
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                    <Calculator className="w-4 h-4 text-emerald-700" />
                    <span>{formula.formulaTitle}</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-white border border-emerald-300 px-2 py-0.5 rounded font-bold">
                    Fórmula Aprobada SGC
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded border border-emerald-200 font-mono text-xs font-bold text-emerald-950 text-center shadow-2xs">
                  {formula.formulaExpression}
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  <strong>Metodología de Cálculo:</strong> {formula.description}
                </p>
              </div>
            );
          })()}

          {/* Operational Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Responsable de la Medición</span>
              </span>
              <p className="font-semibold text-slate-800">{editingKpi.responsible}</p>
              {editingKpi.responsibleEmail && (
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span className="font-mono">{editingKpi.responsibleEmail}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Fecha de Último Registro</span>
              </span>
              <p className="font-mono font-bold text-slate-800">{editingKpi.lastUpdated}</p>
              <p className="text-[11px] text-slate-500">Periodicidad: {editingKpi.periodicity}</p>
            </div>
          </div>

          {/* Google Drive Folder for evidences */}
          <div className="bg-emerald-50/50 border border-emerald-200 p-3 rounded-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold text-emerald-950 block">Carpeta de Destino en Google Drive</span>
                <span className="text-[11px] text-slate-600 font-mono truncate max-w-sm block">
                  {editingKpi.targetDriveFolder || 'Carpeta Institucional de Evidencias Granabastos'}
                </span>
              </div>
            </div>
            {editingKpi.targetDriveFolder && (
              <a
                href={editingKpi.targetDriveFolder}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-100 rounded border border-emerald-300 transition-colors flex items-center gap-1 whitespace-nowrap shadow-xs"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Abrir en Drive</span>
              </a>
            )}
          </div>

          {/* Observations */}
          {editingKpi.observations && (
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                Lineamientos Técnicos y Observaciones:
              </span>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {editingKpi.observations}
              </p>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-semibold transition-colors text-xs"
            >
              Cerrar Ficha Técnica
            </button>

            <button
              type="button"
              onClick={handleGoToMeasurement}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-md transition-colors text-xs shadow-xs"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>+ Registrar Medición Trimestral (Adjuntar Soportes)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
