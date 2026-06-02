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
          <button onClick={onClose}><X size={15} /></button>
        </div>

        <div className="p-5 flex flex-col items-center gap-4 text-center">

          <div className="text-3xl">🍽️</div>

          <div>
            <h3 className="text-lg font-bold text-white">¡Bienvenido a Mi Cuate!</h3>
            <p className="text-white/60 text-sm">
              Disfruta tu descuento exclusivo en nuestro restaurante.
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
            <p className="text-yellow-400 font-bold text-xl tracking-widest">BARBERPRO15</p>
            <p className="text-white/60 text-xs mt-1">15% de descuento en tu consumo</p>
          </div>

          <button onClick={onClose} className="w-full bg-white/10 text-white py-2 rounded-xl">
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
  const session = useAuthStore(s => s.session);

  useEffect(() => {
    const cutoff = Date.now() - 2 * 60 * 1000;

    const recent = bookings.find(b =>
      b.status === 'completed' &&
      new Date(b.createdAt).getTime() > cutoff
    );

    if (recent) {
      const shown = sessionStorage.getItem('coupon_shown');
      if (!shown) {
        setTimeout(() => setShowCoupon(true), 600);
        sessionStorage.setItem('coupon_shown', '1');
      }
    }
  }, []);

  return (
    <div className="page">

      {showCoupon && <CouponModal onClose={() => setShowCoupon(false)} />}

      {/* HERO */}
      <div className="card">

        <div className="text-center p-6">

          <div className="text-5xl mb-3">🍽️</div>

          <h1 className="text-2xl font-bold text-white">
            Mi Cuate Bar Restaurant
          </h1>

          <p className="text-yellow-400 mt-1">
            Sabor, Amigos y Buena Vibra
          </p>

        </div>

        <div className="px-4 pb-5 text-center text-white/60 text-sm">
          Comida latina y mexicana, bebidas, cachimbas y cenas en ambiente premium.
          Sabor auténtico en Palma de Mallorca.
        </div>

      </div>

      {/* INFO */}
      <div className="grid grid-cols-2 gap-3 mt-4">

        <div className="card p-3 text-center">
          <Clock className="mx-auto text-yellow-400" />
          <p className="text-white mt-1 text-sm">12:00 - 22:00</p>
          <p className="text-white/40 text-xs">Martes a Domingo</p>
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

        <p className="text-yellow-400 font-bold mt-3">BARBERPRO15</p>

      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex flex-col gap-2">

        <a className="btn-primary text-center"
           href="https://micuate.es"
           target="_blank">
          <ExternalLink size={14}/> Visitar web
        </a>

        <a className="btn-secondary text-center"
           href="tel:672598458">
          <Phone size={14}/> Llamar
        </a>

        <a className="btn-secondary text-center"
           href="https://maps.google.com/?q=Balanguera+14+Palma">
          <MapPin size={14}/> Cómo llegar
        </a>

      </div>

      <p className="text-center text-white/30 text-xs mt-4">
        Mi Cuate Bar Restaurant · Palma de Mallorca
      </p>

    </div>
  );
}            <p className="text-xs text-white/30 mt-1">15% de descuento en tu consumo</p>
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
