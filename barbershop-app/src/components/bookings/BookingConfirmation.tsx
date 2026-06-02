import { useEffect, useState } from 'react';
import { Booking } from '../../types';
import { CheckCircle, X, QrCode, ExternalLink, MapPin, Utensils } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  booking: Booking;
  onClose: () => void;
}

export default function BookingConfirmation({ booking, onClose }: Props) {
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowPromo(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel fade-in max-h-[92dvh]" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Reserva Confirmada</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          {/* Success badge */}
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-3">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white">¡Reserva creada!</h3>
            <p className="text-white/40 text-sm mt-1">Te esperamos puntual</p>
          </div>

          {/* Booking details */}
          <div className="card-gold p-4 mb-4">
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Cliente', value: booking.clientName },
                { label: 'Servicio', value: booking.serviceName },
                { label: 'Empleado', value: booking.employeeName },
                { label: 'Fecha', value: format(new Date(booking.date + 'T00:00:00'), "EEEE d 'de' MMMM", { locale: es }) },
                { label: 'Hora', value: booking.time },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center">
                  <span className="text-white/40 text-sm">{row.label}</span>
                  <span className="text-white font-medium text-sm">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center border-t border-gold-600/20 pt-2 mt-1">
                <span className="text-white/40 text-sm">Total</span>
                <span className="text-gold-400 font-bold text-lg">${booking.servicePrice}</span>
              </div>
            </div>
          </div>

          {/* Mi Cuate promo card */}
          {showPromo && (
            <div className="fade-in rounded-2xl overflow-hidden border border-gold-600/30 bg-gradient-to-br from-dark-100 to-dark-300 mb-4">
              {/* Header */}
              <div className="bg-gradient-to-r from-gold-700 to-gold-500 px-4 py-3 flex items-center gap-2">
                <Utensils size={16} className="text-black" />
                <span className="text-black font-bold text-sm">🎁 Regalo para nuestros clientes</span>
              </div>
              <div className="p-4">
                <p className="text-white font-semibold mb-1">Gracias por reservar con nosotros.</p>
                <p className="text-white/50 text-sm mb-4">Disfruta también de una oferta especial en <span className="text-gold-400 font-semibold">Mi Cuate Restaurant</span>.</p>

                <div className="flex items-start gap-4">
                  {/* QR */}
                  <div className="bg-white p-2 rounded-xl flex-shrink-0">
                    <QRCodeSVG
                      value="https://restaurantemicuate.com/promo-barberpro"
                      size={80}
                      bgColor="#ffffff"
                      fgColor="#0a0a0a"
                      level="M"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <p className="text-white/60 text-xs">Escanea el QR para reclamar tu oferta especial exclusiva para clientes de BarberPro</p>
                    <a href="https://restaurantemicuate.com" target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-gold-600/15 border border-gold-600/30 text-gold-400 rounded-xl py-2 text-xs font-semibold active:scale-95 transition-all">
                      <ExternalLink size={12} /> Visitar Mi Cuate
                    </a>
                    <a href="https://maps.google.com/?q=Restaurante+Mi+Cuate" target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 text-white/60 rounded-xl py-2 text-xs font-medium active:scale-95 transition-all">
                      <MapPin size={12} /> Ver ubicación
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button onClick={onClose} className="btn-primary w-full py-3">Listo</button>
        </div>
      </div>
    </div>
  );
}
