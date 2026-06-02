import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, UserCog, Scissors, UtensilsCrossed, Settings, User } from 'lucide-react';
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
  { to: '/profile',    icon: User,            label: 'Mi Perfil' },
];

const CLIENT_ITEMS = [
  { to: '/bookings',   icon: CalendarCheck,   label: 'Mis Citas' },
  { to: '/restaurant', icon: UtensilsCrossed, label: 'Mi Cuate' },
  { to: '/profile',    icon: User,            label: 'Mi Perfil' },
];

export default function BottomNav() {
  const session = useAuthStore(s => s.session);
  const role    = session?.role ?? 'client';
  const items   = role === 'admin' ? ADMIN_ITEMS : role === 'employee' ? EMPLOYEE_ITEMS : CLIENT_ITEMS;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-dark-100/97 backdrop-blur-md border-t border-white/6 max-w-md mx-auto"
      style={{ paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-stretch justify-around px-0.5 pt-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/' || to === '/bookings'}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            {({ isActive }) => (
              <>
                <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[8px] font-medium leading-none tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
