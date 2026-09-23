import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Clock, CheckCircle, Ban, AlertCircle, RefreshCw } from 'lucide-react';
import { getSlots } from '../api/client';
import BookingModal from './BookingModal';

export default function SlotSelection({ service, onBack, onBookingComplete }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Default date filter to today
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getSlots({ serviceId: service._id });
      if (data.success) {
        setSlots(data.data);
      } else {
        setError('No available slots for this service.');
      }
    } catch (err) {
      console.error('Fetch slots error:', err);
      setError('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (service) {
      fetchSlots();
    }
  }, [service]);

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const d = slot.date || todayStr;
    if (!acc[d]) acc[d] = [];
    acc[d].push(slot);
    return acc;
  }, {});

  const availableDates = Object.keys(slotsByDate).sort();
  const currentSlots = slotsByDate[selectedDate] || slots;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition mb-6 group text-sm font-semibold"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Services</span>
      </button>

      {/* Selected Service Header Card */}
      <div className="glass-card p-6 rounded-2xl mb-8 border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
              {service.category || 'General Service'}
            </div>
            <h2 className="text-2xl font-extrabold text-white">{service.name}</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">{service.description}</p>
          </div>
          
          <div className="flex items-center space-x-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800 shrink-0">
            <div>
              <p className="text-xs text-slate-400">Duration</p>
              <p className="font-bold text-slate-200 text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {service.duration}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <p className="text-xs text-slate-400">Price</p>
              <p className="font-extrabold text-emerald-400 text-lg">₹{service.price}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slot Selection Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            <span>Select Available Appointment Slot</span>
          </h3>
          <p className="text-xs text-slate-400">Green slots are open for booking. Red/Grey slots are already booked.</p>
        </div>

        <button
          onClick={fetchSlots}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
          title="Refresh Slots"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="glass-panel p-12 text-center rounded-2xl">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Fetching real-time available slots from MongoDB...</p>
        </div>
      ) : error ? (
        <div className="glass-panel p-8 text-center rounded-2xl border border-amber-500/30 text-amber-300">
          <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-80" />
          <p className="font-bold text-lg">{error}</p>
        </div>
      ) : slots.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl text-slate-400">
          <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h4 className="text-lg font-bold text-slate-300">No Available Slots</h4>
          <p className="text-sm mt-1 max-w-md mx-auto">No appointment slots have been created for this service yet. Providers can add slots from the Provider Dashboard.</p>
        </div>
      ) : (
        <>
          {/* Date Selector Tabs (if multiple dates) */}
          {availableDates.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
              {availableDates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedDate === date
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  📅 {date}
                </button>
              ))}
            </div>
          )}

          {/* Slots Grid per spec */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {currentSlots.map((slot) => {
              const isSelected = selectedSlot?._id === slot._id;
              const isBooked = slot.isBooked;

              return (
                <button
                  key={slot._id}
                  disabled={isBooked}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between h-28 ${
                    isBooked
                      ? 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'bg-gradient-to-br from-indigo-900/80 to-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-indigo-500/50 hover:bg-slate-800/90'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-400">{slot.date}</span>
                    {isBooked ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                        <Ban className="w-2.5 h-2.5" /> Booked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" /> Available
                      </span>
                    )}
                  </div>

                  <div>
                    <p className={`text-base font-extrabold ${isBooked ? 'line-through text-slate-500' : 'text-amber-300'}`}>
                      {slot.startTime}
                    </p>
                    <p className="text-xs text-slate-400">to {slot.endTime}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Button: Book Appointment */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
            <div>
              {selectedSlot ? (
                <div>
                  <p className="text-xs text-slate-400 font-medium">Selected Appointment Slot:</p>
                  <p className="text-sm font-bold text-white">
                    📅 {selectedSlot.date} @ <span className="text-amber-300 font-extrabold">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-medium">Please select an available time slot above to proceed with booking.</p>
              )}
            </div>

            <button
              disabled={!selectedSlot || selectedSlot.isBooked}
              id="book-appointment-btn"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-indigo-600/30 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Book Appointment
            </button>
          </div>
        </>
      )}

      {/* Booking Confirmation Modal */}
      {isModalOpen && selectedSlot && (
        <BookingModal
          service={service}
          slot={selectedSlot}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(newAppointment) => {
            setIsModalOpen(false);
            onBookingComplete(newAppointment);
          }}
        />
      )}

    </div>
  );
}
