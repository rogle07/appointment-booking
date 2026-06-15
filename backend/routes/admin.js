const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') 
    return res.status(403).json({ message: 'Admin only' });
  next();
};

// GET all users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Users error:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE user
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all appointments — fully populated
router.get('/appointments', auth, adminOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({ path: 'service', select: 'name price category' })
      .populate({ path: 'customer', select: 'name email' })
      .populate({ path: 'provider', select: 'name email' })
      .sort({ createdAt: -1 });
    console.log('Admin appointments count:', appointments.length);
    res.json(appointments);
  } catch (err) {
    console.error('Appointments error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET stats
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalAppointments, totalServices] = await Promise.all([
      User.countDocuments(),
      Appointment.countDocuments(),
      Service.countDocuments(),
    ]);

    const byStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusMap = {};
    byStatus.forEach(s => { statusMap[s._id] = s.count; });

    console.log('Stats:', { totalUsers, totalAppointments, totalServices, statusMap });

    res.json({
      totalUsers,
      totalAppointments,
      totalServices,
      pending:   statusMap['pending']   || 0,
      confirmed: statusMap['confirmed'] || 0,
      completed: statusMap['completed'] || 0,
      cancelled: statusMap['cancelled'] || 0,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;