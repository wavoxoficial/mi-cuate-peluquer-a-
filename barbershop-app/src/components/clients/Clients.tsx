import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Client } from '../../types';
import { Search, Plus, Phone, Mail, Star, Crown, ChevronDown, ChevronUp, Pencil, Trash2, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';
import ClientForm from './ClientForm';
import { clientWhatsappLink } from '../../utils/whatsapp';

export default function Clients() {
  const { clients, bookings, deleteClient, settings } = useStore();
  const [search,   setSearch]   = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<Client | null>(null);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getClientBookings = (clientId: string) =>
    bookings.filter(b => b.clientId === clientId).sort((a, b) => b.date.localeCompare(a.date));

  const handleDelete = (c: Client) => {
    if (confirm(`¿Eliminar a ${c.name}?`)) {
      deleteClient(c.id);
      toast.success('Cliente eliminado');
    }
  };

  const loyaltyTier = (points: number) => {
    if (points >= 100) return { label: 'VIP',      color: 'text-gold-400',   bg: 'bg-gold-600/15' };
    if (points >= 50)  return { label: 'Frecuente', color: 'text-purple-400', bg: 'bg-purple-500/15' };
    return               { label: 'Nuevo',      color: 'text-blue-400',   bg: 'bg-blue-500/15' };
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between fade-in">
        <div>
          <h2 className="text-xl font-bold text-white">Clientes</h2>
          <p className="text-white/40 text-sm">{clients.length} registrados</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {/* Search */}
      <div className="relative fade-in">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input className="input pl-9" placeholder="Buscar por nombre, teléfono o email..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Client list */}
      <div className="flex flex-col gap-3 fade-in">
        {filtered.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-white/30">No se encontraron clientes</p>
          </div>
        )}

        {filtered.map(client => {
          const tier   = loyaltyTier(client.loyaltyPoints);
          const isOpen = expanded === client.id;
          const clientBookings = getClientBookings(client.id);
          const hasPhone = !!client.phone;

          return (
            <div key={client.id} className="card overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gold-600/20 flex items-center justify-center text-gold-400 font-bold text-lg flex-shrink-0">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{client.name}</p>
                        {client.loyaltyPoints >= 100 && <Crown size={12} className="text-gold-400" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`badge ${tier.bg} ${tier.color}`}>{tier.label}</span>
                        <span className="text-white/40 text-xs">{client.loyaltyPoints} pts</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* WhatsApp button */}
                    {hasPhone && (
                      <a href={clientWhatsappLink(client.phone, client.name, settings)}
                        target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-colors"
                        title="Abrir WhatsApp">
                        <MessageCircle size={13} />
                      </a>
                    )}
                    <button onClick={() => { setEditing(client); setShowForm(true); }}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-gold-400 hover:bg-gold-600/10 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(client)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                    <button onClick={() => setExpanded(isOpen ? null : client.id)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50">
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Contact */}
                <div className="mt-3 flex flex-col gap-1.5">
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Phone size={12} /><span>{client.phone}</span>
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Mail size={12} /><span>{client.email}</span>
                    </div>
                  )}
                  {!hasPhone && (
                    <p className="text-xs text-yellow-500/50 flex items-center gap-1">
                      ⚠️ Sin teléfono — edita para agregar WhatsApp
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="bg-white/5 rounded-xl p-2 text-center">
                    <p className="text-gold-400 font-bold">{client.visitCount}</p>
                    <p className="text-white/40 text-[10px]">visitas</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 text-center">
                    <p className="text-gold-400 font-bold">${client.totalSpent.toLocaleString()}</p>
                    <p className="text-white/40 text-[10px]">gastado</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 text-center">
                    <p className="text-gold-400 font-bold text-xs">
                      {client.lastVisit
                        ? format(new Date(client.lastVisit + 'T00:00:00'), 'd MMM', { locale: es })
                        : '—'}
                    </p>
                    <p className="text-white/40 text-[10px]">última</p>
                  </div>
                </div>
              </div>

              {/* Expandable history */}
              {isOpen && (
                <div className="border-t border-white/5 bg-dark-300/50">
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-1.5">
                      <Star size={12} className="text-gold-400" /> Historial de visitas
                    </h4>
                    {client.notes && (
                      <div className="bg-gold-600/10 rounded-xl p-3 mb-3 border border-gold-600/20">
                        <p className="text-xs text-white/60">
                          <span className="text-gold-400 font-medium">Notas:</span> {client.notes}
                        </p>
                      </div>
                    )}
                    {clientBookings.length === 0 ? (
                      <p className="text-white/30 text-sm">Sin visitas registradas</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {clientBookings.slice(0, 5).map(b => (
                          <div key={b.id}
                            className="flex items-center justify-between bg-white/3 rounded-xl p-3">
                            <div>
                              <p className="text-sm text-white font-medium">{b.serviceName}</p>
                              <p className="text-xs text-white/40">{b.employeeName}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-white/50">
                                {format(new Date(b.date + 'T00:00:00'), 'd MMM yyyy', { locale: es })}
                              </p>
                              <p className="text-xs text-gold-400 font-semibold">${b.servicePrice}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)}
        title={editing ? 'Editar Cliente' : 'Nuevo Cliente'}>
        <ClientForm client={editing} onClose={() => setShowForm(false)} />
      </Modal>
    </div>
  );
}
