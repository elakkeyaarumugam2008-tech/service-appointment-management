import Appointment from '../models/Appointment.js';
import Slot from '../models/Slot.js';
import Service from '../models/Service.js';

// @desc    Book an appointment (Includes Double Booking Prevention)
// @route   POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { customerName, slotId, serviceId } = req.body;

    if (!customerName || !slotId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer name and select a time slot.',
      });
    }

    // Step 1: Check whether requested slot exists
    const existingSlot = await Slot.findById(slotId);
    if (!existingSlot) {
      return res.status(404).json({
        success: false,
        message: 'The requested slot does not exist.',
      });
    }

    // Step 2: Check whether slot is already booked
    if (existingSlot.isBooked) {
      return res.status(400).json({
        success: false,
        message: 'This slot is no longer available.',
      });
    }

    // Step 3: Atomic update to prevent race conditions / double bookings
    const updatedSlot = await Slot.findOneAndUpdate(
      { _id: slotId, isBooked: false },
      { isBooked: true },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(400).json({
        success: false,
        message: 'This slot is no longer available.',
      });
    }

    // Get Service details
    const service = await Service.findById(existingSlot.serviceId);
    const serviceName = service ? service.name : 'General Service';
    const providerName = service ? service.providerName : 'ProCare Services';

    // Step 4: Create Appointment
    const appointment = await Appointment.create({
      customerName,
      serviceId: existingSlot.serviceId,
      serviceName,
      slotId: existingSlot._id,
      providerId: existingSlot.providerId,
      providerName,
      date: existingSlot.date,
      startTime: existingSlot.startTime,
      endTime: existingSlot.endTime,
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: appointment,
    });
  } catch (error) {
    console.error('Error in createAppointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment. Please try again.',
      error: error.message,
    });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
export const getAppointments = async (req, res) => {
  try {
    const { customerName, status } = req.query;
    const filter = {};

    if (customerName) {
      filter.customerName = { $regex: customerName, $options: 'i' };
    }
    if (status) {
      filter.status = status.toUpperCase();
    }

    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error('Error in getAppointments:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch appointments.',
      error: error.message,
    });
  }
};

// @desc    Update appointment status (ACCEPTED, CANCELLED, COMPLETED)
// @route   PUT /api/appointments/:id/status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'ACCEPTED', 'CANCELLED', 'COMPLETED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const newStatus = status.toUpperCase();

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    appointment.status = newStatus;
    await appointment.save();

    // If appointment is CANCELLED, release the slot so others can book it!
    if (newStatus === 'CANCELLED' && appointment.slotId) {
      await Slot.findByIdAndUpdate(appointment.slotId, { isBooked: false });
    }

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${newStatus}.`,
      data: appointment,
    });
  } catch (error) {
    console.error('Error in updateAppointmentStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status.',
      error: error.message,
    });
  }
};
