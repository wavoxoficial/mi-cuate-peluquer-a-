import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarCheck, Scissors,
  UtensilsCrossed, Settings, User
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../store/useAuthStore';

const ADMIN_ITEMS = [
  { to: '/',           icon: LayoutDashboard, label: 'Inicio' },
  { to: '/bookings',   icon: CalendarCheck,   label: 'Reservas' },
  { to: '/clients',    icon: Users,           label: 'Clientes' },
  { to: '/services',   icon: Scissors,        label: 'Servicios' },
  { to: '/restaurant', icon: UtensilsCrossed, label: 'Mi Cuate' },
  { to: '/settings',   icon: Settings,        label: 'Config' },
];

const EMPLOYEE_ITEMS = [
  { to: '/',           icon: LayoutDashboard, label: 'Inicio' },
  { to: '/bookings',   icon: CalendarCheck,   label: 'Reservas' },
  { to: '/clients',    icon: Users,           label: 'Clientes' },
  { to: '/restaurant', icon: UtensilsCrossed, label: 'Mi Cuate' },
  { to: '/profile',    icon: User,            label: 'Perfil' },
];

const CLIENT_ITEMS = [
  { to: '/bookings',   icon: CalendarCheck,   label: 'Mis Citas' },
  { to: '/restaurant', icon: UtensilsCrossed, label: 'Mi Cuate' },
  { to: '/profile',    icon: User,            label: 'Perfil' },
];

export default function BottomNav() {
  const session = useAuthStore(s => s.session);
  const role    = session?.role ?? 'client';
  const items   = role === 'admin' ? ADMIN_ITEMS : role === 'employee' ? EMPLOYEE_ITEMS : CLIENT_ITEMS;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto"
      style={{
        background: 'rgba(13,13,15,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom, 0px))',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.6)',
      }}
    >
      <div className="flex items-stretch justify-around px-1 pt-1.5">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/' || to === '/bookings'}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={isActive ? {
                      filter: 'drop-shadow(0 0 6px rgba(201,152,26,0.5))'
                    } : undefined}
                  />
                </div>
                <span className="text-[9px] font-semibold leading-none tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
