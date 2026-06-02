---
name: BarberPro Android CSS Fixes
description: CSS rules required for correct rendering on Android Chrome and PWA.
---

## Key rules applied (index.css)

- `font-size: 16px !important` on all inputs/selects — prevents Android zoom-on-focus
- `-webkit-appearance: none; appearance: none` on select/input[date/time] — removes Android default chrome
- `min-height: 44px` on buttons, `min-height: 48px` on inputs — meets touch target requirements
- `touch-action: manipulation` on buttons/nav — removes 300ms tap delay
- `-webkit-transform: translateZ(0)` on cards — prevents rendering artifacts
- `overscroll-behavior: contain` on modal overlay — prevents background scroll leakage
- `min-height: 100svh` (not `dvh`) — prevents layout shift from address bar
- `env(safe-area-inset-bottom)` on BottomNav paddingBottom and `.page` padding
- Body: `position: fixed; top: -scrollY` technique in Modal.tsx to lock scroll without layout shift

## Why
Android Chrome has well-known bugs with `fixed` elements + keyboard, `dvh` layout shifts, and font zoom on input focus. These rules collectively prevent the visual artifacts reported.
