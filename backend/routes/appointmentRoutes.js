import express from 'express';
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
} from '../controllers/appointmentController.js';

const router = express.Router();

router.route('/')
  .post(createAppointment)
  .get(getAppointments);

router.route('/:id/status')
  .put(updateAppointmentStatus);

export default router;
