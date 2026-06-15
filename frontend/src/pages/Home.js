import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const CATEGORIES = ['All','Healthcare','Beauty','Consulting','Fitness','Education','Home Services'];
const SERVICE_ICONS = { Healthcare:'🏥', Beauty:'💅', Consulting:'💼', Fitness:'💪', Education:'📚', 'Home Services':'🏠', Default:'⭐' };
// Color accent per category
const CAT_COLORS = { Healthcare:'#34d399', Beauty:'#f472b6', Consulting:'#60a5fa', Fitness:'#fb923c', Education:'#a78bfa', 'Home Services':'#fbbf24', Default:'#818cf8' };

export default function Home() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/services').then(res => {
      setServices(res.data);
      setFiltered(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // ✅ Filter fix — case-insensitive trim comparison
  useEffect(() => {
    let result = [...services];
    if (category !== 'All') {
      result = result.filter(s =>
        (s.category || '').trim().toLowerCase() === category.trim().toLowerCase()
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [category, search, services]);

  const stats = [
    { label:'Services Available', value:`${services.length}+`, icon:'🎯' },
    { label:'Happy Customers',    value:'500+',               icon:'😊' },
    { label:'Expert Providers',   value:'50+',                icon:'👨‍💼' },
    { label:'Cities Covered',     value:'10+',                icon:'🌆' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f' }}>

      {/* ── Hero ── */}
      <div style={{
        minHeight:'100vh', display:'flex', flexDirection:'column',
        justifyContent:'center', alignItems:'center', textAlign:'center',
        padding:'110px 20px 70px',
        background:'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 65%)',
        position:'relative', overflow:'hidden'
      }}>
        {/* Decorative rings */}
        {[200,340,480].map((size, i) => (
          <div key={i} style={{
            position:'absolute', width:size, height:size, borderRadius:'50%',
            border:'1px solid rgba(99,102,241,0.07)',
            top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            animation:`float ${4+i}s ease-in-out infinite`,
            animationDelay:`${i*0.7}s`, pointerEvents:'none'
          }} />
        ))}

        <div style={{ position:'relative', zIndex:1, animation:'slide-in 0.7s ease' }}>
          <div style={{
            display:'inline-block', padding:'6px 20px', borderRadius:'20px',
            background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)',
            color:'#818cf8', fontSize:'13px', fontWeight:600, marginBottom:'24px',
            letterSpacing:'0.3px'
          }}>✨ #1 Appointment Booking Platform</div>

          <h1 style={{ fontSize:'clamp(34px,6vw,68px)', fontWeight:900, lineHeight:1.1, marginBottom:'20px', color:'#f1f5f9' }}>
            Book Your <span className="gradient-text">Perfect</span>
            <br />Appointment Today
          </h1>

          <p style={{ fontSize:'17px', color:'#94a3b8', maxWidth:'540px', margin:'0 auto 40px', lineHeight:1.7 }}>
            Connect with top-rated service providers. Healthcare, beauty, fitness, consulting and more — all in one place.
          </p>

          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            {!user ? (
              <>
                <button className="btn-primary" onClick={() => navigate('/register')} style={{ fontSize:'15px', padding:'13px 30px' }}>Get Started Free →</button>
                <button className="btn-secondary" onClick={() => navigate('/login')} style={{ fontSize:'15px', padding:'13px 30px' }}>Sign In</button>
              </>
            ) : (
              <button className="btn-primary"
                onClick={() => document.getElementById('services').scrollIntoView({ behavior:'smooth' })}
                style={{ fontSize:'15px', padding:'13px 30px' }}>
                Browse Services ↓
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:'20px', marginTop:'72px', flexWrap:'wrap', justifyContent:'center', position:'relative', zIndex:1 }}>
          {stats.map((s, i) => (
            <div key={i} className="glass" style={{ padding:'18px 26px', textAlign:'center', minWidth:'130px', animation:`slide-in 0.5s ease ${0.15+i*0.1}s both` }}>
              <div style={{ fontSize:'26px', marginBottom:'6px' }}>{s.icon}</div>
              <div style={{ fontSize:'22px', fontWeight:800 }} className="gradient-text">{s.value}</div>
              <div style={{ fontSize:'12px', color:'#64748b', marginTop:'3px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <div id="services" style={{ padding:'80px 40px', maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'48px' }}>
          <h2 style={{ fontSize:'38px', fontWeight:800, color:'#f1f5f9', marginBottom:'10px' }}>
            Available <span className="gradient-text">Services</span>
          </h2>
          <p style={{ color:'#64748b', fontSize:'15px' }}>Choose from our wide range of professional services</p>
        </div>

        {/* Search */}
        <input className="input-field" placeholder="🔍  Search services by name or description..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ marginBottom:'24px', fontSize:'14px' }} />

        {/* Category pills */}
        <div style={{ display:'flex', gap:'10px', marginBottom:'40px', flexWrap:'wrap' }}>
          {CATEGORIES.map(cat => {
            const active = category === cat;
            return (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding:'8px 20px', borderRadius:'20px', border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                cursor:'pointer', fontWeight:600, fontSize:'13px', transition:'all 0.25s',
                background: active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                color: active ? '#ffffff' : '#94a3b8',
                boxShadow: active ? '0 4px 14px rgba(99,102,241,0.35)' : 'none',
                transform: active ? 'scale(1.04)' : 'scale(1)'
              }}>{cat}</button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'80px', color:'#475569' }}>
            <div style={{ fontSize:'40px', animation:'float 1s infinite' }}>⏳</div>
            <p style={{ marginTop:'14px', fontSize:'15px' }}>Loading services...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px' }}>
            <div style={{ fontSize:'56px' }}>🔍</div>
            <p style={{ color:'#475569', marginTop:'16px', fontSize:'17px' }}>No services found in "{category}"</p>
            <button className="btn-secondary" onClick={() => { setCategory('All'); setSearch(''); }} style={{ marginTop:'16px' }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:'22px' }}>
            {filtered.map((s, i) => (
              <ServiceCard key={s._id} service={s} index={i}
                onBook={() => user ? navigate(`/book/${s._id}`) : navigate('/login')} />
            ))}
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      {!user && (
        <div style={{
          margin:'20px 40px 60px', borderRadius:'20px', padding:'56px 40px',
          background:'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))',
          border:'1px solid rgba(99,102,241,0.2)', textAlign:'center'
        }}>
          <h2 style={{ fontSize:'32px', fontWeight:800, color:'#f1f5f9', marginBottom:'12px' }}>Ready to Get Started?</h2>
          <p style={{ color:'#64748b', marginBottom:'32px', fontSize:'15px' }}>Join thousands of happy customers booking services daily.</p>
          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/register?role=customer')} style={{ fontSize:'14px', padding:'12px 26px' }}>👤 Book as Customer</button>
            <button className="btn-secondary" onClick={() => navigate('/register?role=provider')} style={{ fontSize:'14px', padding:'12px 26px' }}>🏪 Join as Provider</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceCard({ service, index, onBook }) {
  const icon  = SERVICE_ICONS[service.category] || SERVICE_ICONS.Default;
  const color = CAT_COLORS[service.category]    || CAT_COLORS.Default;

  return (
    <div className="glass card-hover" style={{ padding:'24px', cursor:'pointer', animation:`slide-in 0.45s ease ${index*0.07}s both` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
        <div style={{
          width:50, height:50, borderRadius:'14px', fontSize:'24px',
          background:`${color}18`,
          display:'flex', alignItems:'center', justifyContent:'center',
          border:`1px solid ${color}30`
        }}>{icon}</div>
        {service.category && (
          <span style={{ fontSize:'11px', padding:'4px 10px', borderRadius:'20px', background:`${color}18`, color, border:`1px solid ${color}30`, fontWeight:600 }}>
            {service.category}
          </span>
        )}
      </div>
      <h3 style={{ fontSize:'17px', fontWeight:700, marginBottom:'8px', color:'#f1f5f9' }}>{service.name}</h3>
      <p style={{ color:'#64748b', fontSize:'13px', marginBottom:'16px', lineHeight:1.55 }}>
        {service.description || 'Professional service available for booking.'}
      </p>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
        <span style={{ color:'#475569', fontSize:'13px' }}>⏱ {service.duration} mins</span>
        <span style={{ fontSize:'19px', fontWeight:800, color:'#818cf8' }}>₹{service.price}</span>
      </div>
      <div style={{ fontSize:'12px', color:'#475569', marginBottom:'16px' }}>👤 {service.provider?.name}</div>
      <button className="btn-primary" onClick={onBook} style={{ width:'100%', padding:'11px', fontSize:'14px' }}>Book Now →</button>
    </div>
  );
}