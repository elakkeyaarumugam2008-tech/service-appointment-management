import React from 'react';
import { UserCheck, ShieldCheck, Scissors, Wrench, Headphones } from 'lucide-react';

export default function HomeHero({ setRole, setActiveTab }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20 text-center relative">
      
      {/* Hero Badge */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-md">
        <SparklesIcon className="w-4 h-4 text-indigo-400" />
        <span>Generic Service Appointment Platform</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-6">
        Service Appointment <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
          Management System
        </span>
      </h1>

      {/* Subtitle / Description */}
      <p className="text-base sm:text-xl font-medium text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        "Book services. Choose your time. Manage appointments seamlessly."
      </p>

      {/* Action Buttons: Customer & Provider */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <button
          id="hero-btn-customer"
          onClick={() => {
            setRole('CUSTOMER');
            setActiveTab('customer');
          }}
          className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <UserCheck className="w-5 h-5" />
          <span>Browse Services</span>
        </button>

        <button
          id="hero-btn-provider"
          onClick={() => {
            setRole('PROVIDER');
            setActiveTab('provider');
          }}
          className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-base border border-slate-700/80 shadow-lg transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Provider Dashboard</span>
        </button>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
        <div className="glass-card p-6 rounded-2xl border border-slate-800/80">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
            <Scissors className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-white mb-2">Salons & Beauty</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Haircuts, styling, and grooming services with instant real-time slot booking.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800/80">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 text-sky-400">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-white mb-2">Repair Shops</h3>
          <p className="text-xs text-slate-400 leading-relaxed">AC servicing, appliance repairs, technician maintenance, and home visits.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800/80">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
            <Headphones className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-white mb-2">Consultants</h3>
          <p className="text-xs text-slate-400 leading-relaxed">1-on-1 expert advisory sessions, code reviews, and technical guidance.</p>
        </div>
      </div>

    </div>
  );
}

function SparklesIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  );
}
