import { useState } from 'react';
import { Service, ServiceCategory } from '../../types';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface Props { service: Service | null; onClose: () => void; }

const CATEGORIES: ServiceCategory[] = ['Corte', 'Barba', 'Color', 'Tratamiento', 'Combo', 'Otro'];

export default function ServiceForm({ service, onClose }: Props) {
  const { addService, updateService } = useStore();
  const [form, setForm] = useState({
    name:        service?.name        ?? '',
    description: service?.description ?? '',
    price:       service?.price       ?? 150,
    duration:    service?.duration    ?? 30,
    category:    service?.category    ?? 'Corte' as ServiceCategory,
    isActive:    service?.isActive    ?? true,
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('El nombre es obligatorio'); return; }
    if (service) {
      updateService(service.id, form);
      toast.success('Servicio actualizado ✓');
    } else {
      addService(form);
      toast.success('Servicio creado ✓');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="label">Nombre del servicio *</label>
        <input className="input" placeholder="Ej. Corte Clásico" value={form.name} onChange={e => set('name', e.target.value)} />
      </div>
      <div>
        <label className="label">Descripción</label>
        <textarea className="input resize-none" rows={2} placeholder="Descripción breve..." value={form.description} onChange={e => set('description', e.target.value)} />
      </div>
      <div>
        <label className="label">Categoría</label>
        <select className="input" value={form.category} onChange={e => set('category', e.target.value as ServiceCategory)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Precio ($)</label>
          <input className="input" type="number" min="0" step="10" value={form.price} onChange={e => set('price', Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Duración (min)</label>
          <input className="input" type="number" min="5" step="5" value={form.duration} onChange={e => set('duration', Number(e.target.value))} />
        </div>
      </div>
      <div className="flex items-center justify-between bg-dark-300/60 rounded-xl px-4 py-3">
        <span className="text-sm text-white/60">Servicio activo</span>
        <button type="button" onClick={() => set('isActive', !form.isActive)}
          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.isActive ? 'bg-gold-600' : 'bg-white/10'}`}>
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${form.isActive ? 'left-6' : 'left-0.5'}`} />
        </button>
      </div>
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
        <button type="submit" className="btn-primary flex-1">{service ? 'Guardar' : 'Crear servicio'}</button>
      </div>
    </form>
  );
}
