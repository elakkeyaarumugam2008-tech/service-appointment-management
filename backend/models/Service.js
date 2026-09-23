import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  duration: {
    type: String, // e.g. "30 min", "60 min"
    required: [true, 'Service duration is required'],
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: 0,
  },
  category: {
    type: String,
    default: 'General',
  },
  providerName: {
    type: String,
    default: 'ProCare Services',
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

export default mongoose.model('Service', serviceSchema);
