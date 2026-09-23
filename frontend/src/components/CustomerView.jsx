import React, { useState, useEffect } from 'react';
import { Scissors, Clock, ArrowRight, RefreshCw, CalendarCheck2, Layers, AlertCircle } from 'lucide-react';
import { getServices } from '../api/client';
import SlotSelection from './SlotSelection';
import CustomerAppointments from './CustomerAppointments';

export default function CustomerView({ subTab, setSubTab }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [bookedAppointmentToast, setBookedAppointmentToast] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getServices();
      if (data.success) {
        setServices(data.data);
      } else {
        setError('No services available.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const categories = ['ALL', ...new Set(services.map((s) => s.category || 'General'))];

  const filteredServices = selectedCategory === 'ALL'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  // Handle Slot Selection View
  if (selectedService) {
    return (
      <SlotSelection
        service={selectedService}
        onBack={() => setSelectedService(null)}
        onBookingComplete={(newApp) => {
          setSelectedService(null);
          setBookedAppointmentToast(newApp);
          setSubTab('appointments');
        }}
      />
    );
  }

  // Handle My Appointments View (PAGE 4)
  if (subTab === 'appointments') {
    return (
      <div>
        {bookedAppointmentToast && (
          <div className="max-w-5xl mx-auto px-4 pt-4">
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm font-bold flex justify-between items-center shadow-lg">
              <span>🎉 Booking Confirmed! Your appointment for {bookedAppointmentToast.serviceName} on {bookedAppointmentToast.date} @ {bookedAppointmentToast.startTime} is saved.</span>
              <button onClick={() => setBookedAppointmentToast(null)} className="text-xs opacity-75 hover:opacity-100">Dismiss</button>
            </div>
          </div>
        )}
        <CustomerAppointments />
      </div>
    );
  }

  // Handle Services Catalog View (PAGE 2)
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>CUSTOMER VIEW</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Browse Services & Book Slots</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Select a service, view real-time open slots, and book your appointment instantly.</p>
        </div>

        {/* Customer Navigation Sub-Tabs */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shrink-0 shadow-inner">
          <button
            onClick={() => setSubTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
              subTab === 'catalog' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Services Catalog
          </button>
          <button
            onClick={() => setSubTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
              subTab === 'appointments' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span>My Appointments</span>
          </button>
        </div>
      </div>

      {/* Category Filters */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 shadow-sm shadow-indigo-500/10'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading & Error States */}
      {loading ? (
        <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800/80">
          <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300 font-semibold text-sm">Fetching real-time services from backend...</p>
        </div>
      ) : error ? (
        <div className="glass-panel p-10 text-center rounded-3xl border border-red-500/30 text-red-300">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <p className="font-bold text-lg">{error}</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-3xl text-slate-400 border border-slate-800/80">
          <Scissors className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h4 className="text-lg font-bold text-slate-300">No Services Available</h4>
          <p className="text-xs mt-1 text-slate-400">No services matched the selected category. Switch to Provider mode to create new services.</p>
        </div>
      ) : (
        /* Services Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="glass-card p-6 rounded-3xl border border-slate-800/80 flex flex-col justify-between group hover:border-indigo-500/50 transition duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {service.category || 'General Service'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {service.duration}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {service.name}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-6 font-normal">
                  {service.description || 'Professional service with guaranteed customer satisfaction.'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mb-5">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Service Price</span>
                    <span className="text-2xl font-black text-emerald-400">₹{service.price}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Provider</span>
                    <span className="text-xs font-semibold text-slate-300">{service.providerName || 'ProCare'}</span>
                  </div>
                </div>

                <button
                  id={`view-slots-btn-${service._id}`}
                  onClick={() => setSelectedService(service)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition duration-200 transform group-hover:translate-x-0.5 cursor-pointer"
                >
                  <span>View Available Slots</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
