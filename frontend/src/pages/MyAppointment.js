import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api/axios';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/appointments/my')
      .then(res => { setAppointments(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCancel = async id => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await API.put(`/appointments/${id}/status`, { status: 'cancelled' });
      setAppointments(p => p.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
      toast.success('Appointment cancelled');
    } catch { toast.error('Failed to cancel'); }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const statusInfo = {
    pending:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  icon: '⏳' },
    confirmed: { color: '#34d399', bg: 'rgba(52,211,153,0.12)',  icon: '✅' },
    cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: '❌' },
    completed: { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', icon: '🎉' },
  };

  const counts = { all: appointments.length, pending: appointments.filter(a => a.status === 'pending').length, confirmed: appointments.filter(a => a.status === 'confirmed').length, completed: appointments.filter(a => a.status === 'completed').length };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)', padding: '90px 32px 60px' }}>
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'rgba(99,102,241,0.04)', top: '-150px', right: '-100px', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '32px', animation: 'slide-in 0.5s ease' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9' }}>My Appointments</h1>
          <p style={{ color: '#475569', fontSize: '14px', marginTop: '4px' }}>Track and manage all your bookings</p>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '14px', marginBottom: '28px' }}>
          {Object.entries(counts).map(([k, v], i) => (
            <div key={k} className="glass" style={{ padding: '16px 18px', cursor: 'pointer', transition: 'all 0.25s', borderColor: filter === k ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)', animation: `slide-in 0.4s ease ${i*0.08}s both` }}
              onClick={() => setFilter(k)}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: filter === k ? '#818cf8' : '#e2e8f0' }}>{v}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px', textTransform: 'capitalize', fontWeight: 500 }}>{k}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: '44px', animation: 'float 1s ease-in-out infinite' }}>⏳</div>
            <p style={{ color: '#475569', marginTop: '16px' }}>Loading appointments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass" style={{ textAlign: 'center', padding: '80px 40px', animation: 'slide-in 0.5s ease' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ color: '#94a3b8', fontSize: '18px', fontWeight: 600 }}>No appointments found</h3>
            <p style={{ color: '#475569', marginTop: '8px', fontSize: '14px' }}>
              {filter === 'all' ? 'Book a service from the home page to get started!' : `No ${filter} appointments`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map((a, i) => {
              const info = statusInfo[a.status] || statusInfo.pending;
              return (
                <div key={a._id} className="glass card-hover" style={{ padding: '22px', animation: `slide-in 0.4s ease ${i * 0.07}s both` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ width: 50, height: 50, borderRadius: '14px', background: info.bg, border: `1px solid ${info.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{info.icon}</div>
                      <div>
                        <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{a.service?.name}</h3>
                        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>with {a.provider?.name}</p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <span style={{ color: '#94a3b8', fontSize: '13px' }}>📅 {a.date}</span>
                          <span style={{ color: '#94a3b8', fontSize: '13px' }}>⏰ {a.timeSlot}</span>
                          {a.service?.price && <span style={{ color: '#818cf8', fontSize: '13px', fontWeight: 600 }}>₹{a.service.price}</span>}
                        </div>
                        {a.notes && <p style={{ color: '#475569', fontSize: '12px', marginTop: '8px', fontStyle: 'italic' }}>📝 {a.notes}</p>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                      <span className={`badge badge-${a.status}`}>{a.status}</span>
                      {a.status === 'pending' && (
                        <button onClick={() => handleCancel(a._id)} style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'all 0.2s' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}