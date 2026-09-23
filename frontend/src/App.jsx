import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import CustomerView from './components/CustomerView';
import ProviderDashboard from './components/ProviderDashboard';

export default function App() {
  const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER' | 'PROVIDER'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'customer' | 'provider'
  const [customerSubTab, setCustomerSubTab] = useState('catalog'); // 'catalog' | 'appointments'

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'CUSTOMER') {
      setActiveTab('customer');
    } else {
      setActiveTab('provider');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Top Header Navbar */}
      <Navbar
        role={role}
        setRole={handleRoleChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Container */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && (
          <HomeHero
            setRole={handleRoleChange}
            setActiveTab={setActiveTab}
          />
        )}

        {(activeTab === 'customer' || (activeTab !== 'home' && role === 'CUSTOMER')) && (
          <CustomerView
            subTab={customerSubTab}
            setSubTab={setCustomerSubTab}
          />
        )}

        {(activeTab === 'provider' || (activeTab !== 'home' && role === 'PROVIDER')) && (
          <ProviderDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-slate-300">© 2026 ServiceSpot — Service Appointment Management System</p>
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">React + Vite</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">Express Node.js</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">MongoDB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
