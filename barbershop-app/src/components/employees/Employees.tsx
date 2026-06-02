import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Employee } from '../../types';
import { Plus, UserCog, Pencil, Trash2, ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react';
import Modal from '../ui/Modal';
import EmployeeForm from './EmployeeForm';
import toast from 'react-hot-toast';

const DAYS: { key: keyof Employee['schedule']; label: string }[] = [
  { key: 'monday',    label: 'Lun' },
  { key: 'tuesday',   label: 'Mar' },
  { key: 'wednesday', label: 'Mié' },
  { key: 'thursday',  label: 'Jue' },
  { key: 'friday',    label: 'Vie' },
  { key: 'saturday',  label: 'Sáb' },
  { key: 'sunday',    label: 'Dom' },
];

export default function Employees() {
  const { employees, deleteEmployee, updateEmployee } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleDelete = (e: Employee) => {
    if (confirm(`¿Eliminar a ${e.name}?`)) {
      deleteEmployee(e.id);
      toast.success('Empleado eliminado');
    }
  };

  const toggleActive = (e: Employee) => {
    updateEmployee(e.id, { isActive: !e.isActive });
    toast.success(e.isActive ? 'Empleado desactivado' : 'Empleado activado');
  };

  return (
    <div className="page">
      <div className="flex items-center justify-between fade-in">
        <div>
          <h2 className="text-xl font-bold text-white">Empleados</h2>
          <p className="text-white/40 text-sm">{employees.filter(e => e.isActive).length} activos</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={16} /> Agregar
        </button>
      </div>

      <div className="flex flex-col gap-3 fade-in">
        {employees.length === 0 && (
          <div className="card p-10 text-center">
            <UserCog size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/30">No hay empleados registrados</p>
          </div>
        )}
        {employees.map(emp => {
          const isOpen = expanded === emp.id;
          return (
            <div key={emp.id} className={`card overflow-hidden ${!emp.isActive ? 'opacity-60' : ''}`}>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-600/30 to-gold-800/20 border border-gold-600/20 flex items-center justify-center text-gold-400 font-bold text-lg flex-shrink-0">
                      {emp.avatar || emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{emp.name}</p>
                      <p className="text-sm text-gold-400/80">{emp.role}</p>
                      {!emp.isActive && <span className="badge bg-red-500/15 text-red-400 text-[10px] mt-0.5">Inactivo</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleActive(emp)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${emp.isActive ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>
                      <div className={`w-3 h-3 rounded-full ${emp.isActive ? 'bg-green-400' : 'bg-white/20'}`} />
                    </button>
                    <button onClick={() => { setEditing(emp); setShowForm(true); }}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-gold-400 hover:bg-gold-600/10 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(emp)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                    <button onClick={() => setExpanded(isOpen ? null : emp.id)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                      {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-1">
                  {emp.phone && <div className="flex items-center gap-2 text-sm text-white/40"><Phone size={11} /><span>{emp.phone}</span></div>}
                  {emp.email && <div className="flex items-center gap-2 text-sm text-white/40"><Mail size={11} /><span>{emp.email}</span></div>}
                </div>
              </div>

              {/* Schedule */}
              {isOpen && (
                <div className="border-t border-white/5 bg-dark-300/40 p-4">
                  <h4 className="text-sm font-semibold text-white/60 mb-3">Horario semanal</h4>
                  <div className="grid grid-cols-7 gap-1">
                    {DAYS.map(({ key, label }) => {
                      const day = emp.schedule[key];
                      return (
                        <div key={key} className={`rounded-xl p-2 text-center ${day.isWorking ? 'bg-gold-600/10 border border-gold-600/20' : 'bg-white/3'}`}>
                          <p className={`text-[10px] font-semibold mb-1 ${day.isWorking ? 'text-gold-400' : 'text-white/20'}`}>{label}</p>
                          {day.isWorking ? (
                            <>
                              <p className="text-[9px] text-white/70 leading-tight">{day.start}</p>
                              <p className="text-[9px] text-white/40 leading-tight">{day.end}</p>
                            </>
                          ) : (
                            <p className="text-[9px] text-white/20">—</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar Empleado' : 'Nuevo Empleado'}>
        <EmployeeForm employee={editing} onClose={() => setShowForm(false)} />
      </Modal>
    </div>
  );
}
