import { create } from 'zustand';
import { saveToStorage, loadFromStorage, generateId } from '../utils/storage';

export type NotifType = 'booking_new' | 'booking_upcoming' | 'booking_completed' | 'booking_cancelled' | 'system';

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string; // ISO
  read: boolean;
  meta?: Record<string, string>;
}

interface NotifState {
  items: Notification[];
  unread: number;
  init: () => void;
  add: (n: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
}

const KEY = 'notifications';

export const useNotificationStore = create<NotifState>((set, get) => ({
  items: [],
  unread: 0,

  init: () => {
    const items = loadFromStorage<Notification[]>(KEY, []);
    set({ items, unread: items.filter(n => !n.read).length });
  },

  add: (data) => {
    const n: Notification = { ...data, id: generateId(), time: new Date().toISOString(), read: false };
    const items = [n, ...get().items].slice(0, 50); // keep last 50
    saveToStorage(KEY, items);
    set({ items, unread: items.filter(x => !x.read).length });
  },

  markRead: (id) => {
    const items = get().items.map(n => n.id === id ? { ...n, read: true } : n);
    saveToStorage(KEY, items);
    set({ items, unread: items.filter(n => !n.read).length });
  },

  markAllRead: () => {
    const items = get().items.map(n => ({ ...n, read: true }));
    saveToStorage(KEY, items);
    set({ items, unread: 0 });
  },

  clear: () => {
    saveToStorage(KEY, []);
    set({ items: [], unread: 0 });
  },
}));

// Notification templates
export const notifTemplates = {
  newBooking: (clientName: string, time: string, service: string) => ({
    type: 'booking_new' as NotifType,
    title: 'Nueva reserva',
    body: `${clientName} — ${service} a las ${time}`,
    meta: {},
  }),
  upcoming: (clientName: string, time: string, mins: number) => ({
    type: 'booking_upcoming' as NotifType,
    title: `Cita en ${mins} min`,
    body: `${clientName} te espera a las ${time}`,
    meta: {},
  }),
  completed: (clientName: string, service: string, amount: number) => ({
    type: 'booking_completed' as NotifType,
    title: '✅ Cita completada',
    body: `${clientName} · ${service} · $${amount}`,
    meta: {},
  }),
  cancelled: (clientName: string, date: string) => ({
    type: 'booking_cancelled' as NotifType,
    title: '❌ Reserva cancelada',
    body: `${clientName} · ${date}`,
    meta: {},
  }),
};
