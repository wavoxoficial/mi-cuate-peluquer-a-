import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Scissors, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props { onRegister: () => void; onForgot: () => void; }

export default function LoginPage({ onRegister, onForgot }: Props) {
  const { login } = useAuthStore();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [show, setShow]   = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy]   = useState(false);

  const set = (k: keyof typeof form, v: string) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim())    { setError('Ingresa tu correo'); return; }
    if (!form.password.trim()) { setError('Ingresa tu contraseña'); return; }
    setBusy(true);
    await new Promise(r => setTimeout(r, 300)); // UX delay
    const res = login(form.email, form.password);
    setBusy(false);
    if (!res.ok) { setError(res.error ?? 'Error al iniciar sesión'); return; }
    toast.success('¡Bienvenido! 💈');
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-sm fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gold-600 flex items-center justify-center shadow-gold mb-4">
            <Scissors size={28} className="text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white">BarberPro</h1>
          <p className="text-white/40 text-sm mt-1">Sistema de gestión profesional</p>
        </div>

        {/* Card */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-white mb-5">Iniciar sesión</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mb-4">
              <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label">Correo electrónico</label>
              <input className="input" type="email" inputMode="email" autoComplete="email"
                placeholder="correo@ejemplo.com" value={form.email}
                onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <input className="input pr-12" type={show ? 'text' : 'password'}
                  autoComplete="current-password" placeholder="••••••••"
                  value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 p-1">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="button" onClick={onForgot}
              className="text-gold-400 text-sm text-right hover:underline self-end -mt-2">
              ¿Olvidaste tu contraseña?
            </button>

            <button type="submit" disabled={busy}
              className="btn-primary w-full py-3 text-base disabled:opacity-60">
              {busy ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p className="text-center text-white/40 text-sm mt-5">
          ¿No tienes cuenta?{' '}
          <button onClick={onRegister} className="text-gold-400 font-semibold hover:underline">
            Regístrate
          </button>
        </p>

        {/* Demo credentials */}
        <div className="mt-6 bg-dark-100 rounded-2xl border border-white/5 p-4">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-3">Accesos de prueba</p>
          <div className="flex flex-col gap-2">
            {[
              { role: 'Admin',    email: 'admin@barberpro.com', pass: 'admin123',  color: 'text-gold-400' },
              { role: 'Empleado', email: 'juan@barberpro.com',  pass: 'emp123',    color: 'text-blue-400' },
              { role: 'Cliente',  email: 'carlos@email.com',    pass: 'client123', color: 'text-green-400' },
            ].map(d => (
              <button key={d.role} type="button"
                onClick={() => { setForm({ email: d.email, password: d.pass }); setError(''); }}
                className="flex items-center justify-between bg-dark-300/50 rounded-xl px-3 py-2 active:bg-dark-300 transition-colors">
                <span className={`text-xs font-semibold ${d.color}`}>{d.role}</span>
                <span className="text-white/30 text-xs font-mono">{d.email}</span>
              </button>
            ))}
          </div>
          <p className="text-white/20 text-xs mt-2 text-center">Toca para rellenar automáticamente</p>
        </div>
      </div>
    </div>
  );
}
