import { useEffect } from 'react';
import { X, Bell, CalendarCheck, Clock, CheckCircle, XCircle, Trash2, BellOff } from 'lucide-react';
import { useNotificationStore, Notification, NotifType } from '../../store/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import clsx from 'clsx';

interface Props { onClose: () => void; }

const icons: Record<NotifType, React.ReactNode> = {
  booking_new:       <CalendarCheck size={14} className="text-blue-400" />,
  booking_upcoming:  <Clock size={14} className="text-amber-400" />,
  booking_completed: <CheckCircle size={14} className="text-emerald-400" />,
  booking_cancelled: <XCircle size={14} className="text-red-400" />,
  system:            <Bell size={14} className="text-gold-400" />,
};

const dots: Record<NotifType, string> = {
  booking_new:       'bg-blue-400',
  booking_upcoming:  'bg-amber-400',
  booking_completed: 'bg-emerald-400',
  booking_cancelled: 'bg-red-400',
  system:            'bg-gold-400',
};

function NotifItem({ n, onRead }: { n: Notification; onRead: (id: string) => void }) {
  return (
    <button
      onClick={() => onRead(n.id)}
      className={clsx(
        'w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all duration-150',
        !n.read ? 'bg-white/[0.035]' : 'hover:bg-white/[0.02]'
      )}
    >
      {/* Icon bubble */}
      <div className={clsx(
        'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
        !n.read ? 'bg-white/8 ring-1 ring-white/10' : 'bg-white/4'
      )}>
        {icons[n.type]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={clsx('text-sm font-medium leading-tight', n.read ? 'text-white/50' : 'text-white')}>
            {n.title}
          </p>
          {!n.read && (
            <span className={clsx('w-2 h-2 rounded-full flex-shrink-0 mt-1', dots[n.type])} />
          )}
        </div>
        <p className="text-xs text-white/35 mt-0.5 leading-snug">{n.body}</p>
        <p className="text-[10px] text-white/20 mt-1">
          {formatDistanceToNow(new Date(n.time), { addSuffix: true, locale: es })}
        </p>
      </div>
    </button>
  );
}

export default function NotificationPanel({ onClose }: Props) {
  const { items, markRead, markAllRead, clear } = useNotificationStore();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    const y = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${y}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, y);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50"
      onPointerDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-dark-100 border-l border-white/6 flex flex-col animate-slide-in-up"
        style={{ animation: 'slideFromRight 0.3s cubic-bezier(0.34,1.2,0.64,1) forwards' }}
        onPointerDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/6"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))' }}>
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-gold-400" />
            <h2 className="font-bold text-white text-base">Notificaciones</h2>
            {items.filter(n => !n.read).length > 0 && (
              <span className="bg-gold-600 text-black text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                {items.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="icon-btn"><X size={15} /></button>
        </div>

        {/* Actions */}
        {items.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/4">
            <button onClick={markAllRead}
              className="text-xs text-gold-400 font-medium hover:text-gold-300 transition-colors">
              Marcar todas como leídas
            </button>
            <span className="text-white/10">·</span>
            <button onClick={clear}
              className="text-xs text-white/25 font-medium hover:text-red-400 transition-colors flex items-center gap-1">
              <Trash2 size={10} /> Limpiar
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' } as any}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="w-14 h-14 rounded-full bg-white/4 flex items-center justify-center">
                <BellOff size={22} className="text-white/20" />
              </div>
              <p className="text-white/25 text-sm">Sin notificaciones</p>
            </div>
          ) : (
            <div className="divide-y divide-white/4">
              {items.map(n => (
                <NotifItem key={n.id} n={n} onRead={markRead} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
