import { Booking, AppSettings } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr + 'T00:00:00'), "EEEE d 'de' MMMM", { locale: es });
  } catch {
    return dateStr;
  }
}

function buildMessage(template: string, booking: Booking, settings: AppSettings): string {
  return template
    .replace(/\{cliente\}/gi,   booking.clientName)
    .replace(/\{fecha\}/gi,     formatDate(booking.date))
    .replace(/\{hora\}/gi,      booking.time)
    .replace(/\{servicio\}/gi,  booking.serviceName)
    .replace(/\{empleado\}/gi,  booking.employeeName)
    .replace(/\{precio\}/gi,    `$${booking.servicePrice}`)
    .replace(/\{negocio\}/gi,   settings.barberName)
    .replace(/\{direccion\}/gi, settings.barberAddress);
}

export function waLink(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${clean}?text=${encoded}`;
}

export function confirmationLink(booking: Booking, settings: AppSettings): string {
  const msg = buildMessage(settings.whatsappConfirmTemplate, booking, settings);
  return waLink(booking.clientPhone, msg);
}

export function reminderLink(booking: Booking, settings: AppSettings): string {
  const msg = buildMessage(settings.whatsappReminderTemplate, booking, settings);
  return waLink(booking.clientPhone, msg);
}

export function thanksLink(booking: Booking, settings: AppSettings): string {
  const msg = buildMessage(settings.whatsappThanksTemplate, booking, settings);
  return waLink(booking.clientPhone, msg);
}

export function clientWhatsappLink(phone: string, clientName: string, settings: AppSettings): string {
  const msg = `Hola ${clientName}, te contactamos desde ${settings.barberName}. 👋`;
  return waLink(phone, msg);
}

export const DEFAULT_SETTINGS: AppSettings = {
  barberPhone:   '',
  barberName:    'BarberPro',
  barberAddress: '',
  whatsappConfirmTemplate:
    'Hola {cliente} ✂️, tu cita ha sido *confirmada* para el *{fecha}* a las *{hora}*.\n\nServicio: {servicio}\nBarbero: {empleado}\n\n¡Te esperamos en {negocio}! 💈',
  whatsappReminderTemplate:
    'Hola {cliente} 👋, te recordamos que tienes una cita *mañana a las {hora}*.\n\nServicio: {servicio}\nUbicación: {direccion}\n\n¡No faltes! — {negocio} ✂️',
  whatsappThanksTemplate:
    '¡Gracias por visitarnos, {cliente}! 🙏✂️\n\nFue un placer atenderte. Esperamos verte pronto en {negocio}.\n\n💈 ¡Hasta la próxima!',
};
