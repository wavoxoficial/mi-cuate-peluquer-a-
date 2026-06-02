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
    await new Promise(r => setTimeout(r, 350));
    const res = login(form.email, form.password);
    setBusy(false);
    if (!res.ok) { setError(res.error ?? 'Error al iniciar sesión'); return; }
    toast.success('¡Bienvenido! 💈');
  };

  const demos = [
    { role: 'Admin',    email: 'admin@barberpro.com', pass: 'MiCuate2025',  color: '#c9981a',  bg: 'rgba(201,152,26,0.08)'  },
    { role: 'Empleado', email: 'juan@barberpro.com',  pass: 'Maestro2025',  color: '#60a5fa',  bg: 'rgba(59,130,246,0.08)'  },
    { role: 'Cliente',  email: 'carlos@email.com',    pass: 'Cliente2025',  color: '#4ade80',  bg: 'rgba(34,197,94,0.08)'   },
  ];

  return (
    <div className="auth-page">
      <div className="w-full max-w-sm fade-in" style={{ position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #c9981a 0%, #f0c040 50%, #c9981a 100%)',
                boxShadow: '0 0 40px rgba(201,152,26,0.5), 0 0 80px rgba(201,152,26,0.2)',
              }}>
              <Scissors size={34} className="text-black" strokeWidth={2.5} />
            </div>
            {/* Ring decoration */}
            <div style={{
              position: 'absolute', inset: -6, borderRadius: '2.25rem',
              border: '1px solid rgba(201,152,26,0.25)',
              pointerEvents: 'none',
            }} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">BarberPro</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Sistema de gestión profesional</p>
        </div>

        {/* Card */}
        <div className="card p-6 mb-4" style={{ backdropFilter: 'blur(20px)' }}>
          <h2 className="text-lg font-bold text-white mb-5">Iniciar sesión</h2>

          {error && (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
              <AlertCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />
              <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
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
                <input className="input" style={{ paddingRight: '3rem' }}
                  type={show ? 'text' : 'password'} autoComplete="current-password"
                  placeholder="••••••••" value={form.password}
                  onChange={e => set('password', e.target.value)} />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="button" onClick={onForgot}
              className="text-sm self-end font-semibold" style={{ color: '#c9981a' }}>
              ¿Olvidaste tu contraseña?
            </button>

            <button type="submit" disabled={busy}
              className="btn-primary w-full py-3.5 text-sm font-bold disabled:opacity-50">
              {busy ? 'Verificando...' : 'Entrar al sistema'}
            </button>
          </form>
        </div>

        {/* Register */}
        <p className="text-center text-sm mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          ¿No tienes cuenta?{' '}
          <button onClick={onRegister} className="font-bold" style={{ color: '#c9981a' }}>
            Regístrate gratis
          </button>
        </p>

        {/* Demo credentials */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(22,22,24,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Accesos de demostración
          </p>
          <div className="flex flex-col gap-2">
            {demos.map(d => (
              <button key={d.role} type="button"
                onClick={() => { setForm({ email: d.email, password: d.pass }); setError(''); }}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all active:scale-98"
                style={{ background: d.bg, border: `1px solid ${d.color}22` }}>
                <span className="text-xs font-bold" style={{ color: d.color }}>{d.role}</span>
                <div className="text-right">
                  <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{d.email}</p>
                  <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>{d.pass}</p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-center mt-2.5" style={{ color: 'rgba(255,255,255,0.18)' }}>
            Toca una fila para rellenar automáticamente
          </p>
        </div>
      </div>
    </div>
  );
}
