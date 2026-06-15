import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';

export default function BookAppointment() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/services').then(res => {
      const found = res.data.find(s => s._id === serviceId);
      setService(found);
    });
  }, [serviceId]);

  const handleBook = async () => {
    if (!date || !timeSlot) return toast.error('Please select date and time slot');
    setLoading(true);
    try {
      await API.post('/appointments', { serviceId, providerId: service.provider._id, date, timeSlot, notes });
      toast.success('🎉 Appointment booked successfully!');
      navigate('/my-appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setLoading(false);
  };

  const catColors = { Healthcare: '#34d399', Beauty: '#f472b6', Consulting: '#60a5fa', Fitness: '#fb923c', Education: '#a78bfa', 'Home Services': '#fbbf24' };

  if (!service) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '44px', animation: 'float 1s infinite' }}>⏳</div>
        <p style={{ color: '#475569', marginTop: '14px' }}>Loading service...</p>
      </div>
    </div>
  );

  const color = catColors[service.category] || '#818cf8';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)', padding: '90px 20px 60px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: `${color}08`, top: '-100px', right: '-100px', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '520px', animation: 'slide-in 0.5s ease', position: 'relative', zIndex: 1 }}>

        {/* Service info card */}
        <div className="glass" style={{ padding: '24px', marginBottom: '20px', borderColor: `${color}25` }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: 54, height: 54, borderRadius: '15px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
              {{ Healthcare:'🏥', Beauty:'💅', Consulting:'💼', Fitness:'💪', Education:'📚', 'Home Services':'🏠' }[service.category] || '⭐'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9' }}>{service.name}</h2>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: `${color}18`, color, border: `1px solid ${color}30`, fontWeight: 600 }}>{service.category}</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '13px', marginTop: '6px', lineHeight: 1.5 }}>{service.description}</p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>⏱ {service.duration} mins</span>
                <span style={{ color, fontSize: '15px', fontWeight: 700 }}>₹{service.price}</span>
                <span style={{ color: '#64748b', fontSize: '13px' }}>👤 {service.provider?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking form */}
        <div className="glass" style={{ padding: '28px' }}>
          <h3 style={{ color: '#f1f5f9', fontSize: '17px', fontWeight: 700, marginBottom: '22px' }}>📅 Select Date & Time</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Select Date</label>
              <input type="date" className="input-field"
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Select Time Slot</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {service.availableSlots?.map(slot => (
                  <button key={slot} onClick={() => setTimeSlot(slot)} style={{
                    padding: '9px 16px', borderRadius: '9px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                    background: timeSlot === slot ? `${color}25` : 'rgba(255,255,255,0.05)',
                    color: timeSlot === slot ? color : '#64748b',
                    border: `1.5px solid ${timeSlot === slot ? color : 'rgba(255,255,255,0.08)'}`,
                    transform: timeSlot === slot ? 'scale(1.05)' : 'scale(1)'
                  }}>{slot}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Notes (optional)</label>
              <textarea className="input-field" rows={3} placeholder="Any special requests or information..."
                onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
            </div>

            {date && timeSlot && (
              <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)', animation: 'slide-in 0.3s ease' }}>
                <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 600 }}>📋 Booking Summary</p>
                <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>{service.name} • {date} at {timeSlot} • ₹{service.price}</p>
              </div>
            )}

            <button className="btn-primary" onClick={handleBook} disabled={loading || !date || !timeSlot}
              style={{ padding: '13px', fontSize: '15px', opacity: (!date || !timeSlot || loading) ? 0.5 : 1, cursor: (!date || !timeSlot) ? 'not-allowed' : 'pointer' }}>
              {loading ? '⏳ Booking...' : '🎉 Confirm Appointment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}