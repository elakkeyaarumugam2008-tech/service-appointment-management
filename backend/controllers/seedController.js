import Service from '../models/Service.js';
import Slot from '../models/Slot.js';
import Appointment from '../models/Appointment.js';

export const seedDatabase = async (req, res) => {
  try {
    await Service.deleteMany({});
    await Slot.deleteMany({});
    await Appointment.deleteMany({});

    // 1. Create Services
    const services = await Service.insertMany([
      {
        name: 'Haircut & Styling',
        description: 'Professional hair cutting, washing, and custom styling for all hair types.',
        duration: '30 min',
        price: 200,
        category: 'Salons',
        providerName: 'StyleStudio Salon',
        providerId: 'prov_salon',
      },
      {
        name: 'AC Repair & Servicing',
        description: 'Full air conditioner inspection, filter cleaning, and gas top-up.',
        duration: '60 min',
        price: 500,
        category: 'Repair Shops',
        providerName: 'CoolFix Tech',
        providerId: 'prov_repair',
      },
      {
        name: 'Tech Consultation',
        description: '1-on-1 expert advisory on software architecture, code reviews, and cloud setup.',
        duration: '30 min',
        price: 300,
        category: 'Consultants',
        providerName: 'Apex Advisory',
        providerId: 'prov_consult',
      },
    ]);

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // 2. Create Slots for Haircut
    const haircutSlots = await Slot.insertMany([
      { serviceId: services[0]._id, date: todayStr, startTime: '10:00 AM', endTime: '10:30 AM', isBooked: false, providerId: 'prov_salon' },
      { serviceId: services[0]._id, date: todayStr, startTime: '10:30 AM', endTime: '11:00 AM', isBooked: false, providerId: 'prov_salon' },
      { serviceId: services[0]._id, date: todayStr, startTime: '11:00 AM', endTime: '11:30 AM', isBooked: false, providerId: 'prov_salon' },
      { serviceId: services[0]._id, date: tomorrowStr, startTime: '02:00 PM', endTime: '02:30 PM', isBooked: false, providerId: 'prov_salon' },
    ]);

    // 3. Create Slots for AC Repair
    const acSlots = await Slot.insertMany([
      { serviceId: services[1]._id, date: todayStr, startTime: '11:00 AM', endTime: '12:00 PM', isBooked: false, providerId: 'prov_repair' },
      { serviceId: services[1]._id, date: todayStr, startTime: '03:00 PM', endTime: '04:00 PM', isBooked: false, providerId: 'prov_repair' },
      { serviceId: services[1]._id, date: tomorrowStr, startTime: '10:00 AM', endTime: '11:00 AM', isBooked: false, providerId: 'prov_repair' },
    ]);

    // 4. Create Slots for Tech Consultation
    const consultSlots = await Slot.insertMany([
      { serviceId: services[2]._id, date: todayStr, startTime: '04:00 PM', endTime: '04:30 PM', isBooked: false, providerId: 'prov_consult' },
      { serviceId: services[2]._id, date: tomorrowStr, startTime: '05:00 PM', endTime: '05:30 PM', isBooked: false, providerId: 'prov_consult' },
    ]);

    const result = {
      servicesCount: services.length,
      slotsCount: haircutSlots.length + acSlots.length + consultSlots.length,
    };

    if (res) {
      return res.status(200).json({
        success: true,
        message: 'Database seeded successfully with hackathon demo data.',
        data: result,
      });
    }
    return result;
  } catch (error) {
    console.error('Error seeding database:', error);
    if (res) {
      return res.status(500).json({ success: false, message: 'Seeding failed', error: error.message });
    }
  }
};
