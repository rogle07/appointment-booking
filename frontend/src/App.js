import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/register';
import BookAppointment from './pages/Bookappointment';
import MyAppointments from './pages/MyAppointment';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <ToastContainer
          position="top-right"
          toastStyle={{ background: '#1a1a2e', color: '#fff', border: '1px solid rgba(99,102,241,0.3)' }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book/:serviceId" element={<PrivateRoute><BookAppointment /></PrivateRoute>} />
          <Route path="/my-appointments" element={<PrivateRoute><MyAppointments /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute role="provider"><ProviderDashboard /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;