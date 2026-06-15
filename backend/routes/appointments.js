const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

// Book appointment (customer)
router.post('/', auth, async (req, res) => {
  const { serviceId, providerId, date, timeSlot, notes } = req.body;
  try {
    // Conflict check
    const conflict = await Appointment.findOne({
      provider: providerId, date, timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });
    if (conflict) return res.status(400).json({ message: 'This slot is already booked' });

    const appointment = await Appointment.create({
      customer: req.user.id,
      provider: providerId,
      service: serviceId,
      date, timeSlot, notes
    });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my appointments
router.get('/my', auth, async (req, res) => {
  const filter = req.user.role === 'customer'
    ? { customer: req.user.id }
    : { provider: req.user.id };

  const appointments = await Appointment.find(filter)
    .populate('service', 'name price')
    .populate('customer', 'name email')
    .populate('provider', 'name email')
    .sort({ date: -1 });

  res.json(appointments);
});

// Update status (provider)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;