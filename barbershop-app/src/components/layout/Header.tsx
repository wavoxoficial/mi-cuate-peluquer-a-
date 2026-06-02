import { useLocation } from 'react-router-dom';
import { Scissors } from 'lucide-react';

const titles: Record<string, string> = {
  '/':           'Dashboard',
  '/clients':    'Clientes',
  '/bookings':   'Reservas',
  '/employees':  'Empleados',
  '/services':   'Servicios',
  '/restaurant': 'Mi Cuate',
  '/settings':   'Configuración',
};

export default function Header() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? 'BarberPro';

  return (
    <header className="sticky top-0 z-40 bg-dark-400/95 backdrop-blur-sm border-b border-white/5 px-4 py-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gold-600 flex items-center justify-center shadow-gold flex-shrink-0">
        <Scissors size={16} className="text-black" />
      </div>
      <div>
        <p className="text-[10px] text-white/40 leading-none font-medium tracking-widest uppercase">BarberPro</p>
        <h1 className="text-base font-semibold text-white leading-tight">{title}</h1>
      </div>
    </header>
  );
}
