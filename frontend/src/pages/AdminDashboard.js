import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api/axios';

const TABS = ['overview', 'users', 'appointments', 'services'];
const TAB_ICONS = { overview: '📊', users: '👥', appointments: '📅', services: '⭐' };

export default function AdminDashboard() {
  const [users, setUsers]               = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices]         = useState([]);
  const [stats, setStats]               = useState({ totalUsers:0, totalAppointments:0, totalServices:0, pending:0, confirmed:0, completed:0, cancelled:0 });
  const [tab, setTab]                   = useState('overview');
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [u, a, s, st] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/appointments'),
        API.get('/services'),
        API.get('/admin/stats'),
      ]);
      setUsers(u.data);
      setAppointments(a.data);
      setServices(s.data);
      setStats(st.data);
    } catch (err) {
      console.error('Dashboard load error:', err);
      toast.error('Failed to load data — check console');
    }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const deleteUser = async id => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(p => p.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Delete failed'); }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      setAppointments(p => p.map(a => a._id === id ? { ...a, status } : a));
      // refresh stats
      const st = await API.get('/admin/stats');
      setStats(st.data);
      toast.success(`Status → ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const filteredAppts = appointments.filter(a =>
    (a.service?.name  || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.customer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.provider?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  // ── stat cards now use REAL stats from backend ──
  const statCards = [
    { label:'Total Users',    value: stats.totalUsers,        icon:'👥', color:'#818cf8', bg:'rgba(129,140,248,0.12)' },
    { label:'Providers',      value: users.filter(u=>u.role==='provider').length, icon:'🏪', color:'#34d399', bg:'rgba(52,211,153,0.12)' },
    { label:'Total Bookings', value: stats.totalAppointments, icon:'📅', color:'#c084fc', bg:'rgba(192,132,252,0.12)' },
    { label:'Services',       value: stats.totalServices,     icon:'⭐', color:'#fbbf24', bg:'rgba(251,191,36,0.12)'  },
    { label:'Completed',      value: stats.completed,         icon:'✅', color:'#34d399', bg:'rgba(52,211,153,0.12)'  },
    { label:'Pending',        value: stats.pending,           icon:'⏳', color:'#fbbf24', bg:'rgba(251,191,36,0.12)'  },
    { label:'Confirmed',      value: stats.confirmed,         icon:'🎯', color:'#60a5fa', bg:'rgba(96,165,250,0.12)'  },
    { label:'Cancelled',      value: stats.cancelled,         icon:'❌', color:'#f87171', bg:'rgba(248,113,113,0.12)' },
  ];

  const S = {
    page:    { minHeight:'100vh', background:'linear-gradient(135deg,#0a0a0f 0%,#0d0d1a 50%,#0a0a0f 100%)', padding:'90px 32px 60px' },
    blob1:   { position:'fixed', width:600, height:600, borderRadius:'50%', background:'rgba(99,102,241,0.05)', top:'-200px', right:'-200px', filter:'blur(80px)', pointerEvents:'none' },
    blob2:   { position:'fixed', width:400, height:400, borderRadius:'50%', background:'rgba(139,92,246,0.04)', bottom:'-100px', left:'-100px', filter:'blur(60px)', pointerEvents:'none' },
    inner:   { maxWidth:'1280px', margin:'0 auto', position:'relative', zIndex:1 },
    label:   { fontSize:'13px', color:'#94a3b8', marginBottom:'7px', display:'block', fontWeight:500 },
    dimText: { color:'#94a3b8', fontSize:'13px' },
    mutedText:{ color:'#64748b', fontSize:'12px' },
  };

  return (
    <div style={S.page}>
      <div style={S.blob1} /><div style={S.blob2} />
      <div style={S.inner}>

        {/* ── Header ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'36px', flexWrap:'wrap', gap:'16px', animation:'slide-in 0.5s ease' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <div style={{ width:56, height:56, borderRadius:'16px', background:'linear-gradient(135deg,rgba(248,113,113,0.2),rgba(239,68,68,0.1))', border:'1px solid rgba(248,113,113,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', animation:'pulse-glow 3s infinite' }}>🛡️</div>
            <div>
              <h1 style={{ fontSize:'28px', fontWeight:800, color:'#f1f5f9' }}>Admin Dashboard</h1>
              <p style={{ color:'#475569', fontSize:'13px', marginTop:'3px' }}>Full system control panel • AppointEase</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <button onClick={loadAll} style={{ background:'rgba(129,140,248,0.1)', color:'#818cf8', border:'1px solid rgba(129,140,248,0.25)', padding:'8px 18px', borderRadius:'10px', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>🔄 Refresh</button>
            <div style={{ padding:'6px 16px', borderRadius:'20px', background:'rgba(52,211,153,0.12)', border:'1px solid rgba(52,211,153,0.25)', color:'#34d399', fontSize:'12px', fontWeight:600 }}>🟢 System Online</div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display:'flex', gap:'6px', marginBottom:'32px', background:'rgba(255,255,255,0.03)', padding:'5px', borderRadius:'14px', width:'fit-content', border:'1px solid rgba(255,255,255,0.06)', animation:'slide-in 0.5s ease 0.1s both' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setSearch(''); }} style={{
              padding:'9px 22px', borderRadius:'10px', border:'none', cursor:'pointer',
              fontWeight:600, fontSize:'13px', transition:'all 0.25s', textTransform:'capitalize',
              background: tab===t ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
              color: tab===t ? '#ffffff' : '#64748b',
              boxShadow: tab===t ? '0 4px 14px rgba(99,102,241,0.35)' : 'none'
            }}>{TAB_ICONS[t]} {t}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'120px 0' }}>
            <div style={{ fontSize:'48px', animation:'float 1s ease-in-out infinite' }}>⏳</div>
            <p style={{ color:'#475569', marginTop:'16px' }}>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* ══ OVERVIEW ══ */}
            {tab==='overview' && (
              <div style={{ animation:'slide-in 0.4s ease' }}>

                {/* Stat cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:'16px', marginBottom:'28px' }}>
                  {statCards.map((c,i) => (
                    <div key={i} className="glass card-hover" style={{ padding:'20px', display:'flex', alignItems:'center', gap:'14px', animation:`slide-in 0.4s ease ${i*0.06}s both` }}>
                      <div style={{ width:48, height:48, borderRadius:'13px', background:c.bg, border:`1px solid ${c.color}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>{c.icon}</div>
                      <div>
                        <div style={{ fontSize:'28px', fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
                        <div style={{ fontSize:'11px', color:'#64748b', marginTop:'4px', fontWeight:500 }}>{c.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent panels */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>

                  {/* Recent Appointments */}
                  <div className="glass" style={{ padding:'24px' }}>
                    <h3 style={{ color:'#64748b', fontSize:'12px', fontWeight:700, letterSpacing:'1px', marginBottom:'18px', textTransform:'uppercase' }}>Recent Appointments</h3>
                    {appointments.length === 0
                      ? <p style={{ color:'#334155', fontSize:'14px', textAlign:'center', padding:'24px 0' }}>No appointments yet</p>
                      : appointments.slice(0,6).map((a,i) => (
                        <div key={a._id} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom: i<5 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems:'center', animation:`slide-in 0.4s ease ${i*0.07}s both` }}>
                          <div>
                            <div style={{ fontWeight:600, color:'#e2e8f0', fontSize:'13px' }}>{a.service?.name || 'N/A'}</div>
                            <div style={{ color:'#475569', fontSize:'11px', marginTop:'2px' }}>{a.customer?.name} → {a.provider?.name}</div>
                          </div>
                          <span className={`badge badge-${a.status}`}>{a.status}</span>
                        </div>
                      ))
                    }
                  </div>

                  {/* Recent Users */}
                  <div className="glass" style={{ padding:'24px' }}>
                    <h3 style={{ color:'#64748b', fontSize:'12px', fontWeight:700, letterSpacing:'1px', marginBottom:'18px', textTransform:'uppercase' }}>Recent Users</h3>
                    {users.length === 0
                      ? <p style={{ color:'#334155', fontSize:'14px', textAlign:'center', padding:'24px 0' }}>No users yet</p>
                      : users.slice(0,6).map((u,i) => (
                        <div key={u._id} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom: i<5 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems:'center', animation:`slide-in 0.4s ease ${i*0.07}s both` }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                            <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:700, color:'#fff', flexShrink:0 }}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight:600, color:'#e2e8f0', fontSize:'13px' }}>{u.name}</div>
                              <div style={{ color:'#475569', fontSize:'11px' }}>{u.email}</div>
                            </div>
                          </div>
                          <span style={{
                            padding:'3px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:600,
                            background: u.role==='admin' ? 'rgba(248,113,113,0.15)' : u.role==='provider' ? 'rgba(52,211,153,0.15)' : 'rgba(129,140,248,0.15)',
                            color:      u.role==='admin' ? '#f87171'               : u.role==='provider' ? '#34d399'               : '#818cf8'
                          }}>{u.role}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            )}

            {/* ══ USERS ══ */}
            {tab==='users' && (
              <div style={{ animation:'slide-in 0.4s ease' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
                  <p style={{ color:'#64748b', fontSize:'14px' }}>Showing <span style={{ color:'#818cf8', fontWeight:600 }}>{filteredUsers.length}</span> users</p>
                  <input className="input-field" placeholder="🔍 Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)} style={{ width:'280px' }} />
                </div>
                <div className="glass" style={{ overflow:'hidden' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr style={{ background:'rgba(255,255,255,0.03)' }}>
                        {['User','Email','Role','Joined','Action'].map(h=>(
                          <th key={h} style={{ padding:'14px 18px', textAlign:'left', color:'#475569', fontSize:'11px', fontWeight:700, borderBottom:'1px solid rgba(255,255,255,0.06)', textTransform:'uppercase', letterSpacing:'0.6px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u,i)=>(
                        <tr key={u._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', transition:'background 0.2s', animation:`slide-in 0.4s ease ${i*0.04}s both` }}
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <td style={{ padding:'14px 18px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:700, color:'#fff', flexShrink:0 }}>
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ color:'#e2e8f0', fontWeight:600, fontSize:'14px' }}>{u.name}</span>
                            </div>
                          </td>
                          <td style={{ padding:'14px 18px', color:'#64748b', fontSize:'13px' }}>{u.email}</td>
                          <td style={{ padding:'14px 18px' }}>
                            <span style={{
                              padding:'4px 11px', borderRadius:'20px', fontSize:'12px', fontWeight:600,
                              background: u.role==='admin' ? 'rgba(248,113,113,0.15)' : u.role==='provider' ? 'rgba(52,211,153,0.15)' : 'rgba(129,140,248,0.15)',
                              color:      u.role==='admin' ? '#f87171'               : u.role==='provider' ? '#34d399'               : '#818cf8',
                              border:`1px solid ${u.role==='admin' ? 'rgba(248,113,113,0.3)' : u.role==='provider' ? 'rgba(52,211,153,0.3)' : 'rgba(129,140,248,0.3)'}`
                            }}>{u.role}</span>
                          </td>
                          <td style={{ padding:'14px 18px', color:'#475569', fontSize:'13px' }}>{new Date(u.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                          <td style={{ padding:'14px 18px' }}>
                            {u.role!=='admin' && (
                              <button onClick={()=>deleteUser(u._id)} style={{ background:'rgba(248,113,113,0.1)', color:'#f87171', border:'1px solid rgba(248,113,113,0.25)', padding:'6px 14px', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:600, transition:'all 0.2s' }}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(248,113,113,0.2)'}
                                onMouseLeave={e=>e.currentTarget.style.background='rgba(248,113,113,0.1)'}>
                                🗑 Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══ APPOINTMENTS ══ */}
            {tab==='appointments' && (
              <div style={{ animation:'slide-in 0.4s ease' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
                  <p style={{ color:'#64748b', fontSize:'14px' }}>
                    Total: <span style={{ color:'#818cf8', fontWeight:600 }}>{filteredAppts.length}</span> appointments
                  </p>
                  <input className="input-field" placeholder="🔍 Search appointments..." value={search} onChange={e=>setSearch(e.target.value)} style={{ width:'280px' }} />
                </div>

                {filteredAppts.length===0 ? (
                  <div className="glass" style={{ textAlign:'center', padding:'80px' }}>
                    <div style={{ fontSize:'52px', marginBottom:'16px' }}>📭</div>
                    <p style={{ color:'#94a3b8', fontSize:'16px', fontWeight:600 }}>No appointments found</p>
                    <p style={{ color:'#334155', fontSize:'13px', marginTop:'8px' }}>Appointments will show here once customers book services</p>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                    {filteredAppts.map((a,i)=>{
                      const statusColors = { pending:'#fbbf24', confirmed:'#34d399', cancelled:'#f87171', completed:'#818cf8' };
                      const statusBgs    = { pending:'rgba(251,191,36,0.1)', confirmed:'rgba(52,211,153,0.1)', cancelled:'rgba(248,113,113,0.1)', completed:'rgba(129,140,248,0.1)' };
                      const statusIcons  = { pending:'⏳', confirmed:'✅', cancelled:'❌', completed:'🎉' };
                      const c = statusColors[a.status] || '#818cf8';
                      return (
                        <div key={a._id} className="glass card-hover" style={{ padding:'18px 22px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'14px', animation:`slide-in 0.4s ease ${i*0.05}s both`, borderLeft:`3px solid ${c}` }}>
                          <div style={{ display:'flex', gap:'14px', alignItems:'center' }}>
                            <div style={{ width:44, height:44, borderRadius:'12px', background:statusBgs[a.status], border:`1px solid ${c}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>{statusIcons[a.status]}</div>
                            <div>
                              <div style={{ fontWeight:700, color:'#e2e8f0', fontSize:'15px' }}>{a.service?.name || 'Unknown Service'}</div>
                              <div style={{ color:'#64748b', fontSize:'12px', marginTop:'3px' }}>
                                👤 <span style={{ color:'#94a3b8' }}>{a.customer?.name || 'N/A'}</span>
                                <span style={{ color:'#334155', margin:'0 6px' }}>→</span>
                                🏪 <span style={{ color:'#94a3b8' }}>{a.provider?.name || 'N/A'}</span>
                              </div>
                              <div style={{ color:'#475569', fontSize:'12px', marginTop:'3px' }}>
                                🗓 {a.date} &nbsp;⏰ {a.timeSlot}
                                {a.notes && <span style={{ marginLeft:'10px', fontStyle:'italic' }}>📝 {a.notes}</span>}
                              </div>
                            </div>
                          </div>
                          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                            <span className={`badge badge-${a.status}`}>{a.status}</span>
                            <select onChange={e=>updateStatus(a._id,e.target.value)} value={a.status}
                              style={{ background:'rgba(15,15,30,0.9)', border:'1px solid rgba(255,255,255,0.12)', color:'#e2e8f0', padding:'7px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer', outline:'none', fontWeight:500 }}>
                              {['pending','confirmed','cancelled','completed'].map(s=><option key={s} value={s} style={{ background:'#1e1e2e', color:'#e2e8f0' }}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ══ SERVICES ══ */}
            {tab==='services' && (
              <div style={{ animation:'slide-in 0.4s ease' }}>
                <p style={{ color:'#64748b', fontSize:'14px', marginBottom:'20px' }}>
                  Total: <span style={{ color:'#818cf8', fontWeight:600 }}>{services.length}</span> services
                </p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'16px' }}>
                  {services.map((s,i)=>{
                    const catColors = { Healthcare:'#34d399', Beauty:'#f472b6', Consulting:'#60a5fa', Fitness:'#fb923c', Education:'#a78bfa', 'Home Services':'#fbbf24' };
                    const color = catColors[s.category] || '#818cf8';
                    return (
                      <div key={s._id} className="glass card-hover" style={{ padding:'20px', animation:`slide-in 0.4s ease ${i*0.04}s both`, borderTop:`2px solid ${color}40` }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                          <h4 style={{ color:'#e2e8f0', fontSize:'14px', fontWeight:700, lineHeight:1.3, flex:1, marginRight:'10px' }}>{s.name}</h4>
                          <span style={{ padding:'3px 9px', borderRadius:'20px', fontSize:'10px', fontWeight:600, background:`${color}18`, color, border:`1px solid ${color}30`, whiteSpace:'nowrap', flexShrink:0 }}>{s.category}</span>
                        </div>
                        <p style={{ color:'#475569', fontSize:'12px', marginBottom:'14px', lineHeight:1.5 }}>{s.description}</p>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'10px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ color:'#64748b', fontSize:'12px' }}>⏱ {s.duration} mins</span>
                          <span style={{ color, fontWeight:700, fontSize:'16px' }}>₹{s.price}</span>
                        </div>
                        <div style={{ fontSize:'11px', color:'#334155', marginTop:'8px' }}>👤 {s.provider?.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}