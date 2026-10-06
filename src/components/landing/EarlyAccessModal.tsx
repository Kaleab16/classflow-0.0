import { useState } from 'react';
import { Modal } from '../common/Modal';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EarlyAccessModal({ isOpen, onClose }: EarlyAccessModalProps) {
  const [form, setForm] = useState({ name: '', email: '', role: '', university: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.role) {
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ name: '', email: '', role: '', university: '' });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '6px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  };

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="">
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10B981',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '28px',
          }}>✓</div>
          <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>
            You're on the list!
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '0 0 24px' }}>
            We'll reach out when ClassFlow is ready for your university.
          </p>
          <button
            onClick={handleClose}
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              border: 'none', color: '#fff', fontWeight: 600,
              padding: '10px 28px', borderRadius: '999px', cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Get Early Access">
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '0 0 24px' }}>
        Be among the first universities to experience ClassFlow.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            style={inputStyle}
            placeholder="e.g. Kaleab Tadesse"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
        </div>
        <div>
          <label style={labelStyle}>Email Address *</label>
          <input
            style={inputStyle}
            type="email"
            placeholder="e.g. kaleab@aau.edu.et"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
        </div>
        <div>
          <label style={labelStyle}>I am a... *</label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
          >
            <option value="" style={{ background: '#0B1120' }}>Select your role</option>
            <option value="student" style={{ background: '#0B1120' }}>Student</option>
            <option value="class_rep" style={{ background: '#0B1120' }}>Class Representative</option>
            <option value="teacher" style={{ background: '#0B1120' }}>Teacher / Instructor</option>
            <option value="admin" style={{ background: '#0B1120' }}>University Administrator</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>University</label>
          <input
            style={inputStyle}
            placeholder="e.g. Addis Ababa University"
            value={form.university}
            onChange={(e) => setForm({ ...form, university: e.target.value })}
            onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
        </div>
        <button
          type="submit"
          style={{
            marginTop: '8px',
            background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
            border: 'none', color: '#fff', fontWeight: 700,
            padding: '13px', borderRadius: '10px', cursor: 'pointer',
            fontSize: '15px', boxShadow: '0 0 24px rgba(59,130,246,0.35)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.transform = 'scale(1)')}
        >
          Request Early Access
        </button>
      </form>
    </Modal>
  );
}
