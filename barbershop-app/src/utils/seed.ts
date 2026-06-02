import { Client, Employee, Service, Booking, WeeklySchedule } from '../types';
import { generateId } from './storage';
import { format, addDays, subDays } from 'date-fns';

const today    = new Date();
const todayStr = format(today, 'yyyy-MM-dd');

const DEFAULT_SCHEDULE: WeeklySchedule = {
  monday:    { isWorking: true,  start: '09:00', end: '20:00' },
  tuesday:   { isWorking: true,  start: '09:00', end: '20:00' },
  wednesday: { isWorking: true,  start: '09:00', end: '20:00' },
  thursday:  { isWorking: true,  start: '09:00', end: '20:00' },
  friday:    { isWorking: true,  start: '09:00', end: '21:00' },
  saturday:  { isWorking: true,  start: '10:00', end: '20:00' },
  sunday:    { isWorking: false, start: '10:00', end: '15:00' },
};

export const seedClients: Client[] = [
  {
    id: generateId(), name: 'Carlos Mendoza', phone: '+52 555 123 4567',
    email: 'carlos@email.com', notes: 'Prefiere corte clásico bajo',
    visitCount: 8, totalSpent: 760, lastVisit: format(subDays(today, 14), 'yyyy-MM-dd'),
    createdAt: '2024-06-01', loyaltyPoints: 80,
  },
  {
    id: generateId(), name: 'Miguel Ángel Torres', phone: '+52 555 987 6543',
    email: 'miguel@email.com', notes: 'Corte moderno + barba siempre',
    visitCount: 15, totalSpent: 2100, lastVisit: format(subDays(today, 7), 'yyyy-MM-dd'),
    createdAt: '2024-05-15', loyaltyPoints: 150,
  },
  {
    id: generateId(), name: 'Roberto Díaz', phone: '+52 555 456 7890',
    email: 'roberto@email.com', notes: '',
    visitCount: 4, totalSpent: 380, lastVisit: format(subDays(today, 30), 'yyyy-MM-dd'),
    createdAt: '2024-07-20', loyaltyPoints: 40,
  },
  {
    id: generateId(), name: 'Alejandro Reyes', phone: '+52 555 321 0987',
    email: 'alex@email.com', notes: 'Le gusta el degradado alto',
    visitCount: 6, totalSpent: 660, lastVisit: format(subDays(today, 5), 'yyyy-MM-dd'),
    createdAt: '2024-08-10', loyaltyPoints: 60,
  },
];

export const seedEmployees: Employee[] = [
  {
    id: generateId(),
    name: 'Juan "El Maestro" Pérez',
    phone: '+52 555 400 0001',
    email: 'juan@barberpro.com',
    role: 'Maestro Barbero',
    avatar: '✂️',
    services: ['Corte Clásico', 'Corte Moderno', 'Corte + Barba', 'Afeitado Clásico', 'Degradado'],
    schedule: DEFAULT_SCHEDULE,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: generateId(),
    name: 'Luis Rodríguez',
    phone: '+52 555 400 0002',
    email: 'luis@barberpro.com',
    role: 'Barbero',
    avatar: '💈',
    services: ['Corte Clásico', 'Corte Infantil', 'Degradado', 'Arreglo de Barba'],
    schedule: DEFAULT_SCHEDULE,
    isActive: true,
    createdAt: '2024-03-15',
  },
];

