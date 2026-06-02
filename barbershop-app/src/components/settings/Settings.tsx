import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { AppSettings } from '../../types';
import { Settings as SettingsIcon, MessageCircle, Phone, MapPin, Store, Save, RotateCcw } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../../utils/whatsapp';
import toast from 'react-hot-toast';

export default function Settings() {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState<AppSettings>({ ...settings });
  const [tab, setTab] = useState<'general' | 'whatsapp'>('general');

  const set = (k: keyof AppSettings, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    updateSettings(form);
    toast.success('Configuración guardada ✓');
  };

  const handleReset = () => {
    const reset = { ...DEFAULT_SETTINGS };
    setForm(reset);
    updateSettings(reset);
    toast.success('Plantillas restauradas a valores por defecto');
  };

  const VARS = [
    { v: '{cliente}',   desc: 'Nombre del cliente' },
    { v: '{fecha}',     desc: 'Fecha de la cita' },
    { v: '{hora}',      desc: 'Hora de la cita' },
    { v: '{servicio}',  desc: 'Servicio reservado' },
    { v: '{empleado}',  desc: 'Nombre del barbero' },
    { v: '{precio}',    desc: 'Precio del servicio' },
    { v: '{negocio}',   desc: 'Nombre de tu negocio' },
    { v: '{direccion}', desc: 'Dirección del negocio' },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div className="fade-in">
        <h2 className="text-xl font-bold text-white">Configuración</h2>
        <p className="text-white/40 text-sm">Negocio y mensajes WhatsApp</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-100 rounded-2xl p-1 fade-in">
        {([
          { key: 'general',  label: 'Mi Negocio', icon: Store },
          { key: 'whatsapp', label: 'WhatsApp',   icon: MessageCircle },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5
              ${tab === t.key ? 'bg-gold-600 text-black' : 'text-white/50 hover:text-white/80'}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── GENERAL TAB ── */}
      {tab === 'general' && (
        <div className="flex flex-col gap-4 fade-in">
          <div className="card p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Store size={15} className="text-gold-400" />
              <h3 className="font-semibold text-white">Datos del negocio</h3>
            </div>

            <div>
              <label className="label">Nombre de la peluquería</label>
              <input className="input" placeholder="Ej. BarberPro Estudio" value={form.barberName}
                onChange={e => set('barberName', e.target.value)} />
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <Phone size={12} className="text-gold-400" /> Teléfono / WhatsApp del negocio
              </label>
              <input className="input" type="tel"
                placeholder="Ej. 525551234567 (con código de país, sin +)"
                value={form.barberPhone}
                onChange={e => set('barberPhone', e.target.value)} />
              <p className="text-white/30 text-xs mt-1">
                Incluye código de país sin + (México = 52, España = 34)
              </p>
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <MapPin size={12} className="text-gold-400" /> Dirección
              </label>
              <input className="input" placeholder="Ej. Calle Principal 123, Ciudad"
                value={form.barberAddress}
                onChange={e => set('barberAddress', e.target.value)} />
            </div>
          </div>

          {/* WhatsApp API info card */}
          <div className="card p-4 border border-blue-500/20 bg-blue-500/5 fade-in">
            <div className="flex items-start gap-3">
              <MessageCircle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm mb-1">Preparado para WhatsApp Business API</p>
                <p className="text-white/50 text-xs leading-relaxed">
                  La arquitectura está lista para integrar WhatsApp Business API oficial (Meta). 
                  Actualmente los mensajes se generan via <span className="text-blue-400">wa.me</span> (gratuito). 
                  Para automatización completa, conecta tu API Key de Meta en el futuro sin modificar el sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WHATSAPP TAB ── */}
      {tab === 'whatsapp' && (
        <div className="flex flex-col gap-4 fade-in">
          {/* Variables reference */}
          <div className="card p-4">
            <p className="text-gold-400 text-sm font-semibold mb-3 flex items-center gap-1.5">
              <MessageCircle size={13} /> Variables disponibles
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {VARS.map(v => (
                <div key={v.v} className="flex items-center justify-between bg-dark-300/60 rounded-lg px-3 py-1.5">
                  <code className="text-gold-400 text-xs font-mono">{v.v}</code>
                  <span className="text-white/40 text-xs">{v.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation */}
          <div className="card p-4">
            <label className="label text-sm font-semibold text-white flex items-center gap-1.5 mb-3">
              ✅ Mensaje de confirmación
            </label>
            <textarea
              className="input resize-none font-mono text-xs leading-relaxed"
              rows={5}
              value={form.whatsappConfirmTemplate}
              onChange={e => set('whatsappConfirmTemplate', e.target.value)}
            />
          </div>

          {/* Reminder */}
          <div className="card p-4">
            <label className="label text-sm font-semibold text-white flex items-center gap-1.5 mb-3">
              🔔 Mensaje de recordatorio
            </label>
            <textarea
              className="input resize-none font-mono text-xs leading-relaxed"
              rows={5}
              value={form.whatsappReminderTemplate}
              onChange={e => set('whatsappReminderTemplate', e.target.value)}
            />
          </div>

          {/* Thanks */}
          <div className="card p-4">
            <label className="label text-sm font-semibold text-white flex items-center gap-1.5 mb-3">
              🙏 Mensaje de agradecimiento
            </label>
            <textarea
              className="input resize-none font-mono text-xs leading-relaxed"
              rows={4}
              value={form.whatsappThanksTemplate}
              onChange={e => set('whatsappThanksTemplate', e.target.value)}
            />
          </div>

          {/* Reset */}
          <button onClick={handleReset}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:text-white/80 transition-colors">
            <RotateCcw size={14} /> Restaurar plantillas por defecto
          </button>
        </div>
      )}

      {/* Save */}
      <button onClick={handleSave} className="btn-primary py-3 flex items-center justify-center gap-2 sticky bottom-24 w-full">
        <Save size={16} /> Guardar configuración
      </button>
    </div>
  );
}
