import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Scissors, Bell, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import NotificationPanel from '../ui/NotificationPanel';
import clsx from 'clsx';

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

const roleDot: Record<string, string> = {
  admin:    'bg-gold-400',
  employee: 'bg-blue-400',
  client:   'bg-emerald-400',
};

export default function Header() {
  const { pathname }        = useLocation();
  const navigate            = useNavigate();
  const { session }         = useAuthStore();
  const { unread, init }    = useNotificationStore();
  const [showNotif, setShowNotif] = useState(false);
  const [bellRing, setBellRing]   = useState(false);
  const title = titles[pathname] ?? 'BarberPro';

  useEffect(() => { init(); }, []);

  // Ring bell when new unread arrives
  useEffect(() => {
    if (unread > 0) {
      setBellRing(true);
      const t = setTimeout(() => setBellRing(false), 900);
      return () => clearTimeout(t);
    }
  }, [unread]);

  const canSeeNotifs = session?.role === 'admin' || session?.role === 'employee';

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{
          background: 'rgba(9,9,11,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          paddingTop: 'max(0.625rem, env(safe-area-inset-top, 0px))',
          paddingBottom: '0.625rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex items-center gap-3 max-w-md mx-auto">
          {/* Logo */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative"
            style={{
              background: 'linear-gradient(135deg, #c9981a, #f0c040)',
              boxShadow: '0 0 16px rgba(201,152,26,0.45)',
            }}
          >
            <Scissors size={14} className="text-black" strokeWidth={2.5} />
          </div>

          {/* Title area */}
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-semibold tracking-[0.12em] uppercase" style={{ color: 'rgba(201,152,26,0.6)' }}>
              BarberPro
            </p>
            <h1 className="text-[15px] font-bold text-white leading-tight truncate">{title}</h1>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Notification bell — admin/employee */}
            {canSeeNotifs && (
              <button
                onClick={() => setShowNotif(true)}
                className={clsx('relative w-9 h-9 flex items-center justify-center rounded-xl transition-all', bellRing && 'bell-ring')}
                style={{ background: unread > 0 ? 'rgba(201,152,26,0.12)' : 'rgba(255,255,255,0.04)' }}
                aria-label="Notificaciones"
              >
                <Bell
                  size={16}
                  strokeWidth={2}
                  className={unread > 0 ? 'text-gold-400' : 'text-white/40'}
                />
                {unread > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] flex items-center justify-center rounded-full text-[9px] font-bold text-black leading-none px-0.5"
                    style={{ background: 'linear-gradient(135deg, #c9981a, #f0c040)' }}
                  >
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
            )}

            {/* User pill */}
            {session && (
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 flex-shrink-0 transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', roleDot[session.role])} />
                <span className="text-white/65 text-xs font-semibold truncate max-w-[72px]">
                  {session.name.split(' ')[0]}
                </span>
                <User size={10} className="text-white/25 flex-shrink-0" />
              </button>
            )}
          </div>
        </div>
      </header>

      {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
    </>
  );
}
