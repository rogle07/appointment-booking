const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const appointmentRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin'); // ← MUST BE HERE

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes); // ← MUST BE HERE

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));