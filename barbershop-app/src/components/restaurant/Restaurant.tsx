import { useState, useEffect } from 'react';
import { ExternalLink, MapPin, Phone, Clock, Star, Gift, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';

function CouponModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onPointerDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-panel slide-up" onPointerDown={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">🎁 Tu cupón exclusivo</h2>
          <button onClick={onClose} className="icon-btn"><X size={15} /></button>
        </div>
        <div className="p-5 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gold-600/20 border border-gold-600/30 flex items-center justify-center text-3xl">
            🍽️
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">¡Gracias por visitarnos!</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Presenta este cupón o QR en <span className="text-gold-400 font-semibold">Mi Cuate</span> y disfruta de una promoción exclusiva para clientes de la peluquería.
            </p>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-gold">
            <QRCodeSVG
              value="https://restaurantemicuate.com/promo-barberpro"
              size={130}
              bgColor="#ffffff"
              fgColor="#0a0a0a"
              level="M"
            />
          </div>
          <div className="bg-gold-600/10 border border-gold-600/30 rounded-2xl px-6 py-3 w-full">
            <p className="text-xs text-white/40 mb-1">Código de descuento</p>
            <p className="text-gold-400 font-bold text-2xl tracking-widest">BARBERPRO15</p>
            <p className="text-xs text-white/30 mt-1">15% de descuento en tu consumo</p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <a href="https://restaurantemicuate.com" target="_blank" rel="noopener noreferrer"
              className="btn-primary w-full text-sm">
              <ExternalLink size={14} /> Visitar Mi Cuate
            </a>
            <button onClick={onClose} className="btn-secondary w-full text-sm">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Restaurant() {
  const [showCoupon, setShowCoupon]       = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const { bookings }  = useStore();
  const session       = useAuthStore(s => s.session);

  // Show coupon popup if there's a recently-completed booking (last 2 minutes)
  useEffect(() => {
    const cutoff = Date.now() - 2 * 60 * 1000;
    const recent = bookings.find(b =>
      b.status === 'completed' &&
      new Date(b.createdAt).getTime() > cutoff // fallback: always show if from today
    );
    if (recent || bookings.some(b => b.status === 'completed' && b.date === new Date().toISOString().slice(0,10))) {
      const shown = sessionStorage.getItem('cuate_coupon_shown');
      if (!shown) {
        const timer = setTimeout(() => setShowCoupon(true), 600);
        sessionStorage.setItem('cuate_coupon_shown', '1');
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <div className="page">
      {showCoupon && <CouponModal onClose={() => setShowCoupon(false)} />}

      {/* Hero */}
      <div className="card-gold overflow-hidden fade-in">
        <div className="bg-gradient-to-br from-amber-900/50 via-dark-100 to-dark-300 p-6 text-center border-b border-gold-600/20">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-600 to-amber-700 flex items-center justify-center mx-auto mb-3 shadow-gold">
            <span className="text-4xl">🍽️</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Restaurante Mi Cuate</h2>
          <p className="text-gold-400/80 text-sm font-medium">Sabor auténtico, precio justo</p>
        </div>
        <div className="p-4">
          <p className="text-white/55 text-sm leading-relaxed text-center">
            El mejor restaurante de comida mexicana tradicional. Ingredientes frescos, recetas de generación en generación.
            <span className="text-gold-400 font-medium"> Aliado oficial de BarberPro</span> — disfruta de ofertas exclusivas para nuestros clientes.
          </p>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 fade-in">
        {[
          { icon: Clock, label: 'Horario',      value: 'Lun–Dom',    sub: '12:00 – 22:00' },
          { icon: Star,  label: 'Calificación', value: '4.8 ★',      sub: 'Clientes felices' },
          { icon: Phone, label: 'Reservas',     value: 'Llámanos',   sub: '+52 555 000 1234' },
          { icon: MapPin,label: 'Ubicación',    value: 'Centro',     sub: 'A 2 min de aquí' },
        ].map(item => (
          <div key={item.label} className="card p-3 text-center">
            <item.icon size={18} className="text-gold-400 mx-auto mb-1.5" />
            <p className="text-white font-semibold text-sm">{item.value}</p>
            <p className="text-white/30 text-xs">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Promo QR */}
      <div className="card-gold p-5 fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Gift size={16} className="text-gold-400" />
          <h3 className="text-gold-400 font-bold text-sm">Oferta exclusiva BarberPro</h3>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-white p-2.5 rounded-2xl shadow-gold flex-shrink-0">
            <QRCodeSVG
              value="https://restaurantemicuate.com/promo-barberpro"
              size={100}
              bgColor="#ffffff"
              fgColor="#0a0a0a"
              level="M"
              includeMargin={false}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm mb-1">15% de descuento</p>
            <p className="text-white/45 text-xs mb-3 leading-relaxed">
              Presenta este QR al pedir tu cuenta. Válido para todos los clientes de BarberPro.
            </p>
            <div className="bg-gold-600/10 border border-gold-600/20 rounded-xl p-2 text-center mb-2">
              <p className="text-gold-400 text-xs font-bold tracking-widest">BARBERPRO15</p>
            </div>
            <button onClick={() => setShowCoupon(true)}
              className="btn-primary w-full text-xs py-2">
              Ver cupón completo
            </button>
          </div>
        </div>
      </div>

      {/* Menu highlights */}
      <div className="card fade-in">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-base font-semibold text-white">Platillos destacados</h3>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { name: 'Tacos de Barbacoa',   price: '$85',  desc: 'Con salsa verde y cebolla' },
            { name: 'Pozole Rojo',         price: '$110', desc: 'Tradicional con tostadas' },
            { name: 'Enchiladas Verdes',   price: '$95',  desc: 'Con crema y queso' },
            { name: 'Cochinita Pibil',     price: '$120', desc: 'Con cebolla morada' },
          ].map(item => (
            <div key={item.name} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-white text-sm font-medium">{item.name}</p>
                <p className="text-white/40 text-xs">{item.desc}</p>
              </div>
              <span className="text-gold-400 font-bold text-sm flex-shrink-0 ml-2">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 fade-in">
        <a href="https://restaurantemicuate.com" target="_blank" rel="noopener noreferrer"
          className="btn-primary w-full py-3 text-sm">
          <ExternalLink size={15} /> Visitar sitio web
        </a>
        <a href="https://maps.google.com/?q=Restaurante+Mi+Cuate" target="_blank" rel="noopener noreferrer"
          className="btn-secondary w-full py-3 text-sm">
          <MapPin size={15} /> Ver en el mapa
        </a>
        <a href="tel:+525550001234"
          className="btn-secondary w-full py-3 text-sm">
          <Phone size={15} /> Llamar para reservar mesa
        </a>
      </div>

      <p className="text-center pb-2 fade-in">
        <span className="text-white/20 text-xs">🤝 Alianza comercial BarberPro × Mi Cuate</span>
      </p>
    </div>
  );
}
