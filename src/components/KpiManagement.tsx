import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { KPI, KpiStatus } from '../types';
import { GRANABASTOS_AREAS, PERIODICITIES, YEARS_HORIZON_2028 } from '../data/initialData';
import { 
  Target, 
  Search, 
  Plus, 
  History, 
  Edit3, 
  LayoutGrid, 
  List, 
  Calendar,
  User,
  CheckSquare,
  FolderOpen,
  FileText,
  Paperclip,
  TrendingUp,
  Award,
  Shield,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface KpiManagementProps {
  onOpenNewKpiModal: () => void;
  onOpenEditKpiModal: (kpi: KPI) => void;
  onOpenMeasurementModal: (kpiId: string) => void;
  onOpenHistoryModal: (kpi: KPI) => void;
  onNavigateToKpiTasks?: (kpiCode: string) => void;
}

export const KpiManagement: React.FC<KpiManagementProps> = ({
  onOpenNewKpiModal,
  onOpenEditKpiModal,
  onOpenMeasurementModal,
  onOpenHistoryModal,
  onNavigateToKpiTasks,
}) => {
  const { kpis, googleDriveFolder, setGoogleDriveFolder } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('Todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [selectedPeriodicity, setSelectedPeriodicity] = useState<string>('Todas');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showDriveSettings, setShowDriveSettings] = useState(false);
  const [tempDriveUrl, setTempDriveUrl] = useState(googleDriveFolder);
  const [expandedKpis, setExpandedKpis] = useState<Record<string, boolean>>({});

  const toggleKpiExpand = (id: string) => {
    setExpandedKpis((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered KPIs
  const filteredKpis = useMemo(() => {
    return kpis.filter((kpi) => {
      const matchesSearch =
        kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kpi.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kpi.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kpi.responsible.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesArea = selectedArea === 'Todas' || kpi.area === selectedArea;
      const matchesStatus = selectedStatus === 'Todos' || kpi.status === selectedStatus;
      const matchesPeriodicity = selectedPeriodicity === 'Todas' || kpi.periodicity === selectedPeriodicity;

      return matchesSearch && matchesArea && matchesStatus && matchesPeriodicity;
    });
  }, [kpis, searchTerm, selectedArea, selectedStatus, selectedPeriodicity]);

  const handleSaveDriveFolder = () => {
    setGoogleDriveFolder(tempDriveUrl);
    setShowDriveSettings(false);
    alert('Enlace guardado para referencia local. La carpeta donde se cargan evidencias la configura el servidor mediante GOOGLE_DRIVE_ROOT_FOLDER_ID.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Strategic Plan 2028 & Quarterly Focus - Oficial de Gerencia */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-xl p-5 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Indicadores Oficiales de Gerencia General · Plan Estratégico 2024 - 2028</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Seguimiento Trimestral de KPIs Institucionales
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl">
            Los indicadores de desempeño han sido fijados formalmente por la <strong>Gerencia General y la Junta Directiva</strong>; ya están establecidos y son de carácter institucional no modificable. La gestión se realiza trimestralmente (cortes T1 a T4) registrando el valor alcanzado y <strong>adjuntando las evidencias de soporte</strong> a la carpeta de Google Drive.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/70 border border-emerald-400/30 rounded-lg text-emerald-200 text-xs">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{kpis.length} KPIs de Gerencia Establecidos</span>
          </div>
          <button
            onClick={() => onOpenMeasurementModal('')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Medición Trimestral</span>
          </button>
          <button
            onClick={() => setShowDriveSettings(!showDriveSettings)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-700/80 hover:bg-emerald-600 rounded-lg transition-colors border border-emerald-500/30 text-white"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Carpeta Drive</span>
          </button>
        </div>
      </div>

      {/* Google Drive Configuration Drawer if expanded */}
      {showDriveSettings && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow-xs space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-emerald-700" />
              <span>Carpeta de referencia en Google Drive para Evidencias de Mediciones</span>
            </span>
            <button
              onClick={() => setShowDriveSettings(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-600">
            Este enlace se conserva como referencia local. La carga real de evidencias usa la carpeta configurada por la API en GOOGLE_DRIVE_ROOT_FOLDER_ID.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={tempDriveUrl}
              onChange={(e) => setTempDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="flex-1 px-3 py-1.5 bg-white border border-emerald-300 rounded-md font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <button
              onClick={handleSaveDriveFolder}
              className="px-4 py-1.5 bg-emerald-800 text-white font-semibold rounded-md hover:bg-emerald-900 transition-colors whitespace-nowrap"
            >
              Guardar Carpeta
            </button>
            <a
              href={googleDriveFolder}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white text-emerald-800 border border-emerald-300 font-semibold rounded-md hover:bg-emerald-100 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Abrir Drive</span>
            </a>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por código, nombre del indicador, objetivo o responsable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Area Selector */}
          <div className="w-full md:w-48">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="Todas">Todas las Áreas</option>
              {GRANABASTOS_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div className="w-full md:w-36">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Superado">Superado (≥100%)</option>
              <option value="En meta">En meta (90-99%)</option>
              <option value="En riesgo">En riesgo (70-89%)</option>
              <option value="Crítico">Crítico (&lt;70%)</option>
            </select>
          </div>

          {/* Periodicity Selector */}
          <div className="w-full md:w-36">
            <select
              value={selectedPeriodicity}
              onChange={(e) => setSelectedPeriodicity(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="Todas">Periodicidad</option>
              {PERIODICITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Toggle View mode */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-md p-0.5 bg-slate-50 self-start md:self-auto">
            <button
              onClick={() => setViewMode('cards')}
              title="Vista de Tarjetas con Planeación 2028"
              className={`p-1 rounded ${viewMode === 'cards' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Vista de Tabla Comparativa"
              className={`p-1 rounded ${viewMode === 'table' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary counts */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Mostrando <strong>{filteredKpis.length}</strong> de {kpis.length} indicadores estratégicos
          </span>
          {(searchTerm || selectedArea !== 'Todas' || selectedStatus !== 'Todos' || selectedPeriodicity !== 'Todas') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedArea('Todas');
                setSelectedStatus('Todos');
                setSelectedPeriodicity('Todas');
              }}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* KPI Display Area */}
      {filteredKpis.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <Target className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No se encontraron indicadores</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No hay ningún KPI que coincida con los criterios de búsqueda o filtros seleccionados.
          </p>
          <button
            onClick={onOpenNewKpiModal}
            className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors"
          >
            Registrar Primer Indicador
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredKpis.map((kpi) => {
            const isCrit = kpi.status === 'Crítico';
            const isRisk = kpi.status === 'En riesgo';
            const isOver = kpi.status === 'Superado';
            const latestMeasurement = kpi.history[kpi.history.length - 1];
            const totalEvidenceFiles = kpi.history.reduce((acc, h) => acc + (h.attachedFiles?.length || 0), 0);

            return (
              <div
                key={kpi.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-emerald-600/40 transition-all hover:shadow-sm"
              >
                <div>
                  {/* Card Header: Code, Area, Tags & Status */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {kpi.code}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">{kpi.area}</span>
                        <span className="text-[10px] text-emerald-700 bg-white border border-emerald-200 px-1.5 py-0.2 rounded font-medium">
                          🔒 Plan 2028
                        </span>
                      </div>
                      <h2 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                        {kpi.name}
                      </h2>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`px-2 py-0.5 text-[11px] font-semibold rounded-full whitespace-nowrap ${
                          isOver
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : kpi.status === 'En meta'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : isRisk
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {kpi.status}
                      </span>
                      <span
                        className={`text-base font-mono font-bold tabular-nums ${
                          isCrit ? 'text-rose-700' : isRisk ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {kpi.compliancePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Compact Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 my-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Meta 2026</span>
                      <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">
                        {kpi.targetValue.toLocaleString('es-CO')} {kpi.unit}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Resultado Actual</span>
                      <span className="text-xs font-mono font-bold text-slate-950 tabular-nums">
                        {kpi.currentValue.toLocaleString('es-CO')} {kpi.unit}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Último Corte</span>
                      <span className="text-xs font-mono font-bold text-emerald-800 tabular-nums">
                        {latestMeasurement ? `${latestMeasurement.quarter} ${latestMeasurement.year}` : 'T2 2026'}
                      </span>
                    </div>
                  </div>

                  {/* Sleek Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isCrit ? 'bg-rose-600' : isRisk ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(kpi.compliancePercentage, 100)}%` }}
                    />
                  </div>

                  {/* Compact Info Row */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="truncate max-w-[200px]">
                      👤 {kpi.responsible.split('(')[0]}
                    </span>
                    <div className="flex items-center gap-2">
                      {kpi.targetDriveFolder && (
                        <a
                          href={kpi.targetDriveFolder}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <FolderOpen className="w-3 h-3 text-emerald-600" />
                          <span>Drive ({totalEvidenceFiles})</span>
                        </a>
                      )}
                      <button
                        onClick={() => toggleKpiExpand(kpi.id)}
                        className="text-slate-500 hover:text-slate-800 flex items-center gap-0.5 font-medium ml-1"
                      >
                        <span>{expandedKpis[kpi.id] ? 'Menos' : 'Detalle 2028'}</span>
                        {expandedKpis[kpi.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Section if toggled */}
                  {expandedKpis[kpi.id] && (
                    <div className="pt-2 mt-2 border-t border-slate-100 space-y-2">
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100">
                        "{kpi.objective}"
                      </p>

                      <div className="p-2 bg-slate-50 rounded border border-slate-200">
                        <div className="text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Metas Plan Estratégico 2028:
                        </div>
                        <div className="grid grid-cols-5 gap-1 text-center font-mono text-[11px]">
                          {YEARS_HORIZON_2028.map((yr) => {
                            const targetYear = kpi.strategicPlanning2028?.[`target${yr}` as keyof typeof kpi.strategicPlanning2028] as number || '-';
                            const isCurrentYear = yr === 2026;
                            return (
                              <div
                                key={yr}
                                className={`p-1 rounded border ${
                                  isCurrentYear ? 'bg-emerald-100 border-emerald-300 font-bold text-emerald-950' : 'bg-white border-slate-200 text-slate-600'
                                }`}
                              >
                                <span className="block text-[9px] text-slate-400">{yr}</span>
                                <span>{targetYear}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions Bottom */}
                <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditKpiModal(kpi)}
                      title="Ver Ficha Técnica Oficial y Fórmula"
                      className="px-2 py-1 text-slate-700 hover:text-emerald-800 hover:bg-slate-100 rounded transition-colors flex items-center gap-1 text-xs font-medium border border-slate-200 shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Ficha Oficial</span>
                    </button>

                    <button
                      onClick={() => onOpenHistoryModal(kpi)}
                      title="Ver Historial de Mediciones Trimestrales"
                      className="px-2 py-1 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded transition-colors flex items-center gap-1 text-xs"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Historial</span>
                    </button>

                    {onNavigateToKpiTasks && (
                      <button
                        onClick={() => onNavigateToKpiTasks(kpi.code)}
                        title="Ver Tareas Operativas de Medición"
                        className="px-2 py-1 text-amber-800 hover:bg-amber-50 rounded transition-colors flex items-center gap-1 text-xs font-medium border border-amber-200"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                        <span className="hidden sm:inline">Tareas</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenMeasurementModal(kpi.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors shadow-xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Medición</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-3 px-3">Código</th>
                <th className="py-3 px-3">Nombre del KPI & Área</th>
                <th className="py-3 px-3 text-right">Meta 2026</th>
                <th className="py-3 px-3 text-right">Actual</th>
                <th className="py-3 px-3 text-center">% Cumplimiento</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-3 text-center font-mono">Meta 2028</th>
                <th className="py-3 px-3">Responsable</th>
                <th className="py-3 px-3 text-center">Evidencias</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKpis.map((kpi) => (
                <tr key={kpi.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-emerald-800 whitespace-nowrap">
                    {kpi.code}
                  </td>
                  <td className="py-3 px-3 max-w-[260px]">
                    <p className="font-semibold text-slate-900 leading-snug">{kpi.name}</p>
                    <p className="text-[11px] text-slate-500">{kpi.area}</p>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums whitespace-nowrap">
                    {kpi.targetValue.toLocaleString('es-CO')} {kpi.unit}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                    {kpi.currentValue.toLocaleString('es-CO')} {kpi.unit}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold tabular-nums whitespace-nowrap">
                    <span
                      className={
                        kpi.compliancePercentage >= 90
                          ? 'text-emerald-700'
                          : kpi.compliancePercentage >= 70
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }
                    >
                      {kpi.compliancePercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full ${
                        kpi.status === 'Superado'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : kpi.status === 'En meta'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : kpi.status === 'En riesgo'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {kpi.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 bg-amber-50/50">
                    {kpi.strategicPlanning2028?.target2028 || '-'} {kpi.unit}
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-[140px] truncate">
                    {kpi.responsible}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <a
                      href={kpi.targetDriveFolder || googleDriveFolder}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                    >
                      <FolderOpen className="w-3 h-3" />
                      <span>Drive</span>
                    </a>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onOpenMeasurementModal(kpi.id)}
                        className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                      >
                        + Medir
                      </button>
                      <button
                        onClick={() => onOpenHistoryModal(kpi)}
                        className="p-1 text-slate-600 hover:text-emerald-800 rounded"
                        title="Historial"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenEditKpiModal(kpi)}
                        className="p-1 text-slate-600 hover:text-emerald-800 rounded"
                        title="Ver Ficha Técnica Oficial (Aprobada por Gerencia)"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
