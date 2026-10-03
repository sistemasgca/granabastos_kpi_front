import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AttachedFile, Quarter } from '../../types';
import { QUARTERS, YEARS_HORIZON_2028 } from '../../data/initialData';
import { KPI_FORMULA_REGISTRY, getPreestablishedQuarterTarget } from '../../data/kpiFormulas';
import { 
  Activity, 
  X, 
  UploadCloud, 
  FileText, 
  Paperclip, 
  Trash2, 
  FolderOpen, 
  ExternalLink,
  Calculator,
  Lock,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { calculateCompliance, determineKpiStatus } from '../../context/DataContext';

interface MeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpiId: string | null;
}

export const MeasurementModal: React.FC<MeasurementModalProps> = ({
  isOpen,
  onClose,
  kpiId,
}) => {
  const { kpis, addQuarterlyMeasurement, googleDriveFolder } = useData();

  const [activeKpiId, setActiveKpiId] = useState<string>(kpiId || '');

  React.useEffect(() => {
    if (kpiId) {
      setActiveKpiId(kpiId);
    } else if (kpis.length > 0) {
      setActiveKpiId(kpis[0].id);
    }
  }, [kpiId, kpis, isOpen]);

  const kpi = kpis.find((k) => k.id === activeKpiId) || kpis.find((k) => k.id === kpiId) || kpis[0];

  const [quarter, setQuarter] = useState<Quarter>('T3');
  const [year, setYear] = useState<number>(2026);
  const [value, setValue] = useState<number>(0);
  const [targetQuarter, setTargetQuarter] = useState<number>(100);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [externalDriveLink, setExternalDriveLink] = useState<string>('');
  const [registeredBy, setRegisteredBy] = useState<string>('Coordinación SGC Granabastos');

  // Formula & variables state
  const formulaMeta = KPI_FORMULA_REGISTRY[kpi?.code || ''];
  const [varA, setVarA] = useState<number>(formulaMeta?.initialVarA ?? 0);
  const [varB, setVarB] = useState<number>(formulaMeta?.initialVarB ?? 0);

  // Initialize or update fields when KPI changes
  React.useEffect(() => {
    if (kpi) {
      const meta = KPI_FORMULA_REGISTRY[kpi.code];
      const preestablishedTarget = getPreestablishedQuarterTarget(kpi.code, quarter, year, kpi.targetValue);
      setTargetQuarter(preestablishedTarget);

      if (meta) {
        setVarA(meta.initialVarA);
        setVarB(meta.initialVarB);
        setValue(meta.calculate(meta.initialVarA, meta.initialVarB));
      } else {
        setValue(kpi.currentValue);
      }

      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
      setAttachedFiles([]);
      setExternalDriveLink(kpi.targetDriveFolder || '');
      setRegisteredBy(kpi.responsible || 'Coordinación SGC');
    }
  }, [kpi?.id, isOpen]);

  // Recalculate preestablished target automatically when quarter or year changes
  React.useEffect(() => {
    if (kpi) {
      const preestablishedTarget = getPreestablishedQuarterTarget(kpi.code, quarter, year, kpi.targetValue);
      setTargetQuarter(preestablishedTarget);
    }
  }, [quarter, year, kpi?.code]);

  // When variable A or B changes, recalculate value automatically using the official formula
  const handleVarAChange = (newA: number) => {
    setVarA(newA);
    if (formulaMeta) {
      const calculated = formulaMeta.calculate(newA, varB);
      setValue(calculated);
    }
  };

  const handleVarBChange = (newB: number) => {
    setVarB(newB);
    if (formulaMeta) {
      const calculated = formulaMeta.calculate(varA, newB);
      setValue(calculated);
    }
  };

  if (!isOpen || !kpi) return null;

  const previewCompliance = calculateCompliance(value, targetQuarter || kpi.targetValue, kpi.direction);
  const previewStatus = determineKpiStatus(previewCompliance);
  const targetFolder = kpi.targetDriveFolder || `${googleDriveFolder}/${kpi.code}`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAttachedFile: AttachedFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          uploadDate: new Date().toISOString().split('T')[0],
          driveFolderTarget: targetFolder,
          dataUrl: event.target?.result as string,
        };
        setAttachedFiles((prev) => [...prev, newAttachedFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const saved = await addQuarterlyMeasurement(kpi.id, {
      quarter,
      year,
      date,
      targetQuarter,
      value,
      inputA: varA,
      inputB: varB,
      note,
      registeredBy,
      attachedFiles,
      driveFolderDestination: targetFolder,
    });

    if (saved) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-emerald-900 text-white rounded-t-xl">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-sm font-bold">Registrar Medición Trimestral & Adjuntar Evidencias</h2>
              <span className="text-[11px] font-mono text-emerald-200">{kpi.code} · {kpi.area}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-200 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* KPI Selection (Official Gerencia KPIs) */}
          <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-emerald-950 block">
                Indicador Oficial de Gerencia General:
              </label>
              <span className="text-[10px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                🔒 KPI Establecido (Plan 2028)
              </span>
            </div>
            <select
              value={kpi.id}
              onChange={(e) => setActiveKpiId(e.target.value)}
              className="w-full px-2.5 py-2 bg-white border border-emerald-300 rounded-md font-semibold text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              {kpis.map((k) => (
                <option key={k.id} value={k.id}>
                  [{k.code}] {k.name} ({k.area})
                </option>
              ))}
            </select>
            <p className="text-slate-600 italic text-[11px] leading-relaxed">
              <strong>Objetivo:</strong> "{kpi.objective}"
            </p>
          </div>

          {/* Quarter and Year selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50/70 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Trimestre *</label>
              <select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value as Quarter)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600 font-bold"
              >
                {QUARTERS.map((q) => (
                  <option key={q} value={q}>{q} (Trimestre {q.slice(1)})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Año Vigencia *</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600 font-bold"
              >
                {YEARS_HORIZON_2028.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-emerald-950 block mb-1 text-[11px] flex items-center justify-between">
                <span>Meta Preestablecida ({quarter} {year}) *</span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-1 rounded flex items-center gap-0.5">
                  🔒 Plan 2028
                </span>
              </label>
              <input
                type="number"
                step="any"
                required
                value={targetQuarter}
                onChange={(e) => setTargetQuarter(parseFloat(e.target.value) || 0)}
                title={`Meta oficial preestablecida para ${quarter} ${year}: ${targetQuarter} ${kpi.unit}`}
                className="w-full px-2.5 py-1.5 bg-emerald-50/70 border border-emerald-300 rounded-md font-mono font-bold text-emerald-950 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-inner"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-[11px] flex items-center justify-between">
                <span>Resultado Obtenido *</span>
                <span className="text-[10px] font-mono text-slate-500 font-normal">
                  ({kpi.unit})
                </span>
              </label>
              <input
                type="number"
                step="any"
                required
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-xs"
              />
            </div>
          </div>

          {/* Official Calculation Formula Panel */}
          <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-lg p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-800" />
                <span className="font-bold text-emerald-950 text-xs">
                  {formulaMeta ? formulaMeta.formulaTitle : 'Fórmula Técnica Oficial del Indicador'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-white border border-emerald-300 px-2 py-0.5 rounded shadow-2xs font-mono">
                {kpi.code} · Fórmula SGC
              </span>
            </div>

            {formulaMeta ? (
              <div className="space-y-2">
                <div className="p-2.5 bg-white rounded-md border border-emerald-200 font-mono text-xs text-emerald-950 font-semibold text-center shadow-2xs">
                  {formulaMeta.formulaExpression}
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  <strong>Metodología:</strong> {formulaMeta.description}
                </p>

                {/* Calculation Variables */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                      Variables de la Fórmula (Cálculo Automático del Resultado):
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Calculado: <strong>{formulaMeta.calculate(varA, varB)} {kpi.unit}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded-md border border-slate-200 shadow-2xs">
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">
                        {formulaMeta.variableALabel}:
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="any"
                          value={varA}
                          onChange={(e) => handleVarAChange(parseFloat(e.target.value) || 0)}
                          placeholder={formulaMeta.variableAPlaceholder}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        />
                        <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                          {formulaMeta.variableAUnit}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-md border border-slate-200 shadow-2xs">
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">
                        {formulaMeta.variableBLabel}:
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="any"
                          value={varB}
                          onChange={(e) => handleVarBChange(parseFloat(e.target.value) || 0)}
                          placeholder={formulaMeta.variableBPlaceholder}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        />
                        <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                          {formulaMeta.variableBUnit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-600">
                Fórmula institucional: <strong>(Resultado Obtenido / Meta Oficial) × 100</strong>
              </div>
            )}
          </div>

          {/* Compliance live preview badge */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-950 font-bold block">Cumplimiento del Corte:</span>
              <span className="text-xs text-emerald-800">
                Estado semaforizado: <strong className="font-bold">{previewStatus}</strong>
              </span>
            </div>
            <span className="text-xl font-bold font-mono text-emerald-900 tabular-nums">
              {previewCompliance.toFixed(1)}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fecha de Medición / Corte *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Registrado Por</label>
              <input
                type="text"
                value={registeredBy}
                onChange={(e) => setRegisteredBy(e.target.value)}
                placeholder="Nombre de quien registra la medición"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* ATTACH FILES SECTION */}
          <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-emerald-700" />
                <span>Adjuntar Archivos de Soporte / Evidencias de Medición</span>
              </label>
              <span className="text-[10px] text-slate-500">Excel, PDF, Imágenes, Actas</span>
            </div>

            <div className="p-3 bg-white border border-dashed border-slate-300 rounded-lg text-center hover:border-emerald-600 transition-colors">
              <UploadCloud className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-800">
                Seleccione archivos de soporte para este corte
              </p>
              <p className="text-[10px] text-slate-400 mb-2">
                Los archivos quedan archivados y vinculados a la carpeta oficial de Granabastos
              </p>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold transition-colors">
                <span>Buscar Archivo en Dispositivo</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Destination Google Drive Folder indicator */}
            <div className="flex items-center justify-between p-2 bg-emerald-50/70 border border-emerald-200/60 rounded text-[11px] text-emerald-900">
              <span className="flex items-center gap-1">
                <FolderOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>Destino: <strong>{targetFolder}</strong></span>
              </span>
              <a
                href={targetFolder}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline flex items-center gap-0.5 font-semibold"
              >
                <span>Abrir</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* List of uploaded files */}
            {attachedFiles.length > 0 && (
              <div className="space-y-1 mt-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Archivos adjuntos para este corte ({attachedFiles.length}):
                </span>
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({Math.round(file.size / 1024)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Quitar archivo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Observaciones del Corte Trimestral</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Justificación de cumplimiento o desviaciones, resumen de hallazgos, acuerdos del comité..."
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
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-md transition-colors shadow-xs"
            >
              Guardar Medición & Evidencias
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
