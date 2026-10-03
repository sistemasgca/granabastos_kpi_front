import React, { useEffect, useState } from 'react';
import { UserPlus, Users, Pencil, X, Check, RefreshCw } from 'lucide-react';
import { ManagedUser } from '../services/api';
import { useData } from '../context/DataContext';

type UserRole = ManagedUser['role'];
type UserDraft = Pick<ManagedUser, 'name' | 'role' | 'isActive'>;

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  EDITOR: 'Editor',
  VIEWER: 'Consulta',
};

export const UsersManagement: React.FC = () => {
  const {
    user,
    managedUsers,
    loadManagedUsers,
    createManagedUser,
    updateManagedUser,
  } = useData();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('EDITOR');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<UserDraft | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void loadManagedUsers().then(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [loadManagedUsers]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreating(true);
    const created = await createManagedUser({ email, name, password, role });
    setCreating(false);
    if (created) {
      setEmail('');
      setName('');
      setPassword('');
      setRole('EDITOR');
    }
  };

  const beginEdit = (managedUser: ManagedUser) => {
    setEditingId(managedUser.id);
    setDraft({
      name: managedUser.name,
      role: managedUser.role,
      isActive: managedUser.isActive,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const handleUpdate = async (managedUser: ManagedUser) => {
    if (!draft) return;
    setSavingId(managedUser.id);
    const isSelf = managedUser.id === user?.id;
    const updated = await updateManagedUser(managedUser.id, isSelf
      ? { name: draft.name }
      : draft);
    setSavingId(null);
    if (updated) cancelEdit();
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 rounded-xl bg-gradient-to-r from-emerald-900 to-slate-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-300">
            <Users className="h-4 w-4" />
            Administración del sistema
          </p>
          <h1 className="mt-1 text-2xl font-bold">Usuarios y permisos</h1>
          <p className="mt-1 text-sm text-emerald-100">Crea cuentas, asigna roles y administra el acceso.</p>
        </div>
        <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm">
          {managedUsers.length} usuario{managedUsers.length === 1 ? '' : 's'}
        </div>
      </header>

      <form onSubmit={handleCreate} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
          <UserPlus className="h-5 w-5 text-emerald-700" />
          Crear usuario
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold text-slate-700">
            Nombre
            <input
              required
              minLength={2}
              maxLength={120}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-normal"
              autoComplete="name"
            />
          </label>
          <label className="text-xs font-semibold text-slate-700">
            Correo electrónico
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-normal"
              autoComplete="email"
            />
          </label>
          <label className="text-xs font-semibold text-slate-700">
            Contraseña temporal
            <input
              required
              type="password"
              minLength={12}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-normal"
              autoComplete="new-password"
            />
            <span className="mt-1 block font-normal text-slate-500">Entre 12 y 72 caracteres.</span>
          </label>
          <label className="text-xs font-semibold text-slate-700">
            Rol inicial
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal"
            >
              <option value="VIEWER">Consulta</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>
        </div>
        <button
          type="submit"
          disabled={creating}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
        >
          <UserPlus className="h-4 w-4" />
          {creating ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Cuentas registradas</h2>
            <p className="mt-1 text-xs text-slate-500">El estado inactivo bloquea el acceso sin borrar el usuario.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void loadManagedUsers().then(() => setLoading(false));
            }}
            disabled={loading}
            aria-label="Actualizar lista de usuarios"
            className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-slate-500">Cargando usuarios...</p>
        ) : managedUsers.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No hay usuarios para mostrar.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {managedUsers.map((managedUser) => {
              const isEditing = editingId === managedUser.id && draft !== null;
              const isSelf = managedUser.id === user?.id;
              return (
                <li key={managedUser.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{managedUser.name}</p>
                    <p className="truncate text-sm text-slate-500">{managedUser.email}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800">
                        {roleLabels[managedUser.role]}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 font-semibold ${managedUser.isActive ? 'bg-green-50 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                        {managedUser.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                      {isSelf && <span className="text-slate-400">Tu cuenta</span>}
                    </div>
                  </div>

                  {isEditing && draft ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                      <label className="text-xs font-semibold text-slate-700">
                        Nombre
                        <input
                          required
                          minLength={2}
                          maxLength={120}
                          value={draft.name}
                          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-normal"
                        />
                      </label>
                      <label className="text-xs font-semibold text-slate-700">
                        Rol
                        <select
                          disabled={isSelf}
                          value={draft.role}
                          onChange={(event) => setDraft({ ...draft, role: event.target.value as UserRole })}
                          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal disabled:bg-slate-100"
                        >
                          <option value="VIEWER">Consulta</option>
                          <option value="EDITOR">Editor</option>
                          <option value="ADMIN">Administrador</option>
                        </select>
                      </label>
                      <label className="flex items-center gap-2 pb-2 text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          disabled={isSelf}
                          checked={draft.isActive}
                          onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })}
                          className="h-4 w-4 accent-emerald-700"
                        />
                        Cuenta activa
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void handleUpdate(managedUser)}
                          disabled={savingId === managedUser.id}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-800 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
                        >
                          <Check className="h-4 w-4" />
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <X className="h-4 w-4" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => beginEdit(managedUser)}
                      className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar permisos
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </section>
  );
};
