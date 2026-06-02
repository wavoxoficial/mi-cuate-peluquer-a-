import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Service, ServiceCategory } from '../../types';
import { Plus, Scissors, Pencil, Trash2, Clock, DollarSign } from 'lucide-react';
import Modal from '../ui/Modal';
import ServiceForm from './ServiceForm';
import toast from 'react-hot-toast';

const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  'Corte':       'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'Barba':       'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'Color':       'bg-purple-500/15 text-purple-400 border-purple-500/20',
  'Tratamiento': 'bg-green-500/15 text-green-400 border-green-500/20',
  'Combo':       'bg-gold-600/15 text-gold-400 border-gold-600/20',
  'Otro':        'bg-white/10 text-white/50 border-white/10',
};

const CATEGORIES: ServiceCategory[] = ['Corte', 'Barba', 'Color', 'Tratamiento', 'Combo', 'Otro'];

export default function Services() {
  const { services, deleteService, updateService } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [filter, setFilter] = useState<ServiceCategory | 'Todos'>('Todos');

  const filtered = services.filter(s => filter === 'Todos' || s.category === filter);

  const handleDelete = (s: Service) => {
    if (confirm(`¿Eliminar "${s.name}"?`)) {
      deleteService(s.id);
      toast.success('Servicio eliminado');
    }
  };

  const toggleActive = (s: Service) => {
    updateService(s.id, { isActive: !s.isActive });
  };

  return (
    <div className="page">
      <div className="flex items-center justify-between fade-in">
        <div>
          <h2 className="text-xl font-bold text-white">Servicios</h2>
          <p className="text-white/40 text-sm">{services.filter(s => s.isActive).length} activos</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 fade-in">
        {(['Todos', ...CATEGORIES] as const).map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
              filter === cat ? 'bg-gold-600 border-gold-600 text-black' : 'bg-dark-100 border-white/10 text-white/50'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 gap-3 fade-in">
        {filtered.length === 0 && (
          <div className="card p-10 text-center">
            <Scissors size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/30">No hay servicios en esta categoría</p>
          </div>
        )}
        {filtered.map(svc => (
          <div key={svc.id} className={`card p-4 ${!svc.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{svc.name}</h3>
                  <span className={`badge border text-[10px] ${CATEGORY_COLORS[svc.category]}`}>{svc.category}</span>
                </div>
                {svc.description && <p className="text-white/40 text-sm mb-3">{svc.description}</p>}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <DollarSign size={13} className="text-gold-400" />
                    <span className="text-gold-400 font-bold">${svc.price}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock size={13} className="text-white/40" />
                    <span className="text-white/50">{svc.duration} min</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-3">
                <button onClick={() => toggleActive(svc)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${svc.isActive ? 'bg-green-500/10' : 'bg-white/5'}`}>
                  <div className={`w-3 h-3 rounded-full ${svc.isActive ? 'bg-green-400' : 'bg-white/20'}`} />
                </button>
                <button onClick={() => { setEditing(svc); setShowForm(true); }}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-gold-400 hover:bg-gold-600/10 transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(svc)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar Servicio' : 'Nuevo Servicio'}>
        <ServiceForm service={editing} onClose={() => setShowForm(false)} />
      </Modal>
    </div>
  );
}
