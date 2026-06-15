import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) return toast.error('Fill all fields');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'provider') navigate('/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1f 50%, #0a0a0f 100%)',
      padding: '20px',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background blobs */}
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'rgba(99,102,241,0.07)', top:'-100px', left:'-100px', filter:'blur(60px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'rgba(139,92,246,0.06)', bottom:'-80px', right:'-80px', filter:'blur(50px)', pointerEvents:'none' }} />

      <div className="glass animate-in" style={{ width:'100%', maxWidth:'420px', padding:'48px 40px', position:'relative', zIndex:1 }}>
        
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'36px' }}>
          <div style={{ fontSize:'44px', marginBottom:'14px' }}>👋</div>
          <h2 style={{ fontSize:'26px', fontWeight:800, color:'#f1f5f9' }}>Welcome Back</h2>
          <p style={{ color:'#94a3b8', marginTop:'6px', fontSize:'14px' }}>Sign in to your account</p>
        </div>

        {/* Form */}
        <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
          <div>
            <label style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'7px', display:'block', fontWeight:500 }}>Email Address</label>
            <input className="input-field" placeholder="you@example.com" type="email"
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'7px', display:'block', fontWeight:500 }}>Password</label>
            <input className="input-field" placeholder="••••••••" type="password"
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}
            style={{ width:'100%', padding:'13px', fontSize:'15px', marginTop:'6px' }}>
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>
        </div>

        <p style={{ textAlign:'center', marginTop:'22px', color:'#64748b', fontSize:'14px' }}>
          No account?{' '}
          <Link to="/register" style={{ color:'#818cf8', fontWeight:600, textDecoration:'none' }}>
            Create one free
          </Link>
        </p>

        {/* Admin hint */}
        <div style={{ marginTop:'24px', padding:'13px 16px', borderRadius:'10px', background:'rgba(99,102,241,0.07)', border:'1px solid rgba(99,102,241,0.18)' }}>
          <p style={{ fontSize:'12px', color:'#64748b', textAlign:'center', lineHeight:1.6 }}>
            🛡️ Use for Demo:{' '}
            🛡️ Admin login:{' '}
            <span style={{ color:'#818cf8', fontWeight:600 }}>admin@appointease.com</span>
            <br />
            <span style={{ color:'#818cf8', fontWeight:600 }}>Password: Admin@123</span>
            <br /><br />
            🛡️ Service provider login:{' '}
            <span style={{ color:'#818cf8', fontWeight:600 }}>provider@demo.com</span>
            <br />
            <span style={{ color:'#818cf8', fontWeight:600 }}>Password: Provider@123</span>
             <br /><br />
             🛡️ Coustmer login:{' '}
            <span style={{ color:'#818cf8', fontWeight:600 }}>herec@gmail.com</span>
            <br />
            <span style={{ color:'#818cf8', fontWeight:600 }}>Password: herec123</span>
          </p>
        </div>
      </div>
    </div>
  );
}