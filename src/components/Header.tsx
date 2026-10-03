import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Target, 
  CheckSquare, 
  Wrench, 
  Bell, 
  Plus,
  Users,
} from 'lucide-react';

export type ActiveTab = 'kpis' | 'kpi_tasks' | 'actions' | 'area_tasks' | 'powerbi' | 'alerts' | 'users';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewKpiModal: () => void;
  onOpenNewKpiTaskModal: () => void;
  onOpenNewActionModal: () => void;
  onOpenNewAreaTaskModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewKpiModal,
  onOpenNewKpiTaskModal,
  onOpenNewActionModal,
  onOpenNewAreaTaskModal,
}) => {
  const { unreadAlertsCount, user } = useData();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-amber-300" stroke="none">
                <path d="M12 2L3 9v11a2 2 0 002 2h14a2 2 0 002-2V9l-9-7zm0 3.8L18 10v9H6v-9l6-4.2zM9 13a3 3 0 016 0v6H9v-6z" />
              </svg>
            </div>
            <button
              onClick={() => setActiveTab('kpis')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                  GRANABASTOS
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Plan 2028
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Sistema de Gestión Estratégica, SGC & Cumplimiento
              </p>
            </button>
          </div>

          {/* Institutional Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Módulo 1: KPIs y Planeación 2028 */}
            <button
              onClick={() => setActiveTab('kpis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'kpis'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>1. KPIs & Plan 2028</span>
            </button>

            {/* Módulo 2: Tareas de Medición del KPI */}
            <button
              onClick={() => setActiveTab('kpi_tasks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'kpi_tasks'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
              <span>2. Tareas de Medición KPI</span>
            </button>

            {/* Módulo 3: Planes de Acción */}
            <button
              onClick={() => setActiveTab('actions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'actions' || activeTab === 'area_tasks'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>3. Planes de Acción</span>
            </button>

            {/* Alertas */}
            <button
              onClick={() => setActiveTab('alerts')}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'alerts'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Alertas</span>
              {unreadAlertsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-bold rounded-full">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Usuarios</span>
              </button>
            )}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* + Registrar Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors whitespace-nowrap shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Registrar</span>
              </button>
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-slate-200 py-1 hidden group-hover:block hover:block z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                  Gestión Operativa & Cortes
                </div>
                <button
                  onClick={onOpenNewKpiModal}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2"
                >
                  <Target className="w-3.5 h-3.5 text-emerald-700" />
                  <div>
                    <span className="font-semibold block text-slate-800">+ Medición Trimestral de KPI</span>
                    <span className="text-[10px] text-slate-500">Corte T1-T4 y adjuntar soportes</span>
                  </div>
                </button>
                <button
                  onClick={onOpenNewKpiTaskModal}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2 border-t border-slate-100"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                  <div>
                    <span className="font-semibold block text-slate-800">Tarea Operativa de Medición</span>
                    <span className="text-[10px] text-slate-500">Ej. encuesta, tabulación, diseño</span>
                  </div>
                </button>
                <button
                  onClick={onOpenNewActionModal}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2 border-t border-slate-100"
                >
                  <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                  <div>
                    <span className="font-semibold block text-slate-800">Plan de Acción (Mejora)</span>
                    <span className="text-[10px] text-slate-500">Acción para que el KPI se cumpla</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="lg:hidden flex items-center overflow-x-auto py-2 border-t border-slate-100 text-xs gap-1">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`px-2.5 py-1 font-semibold rounded whitespace-nowrap ${activeTab === 'kpis' ? 'bg-emerald-800 text-white' : 'text-slate-600'}`}
          >
            1. KPIs & 2028
          </button>
          <button
            onClick={() => setActiveTab('kpi_tasks')}
            className={`px-2.5 py-1 font-semibold rounded whitespace-nowrap ${activeTab === 'kpi_tasks' ? 'bg-emerald-800 text-white' : 'text-slate-600'}`}
          >
            2. Tareas Medición
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-2.5 py-1 font-semibold rounded whitespace-nowrap ${activeTab === 'actions' || activeTab === 'area_tasks' ? 'bg-emerald-800 text-white' : 'text-slate-600'}`}
          >
            3. Planes de Acción
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-2.5 py-1 font-semibold rounded whitespace-nowrap relative ${activeTab === 'alerts' ? 'bg-emerald-800 text-white' : 'text-slate-600'}`}
          >
            Alertas {unreadAlertsCount > 0 && `(${unreadAlertsCount})`}
          </button>
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-2.5 py-1 font-semibold rounded whitespace-nowrap ${activeTab === 'users' ? 'bg-emerald-800 text-white' : 'text-slate-600'}`}
            >
              Usuarios
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
