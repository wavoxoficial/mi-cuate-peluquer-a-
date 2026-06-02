import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/useAuthStore';
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
    <div className="bg-dark-400 flex flex-col max-w-md mx-auto relative"
         style={{ minHeight: '100svh' }}>
      <Toaster
        position="top-center"
        containerStyle={{ top: 60 }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#141414',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.875rem',
            fontSize: '14px',
            maxWidth: '340px',
          },
          success: { iconTheme: { primary: '#d4a017', secondary: '#000' } },
        }}
      />
      <Header />
      <main className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' } as any}>
        <Routes>
          {/* Profile — all roles */}
          <Route path="/profile"    element={<ProfilePage />} />
          {/* Restaurant — all roles */}
          <Route path="/restaurant" element={<Restaurant />} />
          {/* Bookings — all roles (filtered by role inside) */}
          <Route path="/bookings"   element={<Bookings />} />

          {/* Admin + Employee */}
          {(role === 'admin' || role === 'employee') && <>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/clients"   element={<Clients />} />
          </>}

          {/* Admin only */}
          {role === 'admin' && <>
            <Route path="/employees" element={<Employees />} />
            <Route path="/services"  element={<Services />} />
            <Route path="/settings"  element={<Settings />} />
          </>}

          {/* Client home → bookings */}
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

export default function App() {
  const initStore = useStore(s => s.init);
  const { init: initAuth, session, isLoading } = useAuthStore();

  useEffect(() => {
    initAuth();
    initStore();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-svh bg-dark-400 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gold-600 flex items-center justify-center animate-pulse">
            <span className="text-2xl">💈</span>
          </div>
          <p className="text-white/30 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {session ? <AppShell /> : <AuthFlow />}
    </BrowserRouter>
  );
}
