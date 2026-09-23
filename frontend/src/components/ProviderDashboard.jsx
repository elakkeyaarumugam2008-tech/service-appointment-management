import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Calendar, Clock, CheckCircle2, XCircle, Award, RefreshCw, Scissors, Wrench, User } from 'lucide-react';
import { getServices, getSlots, getAppointments, updateAppointmentStatus } from '../api/client';
import ServiceFormModal from './ServiceFormModal';
import SlotFormModal from './SlotFormModal';

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState('appointments'); // appointments, services, slots
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const [srvRes, slotRes, appRes] = await Promise.all([
        getServices(),
        getSlots(),
        getAppointments(),
      ]);

      if (srvRes.success) setServices(srvRes.data);
      if (slotRes.success) setSlots(slotRes.data);
      if (appRes.success) setAppointments(appRes.data);
    } catch (err) {
      console.error('Provider data load error:', err);
      showToast('error', 'Unable to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setActionLoadingId(id);
      const res = await updateAppointmentStatus(id, newStatus);
      if (res.success) {
        showToast('success', `Appointment status updated to ${newStatus}`);
        loadData();
      } else {
        showToast('error', res.message || 'Status update failed');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to update status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Toast Notification Banner */}
      {statusMessage.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center justify-between shadow-lg text-sm font-bold ${
          statusMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' : 'bg-red-500/20 text-red-200 border border-red-500/30'
        }`}>
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage({ type: '', text: '' })} className="text-xs opacity-75 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {/* Provider Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PROVIDER DASHBOARD</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Service & Booking Management</h2>
          <p className="text-xs text-slate-400 mt-1">Manage offered services, add available time slots, and respond to appointments.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="provider-add-service-btn"
            onClick={() => setIsServiceModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>

          <button
            id="provider-add-slot-btn"
            onClick={() => setIsSlotModalOpen(true)}
            disabled={services.length === 0}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-amber-600/30 transition disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>

          <button
            onClick={loadData}
            title="Reload Data"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dashboard Sub-Tabs Navigation */}
      <div className="flex border-b border-slate-800/80 mb-8 space-x-8">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'appointments'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Customer Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'services'
              ? 'border-indigo-400 text-indigo-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Services Catalog ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('slots')}
          className={`pb-3 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'slots'
              ? 'border-violet-400 text-violet-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Available Slots ({slots.filter(s => !s.isBooked).length})</span>
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS LIST */}
      {activeTab === 'appointments' && (
        <div>
          {loading ? (
            <div className="glass-panel p-12 text-center rounded-2xl">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
              <p className="text-slate-300 text-sm">Fetching appointments from database...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-300">No Appointments Yet</h3>
              <p className="text-xs text-slate-400 mt-1">When customers book slots, their bookings will appear here for your response.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((app) => (
                <div
                  key={app._id}
                  className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Info Column */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-indigo-300 border border-slate-800">
                        {app.serviceName}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        app.status === 'ACCEPTED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        app.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        app.status === 'CANCELLED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        Status: {app.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-white font-bold text-lg">
                      <User className="w-5 h-5 text-indigo-400 shrink-0" />
                      <span>Customer: {app.customerName}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-slate-300">
                      <span>📅 Date: <strong className="text-white">{app.date}</strong></span>
                      <span>•</span>
                      <span>⏰ Time: <strong className="text-amber-300">{app.startTime} - {app.endTime}</strong></span>
                    </div>
                  </div>

                  {/* Status Change Action Buttons: Accept / Cancel / Complete */}
                  <div className="flex items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <button
                      id={`accept-btn-${app._id}`}
                      disabled={actionLoadingId === app._id || app.status === 'ACCEPTED'}
                      onClick={() => handleStatusUpdate(app._id, 'ACCEPTED')}
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        app.status === 'ACCEPTED'
                          ? 'bg-blue-900/40 text-blue-400 cursor-default opacity-60'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>

                    <button
                      id={`complete-btn-${app._id}`}
                      disabled={actionLoadingId === app._id || app.status === 'COMPLETED'}
                      onClick={() => handleStatusUpdate(app._id, 'COMPLETED')}
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        app.status === 'COMPLETED'
                          ? 'bg-emerald-900/40 text-emerald-400 cursor-default opacity-60'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>

                    <button
                      id={`cancel-btn-${app._id}`}
                      disabled={actionLoadingId === app._id || app.status === 'CANCELLED'}
                      onClick={() => handleStatusUpdate(app._id, 'CANCELLED')}
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        app.status === 'CANCELLED'
                          ? 'bg-red-900/40 text-red-400 cursor-default opacity-60'
                          : 'bg-red-600/80 hover:bg-red-600 text-white border border-red-500/50'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SERVICES CATALOG */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div key={srv._id} className="glass-card p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    {srv.category || 'General'}
                  </span>
                  <span className="text-xs text-slate-400">{srv.duration}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{srv.name}</h3>
                <p className="text-xs text-slate-300 mb-4">{srv.description || 'No description provided.'}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400">Price:</span>
                <span className="text-xl font-extrabold text-emerald-400">₹{srv.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SLOTS LIST */}
      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((slot) => (
            <div key={slot._id} className="glass-panel p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-white text-sm">
                  {slot.serviceId?.name || 'Service Slot'}
                </p>
                <p className="text-xs text-slate-400">📅 {slot.date}</p>
                <p className="text-xs font-bold text-amber-300 mt-1">⏰ {slot.startTime} - {slot.endTime}</p>
              </div>
              <div>
                {slot.isBooked ? (
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    BOOKED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    AVAILABLE
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {isServiceModalOpen && (
        <ServiceFormModal
          onClose={() => setIsServiceModalOpen(false)}
          onSuccess={() => {
            setIsServiceModalOpen(false);
            showToast('success', 'New service created successfully!');
            loadData();
          }}
        />
      )}

      {isSlotModalOpen && (
        <SlotFormModal
          services={services}
          onClose={() => setIsSlotModalOpen(false)}
          onSuccess={() => {
            setIsSlotModalOpen(false);
            showToast('success', 'New slot created successfully!');
            loadData();
          }}
        />
      )}

    </div>
  );
}
