import { useState } from 'react';
import { Client } from '../../types';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface Props {
  client: Client | null;
  onClose: () => void;
}

export default function ClientForm({ client, onClose }: Props) {
  const { addClient, updateClient } = useStore();
  const [form, setForm] = useState({
    name:  client?.name  ?? '',
    phone: client?.phone ?? '',
    email: client?.email ?? '',
    notes: client?.notes ?? '',
  });

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('El nombre es obligatorio'); return; }
    if (client) {
      updateClient(client.id, form);
      toast.success('Cliente actualizado ✓');
    } else {
      addClient(form);
      toast.success('Cliente registrado ✓');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="label">Nombre completo *</label>
        <input className="input" placeholder="Nombre del cliente" value={form.name} onChange={e => set('name', e.target.value)} />
      </div>
      <div>
        <label className="label">Teléfono</label>
        <input className="input" type="tel" placeholder="+52 555 000 0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={e => set('email', e.target.value)} />
      </div>
      <div>
        <label className="label">Notas</label>
        <textarea className="input resize-none" rows={3} placeholder="Preferencias, alergias, etc." value={form.notes} onChange={e => set('notes', e.target.value)} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
        <button type="submit" className="btn-primary flex-1">{client ? 'Guardar cambios' : 'Registrar cliente'}</button>
      </div>
    </form>
  );
}
