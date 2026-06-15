const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'General' }, // ← ADD THIS
  availableSlots: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);