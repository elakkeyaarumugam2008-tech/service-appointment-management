import Service from '../models/Service.js';

// @desc    Get all services
// @route   GET /api/services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Error in getServices:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to connect to the server or fetch services.',
      error: error.message,
    });
  }
};

// @desc    Create a new service
// @route   POST /api/services
export const createService = async (req, res) => {
  try {
    const { name, description, duration, price, category, providerName, providerId } = req.body;

    if (!name || !duration || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide service name, duration, and price.',
      });
    }

    const service = await Service.create({
      name,
      description: description || '',
      duration,
      price: Number(price),
      category: category || 'General',
      providerName: providerName || 'ProCare Services',
      providerId: providerId || 'prov_1',
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: service,
    });
  } catch (error) {
    console.error('Error in createService:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service.',
      error: error.message,
    });
  }
};