/* ── Precios realistas México 2025 ─────────────────────────── */
export const seedServices: Service[] = [
  { id: generateId(), name: 'Corte Clásico',    description: 'Corte tradicional tijera y máquina',                   duration: 30, price: 80,  category: 'Corte',  isActive: true },
  { id: generateId(), name: 'Corte + Barba',    description: 'Corte completo + arreglo y perfilado de barba',         duration: 55, price: 150, category: 'Combo',  isActive: true },
  { id: generateId(), name: 'Degradado',         description: 'Fade profesional skin a número',                       duration: 40, price: 120, category: 'Corte',  isActive: true },
  { id: generateId(), name: 'Corte Moderno',    description: 'Corte con diseño personalizado y textura',              duration: 40, price: 130, category: 'Corte',  isActive: true },
  { id: generateId(), name: 'Corte Infantil',   description: 'Corte para niños hasta 12 años',                        duration: 25, price: 65,  category: 'Corte',  isActive: true },
  { id: generateId(), name: 'Afeitado Clásico', description: 'Afeitado con navaja, crema hot & toalla caliente',      duration: 40, price: 130, category: 'Barba',  isActive: true },
  { id: generateId(), name: 'Arreglo de Barba', description: 'Perfilado y definición de barba',                       duration: 20, price: 70,  category: 'Barba',  isActive: true },
  { id: generateId(), name: 'Tinte de Barba',   description: 'Coloración natural de barba y bigote',                  duration: 35, price: 110, category: 'Color',  isActive: true },
  { id: generateId(), name: 'Keratina',         description: 'Tratamiento de keratina para cabello rebelde',          duration: 60, price: 250, category: 'Tratamiento', isActive: true },
  { id: generateId(), name: 'Combo Premium',    description: 'Corte + Barba + Tratamiento hidratación + Eyebrows',   duration: 90, price: 280, category: 'Combo',  isActive: true },
];

export const seedBookings: Booking[] = [
  {
    id: generateId(), clientId: seedClients[0].id, clientName: seedClients[0].name, clientPhone: seedClients[0].phone,
    employeeId: seedEmployees[0].id, employeeName: seedEmployees[0].name,
    serviceId: seedServices[0].id, serviceName: seedServices[0].name, servicePrice: seedServices[0].price, serviceDuration: seedServices[0].duration,
    date: todayStr, time: '10:00', status: 'confirmed', notes: '', createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), clientId: seedClients[1].id, clientName: seedClients[1].name, clientPhone: seedClients[1].phone,
    employeeId: seedEmployees[0].id, employeeName: seedEmployees[0].name,
    serviceId: seedServices[1].id, serviceName: seedServices[1].name, servicePrice: seedServices[1].price, serviceDuration: seedServices[1].duration,
    date: todayStr, time: '11:30', status: 'confirmed', notes: 'Cliente VIP', createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), clientId: seedClients[2].id, clientName: seedClients[2].name, clientPhone: seedClients[2].phone,
    employeeId: seedEmployees[1].id, employeeName: seedEmployees[1].name,
    serviceId: seedServices[2].id, serviceName: seedServices[2].name, servicePrice: seedServices[2].price, serviceDuration: seedServices[2].duration,
    date: todayStr, time: '14:00', status: 'pending', notes: '', createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), clientId: seedClients[3].id, clientName: seedClients[3].name, clientPhone: seedClients[3].phone,
    employeeId: seedEmployees[1].id, employeeName: seedEmployees[1].name,
    serviceId: seedServices[3].id, serviceName: seedServices[3].name, servicePrice: seedServices[3].price, serviceDuration: seedServices[3].duration,
    date: todayStr, time: '16:30', status: 'confirmed', notes: '', createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), clientId: seedClients[0].id, clientName: seedClients[0].name, clientPhone: seedClients[0].phone,
    employeeId: seedEmployees[0].id, employeeName: seedEmployees[0].name,
    serviceId: seedServices[9].id, serviceName: seedServices[9].name, servicePrice: seedServices[9].price, serviceDuration: seedServices[9].duration,
    date: format(addDays(today, 1), 'yyyy-MM-dd'), time: '09:00', status: 'pending', notes: '', createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), clientId: seedClients[1].id, clientName: seedClients[1].name, clientPhone: seedClients[1].phone,
    employeeId: seedEmployees[0].id, employeeName: seedEmployees[0].name,
    serviceId: seedServices[1].id, serviceName: seedServices[1].name, servicePrice: seedServices[1].price, serviceDuration: seedServices[1].duration,
    date: format(subDays(today, 3), 'yyyy-MM-dd'), time: '10:00', status: 'completed', notes: '', createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), clientId: seedClients[2].id, clientName: seedClients[2].name, clientPhone: seedClients[2].phone,
    employeeId: seedEmployees[1].id, employeeName: seedEmployees[1].name,
    serviceId: seedServices[0].id, serviceName: seedServices[0].name, servicePrice: seedServices[0].price, serviceDuration: seedServices[0].duration,
    date: format(subDays(today, 7), 'yyyy-MM-dd'), time: '15:00', status: 'completed', notes: '', createdAt: new Date().toISOString(),
  },
];
