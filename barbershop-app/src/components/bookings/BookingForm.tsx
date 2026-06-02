import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Booking } from '../../types';
import toast from 'react-hot-toast';
import { format, addMinutes, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Modal from '../ui/Modal';
import ClientForm from '../clients/ClientForm';

interface Props {
  onClose: () => void;
  onSuccess: (b: Booking) => void;
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export default function BookingForm({ onClose, onSuccess }: Props) {
  const { clients, employees, services, bookings, addBooking, addClient } = useStore();
  const session = useAuthStore(s => s.session);
  const [showNewClient, setShowNewClient] = useState(false);
  const [form, setForm] = useState({
    clientId:   '',
    employeeId: '',
    serviceId:  '',
    date:       format(new Date(), 'yyyy-MM-dd'),
    time:       '10:00',
    notes:      '',
  });

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const activeServices  = services.filter(s => s.isActive);
  const activeEmployees = employees.filter(e => e.isActive);

  const selectedClient  = clients.find(c => c.id === form.clientId);
  const selectedService = activeServices.find(s => s.id === form.serviceId);
  const selectedEmp     = activeEmployees.find(e => e.id === form.employeeId);

  // ── Auto-select logged-in client ─────────────────────────────────────────
  const loggedClient = useMemo(() => {
    if (session?.role !== 'client') return null;
    return clients.find(c =>
      c.email === session.email ||
      c.name.toLowerCase() === session.name.toLowerCase()
    ) ?? null;
  }, [session, clients]);

  const effectiveClientId = session?.role === 'client' ? (loggedClient?.id ?? '') : form.clientId;

  // ── Blocked time slots for selected employee on selected date ─────────────
  const blockedSlots = useMemo(() => {
    if (!form.employeeId || !form.date) return new Set<string>();
    const existing = bookings.filter(b =>
      b.employeeId === form.employeeId &&
      b.date       === form.date &&
      b.status !== 'cancelled' &&
      b.status !== 'completed'
    );
    const blocked = new Set<string>();
    existing.forEach(b => {
      const startMin = timeToMinutes(b.time);
      const dur      = b.serviceDuration ?? 30;
      // Block the slot itself plus any overlapping slots
      for (let m = startMin - 15; m < startMin + dur; m += 30) {
        if (m < 0) continue;
        const hh = String(Math.floor(m / 60)).padStart(2, '0');
        const mm = String(m % 60).padStart(2, '0');
        blocked.add(`${hh}:${mm}`);
      }
    });
    return blocked;
  }, [form.employeeId, form.date, bookings]);

  // ── Check for duplicate (same client, same date) ──────────────────────────
  const hasDuplicate = useMemo(() => {
    const cid = effectiveClientId;
    if (!cid || !form.date) return false;
    return bookings.some(b =>
      b.clientId === cid &&
      b.date     === form.date &&
      b.status !== 'cancelled' &&
      b.status !== 'completed'
    );
  }, [effectiveClientId, form.date, bookings]);

  // ── Time slot availability indicator ─────────────────────────────────────
  const isSelectedBlocked = blockedSlots.has(form.time);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 8; h < 20; h++) {
      for (const m of ['00', '30']) {
        slots.push(`${String(h).padStart(2, '0')}:${m}`);
      }
    }
    return slots;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cid = effectiveClientId;
    if (!cid)             { toast.error('Selecciona un cliente');   return; }
    if (!form.serviceId)  { toast.error('Selecciona un servicio');  return; }
    if (!form.employeeId) { toast.error('Selecciona un empleado');  return; }

    if (isSelectedBlocked) {
      toast.error('Ese horario está ocupado para este empleado');
      return;
    }
    if (hasDuplicate) {
      const ok = window.confirm('Este cliente ya tiene una cita en esa fecha. ¿Continuar de todas formas?');
      if (!ok) return;
    }

    const client  = clients.find(c => c.id === cid)!;
    const booking = addBooking({
      clientId:       cid,
      clientName:     client.name,
      clientPhone:    client.phone ?? '',
      employeeId:     form.employeeId,
      employeeName:   selectedEmp!.name,
      serviceId:      form.serviceId,
      serviceName:    selectedService!.name,
      servicePrice:   selectedService!.price,
      serviceDuration: selectedService!.duration,
      date:           form.date,
      time:           form.time,
      status:         'confirmed',
      notes:          form.notes,
    });

    toast.success('¡Reserva creada! 🎉');
    onSuccess(booking);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Client selector — hidden for logged-in clients */}
        {session?.role !== 'client' ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Cliente *</label>
              <button type="button" onClick={() => setShowNewClient(true)}
                className="text-gold-400 text-xs font-medium">
                + Nuevo cliente
              </button>
            </div>
            <select className="input" value={form.clientId} onChange={e => set('clientId', e.target.value)}>
              <option value="">Seleccionar cliente...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}{c.phone ? ` — ${c.phone}` : ''}</option>
              ))}
            </select>
            {selectedClient?.phone && (
              <p className="text-xs text-white/40 mt-1">📱 {selectedClient.phone}</p>
            )}
            {selectedClient && !selectedClient.phone && (
              <p className="text-xs text-yellow-500/70 mt-1">⚠️ Sin teléfono — no recibirá WhatsApp</p>
            )}
          </div>
        ) : (
          <div className="bg-dark-300 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-white/30 text-sm">Cliente</span>
            <span className="text-white font-medium text-sm ml-auto">{session.name}</span>
          </div>
        )}

        {/* Duplicate warning */}
        {hasDuplicate && (
          <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2.5">
            <AlertCircle size={15} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-400 text-xs">Este cliente ya tiene una cita para esta fecha</p>
          </div>
        )}

        {/* Service */}
        <div>
          <label className="label">Servicio *</label>
          <select className="input" value={form.serviceId} onChange={e => set('serviceId', e.target.value)}>
            <option value="">Seleccionar servicio...</option>
            {activeServices.map(s => (
              <option key={s.id} value={s.id}>{s.name} — ${s.price} ({s.duration} min)</option>
            ))}
          </select>
        </div>

        {/* Employee */}
        <div>
          <label className="label">Empleado *</label>
          <select className="input" value={form.employeeId} onChange={e => set('employeeId', e.target.value)}>
            <option value="">Seleccionar empleado...</option>
            {activeEmployees.map(e => (
              <option key={e.id} value={e.id}>{e.name} — {e.role}</option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Fecha *</label>
            <input type="date" className="input" value={form.date}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={e => set('date', e.target.value)} />
          </div>
          <div>
            <label className="label">
              Hora *{' '}
              {form.employeeId && (
                <span className="text-white/30 font-normal">
                  ({blockedSlots.size} ocupadas)
                </span>
              )}
            </label>
            <select className="input" value={form.time} onChange={e => set('time', e.target.value)}
              style={{ color: isSelectedBlocked ? '#f87171' : undefined }}>
              {timeSlots.map(t => {
                const blocked = blockedSlots.has(t);
                return (
                  <option key={t} value={t} disabled={blocked}>
                    {blocked ? `${t} — ocupado` : t}
                  </option>
                );
              })}
            </select>
            {isSelectedBlocked && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> Horario ocupado — elige otro
              </p>
            )}
            {!isSelectedBlocked && form.employeeId && (
              <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                <CheckCircle size={11} /> Horario disponible
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="label">Notas (opcional)</label>
          <textarea className="input resize-none" rows={2} placeholder="Alguna indicación especial..."
            value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        {/* Summary */}
        {selectedService && (
          <div className="bg-gold-600/10 border border-gold-600/20 rounded-2xl p-4">
            <p className="text-gold-400 font-semibold text-sm mb-2">Resumen</p>
            <div className="flex flex-col gap-1.5 text-sm">
              {effectiveClientId && (
                <div className="flex justify-between">
                  <span className="text-white/50">Cliente</span>
                  <span className="text-white">{clients.find(c => c.id === effectiveClientId)?.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/50">Servicio</span>
                <span className="text-white">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Duración</span>
                <span className="text-white flex items-center gap-1"><Clock size={12} />{selectedService.duration} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Hora</span>
                <span className="text-white">{form.date} {form.time}</span>
              </div>
              <div className="flex justify-between border-t border-gold-600/20 mt-1 pt-1.5">
                <span className="text-white/50">Total</span>
                <span className="text-gold-400 font-bold">${selectedService.price}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 text-sm">Cancelar</button>
          <button type="submit" disabled={isSelectedBlocked}
            className="btn-primary flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            Confirmar Reserva
          </button>
        </div>
      </form>

      <Modal open={showNewClient} onClose={() => setShowNewClient(false)} title="Nuevo Cliente">
        <ClientForm client={null} onClose={() => setShowNewClient(false)} />
      </Modal>
    </>
  );
}
