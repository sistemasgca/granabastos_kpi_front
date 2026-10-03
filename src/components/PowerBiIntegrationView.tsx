import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Database, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  Server, 
  Cloud, 
  Code2, 
  Maximize2,
  TrendingUp,
  Award,
  Filter,
  BarChart3,
  Calendar,
  Building2,
  FolderOpen
} from 'lucide-react';
import { GRANABASTOS_AREAS, QUARTERS, YEARS_HORIZON_2028 } from '../data/initialData';

export const PowerBiIntegrationView: React.FC = () => {
  const { 
    kpis, 
    actionPlans, 
    areaTasks,
    googleDriveFolder,
    exportCSV, 
    exportDatabaseJSON, 
    importDatabaseJSON,
    importCSV,
    resetToDemoData 
  } = useData();

  const [copiedMCode, setCopiedMCode] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [jsonImportText, setJsonImportText] = useState('');
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<'dashboard' | 'powerbi' | 'sheets' | 'netlify' | 'backup'>('dashboard');

  // Interactive filters for the Institutional Power BI Preview
  const [filterArea, setFilterArea] = useState<string>('Todas');
  const [filterQuarter, setFilterQuarter] = useState<string>('Todos');

  // Custom Power BI Service embed URL (optional)
  const [powerBiEmbedUrl, setPowerBiEmbedUrl] = useState<string>('https://app.powerbi.com/view?r=eyJrIjoiR3JhbmFiYXN0b3MtUGxhbi0yMDI4In0=');
  const [isEditingEmbedUrl, setIsEditingEmbedUrl] = useState(false);

  // Power Query (M code) ready for Power BI Desktop
  const powerQueryMCode = `let
    // =========================================================================
    // GRANABASTOS S.A. - Conector Star Schema Planeación 2028 para Power BI Desktop
    // Generado automáticamente para: sec_gerencia@granabastos.com.co
    // =========================================================================
    
    // Conexión al archivo CSV del modelo dimensional institucional:
    Origen = Csv.Document(
        Web.Contents("https://raw.githubusercontent.com/granabastos/kpi-data/main/Granabastos_PowerBI_Star_Schema_Planeacion2028.csv"),
        [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]
    ),
    #"Encabezados Promovidos" = Table.PromoteHeaders(Origen, [PromoteAllScalars=true]),
    #"Tipo Cambiado" = Table.TransformColumnTypes(#"Encabezados Promovidos",{
        {"KPI_Code", type text},
        {"KPI_Name", type text},
        {"Area", type text},
        {"Periodicity", type text},
        {"Target_2024", type number},
        {"Target_2025", type number},
        {"Target_2026", type number},
        {"Target_2027", type number},
        {"Target_2028", type number},
        {"Current_Target", type number},
        {"Current_Actual", type number},
        {"Unit", type text},
        {"Compliance_Pct", type number},
        {"Status", type text},
        {"Quarter_Measurement", type text},
        {"Year_Measurement", Int64.Type},
        {"Measurement_Value", type number},
        {"Measurement_Target", type number},
        {"Measurement_Compliance", type number},
        {"Measurement_Date", type date},
        {"Measurement_Has_Evidence", type text},
        {"KPI_Responsible", type text},
        {"Drive_Folder_URL", type text}
    })
in
    #"Tipo Cambiado"`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMCode(true);
    setTimeout(() => setCopiedMCode(false), 2500);
  };

  const handleSyncGoogleSheet = async () => {
    if (!googleSheetUrl) {
      alert('Por favor ingrese la URL pública o enlace CSV de su hoja de cálculo de Google Sheets.');
      return;
    }
    setSyncStatus('Conectando y analizando datos de Google Sheets...');
    try {
      const response = await fetch(googleSheetUrl);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      const csvText = await response.text();
      const res = importCSV(csvText, 'kpis');
      if (res.success) {
        setSyncStatus(`¡Sincronización exitosa! Se cargaron ${res.count} indicadores desde Google Sheets.`);
      } else {
        setSyncStatus(`Error: ${res.error}`);
      }
    } catch (err: unknown) {
      setSyncStatus(`Fallo en la conexión: ${err instanceof Error ? err.message : 'Error desconocido'}. Asegúrese de que la hoja de Google Sheets esté compartida como "Pública con enlace" o "Publicar en la web como CSV".`);
    }
  };

  const handleImportJson = () => {
    if (!jsonImportText.trim()) return;
    const ok = importDatabaseJSON(jsonImportText);
    if (ok) {
      alert('Base de datos importada exitosamente.');
      setShowJsonModal(false);
      setJsonImportText('');
    } else {
      alert('La API no ofrece importación masiva JSON; no se modificó la información.');
    }
  };

  // Filtered KPIs for visualization preview
  const displayKpis = kpis.filter((k) => {
    return filterArea === 'Todas' || k.area === filterArea;
  });

  const avgCompliance = displayKpis.length > 0
    ? Math.round(displayKpis.reduce((acc, k) => acc + k.compliancePercentage, 0) / displayKpis.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-500 text-slate-950 font-bold rounded-xl shadow-xs">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">
                  Power BI Institucional Granabastos & Arquitectura de Datos 2028
                </h1>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  Oficial
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Centro de visualización institucional gerencial y conector dimensional (Star Schema) para Power BI Desktop y Google Sheets a costo cero.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportCSV('powerbi_star_schema')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Star Schema Plan 2028 (CSV)</span>
            </button>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center overflow-x-auto gap-2 border-b border-slate-200 mt-5 pt-2 text-xs font-semibold">
          <button
            onClick={() => setActiveSchemaTab('dashboard')}
            className={`pb-2.5 px-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSchemaTab === 'dashboard'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            <span>1. Tablero Visual Institucional (Power BI)</span>
          </button>

          <button
            onClick={() => setActiveSchemaTab('powerbi')}
            className={`pb-2.5 px-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSchemaTab === 'powerbi'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-amber-600" />
            <span>2. Conexión Power BI Desktop (Power Query M)</span>
          </button>

          <button
            onClick={() => setActiveSchemaTab('sheets')}
            className={`pb-2.5 px-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSchemaTab === 'sheets'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>3. Sincronización Google Sheets (Costo Cero)</span>
          </button>

          <button
            onClick={() => setActiveSchemaTab('netlify')}
            className={`pb-2.5 px-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSchemaTab === 'netlify'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-4 h-4 text-cyan-600" />
            <span>4. Despliegue Netlify (Costo Cero)</span>
          </button>

          <button
            onClick={() => setActiveSchemaTab('backup')}
            className={`pb-2.5 px-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSchemaTab === 'backup'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4 text-slate-600" />
            <span>5. Respaldo de Base de Datos</span>
          </button>
        </div>
      </div>

      {/* TAB 1: VISOR INSTITUCIONAL POWER BI */}
      {activeSchemaTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Institutional Header & Filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-emerald-700" />
                <span>Segmentación Dinámica:</span>
              </span>

              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-800"
              >
                <option value="Todas">Todas las Áreas Granabastos</option>
                {GRANABASTOS_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>

              <select
                value={filterQuarter}
                onChange={(e) => setFilterQuarter(e.target.value)}
                className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-800"
              >
                <option value="Todos">Todos los Trimestres (T1-T4)</option>
                {QUARTERS.map((q) => (
                  <option key={q} value={q}>{q} (Trimestre {q.slice(1)})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={googleDriveFolder}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-semibold flex items-center gap-1"
              >
                <FolderOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>Carpeta de Evidencias Drive</span>
              </a>

              <a
                href="https://app.powerbi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold flex items-center gap-1"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Abrir Power BI Service</span>
              </a>
            </div>
          </div>

          {/* Institutional KPI Dashboard Cards Canvas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 block">Cumplimiento Ponderado</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                  {avgCompliance}%
                </span>
                <span className={`text-xs font-bold ${avgCompliance >= 90 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {avgCompliance >= 90 ? 'En Meta' : 'En Seguimiento'}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${Math.min(100, avgCompliance)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                {displayKpis.length} indicadores evaluados
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 block">Indicadores en Meta / Superados</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-emerald-700 tabular-nums">
                  {displayKpis.filter((k) => k.status === 'En meta' || k.status === 'Superado').length}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  de {displayKpis.length} KPIs
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                <span>Desempeño satisfactorio</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 block">Indicadores en Riesgo / Críticos</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-rose-700 tabular-nums">
                  {displayKpis.filter((k) => k.status === 'Crítico' || k.status === 'En riesgo').length}
                </span>
                <span className="text-xs text-rose-700 font-bold">
                  Atención requerida
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                <span>Cartera y residuos con alerta</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 block">Horizonte Estratégico</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-amber-700 tabular-nums">
                  2028
                </span>
                <span className="text-xs text-slate-500 font-sans">
                  Metas Plurianuales
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Alineado a Visión Granabastos</span>
              </div>
            </div>
          </div>

          {/* Matrix of Indicators with 2028 Goals and Quarterly Execution */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>Matriz Ejecutiva Power BI: Metas 2024 - 2028 & Cortes Trimestrales</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Desglose consolidado del progreso anual y último resultado de corte reportado con evidencia
                </p>
              </div>

              <button
                onClick={() => exportCSV('powerbi_star_schema')}
                className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded transition-colors flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Dataset</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Indicador</th>
                    <th className="py-2.5 px-3">Área</th>
                    <th className="py-2.5 px-3 text-right">Meta 2024</th>
                    <th className="py-2.5 px-3 text-right">Meta 2025</th>
                    <th className="py-2.5 px-3 text-right bg-emerald-50/70 text-emerald-950 font-bold">
                      Meta 2026
                    </th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-950">
                      Resultado Actual
                    </th>
                    <th className="py-2.5 px-3 text-center">% Cumpl.</th>
                    <th className="py-2.5 px-3 text-right bg-amber-50/70 text-amber-950 font-bold">
                      Meta 2028
                    </th>
                    <th className="py-2.5 px-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayKpis.map((kpi) => (
                    <tr key={kpi.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-800 whitespace-nowrap">
                        {kpi.code}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 max-w-[240px]">
                        <p className="truncate" title={kpi.name}>{kpi.name}</p>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {kpi.area}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        {kpi.strategicPlanning2028?.target2024 || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        {kpi.strategicPlanning2028?.target2025 || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold bg-emerald-50/50 text-emerald-900">
                        {kpi.strategicPlanning2028?.target2026 || kpi.targetValue} {kpi.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-950">
                        {kpi.currentValue.toLocaleString('es-CO')} {kpi.unit}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
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
                      <td className="py-2.5 px-3 text-right font-mono font-bold bg-amber-50/50 text-amber-950">
                        {kpi.strategicPlanning2028?.target2028 || '-'} {kpi.unit}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POWER BI DESKTOP (POWER QUERY M SCRIPT) */}
      {activeSchemaTab === 'powerbi' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-700" />
                  <span>Script Power Query (Lenguaje M) para Importación en Power BI Desktop</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Pegue este script en <em>Power BI Desktop → Transformar Datos → Editor Avanzado</em>:
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(powerQueryMCode)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-colors"
              >
                {copiedMCode ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMCode ? '¡Copiado!' : 'Copiar Script M'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 text-emerald-300 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
              {powerQueryMCode}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: GOOGLE SHEETS */}
      {activeSchemaTab === 'sheets' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Sincronización Centralizada con Google Sheets (Costo Cero)</span>
            </h2>
            <p className="text-slate-500 mt-1">
              Permite que las distintas áreas de Granabastos alimenten sus cifras en una hoja compartida de Google Drive / Sheets sin costo alguno.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <label className="font-semibold text-slate-700 block">
              URL Pública de Google Sheets (formato CSV o Web):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <button
                onClick={handleSyncGoogleSheet}
                className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-md transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sincronizar Ahora</span>
              </button>
            </div>

            {syncStatus && (
              <p className="p-2.5 rounded bg-white border border-slate-200 font-mono text-slate-800">
                {syncStatus}
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: NETLIFY */}
      {activeSchemaTab === 'netlify' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-cyan-600" />
            <h2 className="text-sm font-bold text-slate-900">Despliegue Gratuito en Netlify (Costo Cero)</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            La plataforma está lista para desplegarse en <strong>Netlify Free</strong> sin incurrir en ningún costo mensual ni de servidor.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900">Pasos de publicación:</h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>Compile el código ejecutando <code>npm run build</code> (genera la carpeta <code>dist/</code>).</li>
              <li>Ingrese a <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-cyan-700 underline font-bold">app.netlify.com/drop</a> y arrastre la carpeta <code>dist/</code>.</li>
              <li>Su plataforma quedará en línea de inmediato con HTTPS gratuito.</li>
            </ol>
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP & DATABASE RESTORE */}
      {activeSchemaTab === 'backup' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">Respaldo Integral & Migración de Base de Datos</h2>
          </div>
          <p className="text-slate-600">
            Descargue toda la base de datos de indicadores, historial trimestral con archivos adjuntos, tareas de medición y planes de acción en formato JSON estructurado:
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const jsonStr = exportDatabaseJSON();
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Granabastos_Respaldo_SGC_2028_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Respaldo JSON Completo</span>
            </button>

            <button
              onClick={() => setShowJsonModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded-md"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-700" />
              <span>Restaurar desde JSON</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('¿Desea restablecer todos los datos iniciales de Granabastos?')) {
                  resetToDemoData();
                  alert('Datos restablecidos.');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-md ml-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restablecer Datos Iniciales</span>
            </button>
          </div>

          {showJsonModal && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 mt-4">
              <span className="font-bold text-slate-900 block">Pegar contenido JSON:</span>
              <textarea
                rows={6}
                value={jsonImportText}
                onChange={(e) => setJsonImportText(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-[11px]"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowJsonModal(false)} className="px-3 py-1.5 text-slate-600">
                  Cancelar
                </button>
                <button onClick={handleImportJson} className="px-4 py-1.5 bg-emerald-700 text-white font-bold rounded">
                  Confirmar Restauración
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
