import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import serviceRoutes from './routes/serviceRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import seedRoutes from './routes/seedRoutes.js';

import Service from './models/Service.js';
import { seedDatabase } from './controllers/seedController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend local development
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());

// API Routes
app.use('/api/services', serviceRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/seed', seedRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Service Appointment API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect DB and Start Server
const startServer = async () => {
  await connectDB();

  // Auto-seed if database is empty
  try {
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('[Seed] Database is empty. Seeding initial demo data...');
      await seedDatabase();
      console.log('[Seed] Initial hackathon demo data seeded successfully!');
    }
  } catch (err) {
    console.warn('[Seed Warning] Could not auto-seed database:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 PS46 Backend Server running on http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
};

startServer();
