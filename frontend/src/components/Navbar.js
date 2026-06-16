import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
   <nav style={{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  padding: window.innerWidth < 768 ? '12px 16px' : '14px 40px',
  background: scrolled ? 'rgba(15,15,26,0.95)' : 'transparent',
  backdropFilter: scrolled ? 'blur(20px)' : 'none',
  borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
  transition: 'all 0.3s ease',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '10px'
}}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', animation: 'pulse-glow 2s infinite'
        }}>📅</div>
        <span style={{ fontSize: '20px', fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AppointEase
        </span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!user ? (
          <>
            <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: '14px' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: '14px' }}>Get Started</Link>
          </>
        ) : (
          <>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginRight: '8px' }}>
              👋 {user.name}
              <span style={{
                marginLeft: '6px', fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                background: user.role === 'admin' ? 'rgba(239,68,68,0.2)' : user.role === 'provider' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)',
                color: user.role === 'admin' ? '#ef4444' : user.role === 'provider' ? '#10b981' : '#6366f1',
                border: `1px solid ${user.role === 'admin' ? 'rgba(239,68,68,0.3)' : user.role === 'provider' ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)'}`
              }}>{user.role}</span>
            </span>
            {user.role === 'customer' && (
              <Link to="/my-appointments" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s', background: location.pathname === '/my-appointments' ? 'rgba(99,102,241,0.2)' : 'transparent' }}>
                My Bookings
              </Link>
            )}
            {user.role === 'provider' && (
              <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', background: location.pathname === '/dashboard' ? 'rgba(16,185,129,0.2)' : 'transparent' }}>
                Dashboard
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: '#ef4444', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)' }}>
                🛡️ Admin
              </Link>
            )}
            <button className="btn-secondary" onClick={handleLogout} style={{ fontSize: '13px', padding: '8px 16px' }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}