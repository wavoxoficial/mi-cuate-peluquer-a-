import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Booking } from '../../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Modal from '../ui/Modal';
import ClientForm from '../clients/ClientForm';

interface Props {
  onClose: () => void;
  onSuccess: (b: Booking) => void;
}

export default function BookingForm({ onClose, onSuccess }: Props) {
  const { clients, employees, services, addBooking } = useStore();
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

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const h = 8 + Math.floor(i / 2);
    const m = i % 2 === 0 ? '00' : '30';
    if (h >= 20) return null;
    return `${String(h).padStart(2, '0')}:${m}`;
  }).filter(Boolean) as string[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId)   { toast.error('Selecciona un cliente');   return; }
    if (!form.serviceId)  { toast.error('Selecciona un servicio');  return; }
    if (!form.employeeId) { toast.error('Selecciona un empleado');  return; }

    const booking = addBooking({
      clientId:     form.clientId,
      clientName:   selectedClient!.name,
      clientPhone:  selectedClient!.phone ?? '',
      employeeId:   form.employeeId,
      employeeName: selectedEmp!.name,
      serviceId:    form.serviceId,
      serviceName:  selectedService!.name,
      servicePrice: selectedService!.price,
      date:         form.date,
      time:         form.time,
      status:       'confirmed',
      notes:        form.notes,
    });

    toast.success('¡Reserva creada! 🎉');
    onSuccess(booking);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Client */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0">Cliente *</label>
            <button type="button" onClick={() => setShowNewClient(true)}
              className="text-gold-400 text-xs font-medium hover:underline">
              + Nuevo cliente
            </button>
          </div>
          <select className="input" value={form.clientId} onChange={e => set('clientId', e.target.value)}>
            <option value="">Seleccionar cliente...</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}{c.phone ? ` — ${c.phone}` : ''}</option>
            ))}
          </select>
          {/* Show phone of selected client */}
          {selectedClient?.phone && (
            <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
              📱 {selectedClient.phone}
              {!selectedClient.phone && <span className="text-yellow-500/70"> — Sin teléfono (no recibirá WhatsApp)</span>}
            </p>
          )}
          {selectedClient && !selectedClient.phone && (
            <p className="text-xs text-yellow-500/70 mt-1">⚠️ Sin teléfono — no recibirá mensajes WhatsApp</p>
          )}
        </div>

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
            <label className="label">Hora *</label>
            <select className="input" value={form.time} onChange={e => set('time', e.target.value)}>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="label">Notas (opcional)</label>
          <textarea className="input resize-none" rows={2} placeholder="Alguna indicación especial..."
            value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        {/* Summary */}
        {selectedService && selectedClient && (
          <div className="bg-gold-600/10 border border-gold-600/20 rounded-2xl p-4">
            <p className="text-gold-400 font-semibold text-sm mb-2">Resumen de reserva</p>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between"><span className="text-white/50">Cliente</span><span className="text-white">{selectedClient.name}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Servicio</span><span className="text-white">{selectedService.name}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Fecha</span><span className="text-white">{form.date} {form.time}</span></div>
              <div className="flex justify-between border-t border-gold-600/20 mt-1 pt-1">
                <span className="text-white/50">Total</span>
                <span className="text-gold-400 font-bold">${selectedService.price}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          <button type="submit" className="btn-primary flex-1">Confirmar Reserva</button>
        </div>
      </form>

      <Modal open={showNewClient} onClose={() => setShowNewClient(false)} title="Nuevo Cliente">
        <ClientForm client={null} onClose={() => setShowNewClient(false)} />
      </Modal>
    </>
  );
}
