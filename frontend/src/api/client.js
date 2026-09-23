import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Services API
export const getServices = async () => {
  const res = await api.get('/services');
  return res.data;
};

export const createService = async (serviceData) => {
  const res = await api.post('/services', serviceData);
  return res.data;
};

// Slots API
export const getSlots = async (params = {}) => {
  const res = await api.get('/slots', { params });
  return res.data;
};

export const createSlot = async (slotData) => {
  const res = await api.post('/slots', slotData);
  return res.data;
};

// Appointments API
export const getAppointments = async (params = {}) => {
  const res = await api.get('/appointments', { params });
  return res.data;
};

export const createAppointment = async (appointmentData) => {
  const res = await api.post('/appointments', appointmentData);
  return res.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const res = await api.put(`/appointments/${id}/status`, { status });
  return res.data;
};

// Seed API
export const seedDatabase = async () => {
  const res = await api.post('/seed');
  return res.data;
};

export default api;
