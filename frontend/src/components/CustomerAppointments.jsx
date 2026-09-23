import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, RefreshCw, CheckCircle, Clock3, XCircle, Award } from 'lucide-react';
import { getAppointments } from '../api/client';

export default function CustomerAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterName, setFilterName] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAppointments({ customerName: filterName.trim() });
      if (data.success) {
        setAppointments(data.data);
      } else {
        setError('Failed to fetch appointments.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <CheckCircle className="w-3.5 h-3.5" /> ACCEPTED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" /> COMPLETED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
            <XCircle className="w-3.5 h-3.5" /> CANCELLED
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock3 className="w-3.5 h-3.5" /> PENDING
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
            <Calendar className="w-6 h-6 text-indigo-400" />
            <span>My Booked Appointments</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Track live appointment statuses updated by your service providers.</p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Filter by customer name..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchAppointments()}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
          />

          <button
            onClick={fetchAppointments}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition shadow-lg shadow-indigo-600/30 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-300 text-sm font-semibold">Loading your appointments...</p>
        </div>
      ) : error ? (
        <div className="glass-panel p-10 text-center rounded-3xl border border-red-500/30 text-red-300">
          <p className="font-bold">{error}</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800/80">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No Appointments Found</h3>
          <p className="text-xs text-slate-400 mt-1">You haven't booked any appointments yet, or no appointments match your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div
              key={app._id}
              className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Left Column: Service & Customer Info */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-lg text-white">{app.serviceName}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                    {app.providerName || 'ProCare'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-indigo-300">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    Customer: {app.customerName}
                  </span>
                  <span>•</span>
                  <span>Booked: {new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Middle Column: Date & Time */}
              <div className="flex items-center space-x-6 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800/80 shrink-0">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date</p>
                  <p className="font-bold text-white text-sm">📅 {app.date}</p>
                </div>
                <div className="h-6 w-px bg-slate-800"></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Time</p>
                  <p className="font-bold text-amber-300 text-sm">⏰ {app.startTime} - {app.endTime}</p>
                </div>
              </div>

              {/* Right Column: Status Badge */}
              <div className="shrink-0 flex items-center justify-between md:justify-end">
                <div className="md:hidden text-xs text-slate-400 font-medium">Status:</div>
                {getStatusBadge(app.status)}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
