import { useState, useEffect } from 'react';
import { ExternalLink, MapPin, Phone, Clock, Star, Gift, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';

function CouponModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="modal-overlay"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-panel slide-up"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10">
          <h2 className="text-base font-semibold text-white">🎁 Tu cupón</h2>
          <button onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center gap-4 text-center">
          <div className="text-4xl">🍽️</div>

          <div>
            <h3 className="text-lg font-bold text-white">
              ¡Bienvenido a Mi Cuate!
            </h3>
            <p className="text-white/60 text-sm">
              Disfruta tu 15% de descuento exclusivo.
            </p>
          </div>

          <div className="bg-white p-3 rounded-2xl">
            <QRCodeSVG
              value="https://micuate.es"
              size={140}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 w-full">
            <p className="text-yellow-400 font-bold text-xl tracking-widest">
              BARBERPRO15
            </p>
            <p className="text-white/60 text-xs mt-1">
              15% de descuento en tu consumo
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-white/10 text-white py-2 rounded-xl"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Restaurant() {
  const [showCoupon, setShowCoupon] = useState(false);

  const { bookings } = useStore();
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    const cutoff = Date.now() - 2 * 60 * 1000;

    const recent = bookings.find(
      (b) =>
        b.status === 'completed' &&
        new Date(b.createdAt).getTime() > cutoff
    );

    const shown = sessionStorage.getItem('coupon_shown');

    if (recent && !shown) {
      setTimeout(() => setShowCoupon(true), 600);
      sessionStorage.setItem('coupon_shown', '1');
    }
  }, [bookings]);

  return (
    <div className="page">
      {showCoupon && (
        <CouponModal onClose={() => setShowCoupon(false)} />
      )}

      {/* HERO */}
      <div className="card text-center p-6">
        <div className="text-5xl mb-3">🍽️</div>

        <h1 className="text-2xl font-bold text-white">
          Mi Cuate Bar Restaurant
        </h1>

        <p className="text-yellow-400 mt-1">
          Sabor, Amigos y Buena Vibra
        </p>

        <p className="text-white/60 text-sm mt-3">
          Comida latina y mexicana en Palma de Mallorca
        </p>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="card p-3 text-center">
          <Clock className="mx-auto text-yellow-400" />
          <p className="text-white mt-1 text-sm">12:00 - 22:00</p>
          <p className="text-white/40 text-xs">Todos los días</p>
        </div>

        <div className="card p-3 text-center">
          <Star className="mx-auto text-yellow-400" />
          <p className="text-white mt-1 text-sm">4.8 ★</p>
          <p className="text-white/40 text-xs">Clientes felices</p>
        </div>

        <div className="card p-3 text-center">
          <Phone className="mx-auto text-yellow-400" />
          <p className="text-white mt-1 text-sm">672 598 458</p>
          <p className="text-white/40 text-xs">Reservas</p>
        </div>

        <div className="card p-3 text-center">
          <MapPin className="mx-auto text-yellow-400" />
          <p className="text-white mt-1 text-sm">Palma</p>
          <p className="text-white/40 text-xs">Balanguera 14</p>
        </div>
      </div>

      {/* QR */}
      <div className="card mt-4 p-4 text-center">
        <Gift className="mx-auto text-yellow-400 mb-2" />

        <p className="text-white font-bold">15% DESCUENTO</p>

        <p className="text-white/50 text-sm mb-3">
          Escanea el QR o usa el código
        </p>

        <div className="bg-white p-2 rounded-xl w-fit mx-auto">
          <QRCodeSVG value="https://micuate.es" size={120} />
        </div>

        <p className="text-yellow-400 font-bold mt-3">
          BARBERPRO15
        </p>
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex flex-col gap-2">
        <a
          className="btn-primary text-center"
          href="https://micuate.es"
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size={14} /> Visitar web
        </a>

        <a className="btn-secondary text-center" href="tel:672598458">
          <Phone size={14} /> Llamar
        </a>

        <a
          className="btn-secondary text-center"
          href="https://maps.google.com/?q=Balanguera+14+Palma"
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={14} /> Cómo llegar
        </a>
      </div>

      <p className="text-center text-white/30 text-xs mt-4">
        Mi Cuate Bar Restaurant · Palma de Mallorca
      </p>
    </div>
  );
}
