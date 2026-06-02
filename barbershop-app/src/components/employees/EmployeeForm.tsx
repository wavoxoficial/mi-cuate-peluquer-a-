import { useState } from 'react';
import { Employee, DaySchedule, WeeklySchedule } from '../../types';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface Props { employee: Employee | null; onClose: () => void; }

const defaultSchedule: WeeklySchedule = {
  monday:    { isWorking: true,  start: '09:00', end: '18:00' },
  tuesday:   { isWorking: true,  start: '09:00', end: '18:00' },
  wednesday: { isWorking: true,  start: '09:00', end: '18:00' },
  thursday:  { isWorking: true,  start: '09:00', end: '18:00' },
  friday:    { isWorking: true,  start: '09:00', end: '18:00' },
  saturday:  { isWorking: true,  start: '10:00', end: '17:00' },
  sunday:    { isWorking: false, start: '10:00', end: '14:00' },
};

const DAYS: { key: keyof WeeklySchedule; label: string }[] = [
  { key: 'monday', label: 'Lunes' }, { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' }, { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' }, { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

export default function EmployeeForm({ employee, onClose }: Props) {
  const { addEmployee, updateEmployee } = useStore();
  const [form, setForm] = useState({
    name:     employee?.name     ?? '',
    phone:    employee?.phone    ?? '',
    email:    employee?.email    ?? '',
    role:     employee?.role     ?? 'Barbero',
    avatar:   employee?.avatar   ?? '',
    isActive: employee?.isActive ?? true,
    schedule: employee?.schedule ?? defaultSchedule,
    services: employee?.services ?? [],
  });

  const setField = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const setDay = (day: keyof WeeklySchedule, field: keyof DaySchedule, value: any) => {
    setForm(f => ({ ...f, schedule: { ...f.schedule, [day]: { ...f.schedule[day], [field]: value } } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('El nombre es obligatorio'); return; }
    const initials = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const data = { ...form, avatar: form.avatar || initials };
    if (employee) {
      updateEmployee(employee.id, data);
      toast.success('Empleado actualizado ✓');
    } else {
      addEmployee(data);
      toast.success('Empleado registrado ✓');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="label">Nombre completo *</label>
          <input className="input" placeholder="Nombre del empleado" value={form.name} onChange={e => setField('name', e.target.value)} />
        </div>
        <div>
          <label className="label">Cargo</label>
          <select className="input" value={form.role} onChange={e => setField('role', e.target.value)}>
            <option>Barbero</option>
            <option>Barbero Senior</option>
            <option>Estilista</option>
            <option>Colorista</option>
            <option>Auxiliar</option>
          </select>
        </div>
        <div>
          <label className="label">Teléfono</label>
          <input className="input" placeholder="+52 555..." value={form.phone} onChange={e => setField('phone', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="correo@..." value={form.email} onChange={e => setField('email', e.target.value)} />
        </div>
      </div>

      {/* Schedule */}
      <div>
        <label className="label text-white/60 text-base">Horario semanal</label>
        <div className="flex flex-col gap-2">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2 bg-dark-300/60 rounded-xl px-3 py-2">
              <input type="checkbox" checked={form.schedule[key].isWorking}
                onChange={e => setDay(key, 'isWorking', e.target.checked)}
                className="accent-yellow-500 w-4 h-4 flex-shrink-0" />
              <span className={`text-sm w-20 flex-shrink-0 ${form.schedule[key].isWorking ? 'text-white' : 'text-white/30'}`}>{label}</span>
              {form.schedule[key].isWorking && (
                <div className="flex items-center gap-2 flex-1">
                  <input type="time" value={form.schedule[key].start}
                    onChange={e => setDay(key, 'start', e.target.value)}
                    className="input py-1 text-xs flex-1" />
                  <span className="text-white/30 text-xs">—</span>
                  <input type="time" value={form.schedule[key].end}
                    onChange={e => setDay(key, 'end', e.target.value)}
                    className="input py-1 text-xs flex-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
        <button type="submit" className="btn-primary flex-1">{employee ? 'Guardar' : 'Agregar'}</button>
      </div>
    </form>
  );
}
