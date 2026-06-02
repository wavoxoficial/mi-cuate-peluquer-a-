import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Booking } from '../../types';
import { Plus, CalendarCheck, ChevronDown, ChevronUp, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Modal from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';
import toast from 'react-hot-toast';
import { confirmationLink, reminderLink, thanksLink } from '../../utils/whatsapp';

type Tab = 'today' | 'upcoming' | 'all';

export default function Bookings() {
  const { bookings, completeBooking, cancelBooking, settings } = useStore();
  const [tab, setTab]         = useState<Tab>('today');
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newBooking, setNewBooking] = useState<Booking | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');
  const now   = format(new Date(), 'HH:mm');

  const filtered = bookings.filter(b => {
    if (tab === 'today')    return b.date === today && b.status !== 'cancelled';
    if (tab === 'upcoming') return b.date > today && b.status !== 'cancelled';
    return true;
  }).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  const handleComplete = (b: Booking) => {
    completeBooking(b.id);
    toast.success('¡Cita completada! Ingresos actualizados 💰');
  };
  const handleCancel = (b: Booking) => {
    if (confirm('¿Cancelar esta reserva?')) {
      cancelBooking(b.id);
      toast.error('Reserva cancelada');
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'today',    label: 'Hoy' },
    { key: 'upcoming', label: 'Próximas' },
    { key: 'all',      label: 'Todas' },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between fade-in">
        <div>
          <h2 className="text-xl font-bold text-white">Reservas</h2>
          <p className="text-white/40 text-sm">
            {bookings.filter(b => b.date === today && b.status !== 'cancelled').length} citas hoy
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={16} /> Reservar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-100 rounded-2xl p-1 fade-in">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${tab === t.key ? 'bg-gold-600 text-black' : 'text-white/50 hover:text-white/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Booking list */}
      <div className="flex flex-col gap-3 fade-in">
        {filtered.length === 0 && (
          <div className="card p-10 text-center">
            <CalendarCheck size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/30">No hay reservas</p>
          </div>
        )}

        {filtered.map(b => {
          const isOpen   = expanded === b.id;
          const hasPhone = !!b.clientPhone;

          return (
            <div key={b.id} className="card overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-600/20 flex items-center justify-center text-gold-400 font-bold flex-shrink-0">
                      {b.clientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{b.clientName}</p>
                      <p className="text-sm text-white/50">{b.serviceName}</p>
                      {hasPhone && (
                        <p className="text-xs text-white/30 mt-0.5">📱 {b.clientPhone}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gold-400 font-bold text-lg">{b.time}</p>
                    <p className="text-white/30 text-xs">
                      {format(new Date(b.date + 'T00:00:00'), 'd MMM', { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <StatusBadge status={b.status} />
                  <div className="flex items-center gap-1.5">
                    <span className="text-gold-400 font-bold text-sm">${b.servicePrice}</span>
                    <button onClick={() => setExpanded(isOpen ? null : b.id)}
                      className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                      {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div className="border-t border-white/5 bg-dark-300/40 p-4 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Empleado</p>
                      <p className="text-sm text-white font-medium">{b.employeeName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Precio</p>
                      <p className="text-sm text-gold-400 font-bold">${b.servicePrice}</p>
                    </div>
                  </div>

                  {b.notes && (
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-white/50">
                        <span className="text-white/80 font-medium">Nota:</span> {b.notes}
                      </p>
                    </div>
                  )}

                  {/* WhatsApp buttons */}
                  {hasPhone ? (
                    <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-3">
                      <p className="text-xs text-green-400/70 font-medium mb-2 flex items-center gap-1">
                        <MessageCircle size={11} /> Mensajes WhatsApp
                      </p>
                      <div className="flex flex-col gap-2">
                        <a href={confirmationLink(b, settings)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-3 py-2 text-xs font-medium active:scale-95 transition-all">
                          <MessageCircle size={12} /> ✅ Enviar confirmación
                        </a>
                        {b.status !== 'completed' && (
                          <a href={reminderLink(b, settings)} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl px-3 py-2 text-xs font-medium active:scale-95 transition-all">
                            <MessageCircle size={12} /> 🔔 Enviar recordatorio
                          </a>
                        )}
                        {b.status === 'completed' && (
                          <a href={thanksLink(b, settings)} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl px-3 py-2 text-xs font-medium active:scale-95 transition-all">
                            <MessageCircle size={12} /> 🙏 Enviar agradecimiento
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-3 py-2">
                      <p className="text-xs text-yellow-500/60">⚠️ Sin teléfono — agrega el teléfono al cliente para activar WhatsApp</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  {b.status !== 'completed' && b.status !== 'cancelled' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleComplete(b)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20 active:scale-95 transition-all">
                        <CheckCircle size={14} /> Completada
                      </button>
                      <button onClick={() => handleCancel(b)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 active:scale-95 transition-all">
                        <XCircle size={14} /> Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Nueva Reserva">
        <BookingForm
          onClose={() => setShowForm(false)}
          onSuccess={b => { setShowForm(false); setNewBooking(b); }}
        />
      </Modal>

      {newBooking && (
        <BookingConfirmation booking={newBooking} onClose={() => setNewBooking(null)} />
      )}
    </div>
  );
}
