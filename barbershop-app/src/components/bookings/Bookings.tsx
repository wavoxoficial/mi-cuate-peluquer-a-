import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
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
  const { bookings, completeBooking, cancelBooking, settings, clients } = useStore();
  const session = useAuthStore(s => s.session);
  const [tab, setTab]         = useState<Tab>('today');
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newBooking, setNewBooking] = useState<Booking | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');
  const role  = session?.role ?? 'client';

  // Filter by role
  const myClientId = role === 'client'
    ? clients.find(c => c.email === session?.email || c.name.toLowerCase() === session?.name.toLowerCase())?.id
    : null;

  const filtered = bookings.filter(b => {
    // Role filter first
    if (role === 'client' && myClientId && b.clientId !== myClientId) return false;
    // Tab filter
    if (tab === 'today')    return b.date === today && b.status !== 'cancelled';
    if (tab === 'upcoming') return b.date > today   && b.status !== 'cancelled';
    return true;
  }).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  const todayCount = bookings.filter(b => {
    if (role === 'client' && myClientId && b.clientId !== myClientId) return false;
    return b.date === today && b.status !== 'cancelled';
  }).length;

  const handleComplete = (b: Booking) => {
    completeBooking(b.id);
    toast.success('¡Cita completada! 💰');
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

  const canManage = role === 'admin' || role === 'employee';

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between fade-in">
        <div>
          <h2 className="text-xl font-bold text-white">
            {role === 'client' ? 'Mis Citas' : 'Reservas'}
          </h2>
          <p className="text-white/40 text-sm">
            {todayCount} {role === 'client' ? 'citas hoy' : 'citas hoy'}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2.5">
          <Plus size={15} />
          {role === 'client' ? 'Nueva cita' : 'Reservar'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-100 rounded-2xl p-1 fade-in">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
              ${tab === t.key ? 'bg-gold-600 text-black shadow-sm' : 'text-white/50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Booking list */}
      <div className="flex flex-col gap-3 fade-in">
        {filtered.length === 0 && (
          <div className="card p-10 text-center">
            <CalendarCheck size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-sm">
              {tab === 'today'
                ? 'Sin citas para hoy'
                : tab === 'upcoming'
                  ? 'Sin citas próximas'
                  : 'Sin reservas registradas'}
            </p>
            {role === 'client' && (
              <button onClick={() => setShowForm(true)}
                className="btn-primary mt-4 text-sm">
                <Plus size={14} /> Hacer una reserva
              </button>
            )}
          </div>
        )}

        {filtered.map(b => {
          const isOpen   = expanded === b.id;
          const hasPhone = !!b.clientPhone;
          const isCancellable = b.status !== 'completed' && b.status !== 'cancelled';

          return (
            <div key={b.id} className="card overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gold-600/20 flex items-center justify-center text-gold-400 font-bold flex-shrink-0 text-base">
                      {b.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm leading-tight truncate">{b.clientName}</p>
                      <p className="text-sm text-white/50 truncate">{b.serviceName}</p>
                      {hasPhone && canManage && (
                        <p className="text-xs text-white/25 mt-0.5">📱 {b.clientPhone}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gold-400 font-bold text-lg leading-tight">{b.time}</p>
                    <p className="text-white/30 text-xs">
                      {format(new Date(b.date + 'T00:00:00'), 'd MMM', { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <StatusBadge status={b.status} />
                  <div className="flex items-center gap-2">
                    <span className="text-gold-400 font-bold text-sm">${b.servicePrice}</span>
                    <button onClick={() => setExpanded(isOpen ? null : b.id)}
                      className="icon-btn">
                      {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-white/5 bg-dark-300/30 p-4 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-white/35 mb-0.5">Empleado</p>
                      <p className="text-sm text-white font-medium">{b.employeeName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35 mb-0.5">Precio</p>
                      <p className="text-sm text-gold-400 font-bold">${b.servicePrice}</p>
                    </div>
                    {b.serviceDuration && (
                      <div>
                        <p className="text-xs text-white/35 mb-0.5">Duración</p>
                        <p className="text-sm text-white">{b.serviceDuration} min</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-white/35 mb-0.5">Creada</p>
                      <p className="text-sm text-white">{format(new Date(b.createdAt), 'd MMM', { locale: es })}</p>
                    </div>
                  </div>

                  {b.notes && (
                    <div className="bg-white/4 rounded-xl p-3">
                      <p className="text-xs text-white/50"><span className="text-white/70 font-medium">Nota:</span> {b.notes}</p>
                    </div>
                  )}

                  {/* WhatsApp — admin/employee only */}
                  {canManage && (
                    hasPhone ? (
                      <div className="bg-green-500/5 border border-green-500/12 rounded-xl p-3">
                        <p className="text-xs text-green-400/70 font-medium mb-2 flex items-center gap-1">
                          <MessageCircle size={11} /> WhatsApp
                        </p>
                        <div className="flex flex-col gap-1.5">
                          <a href={confirmationLink(b, settings)} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-3 py-2 text-xs font-medium active:scale-95 transition-all">
                            <MessageCircle size={11} /> ✅ Confirmación
                          </a>
                          {b.status !== 'completed' && (
                            <a href={reminderLink(b, settings)} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl px-3 py-2 text-xs font-medium active:scale-95 transition-all">
                              <MessageCircle size={11} /> 🔔 Recordatorio
                            </a>
                          )}
                          {b.status === 'completed' && (
                            <a href={thanksLink(b, settings)} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl px-3 py-2 text-xs font-medium active:scale-95 transition-all">
                              <MessageCircle size={11} /> 🙏 Agradecimiento
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-500/5 border border-yellow-500/12 rounded-xl px-3 py-2">
                        <p className="text-xs text-yellow-500/55">⚠️ Sin teléfono — agrega el teléfono al cliente para WhatsApp</p>
                      </div>
                    )
                  )}

                  {/* Action buttons */}
                  {isCancellable && (
                    canManage ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleComplete(b)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20 active:scale-95 transition-all">
                          <CheckCircle size={14} /> Completar
                        </button>
                        <button onClick={() => handleCancel(b)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 active:scale-95 transition-all">
                          <XCircle size={14} /> Cancelar
                        </button>
                      </div>
                    ) : (
                      // Client can only cancel
                      <button onClick={() => handleCancel(b)}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 active:scale-95 transition-all">
                        <XCircle size={14} /> Cancelar cita
                      </button>
                    )
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
