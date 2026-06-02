import { Client, Employee, Service, Booking, WeeklySchedule } from '../types';
import { generateId } from './storage';
import { format, addDays, subDays } from 'date-fns';

const today    = new Date();
const todayStr = format(today, 'yyyy-MM-dd');

const DEFAULT_SCHEDULE: WeeklySchedule = {
  monday:    { isWorking: true,  start: '09:00', end: '18:00' },
  tuesday:   { isWorking: true,  start: '09:00', end: '18:00' },
  wednesday: { isWorking: true,  start: '09:00', end: '18:00' },
  thursday:  { isWorking: true,  start: '09:00', end: '18:00' },
  friday:    { isWorking: true,  start: '09:00', end: '20:00' },
  saturday:  { isWorking: true,  start: '10:00', end: '17:00' },
  sunday:    { isWorking: false, start: '10:00', end: '14:00' },
};

export const seedClients: Client[] = [
  { id: generateId(), name: 'Carlos Mendoza',      phone: '+52 555 123 4567', email: 'carlos@email.com',    notes: 'Prefiere corte clásico', visitCount: 8,  totalSpent: 960,  lastVisit: format(subDays(today, 14), 'yyyy-MM-dd'), createdAt: '2024-06-01', loyaltyPoints: 80 },
  { id: generateId(), name: 'Miguel Ángel Torres', phone: '+52 555 987 6543', email: 'miguel@email.com',    notes: 'Corte moderno y barba',  visitCount: 12, totalSpent: 1800, lastVisit: format(subDays(today, 7),  'yyyy-MM-dd'), createdAt: '2024-05-15', loyaltyPoints: 120 },
  { id: generateId(), name: 'Roberto Díaz',        phone: '+52 555 456 7890', email: 'roberto@email.com',   notes: '',                       visitCount: 3,  totalSpent: 350,  lastVisit: format(subDays(today, 30), 'yyyy-MM-dd'), createdAt: '2024-07-20', loyaltyPoints: 30 },
];

export const seedEmployees: Employee[] = [
  {
    id: generateId(), name: 'Juan "El Maestro" Pérez', phone: '+52 555 400 0001', email: 'juan@barberpro.com',
    role: 'Maestro Barbero', avatar: '✂️',
    services: ['Corte Clásico', 'Corte Moderno', 'Corte + Barba', 'Afeitado Clásico'],
    schedule: DEFAULT_SCHEDULE, isActive: true, createdAt: '2024-01-01',
  },
  {
    id: generateId(), name: 'Luis Rodríguez', phone: '+52 555 400 0002', email: 'luis@barberpro.com',
    role: 'Barbero Junior', avatar: '💈',
    services: ['Corte Clásico', 'Corte Infantil', 'Degradado'],
    schedule: DEFAULT_SCHEDULE, isActive: true, createdAt: '2024-03-15',
  },
];

export const seedServices: Service[] = [
  { id: generateId(), name: 'Corte Clásico',   description: 'Corte tradicional tijeras y máquina',         duration: 30, price: 120, category: 'Corte',       isActive: true },
  { id: generateId(), name: 'Corte + Barba',   description: 'Corte completo más arreglo de barba',          duration: 60, price: 200, category: 'Combo',       isActive: true },
  { id: generateId(), name: 'Degradado',        description: 'Fade con degradado a máquina',                 duration: 45, price: 150, category: 'Corte',       isActive: true },
  { id: generateId(), name: 'Corte Moderno',   description: 'Corte con diseño personalizado',               duration: 45, price: 170, category: 'Corte',       isActive: true },
  { id: generateId(), name: 'Corte Infantil',  description: 'Corte para niños hasta 12 años',               duration: 25, price: 100, category: 'Corte',       isActive: true },
  { id: generateId(), name: 'Afeitado Clásico',description: 'Afeitado completo con navaja y toalla caliente',duration: 45, price: 200, category: 'Barba',       isActive: true },
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
    date: todayStr, time: '11:30', status: 'confirmed', notes: 'Cliente frecuente', createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), clientId: seedClients[2].id, clientName: seedClients[2].name, clientPhone: seedClients[2].phone,
    employeeId: seedEmployees[1].id, employeeName: seedEmployees[1].name,
    serviceId: seedServices[2].id, serviceName: seedServices[2].name, servicePrice: seedServices[2].price, serviceDuration: seedServices[2].duration,
    date: todayStr, time: '14:00', status: 'pending', notes: '', createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), clientId: seedClients[0].id, clientName: seedClients[0].name, clientPhone: seedClients[0].phone,
    employeeId: seedEmployees[1].id, employeeName: seedEmployees[1].name,
    serviceId: seedServices[3].id, serviceName: seedServices[3].name, servicePrice: seedServices[3].price, serviceDuration: seedServices[3].duration,
    date: format(addDays(today, 1), 'yyyy-MM-dd'), time: '09:00', status: 'pending', notes: '', createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), clientId: seedClients[1].id, clientName: seedClients[1].name, clientPhone: seedClients[1].phone,
    employeeId: seedEmployees[0].id, employeeName: seedEmployees[0].name,
    serviceId: seedServices[5].id, serviceName: seedServices[5].name, servicePrice: seedServices[5].price, serviceDuration: seedServices[5].duration,
    date: format(subDays(today, 3), 'yyyy-MM-dd'), time: '10:00', status: 'completed', notes: '', createdAt: new Date().toISOString(),
  },
];
