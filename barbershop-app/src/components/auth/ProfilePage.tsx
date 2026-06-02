import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import { User, LogOut, Pencil, Save, Eye, EyeOff, CalendarCheck, DollarSign, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import StatusBadge from '../ui/StatusBadge';

export default function ProfilePage() {
  const { session, logout, updateProfile } = useAuthStore();
  const { bookings, clients } = useStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ name: session?.name ?? '', phone: '', password: '', confirm: '' });
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState('');

  if (!session) return null;

  const isClient   = session.role === 'client';
  const myBookings = isClient
    ? bookings
        .filter(b => b.clientName.toLowerCase() === session.name.toLowerCase()
                  || clients.find(c => c.email === session.email)?.id === b.clientId)
        .sort((a, b) => b.date.localeCompare(a.date))
    : [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    if (form.password && form.password.length < 6) { setError('Mínimo 6 caracteres'); return; }
    if (form.password && form.password !== form.confirm) { setError('Las contraseñas no coinciden'); return; }
    const updates: any = { name: form.name };
    if (form.password) updates.password = form.password;
    updateProfile(updates);
    toast.success('Perfil actualizado ✓');
    setEditing(false);
    setError('');
  };

  const roleLabel: Record<string, string> = { admin: 'Administrador', employee: 'Empleado', client: 'Cliente' };
  const roleColor: Record<string, string> = { admin: 'text-gold-400 bg-gold-600/15', employee: 'text-blue-400 bg-blue-500/15', client: 'text-green-400 bg-green-500/15' };

  return (
    <div className="page">
      {/* Header card */}
      <div className="card-gold p-5 flex items-center gap-4 fade-in">
        <div className="w-14 h-14 rounded-full bg-gold-600/20 border border-gold-600/30 flex items-center justify-center text-gold-400 font-bold text-2xl flex-shrink-0">
          {session.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-lg leading-tight truncate">{session.name}</p>
          <p className="text-white/40 text-sm truncate">{session.email}</p>
          <span className={`badge mt-1 ${roleColor[session.role]}`}>{roleLabel[session.role]}</span>
        </div>
        <button onClick={logout}
          className="flex flex-col items-center gap-1 text-red-400/70 hover:text-red-400 transition-colors flex-shrink-0">
          <LogOut size={18} />
          <span className="text-[9px]">Salir</span>
        </button>
      </div>

      {/* Edit profile */}
      <div className="card p-4 fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <User size={15} className="text-gold-400" /> Mi perfil
          </h3>
          {!editing && (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-gold-400 text-sm">
              <Pencil size={13} /> Editar
            </button>
          )}
        </div>

        {!editing ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between"><span className="text-white/40 text-sm">Nombre</span><span className="text-white text-sm font-medium">{session.name}</span></div>
            <div className="flex justify-between"><span className="text-white/40 text-sm">Correo</span><span className="text-white text-sm font-medium truncate ml-4">{session.email}</span></div>
            <div className="flex justify-between"><span className="text-white/40 text-sm">Rol</span><span className="text-white text-sm font-medium">{roleLabel[session.role]}</span></div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-3">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div>
              <label className="label">Nombre</label>
              <input className="input" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Nueva contraseña (dejar vacío para no cambiar)</label>
              <div className="relative">
                <input className="input pr-12" type={show ? 'text' : 'password'} placeholder="••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 p-1">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {form.password && (
              <div>
                <label className="label">Confirmar contraseña</label>
                <input className="input" type={show ? 'text' : 'password'} placeholder="••••••"
                  value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
              </div>
            )}
            <div className="flex gap-2 mt-1">
              <button type="button" onClick={() => { setEditing(false); setError(''); }}
                className="btn-secondary flex-1 text-sm py-2.5">Cancelar</button>
              <button type="submit" className="btn-primary flex-1 text-sm py-2.5">
                <Save size={14} /> Guardar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Client booking history */}
      {isClient && (
        <div className="card fade-in">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <CalendarCheck size={15} className="text-gold-400" />
            <h3 className="font-semibold text-white">Mis citas</h3>
            <span className="badge bg-white/5 text-white/40 ml-auto">{myBookings.length}</span>
          </div>
          {myBookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-white/30 text-sm">No tienes citas registradas</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {myBookings.map(b => (
                <div key={b.id} className="flex items-start justify-between px-4 py-3 gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{b.serviceName}</p>
                    <p className="text-white/40 text-xs">{b.employeeName}</p>
                    <p className="text-white/30 text-xs mt-0.5">
                      {format(new Date(b.date + 'T00:00:00'), "d 'de' MMM yyyy", { locale: es })} · {b.time}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StatusBadge status={b.status} />
                    <span className="text-gold-400 text-xs font-bold">${b.servicePrice}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Logout */}
      <button onClick={() => { if(confirm('¿Cerrar sesión?')) logout(); }}
        className="btn-danger w-full flex items-center justify-center gap-2">
        <LogOut size={15} /> Cerrar sesión
      </button>
    </div>
  );
}
