# BarberPro 💈

Sistema profesional de gestión para peluquería y barbería. PWA instalable, lista para Capacitor APK.

## Accesos de prueba

| Rol       | Correo                  | Contraseña |
|-----------|-------------------------|------------|
| Admin     | admin@barberpro.com     | admin123   |
| Empleado  | juan@barberpro.com      | emp123     |
| Cliente   | carlos@email.com        | client123  |

## Características

- 🔐 **Autenticación** — 3 roles (Admin / Empleado / Cliente), sesión persistente
- 📊 **Dashboard** — estadísticas en tiempo real (Admin/Empleado)
- 👥 **Clientes** — CRM completo con historial y puntos de fidelidad
- 📅 **Reservas** — detección de duplicados, bloqueo de horarios ocupados
- 👨‍💼 **Empleados** — gestión con horarios semanales
- ✂️ **Servicios** — catálogo con precios y duraciones
- 🍽️ **Restaurante Mi Cuate** — QR de promoción, cupón post-cita
- 💬 **WhatsApp** — confirmación, recordatorio y agradecimiento con plantillas editables
- ⚙️ **Configuración** — datos del negocio, plantillas WhatsApp

## Stack

- React 18 + TypeScript + Vite 5
- Tailwind CSS (tema oscuro premium + dorado)
- Zustand (estado global + localStorage)
- PWA con vite-plugin-pwa (service worker, manifest)
- Capacitor configurado para APK Android

## Clonar y ejecutar

```bash
git clone https://github.com/wavoxoficial/mi-cuate-peluquer-a-
cd mi-cuate-peluquer-a-/barbershop-app
npm install
npm run dev
```

La app estará en `http://localhost:5000`

## Build producción

```bash
npm run build
# Sirve el contenido de dist/
```

## Generar APK Android (Capacitor)

```bash
npm run build
npx cap sync
npx cap open android
# Luego Build > Generate Signed APK en Android Studio
```

## Estructura del proyecto

```
barbershop-app/
  src/
    components/
      auth/         — Login, Register, ForgotPassword, AuthGuard, ProfilePage
      dashboard/    — Dashboard principal
      clients/      — Módulo de clientes
      bookings/     — Reservas (bloqueo horarios, duplicados)
      employees/    — Módulo de empleados
      services/     — Catálogo de servicios
      restaurant/   — Mi Cuate (cupón/QR post-cita)
      settings/     — Configuración negocio + WhatsApp
      layout/       — Header (con rol) y BottomNav (por rol)
      ui/           — Modal, StatusBadge
    store/
      useStore.ts      — Estado principal (clientes, reservas, etc.)
      useAuthStore.ts  — Autenticación y sesión
    types/index.ts     — TypeScript types (User, Booking, etc.)
    utils/
      seed.ts         — Datos iniciales
      storage.ts      — localStorage helpers
      whatsapp.ts     — Templates de mensajes
```

## Variables de entorno

No se requieren. Todo funciona con localStorage.
