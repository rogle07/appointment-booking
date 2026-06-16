import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('appointments');
  const [form, setForm] = useState({ name: '', description: '', duration: '', price: '', category: 'Healthcare', availableSlots: '' });
  const [adding, setAdding] = useState(false);

  const CATEGORIES = ['Healthcare', 'Beauty', 'Fitness', 'Consulting', 'Education', 'Home Services'];

  useEffect(() => {
    API.get('/appointments/my')
      .then(res => { setAppointments(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAddService = async () => {
    if (!form.name || !form.price || !form.duration) return toast.error('Fill required fields');
    setAdding(true);
    try {
      const slots = form.availableSlots.split(',').map(s => s.trim()).filter(Boolean);
      await API.post('/services', { ...form, availableSlots: slots });
      toast.success('Service added successfully!');
      setForm({ name: '', description: '', duration: '', price: '', category: 'Healthcare', availableSlots: '' });
    } catch { toast.error('Failed to add service'); }
    setAdding(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      setAppointments(p => p.map(a => a._id === id ? { ...a, status } : a));
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const counts = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  const statusInfo = {
    pending:   { color: '#fbbf24', icon: '⏳' },
    confirmed: { color: '#34d399', icon: '✅' },
    cancelled: { color: '#f87171', icon: '❌' },
    completed: { color: '#818cf8', icon: '🎉' },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)', padding: '90px 32px 60px' }}>
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'rgba(52,211,153,0.04)', top: '-200px', right: '-100px', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', animation: 'slide-in 0.5s ease' }}>
          <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.1))', border: '1px solid rgba(52,211,153,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🏪</div>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#f1f5f9' }}>Provider Dashboard</h1>
            <p style={{ color: '#475569', fontSize: '13px', marginTop: '2px' }}>Welcome back, {user?.name}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px,1fr))', gap: '14px', marginBottom: '28px' }}>
          {[
            { label: 'Total Bookings', value: counts.total,     color: '#818cf8', icon: '📊' },
            { label: 'Pending',        value: counts.pending,   color: '#fbbf24', icon: '⏳' },
            { label: 'Confirmed',      value: counts.confirmed, color: '#34d399', icon: '✅' },
            { label: 'Completed',      value: counts.completed, color: '#60a5fa', icon: '🎉' },
          ].map((c, i) => (
            <div key={i} className="glass" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '12px', animation: `slide-in 0.4s ease ${i * 0.08}s both` }}>
              <div style={{ fontSize: '24px' }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: c.color }}>{c.value}</div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '12px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '28px', animation: 'slide-in 0.4s ease 0.2s both' }}>
          {['appointments', 'add-service'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '13px', transition: 'all 0.25s',
              background: tab === t ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              color: tab === t ? '#fff' : '#64748b'
            }}>
              {t === 'appointments' ? '📋 Appointments' : '➕ Add Service'}
            </button>
          ))}
        </div>

        {/* Appointments Tab */}
        {tab === 'appointments' && (
          <div style={{ animation: 'slide-in 0.4s ease' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px' }}>
                <div style={{ fontSize: '40px', animation: 'float 1s infinite' }}>⏳</div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="glass" style={{ textAlign: 'center', padding: '80px', animation: 'slide-in 0.5s ease' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>📭</div>
                <h3 style={{ color: '#94a3b8', fontSize: '18px' }}>No appointments yet</h3>
                <p style={{ color: '#475569', marginTop: '8px', fontSize: '14px' }}>Customers will appear here once they book your services</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {appointments.map((a, i) => {
                  const info = statusInfo[a.status] || statusInfo.pending;
                  return (
                    <div key={a._id} className="glass card-hover" style={{ padding: '20px 24px', animation: `slide-in 0.4s ease ${i * 0.06}s both` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                          <div style={{ width: 46, height: 46, borderRadius: '13px', background: `${info.color}18`, border: `1px solid ${info.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{info.icon}</div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '15px' }}>{a.service?.name}</div>
                            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '3px' }}>
                              👤 <span style={{ color: '#94a3b8' }}>{a.customer?.name}</span>
                              <span style={{ margin: '0 8px', color: '#334155' }}>•</span>
                              📅 {a.date}
                              <span style={{ margin: '0 8px', color: '#334155' }}>•</span>
                              ⏰ {a.timeSlot}
                            </div>
                            {a.notes && <div style={{ color: '#475569', fontSize: '12px', marginTop: '4px', fontStyle: 'italic' }}>📝 {a.notes}</div>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span className={`badge badge-${a.status}`} style={{ color:'#98e653'}}>{a.status}</span>
                          {a.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(a._id, 'confirmed')} style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>✅ Confirm</button>
                              <button onClick={() => updateStatus(a._id, 'cancelled')} style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>❌ Decline</button>
                            </>
                          )}
                          {a.status === 'confirmed' && (
                            <button onClick={() => updateStatus(a._id, 'completed')} style={{ background: 'rgba(129,140,248,0.12)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.25)', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>🎉 Complete</button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Add Service Tab */}
        {tab === 'add-service' && (
          <div className="glass" style={{ padding: '32px', maxWidth: '600px', animation: 'slide-in 0.4s ease' }}>
            <h3 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>➕ Add New Service</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '7px', display: 'block', fontWeight: 500 }}>Service Name *</label>
                <input className="input-field" placeholder="e.g. Haircut & Styling" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '7px', display: 'block', fontWeight: 500 }}>Description</label>
                <textarea className="input-field" placeholder="Describe your service..." value={form.description} rows={3}
                  onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '7px', display: 'block', fontWeight: 500 }}>Duration (mins) *</label>
                  <input className="input-field" placeholder="60" type="number" value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '7px', display: 'block', fontWeight: 500 }}>Price (₹) *</label>
                  <input className="input-field" placeholder="500" type="number" value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '7px', display: 'block', fontWeight: 500 }}>Category</label>
                <select className="input-field" value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '7px', display: 'block', fontWeight: 500 }}>Available Slots (comma separated)</label>
                <input className="input-field" placeholder="09:00, 10:00, 11:00, 14:00, 15:00" value={form.availableSlots}
                  onChange={e => setForm({ ...form, availableSlots: e.target.value })} />
                <p style={{ color: '#334155', fontSize: '11px', marginTop: '6px' }}>Use 24hr format e.g. 09:00, 14:30</p>
              </div>
              <button className="btn-primary" onClick={handleAddService} disabled={adding}
                style={{ padding: '13px', fontSize: '15px', marginTop: '6px', opacity: adding ? 0.7 : 1 }}>
                {adding ? '⏳ Adding...' : '➕ Add Service'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}