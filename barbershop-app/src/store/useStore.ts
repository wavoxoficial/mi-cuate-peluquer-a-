import { create } from 'zustand';
import { Client, Employee, Service, Booking, AppSettings } from '../types';
import { saveToStorage, loadFromStorage, generateId } from '../utils/storage';
import { seedClients, seedEmployees, seedServices, seedBookings } from '../utils/seed';
import { DEFAULT_SETTINGS } from '../utils/whatsapp';
import { format } from 'date-fns';

interface AppState {
  clients:   Client[];
  employees: Employee[];
  services:  Service[];
  bookings:  Booking[];
  settings:  AppSettings;

  addClient:    (client: Omit<Client, 'id' | 'createdAt' | 'visitCount' | 'totalSpent' | 'lastVisit' | 'loyaltyPoints'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addEmployee:    (emp: Omit<Employee, 'id' | 'createdAt'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  addService:    (svc: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  addBooking:     (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBooking:  (id: string, updates: Partial<Booking>) => void;
  completeBooking:(id: string) => void;
  cancelBooking:  (id: string) => void;

  updateSettings: (updates: Partial<AppSettings>) => void;
  init: () => void;
}

const KEYS = {
  clients:   'clients',
  employees: 'employees',
  services:  'services',
  bookings:  'bookings',
  settings:  'settings',
  seeded:    'seeded',
  seedVer:   'seed_version',
};

const SEED_VERSION = '3'; // bump when seed data changes (prices, services, etc.)

export const useStore = create<AppState>((set, get) => ({
  clients:   [],
  employees: [],
  services:  [],
  bookings:  [],
  settings:  DEFAULT_SETTINGS,

  init: () => {
    const storedVer = loadFromStorage<string>(KEYS.seedVer, '');
    if (storedVer !== SEED_VERSION) {
      // Force re-seed with new data (prices, services updated)
      saveToStorage(KEYS.clients,   seedClients);
      saveToStorage(KEYS.employees, seedEmployees);
      saveToStorage(KEYS.services,  seedServices);
      saveToStorage(KEYS.bookings,  seedBookings);
      saveToStorage(KEYS.seedVer,   SEED_VERSION);
      saveToStorage(KEYS.seeded,    true);
      set({
        clients:   seedClients,
        employees: seedEmployees,
        services:  seedServices,
        bookings:  seedBookings,
        settings:  loadFromStorage<AppSettings>(KEYS.settings, DEFAULT_SETTINGS),
      });
    } else {
      set({
        clients:   loadFromStorage<Client[]>(KEYS.clients,     []),
        employees: loadFromStorage<Employee[]>(KEYS.employees, []),
        services:  loadFromStorage<Service[]>(KEYS.services,   []),
        bookings:  loadFromStorage<Booking[]>(KEYS.bookings,   []),
        settings:  loadFromStorage<AppSettings>(KEYS.settings, DEFAULT_SETTINGS),
      });
    }
  },

  // ── CLIENTS ──────────────────────────────────────────────────
  addClient: (data) => {
    const client: Client = {
      ...data,
      id: generateId(), visitCount: 0, totalSpent: 0,
      lastVisit: null, loyaltyPoints: 0,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    };
    const clients = [...get().clients, client];
    set({ clients });
    saveToStorage(KEYS.clients, clients);
    return client;
  },
  updateClient: (id, updates) => {
    const clients = get().clients.map(c => c.id === id ? { ...c, ...updates } : c);
    set({ clients }); saveToStorage(KEYS.clients, clients);
  },
  deleteClient: (id) => {
    const clients = get().clients.filter(c => c.id !== id);
    set({ clients }); saveToStorage(KEYS.clients, clients);
  },

  // ── EMPLOYEES ────────────────────────────────────────────────
  addEmployee: (data) => {
    const emp: Employee = { ...data, id: generateId(), createdAt: format(new Date(), 'yyyy-MM-dd') };
    const employees = [...get().employees, emp];
    set({ employees }); saveToStorage(KEYS.employees, employees);
  },
  updateEmployee: (id, updates) => {
    const employees = get().employees.map(e => e.id === id ? { ...e, ...updates } : e);
    set({ employees }); saveToStorage(KEYS.employees, employees);
  },
  deleteEmployee: (id) => {
    const employees = get().employees.filter(e => e.id !== id);
    set({ employees }); saveToStorage(KEYS.employees, employees);
  },

  // ── SERVICES ─────────────────────────────────────────────────
  addService: (data) => {
    const svc: Service = { ...data, id: generateId() };
    const services = [...get().services, svc];
    set({ services }); saveToStorage(KEYS.services, services);
  },
  updateService: (id, updates) => {
    const services = get().services.map(s => s.id === id ? { ...s, ...updates } : s);
    set({ services }); saveToStorage(KEYS.services, services);
  },
  deleteService: (id) => {
    const services = get().services.filter(s => s.id !== id);
    set({ services }); saveToStorage(KEYS.services, services);
  },

  // ── BOOKINGS ─────────────────────────────────────────────────
  addBooking: (data) => {
    const booking: Booking = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    const bookings = [...get().bookings, booking];
    set({ bookings }); saveToStorage(KEYS.bookings, bookings);
    return booking;
  },
  updateBooking: (id, updates) => {
    const bookings = get().bookings.map(b => b.id === id ? { ...b, ...updates } : b);
    set({ bookings }); saveToStorage(KEYS.bookings, bookings);
  },
  completeBooking: (id) => {
    const booking = get().bookings.find(b => b.id === id);
    if (!booking) return;
    const bookings = get().bookings.map(b =>
      b.id === id ? { ...b, status: 'completed' as const } : b
    );
    set({ bookings }); saveToStorage(KEYS.bookings, bookings);
    // Update client stats
    const client = get().clients.find(c => c.id === booking.clientId);
    if (client) {
      const clients = get().clients.map(c =>
        c.id === booking.clientId
          ? { ...c, visitCount: c.visitCount + 1, totalSpent: c.totalSpent + booking.servicePrice,
              lastVisit: format(new Date(), 'yyyy-MM-dd'), loyaltyPoints: c.loyaltyPoints + 10 }
          : c
      );
      set({ clients }); saveToStorage(KEYS.clients, clients);
    }
  },
  cancelBooking: (id) => {
    const bookings = get().bookings.map(b =>
      b.id === id ? { ...b, status: 'cancelled' as const } : b
    );
    set({ bookings }); saveToStorage(KEYS.bookings, bookings);
  },

  // ── SETTINGS ─────────────────────────────────────────────────
  updateSettings: (updates) => {
    const settings = { ...get().settings, ...updates };
    set({ settings }); saveToStorage(KEYS.settings, settings);
  },
}));
