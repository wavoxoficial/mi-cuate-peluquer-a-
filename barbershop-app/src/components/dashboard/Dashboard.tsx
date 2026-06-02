import { useMemo, useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CalendarCheck, TrendingUp, Users, DollarSign,
  ChevronRight, Zap, Award, Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../ui/StatusBadge';

/* ── Animated counter ─────────────────────────────────────── */
function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 900;
    const from = 0;
    const to = value;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);

  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

/* ── Stat card ────────────────────────────────────────────── */
interface StatProps {
  label: string; value: number; prefix?: string; suffix?: string;
  sub: string; icon: React.ElementType; iconBg: string; iconColor: string;
  onClick?: () => void; delay?: number;
}

function StatCard({ label, value, prefix, suffix, sub, icon: Icon, iconBg, iconColor, onClick, delay = 0 }: StatProps) {
  return (
    <div
      className="stat-card fade-in"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {/* Icon row */}
      <div className="flex items-center justify-between mb-1">
        <span className="label mb-0 text-xs">{label}</span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
          <Icon size={13} style={{ color: iconColor }} />
        </div>
      </div>

      {/* Big number */}
      <p className="text-2xl font-black text-white leading-tight count-up">
        <Counter value={value} prefix={prefix} suffix={suffix} />
      </p>
      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{sub}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { bookings, clients } = useStore();
  const { session }           = useAuthStore();
  const navigate              = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');

  const stats = useMemo(() => {
    const todayBookings = bookings.filter(b => b.date === today && b.status !== 'cancelled');
    const completedToday = bookings.filter(b => b.date === today && b.status === 'completed');
    const month = format(new Date(), 'yyyy-MM');
    const completedMonth = bookings.filter(b => b.date.startsWith(month) && b.status === 'completed');
    const todayRevenue  = completedToday.reduce((s, b) => s + b.servicePrice, 0);
    const monthRevenue  = completedMonth.reduce((s, b) => s + b.servicePrice, 0);

    const nowStr = format(new Date(), 'HH:mm');
    const nextBooking = todayBookings
      .filter(b => b.time >= nowStr && b.status !== 'completed')
      .sort((a, b) => a.time.localeCompare(b.time))[0] ?? null;

    const serviceCounts: Record<string, number> = {};
    bookings.forEach(b => { serviceCounts[b.serviceName] = (serviceCounts[b.serviceName] ?? 0) + 1; });
    const topServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const completionRate = todayBookings.length
      ? Math.round((completedToday.length / todayBookings.length) * 100)
      : 0;

    return { todayBookings, todayRevenue, monthRevenue, nextBooking, topServices, completionRate };
  }, [bookings, today]);

  const dateLabel = format(new Date(), "EEEE d 'de' MMMM yyyy", { locale: es });
  const firstName = session?.name?.split(' ')[0] ?? 'Maestro';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="page">

      {/* ── Hero greeting ─────────────────────────────────────── */}
      <div className="fade-in relative overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(201,152,26,0.12) 0%, rgba(17,17,19,0.95) 60%, rgba(9,9,11,1) 100%)',
          border: '1px solid rgba(201,152,26,0.2)',
          padding: '1.25rem',
        }}
      >
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,152,26,0.2) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

        {/* Barber pole decoration */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <div style={{
            width: 8, height: 64, borderRadius: 8,
            background: 'repeating-linear-gradient(45deg, #c9981a, #c9981a 4px, #ffffff 4px, #ffffff 8px, #c9981a 8px, #c9981a 12px, #e03b3b 12px, #e03b3b 16px)',
          }} />
        </div>

        <div className="relative z-10">
          <p className="text-[11px] font-medium mb-1 capitalize"
            style={{ color: 'rgba(201,152,26,0.7)', letterSpacing: '0.05em' }}>
            {dateLabel}
          </p>
          <h2 className="text-xl font-black text-white leading-tight">
            {greeting},{' '}
            <span className="gold-shimmer">{firstName}</span>
          </h2>
          {stats.todayBookings.length > 0 ? (
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Tienes <span className="text-white font-semibold">{stats.todayBookings.length} citas</span> programadas hoy
            </p>
          ) : (
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Sin citas programadas hoy — ¡a reservar!
            </p>
          )}
        </div>
      </div>

      {/* ── Stats grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Citas hoy"       value={stats.todayBookings.length}
          sub="reservas activas"  icon={CalendarCheck}
          iconBg="rgba(59,130,246,0.15)" iconColor="#60a5fa"
          onClick={() => navigate('/bookings')} delay={50}
        />
        <StatCard
          label="Ingreso día"     value={stats.todayRevenue}
          prefix="$"             sub="servicios completados"
          icon={DollarSign}       iconBg="rgba(201,152,26,0.15)" iconColor="#c9981a"
          delay={100}
        />
        <StatCard
          label="Ingreso mes"    value={stats.monthRevenue}
          prefix="$"             sub={format(new Date(), 'MMMM', { locale: es })}
          icon={TrendingUp}       iconBg="rgba(34,197,94,0.15)"  iconColor="#4ade80"
          delay={150}
        />
        <StatCard
          label="Clientes"       value={clients.length}
          sub="registrados"      icon={Users}
          iconBg="rgba(168,85,247,0.15)" iconColor="#c084fc"
          onClick={() => navigate('/clients')} delay={200}
        />
      </div>

      {/* ── Next appointment ──────────────────────────────────── */}
      {stats.nextBooking && (
        <div
          className="fade-in relative overflow-hidden rounded-2xl cursor-pointer active:scale-[0.98] transition-transform"
          style={{
            background: 'linear-gradient(135deg, rgba(22,22,24,0.98), rgba(17,17,19,1))',
            border: '1px solid rgba(201,152,26,0.3)',
            boxShadow: '0 0 30px rgba(201,152,26,0.12)',
          }}
          onClick={() => navigate('/bookings')}
          role="button"
        >
          {/* Top stripe */}
          <div style={{ height: 2, background: 'linear-gradient(90deg, #c9981a, #f0c040, #c9981a)', opacity: 0.8 }} />

          <div className="p-4">
            <div className="flex items-center gap-1.5 mb-3">
              {/* Live dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
              </span>
              <span className="text-xs font-semibold" style={{ color: '#c9981a' }}>Próxima cita</span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(201,152,26,0.2), rgba(201,152,26,0.08))', color: '#c9981a', border: '1px solid rgba(201,152,26,0.2)' }}>
                  {stats.nextBooking.clientName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-white leading-tight">{stats.nextBooking.clientName}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{stats.nextBooking.serviceName}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{stats.nextBooking.employeeName}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-black leading-tight" style={{ color: '#c9981a' }}>
                  {stats.nextBooking.time}
                </p>
                <StatusBadge status={stats.nextBooking.status} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Today's bookings ──────────────────────────────────── */}
      {stats.todayBookings.length > 0 && (
        <div className="card fade-in">
          <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <CalendarCheck size={14} style={{ color: '#c9981a' }} />
              <h3 className="text-sm font-bold text-white">Agenda de hoy</h3>
            </div>
            <button onClick={() => navigate('/bookings')}
              className="text-xs font-semibold flex items-center gap-0.5 transition-colors"
              style={{ color: '#c9981a' }}>
              Ver todas <ChevronRight size={12} />
            </button>
          </div>
          <div>
            {stats.todayBookings.slice(0, 5).map((b, i) => (
              <div key={b.id}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < Math.min(stats.todayBookings.length, 5) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: 'rgba(201,152,26,0.12)', color: '#c9981a', border: '1px solid rgba(201,152,26,0.15)' }}
                  >
                    {b.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{b.clientName}</p>
                    <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.38)' }}>{b.serviceName}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-sm font-bold" style={{ color: '#c9981a' }}>{b.time}</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Top services ──────────────────────────────────────── */}
      {stats.topServices.length > 0 && (
        <div className="card fade-in">
          <div className="flex items-center gap-2 px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <Flame size={14} style={{ color: '#c9981a' }} />
            <h3 className="text-sm font-bold text-white">Servicios más populares</h3>
          </div>
          <div className="p-4 flex flex-col gap-3.5">
            {stats.topServices.map((s, i) => {
              const max = stats.topServices[0].count;
              const pct = Math.round((s.count / max) * 100);
              const colors = [
                { bar: 'linear-gradient(90deg, #c9981a, #f0c040)', text: '#c9981a' },
                { bar: 'linear-gradient(90deg, #6366f1, #8b5cf6)', text: '#818cf8' },
                { bar: 'linear-gradient(90deg, #0ea5e9, #38bdf8)', text: '#38bdf8' },
                { bar: 'linear-gradient(90deg, #10b981, #34d399)', text: '#34d399' },
                { bar: 'linear-gradient(90deg, #f59e0b, #fbbf24)', text: '#fbbf24' },
              ];
              const c = colors[i % colors.length];
              return (
                <div key={s.name}>
                  <div className="flex justify-between items-center text-sm mb-1.5">
                    <span className="font-medium text-white/80 text-xs">{s.name}</span>
                    <span className="font-bold text-xs" style={{ color: c.text }}>{s.count}×</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-full rounded-full bar-fill"
                      style={{ width: `${pct}%`, background: c.bar }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Performance badge ─────────────────────────────────── */}
      {stats.completionRate > 0 && (
        <div className="fade-in rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.04))',
            border: '1px solid rgba(34,197,94,0.15)',
          }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(34,197,94,0.15)' }}>
            <Award size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Eficiencia del día</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {stats.completionRate}% de citas completadas hoy
            </p>
          </div>
          <div className="ml-auto text-right flex-shrink-0">
            <p className="text-2xl font-black text-emerald-400">{stats.completionRate}%</p>
          </div>
        </div>
      )}

      {/* ── Quick actions ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 fade-in">
        <button onClick={() => navigate('/bookings')}
          className="btn-primary py-3 text-sm font-bold">
          <Zap size={14} /> Nueva Reserva
        </button>
        <button onClick={() => navigate('/clients')}
          className="btn-secondary py-3 text-sm font-semibold">
          <Users size={14} /> Nuevo Cliente
        </button>
      </div>
    </div>
  );
}
