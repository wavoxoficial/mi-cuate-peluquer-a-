import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CalendarCheck, TrendingUp, Users, Clock, DollarSign, Star, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../ui/StatusBadge';

export default function Dashboard() {
  const { bookings, clients, services } = useStore();
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');

  const stats = useMemo(() => {
    const todayBookings = bookings.filter(b => b.date === today && b.status !== 'cancelled');
    const completedToday = bookings.filter(b => b.date === today && b.status === 'completed');
    const completedMonth = bookings.filter(b => {
      const month = format(new Date(), 'yyyy-MM');
      return b.date.startsWith(month) && b.status === 'completed';
    });
    const todayRevenue = completedToday.reduce((s, b) => s + b.servicePrice, 0);
    const monthRevenue = completedMonth.reduce((s, b) => s + b.servicePrice, 0);

    const now = new Date();
    const nowStr = format(now, 'HH:mm');
    const nextBooking = todayBookings
      .filter(b => b.time >= nowStr && b.status !== 'completed')
      .sort((a, b) => a.time.localeCompare(b.time))[0] ?? null;

    const serviceCounts: Record<string, number> = {};
    bookings.forEach(b => {
      serviceCounts[b.serviceName] = (serviceCounts[b.serviceName] ?? 0) + 1;
    });
    const topServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    return { todayBookings, todayRevenue, monthRevenue, nextBooking, topServices };
  }, [bookings, today]);

  const dateLabel = format(new Date(), "EEEE d 'de' MMMM", { locale: es });

  return (
    <div className="page">
      {/* Greeting */}
      <div className="fade-in">
        <p className="text-white/40 text-xs capitalize">{dateLabel}</p>
        <h2 className="text-2xl font-bold">
          Bienvenido, <span className="gold-shimmer">Maestro</span>
        </h2>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 gap-3 fade-in">
        <div className="stat-card" onClick={() => navigate('/bookings')} role="button">
          <div className="flex items-center justify-between">
            <span className="label mb-0">Citas hoy</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <CalendarCheck size={14} className="text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.todayBookings.length}</p>
          <p className="text-xs text-white/30">reservas activas</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="label mb-0">Ingreso día</span>
            <div className="w-7 h-7 rounded-lg bg-gold-600/15 flex items-center justify-center">
              <DollarSign size={14} className="text-gold-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${stats.todayRevenue.toLocaleString()}</p>
          <p className="text-xs text-white/30">completadas hoy</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="label mb-0">Ingreso mes</span>
            <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center">
              <TrendingUp size={14} className="text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${stats.monthRevenue.toLocaleString()}</p>
          <p className="text-xs text-white/30">{format(new Date(), 'MMMM', { locale: es })}</p>
        </div>

        <div className="stat-card" onClick={() => navigate('/clients')} role="button">
          <div className="flex items-center justify-between">
            <span className="label mb-0">Clientes</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
              <Users size={14} className="text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{clients.length}</p>
          <p className="text-xs text-white/30">registrados</p>
        </div>
      </div>

      {/* Next appointment */}
      {stats.nextBooking && (
        <div className="card-gold p-4 fade-in" onClick={() => navigate('/bookings')} role="button">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-gold-400" />
            <span className="text-gold-400 text-sm font-semibold">Próxima cita</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-white text-lg">{stats.nextBooking.clientName}</p>
              <p className="text-white/60 text-sm">{stats.nextBooking.serviceName}</p>
              <p className="text-white/40 text-xs mt-1">{stats.nextBooking.employeeName}</p>
            </div>
            <div className="text-right">
              <p className="text-gold-400 text-2xl font-bold">{stats.nextBooking.time}</p>
              <StatusBadge status={stats.nextBooking.status} />
            </div>
          </div>
        </div>
      )}

      {/* Today's bookings list */}
      {stats.todayBookings.length > 0 && (
        <div className="card fade-in">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h3 className="section-title text-base">Citas de hoy</h3>
            <button onClick={() => navigate('/bookings')} className="text-gold-400 text-sm flex items-center gap-0.5">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {stats.todayBookings.slice(0, 4).map(b => (
              <div key={b.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-600/20 flex items-center justify-center text-gold-400 font-bold text-sm flex-shrink-0">
                    {b.clientName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{b.clientName}</p>
                    <p className="text-xs text-white/40">{b.serviceName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gold-400">{b.time}</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top services */}
      {stats.topServices.length > 0 && (
        <div className="card fade-in">
          <div className="flex items-center gap-2 p-4 border-b border-white/5">
            <Star size={14} className="text-gold-400" />
            <h3 className="section-title text-base">Servicios más solicitados</h3>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {stats.topServices.map((s, i) => {
              const max = stats.topServices[0].count;
              const pct = Math.round((s.count / max) * 100);
              return (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/80">{s.name}</span>
                    <span className="text-gold-400 font-semibold">{s.count}x</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-700 to-gold-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 fade-in">
        <button onClick={() => navigate('/bookings')} className="btn-primary py-3 text-sm">
          + Nueva Reserva
        </button>
        <button onClick={() => navigate('/clients')} className="btn-secondary py-3 text-sm">
          + Nuevo Cliente
        </button>
      </div>
    </div>
  );
}
