require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Service = require('./models/Service');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB...');

  // Admin
  const adminExists = await User.findOne({ email: 'admin@appointease.com' });
  if (!adminExists) {
    const hashed = await bcrypt.hash('Admin@123', 10);
    await User.create({ name: 'Super Admin', email: 'admin@appointease.com', password: hashed, role: 'admin' });
    console.log('✅ Admin created');
  }

  // Provider
  let provider = await User.findOne({ email: 'provider@demo.com' });
  if (!provider) {
    const hashed = await bcrypt.hash('Provider@123', 10);
    provider = await User.create({ name: 'Demo Provider', email: 'provider@demo.com', password: hashed, role: 'provider' });
    console.log('✅ Provider created');
  }

  // Delete old services and reseed fresh
  await Service.deleteMany({});
  console.log('🗑️ Old services cleared');

  await Service.insertMany([
    // Healthcare
    { provider: provider._id, name: 'General Doctor Consultation', description: 'Consult with experienced general physicians for any health concerns, diagnosis and treatment planning.', duration: 30, price: 500, category: 'Healthcare', availableSlots: ['09:00','10:00','11:00','14:00','15:00','16:00'] },
    { provider: provider._id, name: 'Dental Checkup & Cleaning', description: 'Complete dental examination, X-rays, and professional teeth cleaning by certified dentists.', duration: 45, price: 800, category: 'Healthcare', availableSlots: ['09:30','11:00','14:00','16:00'] },
    { provider: provider._id, name: 'Eye Examination', description: 'Comprehensive eye test including vision check, pressure test, and prescription update.', duration: 30, price: 600, category: 'Healthcare', availableSlots: ['10:00','11:00','14:00','15:00'] },
    { provider: provider._id, name: 'Physiotherapy Session', description: 'Expert physiotherapy for injury recovery, pain relief, and mobility improvement.', duration: 60, price: 900, category: 'Healthcare', availableSlots: ['08:00','10:00','14:00','16:00'] },

    // Beauty
    { provider: provider._id, name: 'Haircut & Styling', description: 'Expert haircut and styling for men and women by professional stylists with years of experience.', duration: 60, price: 350, category: 'Beauty', availableSlots: ['10:00','11:00','12:00','14:00','15:00','16:00','17:00'] },
    { provider: provider._id, name: 'Full Body Massage', description: 'Relaxing full body massage for stress relief, muscle relaxation and improved blood circulation.', duration: 90, price: 1200, category: 'Beauty', availableSlots: ['10:00','12:00','14:00','16:00'] },
    { provider: provider._id, name: 'Facial & Skin Treatment', description: 'Deep cleansing facial, skin analysis and customized treatment for glowing healthy skin.', duration: 75, price: 900, category: 'Beauty', availableSlots: ['10:00','12:00','14:00','16:00'] },
    { provider: provider._id, name: 'Manicure & Pedicure', description: 'Complete nail care, shaping, cuticle treatment and polish for hands and feet.', duration: 60, price: 500, category: 'Beauty', availableSlots: ['10:00','11:30','13:00','15:00','16:30'] },

    // Fitness
    { provider: provider._id, name: 'Personal Training Session', description: 'One-on-one fitness training with certified personal trainers tailored to your goals.', duration: 60, price: 700, category: 'Fitness', availableSlots: ['06:00','07:00','08:00','17:00','18:00','19:00'] },
    { provider: provider._id, name: 'Yoga & Meditation Class', description: 'Guided yoga and meditation for mental clarity, flexibility and physical wellness.', duration: 60, price: 400, category: 'Fitness', availableSlots: ['06:30','08:00','17:30','19:00'] },
    { provider: provider._id, name: 'Zumba Dance Fitness', description: 'High energy Zumba dance workout for weight loss, cardio health and fun fitness.', duration: 45, price: 300, category: 'Fitness', availableSlots: ['07:00','09:00','17:00','18:30'] },
    { provider: provider._id, name: 'Nutritionist Consultation', description: 'Personalized diet planning and nutritional guidance from certified nutrition experts.', duration: 45, price: 600, category: 'Fitness', availableSlots: ['10:00','11:00','14:00','16:00'] },

    // Consulting
    { provider: provider._id, name: 'Business Strategy Consulting', description: 'Expert business consulting for startups and SMEs — strategy, growth and operations.', duration: 60, price: 2000, category: 'Consulting', availableSlots: ['10:00','11:00','14:00','15:00','16:00'] },
    { provider: provider._id, name: 'Legal Advisory Session', description: 'Professional legal advice on business law, property matters and personal legal issues.', duration: 45, price: 1500, category: 'Consulting', availableSlots: ['10:00','11:30','14:00','15:30'] },
    { provider: provider._id, name: 'Financial Planning', description: 'Comprehensive financial planning, investment advice and tax planning from certified advisors.', duration: 60, price: 1800, category: 'Consulting', availableSlots: ['09:00','11:00','14:00','16:00'] },
    { provider: provider._id, name: 'Career Counseling', description: 'Professional career guidance, resume review and interview preparation for job seekers.', duration: 45, price: 800, category: 'Consulting', availableSlots: ['10:00','12:00','14:00','16:00','18:00'] },

    // Education
    { provider: provider._id, name: 'Math & Science Tutoring', description: 'Expert tutoring for school and college students in Mathematics, Physics and Chemistry.', duration: 60, price: 500, category: 'Education', availableSlots: ['14:00','15:00','16:00','17:00','18:00'] },
    { provider: provider._id, name: 'English Language Classes', description: 'Spoken English, grammar and writing skills improvement for all levels.', duration: 60, price: 400, category: 'Education', availableSlots: ['08:00','10:00','14:00','16:00','18:00'] },
    { provider: provider._id, name: 'Coding & Programming', description: 'Learn web development, Python, Java or data science with hands-on project-based teaching.', duration: 90, price: 700, category: 'Education', availableSlots: ['09:00','11:00','14:00','17:00','19:00'] },
    { provider: provider._id, name: 'Music Lessons', description: 'Guitar, piano, vocals or tabla lessons for beginners to advanced students.', duration: 45, price: 500, category: 'Education', availableSlots: ['10:00','12:00','15:00','17:00','18:00'] },

    // Home Services
    { provider: provider._id, name: 'Home Deep Cleaning', description: 'Professional home deep cleaning service — kitchen, bathrooms, bedrooms for a spotless home.', duration: 180, price: 1800, category: 'Home Services', availableSlots: ['09:00','11:00','14:00'] },
    { provider: provider._id, name: 'Plumbing Repair', description: 'Expert plumbing services — pipe repair, leak fixing, tap installation and drain cleaning.', duration: 60, price: 600, category: 'Home Services', availableSlots: ['09:00','11:00','13:00','15:00','17:00'] },
    { provider: provider._id, name: 'Electrical Services', description: 'Certified electricians for wiring, switch repair, fan installation and electrical safety checks.', duration: 60, price: 700, category: 'Home Services', availableSlots: ['09:00','11:00','14:00','16:00'] },
    { provider: provider._id, name: 'Pest Control', description: 'Safe and effective pest control treatment for cockroaches, ants, termites and mosquitoes.', duration: 120, price: 1200, category: 'Home Services', availableSlots: ['09:00','12:00','15:00'] },
  ]);

  console.log('✅ 24 services seeded across all categories!');
  mongoose.disconnect();
});