import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Scissors } from 'lucide-react';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/useAuthStore';
import { useNotificationStore } from './store/useNotificationStore';
import BottomNav from './components/layout/BottomNav';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import Clients from './components/clients/Clients';
import Bookings from './components/bookings/Bookings';
import Employees from './components/employees/Employees';
import Services from './components/services/Services';
import Restaurant from './components/restaurant/Restaurant';
import Settings from './components/settings/Settings';
import ProfilePage from './components/auth/ProfilePage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';

type AuthScreen = 'login' | 'register' | 'forgot';

function AuthFlow() {
  const [screen, setScreen] = useState<AuthScreen>('login');
  if (screen === 'register') return <RegisterPage onLogin={() => setScreen('login')} />;
  if (screen === 'forgot')   return <ForgotPasswordPage onLogin={() => setScreen('login')} />;
  return (
    <LoginPage
      onRegister={() => setScreen('register')}
      onForgot={() => setScreen('forgot')}
    />
  );
}

function AppShell() {
  const session = useAuthStore(s => s.session);
  const role    = session?.role ?? 'client';

  return (
    <div style={{ minHeight: '100svh', background: '#09090b', display: 'flex', flexDirection: 'column', maxWidth: '448px', margin: '0 auto', position: 'relative' }}>
      <Toaster
        position="top-center"
        containerStyle={{ top: 64 }}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(22,22,24,0.98)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '0.875rem',
            fontSize: '13px',
            fontWeight: '500',
            maxWidth: '320px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          },
          success: { iconTheme: { primary: '#c9981a', secondary: '#000' } },
        }}
      />
      <Header />
      <main className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' } as any}>
        <Routes>
          <Route path="/profile"    element={<ProfilePage />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/bookings"   element={<Bookings />} />

          {(role === 'admin' || role === 'employee') && <>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/clients"   element={<Clients />} />
          </>}

          {role === 'admin' && <>
            <Route path="/employees" element={<Employees />} />
            <Route path="/services"  element={<Services />} />
            <Route path="/settings"  element={<Settings />} />
          </>}

          {role === 'client' && (
            <Route path="/" element={<Navigate to="/bookings" replace />} />
          )}

          <Route path="*" element={<Navigate to={role === 'client' ? '/bookings' : '/'} replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

/* ── Loading screen ─────────────────────────────────────────── */
function Loader() {
  return (
    <div style={{
      minHeight: '100svh', background: '#09090b',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem'
    }}>
      {/* Animated logo */}
      <div style={{ position: 'relative' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #c9981a, #f0c040)', boxShadow: '0 0 40px rgba(201,152,26,0.5)' }}>
          <Scissors size={28} className="text-black" strokeWidth={2.5} />
        </div>
        {/* Ring pulse */}
        <div style={{
          position: 'absolute', inset: -6, borderRadius: '1.375rem',
          border: '1.5px solid rgba(201,152,26,0.35)',
          animation: 'ringFade 1.4s ease-out infinite',
        }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 18 }}>BarberPro</p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, marginTop: 4 }}>Cargando sistema...</p>
      </div>
      <style>{`
        @keyframes ringFade {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const initStore = useStore(s => s.init);
  const { init: initAuth, session, isLoading } = useAuthStore();
  const initNotif = useNotificationStore(s => s.init);

  useEffect(() => {
    initAuth();
    initStore();
    initNotif();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <BrowserRouter>
      {session ? <AppShell /> : <AuthFlow />}
    </BrowserRouter>
  );
}
