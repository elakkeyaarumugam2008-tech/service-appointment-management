import React from 'react';
import { Calendar, UserCheck, ShieldCheck, Database } from 'lucide-react';
import { seedDatabase } from '../api/client';

export default function Navbar({ role, setRole, activeTab, setActiveTab, onSeedSuccess }) {
  const [seeding, setSeeding] = React.useState(false);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedDatabase();
      if (onSeedSuccess) onSeedSuccess();
      alert('Demo data re-seeded successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to seed demo data. Is backend server running?');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab && setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">ServiceSpot</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 tracking-wider">PS46</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Service Appointment Management System</p>
          </div>
        </div>

        {/* Role Switcher Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Active Role Indicator Badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
            {role === 'CUSTOMER' ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">Role: CUSTOMER</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">Role: PROVIDER</span>
              </>
            )}
          </div>

          {/* Toggle Role Selector */}
          <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              id="role-btn-customer"
              onClick={() => {
                setRole('CUSTOMER');
                if (activeTab === 'home') setActiveTab('customer');
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-extrabold text-xs transition-all duration-200 ${
                role === 'CUSTOMER'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>CUSTOMER</span>
            </button>

            <button
              id="role-btn-provider"
              onClick={() => {
                setRole('PROVIDER');
                if (activeTab === 'home') setActiveTab('provider');
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-extrabold text-xs transition-all duration-200 ${
                role === 'PROVIDER'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PROVIDER</span>
            </button>
          </div>

          {/* Hackathon Reset/Seed Button */}
          <button
            onClick={handleSeed}
            disabled={seeding}
            title="Reset DB with Sample Data"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 hover:border-slate-700 transition shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{seeding ? 'Seeding...' : 'Seed Data'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
