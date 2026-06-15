const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Get all services
router.get('/', async (req, res) => {
  const services = await Service.find().populate('provider', 'name email');
  res.json(services);
});

// Create service (provider only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'provider')
    return res.status(403).json({ message: 'Only providers can add services' });

  try {
    const service = await Service.create({ ...req.body, provider: req.user.id });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update service
router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete service
router.delete('/:id', auth, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: 'Service deleted' });
});

module.exports = router;