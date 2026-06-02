import { ExternalLink, MapPin, Phone, Clock, Star, Gift, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Restaurant() {
  return (
    <div className="page">
      {/* Hero */}
      <div className="card-gold overflow-hidden fade-in">
        {/* Banner */}
        <div className="bg-gradient-to-br from-amber-900/60 via-dark-100 to-dark-300 p-6 text-center border-b border-gold-600/20">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-600 to-amber-700 flex items-center justify-center mx-auto mb-4 shadow-gold-lg">
            <span className="text-4xl">🍽️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Restaurante Mi Cuate</h2>
          <p className="text-gold-400/80 text-sm font-medium">Sabor auténtico, precio justo</p>
        </div>

        {/* Description */}
        <div className="p-5">
          <p className="text-white/60 text-sm leading-relaxed text-center">
            El mejor restaurante de comida mexicana tradicional. Ingredientes frescos, recetas de generación en generación. 
            <span className="text-gold-400 font-medium"> Aliado oficial de BarberPro</span> — disfruta de ofertas exclusivas para nuestros clientes.
          </p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 fade-in">
        {[
          { icon: Clock, label: 'Horario', value: 'Lun–Dom', sub: '12:00 – 22:00' },
          { icon: Star,  label: 'Calificación', value: '4.8 ★', sub: 'Clientes felices' },
          { icon: Phone, label: 'Reservas', value: 'Llámanos', sub: '+52 555 000 1234' },
          { icon: MapPin,label: 'Ubicación', value: 'Centro', sub: 'A 2 min de aquí' },
        ].map(item => (
          <div key={item.label} className="card p-3 text-center">
            <item.icon size={18} className="text-gold-400 mx-auto mb-2" />
            <p className="text-white font-semibold text-sm">{item.value}</p>
            <p className="text-white/30 text-xs">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Promo QR */}
      <div className="card-gold p-5 fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Gift size={16} className="text-gold-400" />
          <h3 className="text-gold-400 font-bold">Oferta exclusiva BarberPro</h3>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-gold flex-shrink-0">
            <QRCodeSVG
              value="https://restaurantemicuate.com/promo-barberpro"
              size={110}
              bgColor="#ffffff"
              fgColor="#0a0a0a"
              level="M"
              includeMargin={false}
            />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold mb-1">15% de descuento</p>
            <p className="text-white/50 text-sm mb-3">Presenta este QR al pedir tu cuenta. Válido para todos los clientes de BarberPro.</p>
            <div className="bg-gold-600/10 border border-gold-600/20 rounded-xl p-2 text-center">
              <p className="text-gold-400 text-xs font-bold tracking-widest">BARBERPRO15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu highlights */}
      <div className="card fade-in">
        <div className="p-4 border-b border-white/5">
          <h3 className="section-title text-base">Platillos destacados</h3>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { name: 'Tacos de Barbacoa', price: '$85', desc: 'Con salsa verde y cebolla' },
            { name: 'Pozole Rojo', price: '$110', desc: 'Tradicional con tostadas' },
            { name: 'Enchiladas Verdes', price: '$95', desc: 'Con crema y queso' },
            { name: 'Cochinita Pibil', price: '$120', desc: 'Con cebolla morada' },
          ].map(item => (
            <div key={item.name} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-white text-sm font-medium">{item.name}</p>
                <p className="text-white/40 text-xs">{item.desc}</p>
              </div>
              <span className="text-gold-400 font-bold text-sm">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 fade-in">
        <a
          href="https://restaurantemicuate.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex items-center justify-center gap-2 py-3"
        >
          <ExternalLink size={16} /> Visitar sitio web
        </a>
        <a
          href="https://maps.google.com/?q=Restaurante+Mi+Cuate"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center justify-center gap-2 py-3"
        >
          <MapPin size={16} /> Ver en el mapa
        </a>
        <a
          href="tel:+525550001234"
          className="btn-secondary flex items-center justify-center gap-2 py-3"
        >
          <Phone size={16} /> Llamar para reservar mesa
        </a>
      </div>

      {/* Partnership badge */}
      <div className="text-center py-2 fade-in">
        <p className="text-white/20 text-xs">🤝 Alianza comercial BarberPro × Mi Cuate</p>
      </div>
    </div>
  );
}
