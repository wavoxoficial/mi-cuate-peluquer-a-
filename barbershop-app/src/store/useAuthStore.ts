import { create } from 'zustand';
import { User, AuthSession, UserRole } from '../types';
import { saveToStorage, loadFromStorage, generateId } from '../utils/storage';
import { format } from 'date-fns';

interface AuthState {
  session: AuthSession | null;
  users: User[];
  isLoading: boolean;

  init: () => void;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, phone: string, password: string, role?: UserRole) => { ok: boolean; error?: string };
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => { ok: boolean; error?: string };
  updateProfile: (updates: Partial<Pick<User, 'name' | 'phone' | 'password'>>) => void;
}

const KEYS = { users: 'auth_users', session: 'auth_session' };

const SEED_USERS: User[] = [
  {
    id: 'admin-001',
    name: 'Administrador',
    email: 'admin@barberpro.com',
    phone: '+52 555 000 0000',
    password: 'admin123',
    role: 'admin',
    createdAt: '2024-01-01',
    isActive: true,
  },
  {
    id: 'emp-001',
    name: 'Juan El Maestro',
    email: 'juan@barberpro.com',
    phone: '+52 555 400 0001',
    password: 'emp123',
    role: 'employee',
    createdAt: '2024-01-01',
    isActive: true,
  },
  {
    id: 'client-001',
    name: 'Carlos Mendoza',
    email: 'carlos@email.com',
    phone: '+52 555 123 4567',
    password: 'client123',
    role: 'client',
    createdAt: '2024-01-01',
    isActive: true,
  },
];

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  users: [],
  isLoading: true,

  init: () => {
    let users = loadFromStorage<User[]>(KEYS.users, []);
    if (users.length === 0) {
      users = SEED_USERS;
      saveToStorage(KEYS.users, users);
    }
    const session = loadFromStorage<AuthSession | null>(KEYS.session, null);
    set({ users, session, isLoading: false });
  },

  login: (email, password) => {
    const { users } = get();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: 'Correo o contraseña incorrectos' };
    if (!user.isActive) return { ok: false, error: 'Cuenta desactivada. Contacta al administrador.' };
    const session: AuthSession = {
      userId: user.id,
      role:   user.role,
      name:   user.name,
      email:  user.email,
    };
    saveToStorage(KEYS.session, session);
    set({ session });
    return { ok: true };
  },

  register: (name, email, phone, password, role = 'client') => {
    const { users } = get();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo' };
    }
    const user: User = {
      id:        generateId(),
      name:      name.trim(),
      email:     email.toLowerCase().trim(),
      phone:     phone.trim(),
      password,
      role,
      isActive:  true,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    };
    const updated = [...users, user];
    saveToStorage(KEYS.users, updated);
    const session: AuthSession = { userId: user.id, role: user.role, name: user.name, email: user.email };
    saveToStorage(KEYS.session, session);
    set({ users: updated, session });
    return { ok: true };
  },

  logout: () => {
    saveToStorage(KEYS.session, null);
    set({ session: null });
  },

  resetPassword: (email, newPassword) => {
    const { users } = get();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return { ok: false, error: 'No existe una cuenta con ese correo' };
    const updated = users.map((u, i) => i === idx ? { ...u, password: newPassword } : u);
    saveToStorage(KEYS.users, updated);
    set({ users: updated });
    return { ok: true };
  },

  updateProfile: (updates) => {
    const { users, session } = get();
    if (!session) return;
    const updated = users.map(u => u.id === session.userId ? { ...u, ...updates } : u);
    saveToStorage(KEYS.users, updated);
    const newSession = updates.name
      ? { ...session, name: updates.name }
      : session;
    saveToStorage(KEYS.session, newSession);
    set({ users: updated, session: newSession });
  },
}));
