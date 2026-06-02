import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';
import BottomNav from './components/layout/BottomNav';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import Clients from './components/clients/Clients';
import Bookings from './components/bookings/Bookings';
import Employees from './components/employees/Employees';
import Services from './components/services/Services';
import Restaurant from './components/restaurant/Restaurant';
import Settings from './components/settings/Settings';

export default function App() {
  const init = useStore(s => s.init);
  useEffect(() => { init(); }, [init]);

  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-dark-400 flex flex-col max-w-md mx-auto relative">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#141414',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
            success: { iconTheme: { primary: '#d4a017', secondary: '#000' } },
          }}
        />
        <Header />
        <main className="flex-1 overflow-y-auto pb-20">
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/clients"    element={<Clients />} />
            <Route path="/bookings"   element={<Bookings />} />
            <Route path="/employees"  element={<Employees />} />
            <Route path="/services"   element={<Services />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/settings"   element={<Settings />} />
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
