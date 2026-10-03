import React from 'react';
import { useData } from '../../context/DataContext';
import { KPI } from '../../types';
import { YEARS_HORIZON_2028 } from '../../data/initialData';
import { 
  History, 
  X, 
  TrendingUp, 
  Calendar, 
  Paperclip, 
  FileText, 
  FolderOpen, 
  ExternalLink,
  Award,
  Download
} from 'lucide-react';

interface KpiHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPI | null;
}

export const KpiHistoryModal: React.FC<KpiHistoryModalProps> = ({
  isOpen,
  onClose,
  kpi,
}) => {
  const { downloadAttachment } = useData();
  if (!isOpen || !kpi) return null;

  const history = [...kpi.history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const plan = kpi.strategicPlanning2028;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-emerald-900 text-white rounded-t-xl">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-sm font-bold">Historial de Mediciones Trimestrales & Planeación a 2028</h2>
              <span className="text-[11px] font-mono text-emerald-200">{kpi.code} · {kpi.area}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug">{kpi.name}</h3>
            <p className="text-slate-500 italic text-[11px] mt-0.5">{kpi.objective}</p>
          </div>

          {/* Strategic Planning 2024-2028 Trajectory Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Trayectoria Plan Estratégico 2028 (Metas Plurianuales)</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-800">
                Línea Base 2023: <strong>{plan?.baseline2023 || '-'} {kpi.unit}</strong>
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center font-mono">
              {YEARS_HORIZON_2028.map((yr) => {
                const targetYr = plan?.[`target${yr}` as keyof typeof plan] as number || '-';
                const isCurrent = yr === 2026;
                return (
                  <div
                    key={yr}
                    className={`p-2 rounded-lg border ${
                      isCurrent
                        ? 'bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-400 font-bold text-emerald-950'
                        : 'bg-white/80 border-emerald-200 text-slate-700'
                    }`}
                  >
                    <span className="block text-[10px] text-slate-500 font-sans">{yr}</span>
                    <span className="text-sm font-bold tabular-nums">{targetYr}</span>
                    <span className="block text-[9px] text-slate-400">{kpi.unit}</span>
                  </div>
                );
              })}
            </div>

            {plan?.strategyNotes && (
              <p className="text-[11px] text-emerald-800 italic pt-1">
                "{plan.strategyNotes}"
              </p>
            )}
          </div>

          {/* Cloud Folder Destination Box */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block text-xs">Repositorio en la Nube de Evidencias</span>
                <span className="text-[11px] text-slate-500 font-mono truncate max-w-md block">
                  {kpi.targetDriveFolder || 'Carpeta Institucional de Granabastos'}
                </span>
              </div>
            </div>

            <a
              href={kpi.targetDriveFolder || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs flex items-center gap-1 whitespace-nowrap shadow-xs"
            >
              <span>Abrir Carpeta Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Timeline of Measurements with Attached Evidence Files */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Registro Detallado de Cortes Trimestrales y Archivos Adjuntos ({history.length} cortes)</span>
            </h4>

            <div className="space-y-3">
              {history.map((rec) => {
                const isCrit = rec.compliancePercentage < 70;
                const isRisk = rec.compliancePercentage >= 70 && rec.compliancePercentage < 90;

                return (
                  <div
                    key={rec.id}
                    className="border border-slate-200 rounded-lg p-3.5 bg-white space-y-2.5 hover:border-emerald-300 transition-colors shadow-xs"
                  >
                    {/* Top line: Quarter, Date, Results */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold font-mono rounded text-xs">
                          {rec.quarter} {rec.year}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 font-mono text-xs">{rec.date}</span>
                        {rec.registeredBy && (
                          <span className="text-[11px] text-slate-400">
                            (Reg: {rec.registeredBy})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-500 text-[11px]">
                          Meta: <strong>{rec.targetQuarter} {kpi.unit}</strong>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-900 font-bold text-xs">
                          Resultado: <strong>{rec.value.toLocaleString('es-CO')} {kpi.unit}</strong>
                        </span>
                        <span
                          className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                            isCrit
                              ? 'bg-rose-50 text-rose-800'
                              : isRisk
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {rec.compliancePercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Observations */}
                    {rec.note && (
                      <p className="text-slate-600 italic text-xs bg-slate-50 p-2 rounded">
                        "{rec.note}"
                      </p>
                    )}

                    {/* Attached files for this measurement */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                        <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Archivos de Soporte / Evidencias Radicadas:</span>
                      </span>

                      {rec.attachedFiles && rec.attachedFiles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {rec.attachedFiles.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                <span className="font-medium text-slate-800 truncate" title={file.name}>
                                  {file.name}
                                </span>
                              </div>

                              {file.dataUrl ? (
                                <a
                                  href={file.dataUrl}
                                  download={file.name}
                                  className="text-emerald-700 hover:text-emerald-900 p-1 font-bold text-[10px] shrink-0 flex items-center gap-0.5"
                                  title="Descargar archivo adjunto"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Bajar</span>
                                </a>
                              ) : file.externalUrl?.startsWith('/api/attachments/') ? (
                                <button
                                  type="button"
                                  onClick={() => void downloadAttachment(file)}
                                  className="text-emerald-700 hover:text-emerald-900 p-1 font-bold text-[10px] shrink-0 flex items-center gap-0.5"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Bajar</span>
                                </button>
                              ) : file.externalUrl ? (
                                <a
                                  href={file.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-700 hover:text-emerald-900 p-1 font-bold text-[10px] shrink-0 flex items-center gap-0.5"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Ver</span>
                                </a>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">
                          No se adjuntaron archivos locales en este corte. Los soportes físicos reposan en la carpeta del área.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-md transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
