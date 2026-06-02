---
name: BarberPro Auth System
description: localStorage-based auth with 3 roles (admin/employee/client), session persistence, route protection by role.
---

## Auth Design

- Store: `src/store/useAuthStore.ts` (Zustand + localStorage)
- Storage keys prefixed `barberpro_auth_users` / `barberpro_auth_session`
- Passwords stored as plain text (no server — localStorage only)
- 3 roles: `admin`, `employee`, `client`

## Default demo accounts
- admin@barberpro.com / admin123
- juan@barberpro.com / emp123
- carlos@email.com / client123

## Route access by role
- admin: everything
- employee: dashboard, bookings, clients (read), restaurant, profile
- client: bookings (own only), restaurant, profile

## Key decisions
**Why plain passwords:** App is entirely client-side with no server. localStorage is not a security boundary. Noted in README for production upgrade path.

**Why separate auth store:** Keeps auth state independent from app data store; easier to swap for real auth later.
