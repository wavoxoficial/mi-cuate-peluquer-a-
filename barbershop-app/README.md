# BarberPro 💈

Sistema profesional de gestión para peluquería y barbería.

## Características

- 📊 **Dashboard** — estadísticas en tiempo real
- 👥 **Clientes** — CRM completo con historial y fidelización
- 📅 **Reservas** — agenda visual con confirmaciones
- 👨‍💼 **Empleados** — gestión con horarios semanales
- ✂️ **Servicios** — catálogo con precios y duraciones
- 🍽️ **Restaurante Mi Cuate** — integración promocional con QR

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (tema oscuro + dorado)
- Zustand (estado global)
- PWA (instalable como app)
- Capacitor (lista para APK)

## Desarrollo

```bash
npm install
npm run dev
```

## Producción / APK

```bash
npm run build
npx cap add android
npx cap sync
npx cap open android
```

## Estructura

```
src/
  components/
    dashboard/    — Dashboard principal
    clients/      — Módulo de clientes
    bookings/     — Módulo de reservas
    employees/    — Módulo de empleados
    services/     — Catálogo de servicios
    restaurant/   — Sección Mi Cuate
    layout/       — Header y BottomNav
    ui/           — Componentes reutilizables
  store/          — Zustand store
  types/          — TypeScript types
  utils/          — Helpers y seed data
```
