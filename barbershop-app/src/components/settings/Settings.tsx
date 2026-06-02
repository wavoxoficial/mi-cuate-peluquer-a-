import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { DEFAULT_SETTINGS } from '../../utils/whatsapp';
import { Store, MessageCircle, Save, RotateCcw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'business' | 'whatsapp';

export default function Settings() {
  const { settings, updateSettings } = useStore();
  const [tab, setTab]     = useState<Tab>('business');
  const [form, setForm]   = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const set = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setSaved(false);
  };

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    toast.success('Configuración guardada ✓');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (!confirm('¿Restaurar plantillas de WhatsApp por defecto?')) return;
    const reset = {
      ...form,
      whatsappConfirmTemplate:  DEFAULT_SETTINGS.whatsappConfirmTemplate,
      whatsappReminderTemplate: DEFAULT_SETTINGS.whatsappReminderTemplate,
      whatsappThanksTemplate:   DEFAULT_SETTINGS.whatsappThanksTemplate,
    };
    setForm(reset);
    updateSettings(reset);
    toast.success('Plantillas restauradas');
  };

  const VARS = ['{cliente}', '{servicio}', '{fecha}', '{hora}', '{empleado}', '{precio}', '{negocio}'];

  return (
    <div className="page">
      {/* Tabs */}
      <div className="flex gap-2 bg-dark-100 rounded-2xl p-1 fade-in">
        <button onClick={() => setTab('business')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all
            ${tab === 'business' ? 'bg-gold-600 text-black shadow-gold' : 'text-white/50'}`}>
          <Store size={15} /> Mi Negocio
        </button>
        <button onClick={() => setTab('whatsapp')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all
            ${tab === 'whatsapp' ? 'bg-gold-600 text-black shadow-gold' : 'text-white/50'}`}>
          <MessageCircle size={15} /> WhatsApp
        </button>
      </div>

      {/* Business tab */}
      {tab === 'business' && (
        <div className="flex flex-col gap-4 fade-in">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Store size={15} className="text-gold-400" />
              <h3 className="font-semibold text-white text-sm">Datos del negocio</h3>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="label">Nombre de la peluquería</label>
                <input className="input" placeholder="BarberPro"
                  value={form.barberName} onChange={e => set('barberName', e.target.value)} />
              </div>
              <div>
                <label className="label">📱 Teléfono / WhatsApp del negocio</label>
                <input className="input" type="tel" inputMode="tel"
                  placeholder="Ej. 525551234567 (código de país sin +)"
                  value={form.barberPhone} onChange={e => set('barberPhone', e.target.value)} />
                <p className="text-white/25 text-xs mt-1">Sin + (México = 52, España = 34)</p>
              </div>
              <div>
                <label className="label">📍 Dirección</label>
                <input className="input" placeholder="Ej. Calle Principal 123, Ciudad"
                  value={form.barberAddress} onChange={e => set('barberAddress', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp tab */}
      {tab === 'whatsapp' && (
        <div className="flex flex-col gap-4 fade-in">
          <div className="card p-3">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-2">Variables disponibles</p>
            <div className="flex flex-wrap gap-1.5">
              {VARS.map(v => (
                <span key={v} className="bg-gold-600/10 border border-gold-600/20 text-gold-400 text-xs px-2 py-0.5 rounded-lg font-mono">
                  {v}
                </span>
              ))}
            </div>
          </div>
          <div className="card p-4 flex flex-col gap-4">
            <div>
              <label className="label">✅ Confirmación de reserva</label>
              <textarea className="input resize-none" rows={4}
                value={form.whatsappConfirmTemplate}
                onChange={e => set('whatsappConfirmTemplate', e.target.value)} />
            </div>
            <div>
              <label className="label">🔔 Recordatorio</label>
              <textarea className="input resize-none" rows={4}
                value={form.whatsappReminderTemplate}
                onChange={e => set('whatsappReminderTemplate', e.target.value)} />
            </div>
            <div>
              <label className="label">🙏 Agradecimiento</label>
              <textarea className="input resize-none" rows={4}
                value={form.whatsappThanksTemplate}
                onChange={e => set('whatsappThanksTemplate', e.target.value)} />
            </div>
          </div>
          <button onClick={handleReset}
            className="btn-secondary flex items-center justify-center gap-2 text-sm">
            <RotateCcw size={14} /> Restaurar por defecto
          </button>
          <div className="bg-green-500/8 border border-green-500/20 rounded-2xl p-4">
            <div className="flex items-start gap-2.5">
              <MessageCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-400 font-semibold text-sm mb-1">Preparado para WhatsApp Business API</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  Arquitectura lista para integrar con la API oficial de Meta. Actualmente los mensajes se envían vía enlaces <code className="text-green-400/70">wa.me</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save */}
      <button onClick={handleSave}
        className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all
          ${saved ? 'bg-green-500/15 border border-green-500/20 text-green-400' : 'bg-gold-600 text-black shadow-gold'}`}>
        {saved ? <><CheckCircle size={15} /> Guardado</> : <><Save size={15} /> Guardar cambios</>}
      </button>
    </div>
  );
}
