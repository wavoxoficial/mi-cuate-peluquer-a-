import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore, notifTemplates } from '../../store/useNotificationStore';
import { Booking } from '../../types';
import { Plus, CalendarCheck, ChevronDown, ChevronUp, CheckCircle, XCircle, MessageCircle, Clock } from 'lucide-react';
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
  const session  = useAuthStore(s => s.session);
  const { add: addNotif } = useNotificationStore();
  const [tab, setTab]           = useState<Tab>('today');
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newBooking, setNewBooking] = useState<Booking | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');
  const role  = session?.role ?? 'client';

  const myClientId = role === 'client'
    ? clients.find(c => c.email === session?.email || c.name.toLowerCase() === session?.name.toLowerCase())?.id
    : null;

  const filtered = bookings.filter(b => {
    if (role === 'client' && myClientId && b.clientId !== myClientId) return false;
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
    addNotif(notifTemplates.completed(b.clientName, b.serviceName, b.servicePrice));
    toast.success('¡Cita completada! 💰');
  };

  const handleCancel = (b: Booking) => {
    if (confirm('¿Cancelar esta reserva?')) {
      cancelBooking(b.id);
      addNotif(notifTemplates.cancelled(b.clientName, format(new Date(b.date + 'T00:00:00'), "d 'de' MMM", { locale: es })));
      toast.error('Reserva cancelada');
    }
  };

  const handleBookingSuccess = (b: Booking) => {
    setShowForm(false);
    setNewBooking(b);
    addNotif(notifTemplates.newBooking(b.clientName, b.time, b.serviceName));
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
          <h2 className="text-xl font-black text-white">{role === 'client' ? 'Mis Citas' : 'Reservas'}</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {todayCount} {todayCount === 1 ? 'cita' : 'citas'} hoy
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
          <Plus size={14} />
          {role === 'client' ? 'Nueva cita' : 'Reservar'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl fade-in" style={{ background: 'rgba(22,22,24,0.9)', border: '1px solid rgba(255,255,255,0.05)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={tab === t.key
              ? { background: 'linear-gradient(135deg,#c9981a,#f0c040)', color: '#000', boxShadow: '0 0 16px rgba(201,152,26,0.3)' }
              : { color: 'rgba(255,255,255,0.38)' }
            }>
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3 fade-in">
        {filtered.length === 0 && (
          <div className="card p-10 text-center">
            <CalendarCheck size={32} className="mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.12)' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {tab === 'today' ? 'Sin citas para hoy' : tab === 'upcoming' ? 'Sin citas próximas' : 'Sin reservas registradas'}
            </p>
            {role === 'client' && (
              <button onClick={() => setShowForm(true)} className="btn-primary mt-4 text-sm">
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
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(201,152,26,0.18), rgba(201,152,26,0.06))',
                        color: '#c9981a',
                        border: '1px solid rgba(201,152,26,0.18)',
                      }}>
                      {b.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm leading-tight truncate">{b.clientName}</p>
                      <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{b.serviceName}</p>
                      {hasPhone && canManage && (
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>📱 {b.clientPhone}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-black leading-tight" style={{ color: '#c9981a' }}>{b.time}</p>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                      {format(new Date(b.date + 'T00:00:00'), 'd MMM', { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <StatusBadge status={b.status} />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black" style={{ color: '#c9981a' }}>${b.servicePrice}</span>
                    <button onClick={() => setExpanded(isOpen ? null : b.id)} className="icon-btn">
                      {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div className="border-t p-4 flex flex-col gap-3" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(13,13,15,0.4)' }}>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Empleado', value: b.employeeName },
                      { label: 'Precio', value: `$${b.servicePrice}`, gold: true },
                      ...(b.serviceDuration ? [{ label: 'Duración', value: `${b.serviceDuration} min` }] : []),
                      { label: 'Creada', value: format(new Date(b.createdAt), 'd MMM', { locale: es }) },
                    ].map(row => (
                      <div key={row.label}>
                        <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{row.label}</p>
                        <p className="text-sm font-semibold" style={{ color: (row as any).gold ? '#c9981a' : 'rgba(255,255,255,0.85)' }}>{row.value}</p>
                      </div>
                    ))}
                  </div>

                  {b.notes && (
                    <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Nota:</span> {b.notes}
                      </p>
                    </div>
                  )}

                  {/* WhatsApp */}
                  {canManage && (
                    hasPhone ? (
                      <div className="rounded-xl p-3" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wide mb-2 flex items-center gap-1" style={{ color: 'rgba(34,197,94,0.6)' }}>
                          <MessageCircle size={10} /> WhatsApp
                        </p>
                        <div className="flex flex-col gap-1.5">
                          <a href={confirmationLink(b, settings)} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold active:scale-95 transition-all"
                            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.18)', color: '#4ade80' }}>
                            <MessageCircle size={11} /> ✅ Confirmación
                          </a>
                          {b.status !== 'completed' && (
                            <a href={reminderLink(b, settings)} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold active:scale-95 transition-all"
                              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.18)', color: '#60a5fa' }}>
                              <MessageCircle size={11} /> 🔔 Recordatorio
                            </a>
                          )}
                          {b.status === 'completed' && (
                            <a href={thanksLink(b, settings)} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold active:scale-95 transition-all"
                              style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.18)', color: '#c084fc' }}>
                              <MessageCircle size={11} /> 🙏 Agradecimiento
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}>
                        <p className="text-xs" style={{ color: 'rgba(245,158,11,0.5)' }}>⚠️ Sin teléfono — agrega teléfono al cliente para WhatsApp</p>
                      </div>
                    )
                  )}

                  {/* Actions */}
                  {isCancellable && (
                    canManage ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleComplete(b)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all"
                          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>
                          <CheckCircle size={14} /> Completar
                        </button>
                        <button onClick={() => handleCancel(b)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all"
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                          <XCircle size={14} /> Cancelar
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleCancel(b)}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
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
        <BookingForm onClose={() => setShowForm(false)} onSuccess={handleBookingSuccess} />
      </Modal>

      {newBooking && (
        <BookingConfirmation booking={newBooking} onClose={() => setNewBooking(null)} />
      )}
    </div>
  );
}
