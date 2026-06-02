import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, UserCog, Scissors, UtensilsCrossed, Settings } from 'lucide-react';
import clsx from 'clsx';

const items = [
  { to: '/',           icon: LayoutDashboard, label: 'Inicio' },
  { to: '/bookings',   icon: CalendarCheck,   label: 'Reservas' },
  { to: '/clients',    icon: Users,           label: 'Clientes' },
  { to: '/services',   icon: Scissors,        label: 'Servicios' },
  { to: '/restaurant', icon: UtensilsCrossed, label: 'Mi Cuate' },
  { to: '/settings',   icon: Settings,        label: 'Config' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-dark-100/95 backdrop-blur-sm border-t border-white/5 max-w-md mx-auto">
      <div className="flex items-center justify-around px-0.5 py-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            {({ isActive }) => (
              <>
                <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[8px] font-medium leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
