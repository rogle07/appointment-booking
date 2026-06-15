import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'customer');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return toast.error('Fill all fields');
    if (form.password.length < 6) return toast.error('Password min 6 characters');
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { ...form, role });
      login(res.data.user, res.data.token);
      toast.success('Account created successfully!');
      navigate(role === 'provider' ? '/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, #0a0a0f 0%, #0f0f1f 50%, #0a0a0f 100%)',
      padding:'20px', position:'relative', overflow:'hidden'
    }}>
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'rgba(139,92,246,0.07)', top:'-120px', right:'-100px', filter:'blur(60px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'rgba(99,102,241,0.06)', bottom:'-80px', left:'-80px', filter:'blur(50px)', pointerEvents:'none' }} />

      <div className="glass animate-in" style={{ width:'100%', maxWidth:'460px', padding:'48px 40px', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'44px', marginBottom:'14px' }}>🚀</div>
          <h2 style={{ fontSize:'26px', fontWeight:800, color:'#f1f5f9' }}>Create Account</h2>
          <p style={{ color:'#94a3b8', marginTop:'6px', fontSize:'14px' }}>Join thousands of users today</p>
        </div>

        {/* Role toggle */}
        <div style={{ display:'flex', background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:'4px', marginBottom:'28px', border:'1px solid rgba(255,255,255,0.07)' }}>
          {['customer','provider'].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex:1, padding:'10px', borderRadius:'9px', border:'none', cursor:'pointer',
              fontWeight:600, fontSize:'14px', transition:'all 0.3s',
              background: role === r ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              color: role === r ? '#ffffff' : '#64748b'
            }}>
              {r === 'customer' ? '👤 Customer' : '🏪 Service Provider'}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {[
            { label:'Full Name', key:'name', type:'text', placeholder:'John Doe' },
            { label:'Email Address', key:'email', type:'email', placeholder:'you@example.com' },
            { label:'Password', key:'password', type:'password', placeholder:'Min 6 characters' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'7px', display:'block', fontWeight:500 }}>{field.label}</label>
              <input className="input-field" placeholder={field.placeholder} type={field.type}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
          ))}

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}
            style={{ width:'100%', padding:'13px', fontSize:'15px', marginTop:'6px' }}>
            {loading ? '⏳ Creating...' : `Create ${role === 'provider' ? 'Provider' : 'Customer'} Account →`}
          </button>
        </div>

        <p style={{ textAlign:'center', marginTop:'24px', color:'#64748b', fontSize:'14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#818cf8', fontWeight:600, textDecoration:'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}