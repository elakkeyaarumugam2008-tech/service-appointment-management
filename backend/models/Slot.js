import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service ID is required'],
  },
  date: {
    type: String, // YYYY-MM-DD
    required: [true, 'Slot date is required'],
  },
  startTime: {
    type: String, // e.g. "10:00 AM"
    required: [true, 'Start time is required'],
  },
  endTime: {
    type: String, // e.g. "10:30 AM"
    required: [true, 'End time is required'],
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  providerId: {
    type: String,
    default: 'prov_1',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Slot', slotSchema);
