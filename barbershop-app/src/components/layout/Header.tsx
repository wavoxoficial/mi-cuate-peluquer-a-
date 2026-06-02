import { useLocation, useNavigate } from 'react-router-dom';
import { Scissors, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const titles: Record<string, string> = {
  '/':           'Dashboard',
  '/clients':    'Clientes',
  '/bookings':   'Reservas',
  '/employees':  'Empleados',
  '/services':   'Servicios',
  '/restaurant': 'Mi Cuate',
  '/settings':   'Configuración',
  '/profile':    'Mi Perfil',
};

const roleLabel: Record<string, string> = {
  admin:    'Admin',
  employee: 'Empleado',
  client:   'Cliente',
};
const roleDot: Record<string, string> = {
  admin:    'bg-gold-400',
  employee: 'bg-blue-400',
  client:   'bg-green-400',
};

export default function Header() {
  const { pathname }       = useLocation();
  const navigate           = useNavigate();
  const { session, logout } = useAuthStore();
  const title = titles[pathname] ?? 'BarberPro';

  return (
    <header className="sticky top-0 z-40 bg-dark-400/95 backdrop-blur-sm border-b border-white/5 px-4"
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))', paddingBottom: '0.75rem' }}>
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="w-8 h-8 rounded-lg bg-gold-600 flex items-center justify-center shadow-gold flex-shrink-0">
          <Scissors size={15} className="text-black" />
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-white/40 leading-none font-medium tracking-widest uppercase">BarberPro</p>
          <h1 className="text-[15px] font-semibold text-white leading-tight truncate">{title}</h1>
        </div>

        {/* User pill */}
        {session && (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 bg-dark-100 border border-white/8 rounded-xl px-2.5 py-1.5 flex-shrink-0 active:bg-dark-50 transition-colors"
          >
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${roleDot[session.role]}`} />
            <span className="text-white/70 text-xs font-medium truncate max-w-[80px]">{session.name.split(' ')[0]}</span>
            <User size={11} className="text-white/30 flex-shrink-0" />
          </button>
        )}
      </div>
    </header>
  );
}
