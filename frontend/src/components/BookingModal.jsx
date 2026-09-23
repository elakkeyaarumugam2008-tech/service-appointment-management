import React, { useState } from 'react';
import { X, Calendar, Clock, User, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { createAppointment } from '../api/client';

export default function BookingModal({ service, slot, onClose, onSuccess }) {
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const response = await createAppointment({
        customerName: customerName.trim(),
        slotId: slot._id,
        serviceId: service._id,
      });

      if (response.success) {
        onSuccess(response.data);
      } else {
        setErrorMsg(response.message || 'This slot is no longer available.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      const serverMessage = err.response?.data?.message || 'This slot is no longer available.';
      setErrorMsg(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">Confirm Booking</h3>
            <p className="text-xs text-slate-400">Enter your details to reserve this slot.</p>
          </div>
        </div>

        {/* Service & Slot Details Summary */}
        <div className="bg-slate-900/90 rounded-2xl p-4 mb-6 border border-slate-800 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Service:</span>
            <span className="font-bold text-white">{service.name}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Duration & Price:</span>
            <span className="font-bold text-indigo-300">{service.duration} • ₹{service.price}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Date:</span>
            <span className="font-bold text-white">{slot.date}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Time Slot:</span>
            <span className="font-extrabold text-amber-300">{slot.startTime} - {slot.endTime}</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-2.5 border-t border-slate-800">
            <span className="text-slate-400 font-medium">Provider:</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">{service.providerName || 'ProCare Services'}</span>
          </div>
        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start space-x-3 text-red-300 text-xs">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Booking Failed</p>
              <p className="text-xs mt-0.5 text-red-300/90">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Customer Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-2">
              Your Name *
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              id="confirm-book-btn"
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Book Appointment</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
