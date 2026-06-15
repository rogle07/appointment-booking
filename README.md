# 📅 AppointEase - Online Appointment Booking System

A full-stack MERN application for booking, managing, and tracking appointments between customers and service providers.

## 🚀 Project Overview

AppointEase is an industry-oriented appointment booking platform that allows users to:

- Register and login securely
- Browse available services
- Book appointments with providers
- Manage appointment status
- Track appointment history
- Handle scheduling efficiently

This project was developed as part of the Full Stack Development (MERN) Internship Program.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- React Router
- React Toastify

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Other Tools
- REST APIs
- Git & GitHub

---

## ✨ Features

### Customer Features
- User Registration & Login
- Browse Services
- Book Appointments
- View Appointment History
- Track Appointment Status

### Provider Features
- Provider Registration & Login
- Add New Services
- Manage Appointments
- Confirm Appointments
- Mark Appointments as Completed

### Admin Features
- Admin Authentication
- Dashboard Overview
- User Management
- Appointment Monitoring

---

## 📂 Project Structure

```bash
appointment-booking/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── seedData.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.js
│   │
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication

The system uses:

- Password Hashing (bcryptjs)
- JWT Authentication
- Protected Routes
- Role-Based Access Control

Roles:

- Customer
- Provider
- Admin

---

## 📊 Database Collections

### Users

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "customer"
}
```

### Services

```json
{
  "provider": "providerId",
  "name": "General Doctor Consultation",
  "description": "Service description",
  "duration": 30,
  "price": 500,
  "category": "Healthcare"
}
```

### Appointments

```json
{
  "customer": "customerId",
  "provider": "providerId",
  "service": "serviceId",
  "date": "2026-06-25",
  "timeSlot": "10:00",
  "status": "pending"
}
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/appointment-booking.git
cd appointment-booking
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run Backend

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🌐 Deployment

### Frontend
- Vercel

### Backend
- Render

### Database
- MongoDB Atlas

---

## 📸 Screenshots

### Home Page
- Service browsing interface
- Appointment booking section

### Provider Dashboard
- Appointment management
- Status updates
- Service creation

### Authentication
- Login
- Registration

---

## 🎯 Internship Requirements Covered

✅ User Authentication

✅ Service Listing & Management

✅ Appointment Booking

✅ Appointment Status Updates

✅ Scheduling APIs

✅ Database Design

✅ Input Validation

✅ Error Handling

✅ Deployment

✅ Documentation

---

## 📚 Learning Outcomes

- Full Stack MERN Development
- REST API Design
- Authentication & Authorization
- MongoDB Data Modeling
- Deployment Workflow
- Real-world Appointment Scheduling Logic

---

## 👨‍💻 Author

Yogesh Kumar

Full Stack Development (MERN) Internship Project

---

## 📄 License

This project is developed for educational and internship purposes.
