import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Scissors, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props { onLogin: () => void; }

export default function RegisterPage({ onLogin }: Props) {
  const { register } = useAuthStore();
  const [form, setForm]   = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [show, setShow]   = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy]   = useState(false);

  const set = (k: keyof typeof form, v: string) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim())        { setError('Ingresa tu nombre'); return; }
    if (!form.email.trim())       { setError('Ingresa tu correo'); return; }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden'); return; }
    setBusy(true);
    await new Promise(r => setTimeout(r, 300));
    const res = register(form.name, form.email, form.phone, form.password, 'client');
    setBusy(false);
    if (!res.ok) { setError(res.error ?? 'Error al registrarse'); return; }
    toast.success('¡Cuenta creada! Bienvenido 🎉');
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-sm fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gold-600 flex items-center justify-center shadow-gold mb-3">
            <Scissors size={24} className="text-black" />
          </div>
          <h1 className="text-xl font-bold text-white">BarberPro</h1>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={onLogin} className="icon-btn">
              <ArrowLeft size={15} />
            </button>
            <h2 className="text-lg font-bold text-white">Crear cuenta</h2>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mb-4">
              <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="label">Nombre completo</label>
              <input className="input" type="text" autoComplete="name"
                placeholder="Tu nombre" value={form.name}
                onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className="label">Correo electrónico</label>
              <input className="input" type="email" inputMode="email" autoComplete="email"
                placeholder="correo@ejemplo.com" value={form.email}
                onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Teléfono (opcional)</label>
              <input className="input" type="tel" inputMode="tel" autoComplete="tel"
                placeholder="+52 555 000 0000" value={form.phone}
                onChange={e => set('phone', e.target.value)} />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <input className="input pr-12" type={show ? 'text' : 'password'}
                  autoComplete="new-password" placeholder="Mínimo 6 caracteres"
                  value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 p-1">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirmar contraseña</label>
              <input className="input" type={show ? 'text' : 'password'}
                autoComplete="new-password" placeholder="Repite tu contraseña"
                value={form.confirm} onChange={e => set('confirm', e.target.value)} />
            </div>

            <button type="submit" disabled={busy}
              className="btn-primary w-full py-3 mt-1 disabled:opacity-60">
              {busy ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/40 text-sm mt-5">
          ¿Ya tienes cuenta?{' '}
          <button onClick={onLogin} className="text-gold-400 font-semibold hover:underline">
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}
