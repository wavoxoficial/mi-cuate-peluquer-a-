export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  visitCount: number;
  totalSpent: number;
  lastVisit: string | null;
  createdAt: string;
  loyaltyPoints: number;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  avatar: string;
  services: string[];
  schedule: WeeklySchedule;
  isActive: boolean;
  createdAt: string;
}

export interface WeeklySchedule {
  monday:    DaySchedule;
  tuesday:   DaySchedule;
  wednesday: DaySchedule;
  thursday:  DaySchedule;
  friday:    DaySchedule;
  saturday:  DaySchedule;
  sunday:    DaySchedule;
}

export interface DaySchedule {
  isWorking: boolean;
  start: string;
  end: string;
}

export type ServiceCategory = 'Corte' | 'Barba' | 'Color' | 'Tratamiento' | 'Combo' | 'Otro';

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: ServiceCategory;
  isActive: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  employeeId: string;
  employeeName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  status: BookingStatus;
  notes: string;
  createdAt: string;
}

export interface AppSettings {
  barberPhone: string;
  barberName: string;
  barberAddress: string;
  whatsappConfirmTemplate: string;
  whatsappReminderTemplate: string;
  whatsappThanksTemplate: string;
}

export interface DashboardStats {
  todayBookings: number;
  todayRevenue: number;
  monthRevenue: number;
  totalClients: number;
  nextBooking: Booking | null;
  topServices: { name: string; count: number }[];
}
