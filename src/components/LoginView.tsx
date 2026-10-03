import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export const LoginView: React.FC = () => {
  const { login, apiError, clearApiError } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800 text-xl font-bold text-amber-300">G</div>
          <h1 className="text-xl font-bold text-slate-900">GRANABASTOS</h1>
          <p className="mt-1 text-sm text-slate-500">Ingresa para acceder al sistema de gestión KPI</p>
        </div>
        {apiError && (
          <div role="alert" className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {apiError}
            <button type="button" onClick={clearApiError} className="ml-2 font-semibold underline">Cerrar</button>
          </div>
        )}
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="login-email">Correo electrónico</label>
        <input
          id="login-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
        />
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-6 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? 'Conectando...' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  );
};
