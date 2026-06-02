import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Scissors, AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props { onLogin: () => void; }

export default function ForgotPasswordPage({ onLogin }: Props) {
  const { resetPassword } = useAuthStore();
  const [step, setStep]   = useState<'email' | 'reset' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [show, setShow]   = useState(false);
  const [error, setError] = useState('');

  const handleCheckEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Ingresa tu correo'); return; }
    setError('');
    setStep('reset');
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.length < 6) { setError('Mínimo 6 caracteres'); return; }
    const res = resetPassword(email, pass);
    if (!res.ok) { setError(res.error ?? 'Error'); return; }
    setStep('done');
    toast.success('Contraseña actualizada ✓');
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-sm fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gold-600 flex items-center justify-center shadow-gold mb-3">
            <Scissors size={24} className="text-black" />
          </div>
          <h1 className="text-xl font-bold text-white">BarberPro</h1>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={onLogin} className="icon-btn"><ArrowLeft size={15} /></button>
            <h2 className="text-lg font-bold text-white">Recuperar contraseña</h2>
          </div>

          {step === 'done' ? (
            <div className="flex flex-col items-center py-4 gap-3">
              <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                <CheckCircle size={28} className="text-green-400" />
              </div>
              <p className="text-white font-semibold">¡Contraseña actualizada!</p>
              <p className="text-white/40 text-sm text-center">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <button onClick={onLogin} className="btn-primary w-full mt-2">Ir al inicio</button>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mb-4">
                  <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {step === 'email' ? (
                <form onSubmit={handleCheckEmail} className="flex flex-col gap-4">
                  <p className="text-white/50 text-sm">Ingresa tu correo y te permitiremos cambiar tu contraseña.</p>
                  <div>
                    <label className="label">Correo electrónico</label>
                    <input className="input" type="email" inputMode="email"
                      placeholder="correo@ejemplo.com" value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }} />
                  </div>
                  <button type="submit" className="btn-primary w-full">Continuar</button>
                </form>
              ) : (
                <form onSubmit={handleReset} className="flex flex-col gap-4">
                  <p className="text-white/50 text-sm">Crea una nueva contraseña para <span className="text-gold-400">{email}</span></p>
                  <div>
                    <label className="label">Nueva contraseña</label>
                    <div className="relative">
                      <input className="input pr-12" type={show ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres" value={pass}
                        onChange={e => { setPass(e.target.value); setError(''); }} />
                      <button type="button" onClick={() => setShow(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 p-1">
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full">Guardar contraseña</button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
