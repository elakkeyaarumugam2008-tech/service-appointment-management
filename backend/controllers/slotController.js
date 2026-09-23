import Slot from '../models/Slot.js';
import Service from '../models/Service.js';

// @desc    Get slots (filtered by serviceId, date, isBooked)
// @route   GET /api/slots
export const getSlots = async (req, res) => {
  try {
    const { serviceId, date, isBooked } = req.query;
    const filter = {};

    if (serviceId) filter.serviceId = serviceId;
    if (date) filter.date = date;
    if (isBooked !== undefined) filter.isBooked = isBooked === 'true';

    const slots = await Slot.find(filter)
      .populate('serviceId', 'name duration price')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    console.error('Error in getSlots:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to connect to the server or fetch slots.',
      error: error.message,
    });
  }
};

// @desc    Create a new slot
// @route   POST /api/slots
export const createSlot = async (req, res) => {
  try {
    const { serviceId, date, startTime, endTime, providerId } = req.body;

    if (!serviceId || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide serviceId, date, startTime, and endTime.',
      });
    }

    // Verify service exists
    const serviceExists = await Service.findById(serviceId);
    if (!serviceExists) {
      return res.status(404).json({
        success: false,
        message: 'Selected service does not exist.',
      });
    }

    const slot = await Slot.create({
      serviceId,
      date,
      startTime,
      endTime,
      isBooked: false,
      providerId: providerId || 'prov_1',
    });

    const populatedSlot = await Slot.findById(slot._id).populate('serviceId', 'name duration price');

    res.status(201).json({
      success: true,
      message: 'Slot created successfully.',
      data: populatedSlot,
    });
  } catch (error) {
    console.error('Error in createSlot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create slot.',
      error: error.message,
    });
  }
};
