/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Header, ActiveTab } from './components/Header';
import { KpiManagement } from './components/KpiManagement';
import { KpiTasksView } from './components/KpiTasksView';
import { ActionPlansView } from './components/ActionPlansView';
import { PowerBiIntegrationView } from './components/PowerBiIntegrationView';
import { AlertsView } from './components/AlertsView';

import { KpiModal } from './components/modals/KpiModal';
import { MeasurementModal } from './components/modals/MeasurementModal';
import { KpiTaskModal } from './components/modals/KpiTaskModal';
import { ActionPlanModal } from './components/modals/ActionPlanModal';
import { AreaTaskModal } from './components/modals/AreaTaskModal';
import { KpiHistoryModal } from './components/modals/KpiHistoryModal';
import { LoginView } from './components/LoginView';
import { UsersManagement } from './components/UsersManagement';

import { KPI, ActionPlan, KpiTask, AreaManagementTask } from './types';
import { Building2, Shield, FolderOpen, Award } from 'lucide-react';

function AppContent() {
  // Tablero ejecutivo omitted as requested; default tab is quarterly KPI management
  const [activeTab, setActiveTab] = useState<ActiveTab>('kpis');

  const { 
    kpis, 
    kpiTasks, 
    actionPlans, 
    areaTasks, 
    addKpi, 
    updateKpi, 
    addKpiTask, 
    updateKpiTask, 
    addActionPlan, 
    updateActionPlan, 
    addAreaTask, 
    updateAreaTask,
    googleDriveFolder,
    user,
    isAuthenticated,
    isLoading,
    apiError,
    clearApiError,
    logout,
  } = useData();

  // Modals state
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KPI | null>(null);

  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [selectedKpiForMeasurement, setSelectedKpiForMeasurement] = useState<string | null>(null);

  const [isKpiTaskModalOpen, setIsKpiTaskModalOpen] = useState(false);
  const [editingKpiTask, setEditingKpiTask] = useState<KpiTask | null>(null);
  const [defaultKpiForTask, setDefaultKpiForTask] = useState<string | undefined>(undefined);

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ActionPlan | null>(null);

  const [isAreaTaskModalOpen, setIsAreaTaskModalOpen] = useState(false);
  const [editingAreaTask, setEditingAreaTask] = useState<AreaManagementTask | null>(null);
  const [defaultAreaForTask, setDefaultAreaForTask] = useState<string | undefined>(undefined);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedKpiForHistory, setSelectedKpiForHistory] = useState<KPI | null>(null);

  // Handlers for KPIs
  const handleOpenNewKpi = () => {
    setEditingKpi(null);
    setIsKpiModalOpen(true);
  };

  const handleOpenEditKpi = (kpi: KPI) => {
    setEditingKpi(kpi);
    setIsKpiModalOpen(true);
  };

  const handleOpenMeasurement = (kpiId: string) => {
    setSelectedKpiForMeasurement(kpiId);
    setIsMeasurementModalOpen(true);
  };

  const handleOpenHistory = (kpi: KPI) => {
    setSelectedKpiForHistory(kpi);
    setIsHistoryModalOpen(true);
  };

  // Handlers for KPI Tasks (Módulo 2)
  const handleOpenNewKpiTask = (kpiIdOrCode?: string) => {
    setEditingKpiTask(null);
    setDefaultKpiForTask(kpiIdOrCode);
    setIsKpiTaskModalOpen(true);
  };

  const handleOpenEditKpiTask = (task: KpiTask) => {
    setEditingKpiTask(task);
    setIsKpiTaskModalOpen(true);
  };

  const handleNavigateToKpiTasks = (kpiCode: string) => {
    setActiveTab('kpi_tasks');
    setDefaultKpiForTask(kpiCode);
  };

  // Handlers for Improvement Action Plans (Módulo 3)
  const handleOpenNewAction = () => {
    setEditingPlan(null);
    setIsActionModalOpen(true);
  };

  const handleOpenEditAction = (plan: ActionPlan) => {
    setEditingPlan(plan);
    setIsActionModalOpen(true);
  };

  // Handlers for Area Management Tasks (Módulo 4: POA)
  const handleOpenNewAreaTask = (area?: string) => {
    setEditingAreaTask(null);
    setDefaultAreaForTask(area);
    setIsAreaTaskModalOpen(true);
  };

  const handleOpenEditAreaTask = (task: AreaManagementTask) => {
    setEditingAreaTask(task);
    setIsAreaTaskModalOpen(true);
  };

  // Deep-linking from Alerts
  const handleNavigateToKpi = (kpiId: string) => {
    setActiveTab('kpis');
    const targetKpi = kpis.find(k => k.id === kpiId);
    if (targetKpi) handleOpenEditKpi(targetKpi);
  };

  const handleNavigateToAction = (actionId: string) => {
    setActiveTab('actions');
    const targetAction = actionPlans.find(a => a.id === actionId);
    if (targetAction) handleOpenEditAction(targetAction);
  };

  const handleNavigateToKpiTask = (taskId: string) => {
    setActiveTab('kpi_tasks');
    const targetTask = kpiTasks.find(t => t.id === taskId);
    if (targetTask) handleOpenEditKpiTask(targetTask);
  };

  const handleNavigateToAreaTask = (taskId: string) => {
    setActiveTab('actions');
    const targetAreaTask = areaTasks.find(t => t.id === taskId);
    if (targetAreaTask) handleOpenEditAreaTask(targetAreaTask);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-sm font-medium text-slate-600">Conectando con el servidor...</div>;
  }
  if (!isAuthenticated) return <LoginView />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <div className="flex items-center justify-end gap-3 border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">
        <span>{user?.name} · {user?.role}</span>
        <button onClick={logout} className="font-semibold text-emerald-800 hover:underline">Cerrar sesión</button>
      </div>
      {apiError && (
        <div role="alert" className="flex items-center justify-between gap-3 border-b border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <span>{apiError}</span>
          <button onClick={clearApiError} aria-label="Cerrar mensaje" className="font-bold">×</button>
        </div>
      )}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewKpiModal={() => handleOpenMeasurement('')}
        onOpenNewKpiTaskModal={() => handleOpenNewKpiTask()}
        onOpenNewActionModal={handleOpenNewAction}
        onOpenNewAreaTaskModal={() => handleOpenNewAreaTask()}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Módulo 1: KPIs y Planeación a 2028 */}
        {activeTab === 'kpis' && (
          <KpiManagement
            onOpenNewKpiModal={() => handleOpenMeasurement('')}
            onOpenEditKpiModal={handleOpenEditKpi}
            onOpenMeasurementModal={handleOpenMeasurement}
            onOpenHistoryModal={handleOpenHistory}
            onNavigateToKpiTasks={handleNavigateToKpiTasks}
          />
        )}

        {/* Módulo 2: Tareas Operativas de Medición del KPI */}
        {activeTab === 'kpi_tasks' && (
          <KpiTasksView
            onOpenNewKpiTaskModal={handleOpenNewKpiTask}
            onOpenEditKpiTaskModal={handleOpenEditKpiTask}
            onOpenMeasurementModal={handleOpenMeasurement}
            initialFilterKpiCode={defaultKpiForTask}
          />
        )}

        {/* Módulo 3: Planes de Acción & Cronograma Operativo Unificado */}
        {(activeTab === 'actions' || activeTab === 'area_tasks') && (
          <ActionPlansView
            onOpenNewActionModal={handleOpenNewAction}
            onOpenEditActionModal={handleOpenEditAction}
            onOpenNewAreaTaskModal={handleOpenNewAreaTask}
            onOpenEditAreaTaskModal={handleOpenEditAreaTask}
          />
        )}

        {/* Módulo 5: Power BI Institucional & Google Sheets */}
        {activeTab === 'powerbi' && (
          <PowerBiIntegrationView />
        )}

        {/* Centro de Alertas Tempranas */}
        {activeTab === 'alerts' && (
          <AlertsView
            onNavigateToKpi={handleNavigateToKpi}
            onNavigateToAction={handleNavigateToAction}
            onNavigateToKpiTask={handleNavigateToKpiTask}
            onNavigateToAreaTask={handleNavigateToAreaTask}
          />
        )}
        {activeTab === 'users' && user?.role === 'ADMIN' && <UsersManagement />}
      </main>

      {/* Institutional Corporate Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-700 flex items-center justify-center text-amber-300 font-bold text-[10px]">
              G
            </div>
            <span className="font-bold text-slate-800">
              Gran Central de Abastos del Caribe S.A. · Granabastos
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-800 font-semibold">Plan Estratégico 2024 - 2028</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px]">
            <a
              href={googleDriveFolder}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-700 hover:underline font-semibold"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Carpeta Drive de Evidencias</span>
            </a>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Power BI & SGC</span>
            </span>
            <span className="font-mono">sec_gerencia@granabastos.com.co</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Modal Ficha Técnica Oficial del KPI (Gerencia General) */}
      <KpiModal
        isOpen={isKpiModalOpen}
        onClose={() => setIsKpiModalOpen(false)}
        editingKpi={editingKpi}
        onOpenMeasurement={handleOpenMeasurement}
      />

      {/* 2. Modal Medición Trimestral con Adjuntos a Carpeta */}
      <MeasurementModal
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
        kpiId={selectedKpiForMeasurement}
      />

      {/* 3. Modal Tareas de Medición (Módulo 2) */}
      <KpiTaskModal
        isOpen={isKpiTaskModalOpen}
        onClose={() => setIsKpiTaskModalOpen(false)}
        onSave={addKpiTask}
        onUpdate={updateKpiTask}
        editingTask={editingKpiTask}
        defaultKpiId={defaultKpiForTask}
      />

      {/* 4. Modal Plan de Acción de Mejora (Módulo 3) */}
      <ActionPlanModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onSave={addActionPlan}
        onUpdate={updateActionPlan}
        editingPlan={editingPlan}
      />

      {/* 5. Modal Actividad de Gestión de Área (Módulo 4: POA) */}
      <AreaTaskModal
        isOpen={isAreaTaskModalOpen}
        onClose={() => setIsAreaTaskModalOpen(false)}
        onSave={addAreaTask}
        onUpdate={updateAreaTask}
        editingTask={editingAreaTask}
        defaultArea={defaultAreaForTask}
      />

      {/* 6. Modal Histórico & Trayectoria 2028 */}
      <KpiHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        kpi={selectedKpiForHistory}
      />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
