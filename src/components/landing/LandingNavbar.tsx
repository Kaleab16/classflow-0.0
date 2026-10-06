import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function LandingNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveLink(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'For Everyone', id: 'roles' },
    { label: 'Features', id: 'features' },
    { label: 'Why ClassFlow', id: 'why' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: '18px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      borderRadius: '999px',
      background: scrolled ? 'rgba(8,14,28,0.88)' : 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: `1px solid ${scrolled ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'}`,
      boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)' : 'none',
      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      width: 'min(880px, 94vw)',
    }}>
      {/* Logo */}
      <div
        onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveLink(''); }}
        style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer', padding: '4px 8px', borderRadius: '999px' }}
      >
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: 900, color: '#fff',
          boxShadow: '0 0 14px rgba(99,102,241,0.5)',
          flexShrink: 0,
        }}>CF</div>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>CLASSFLOW</span>
      </div>

      {/* Center nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {navLinks.map((item) => {
          const isActive = activeLink === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                background: isActive ? 'rgba(99,102,241,0.15)' : 'none',
                border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                color: isActive ? '#A5B4FC' : 'rgba(255,255,255,0.55)',
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 500,
                padding: '6px 14px',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'none';
                }
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.65)', fontSize: '13.5px', fontWeight: 500,
            padding: '7px 14px', borderRadius: '999px', cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#fff')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)')}
        >
          Sign In
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
            border: 'none', color: '#fff', fontSize: '13.5px', fontWeight: 700,
            padding: '8px 20px', borderRadius: '999px', cursor: 'pointer',
            boxShadow: '0 0 18px rgba(99,102,241,0.45)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(99,102,241,0.65)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 18px rgba(99,102,241,0.45)';
          }}
        >
          Sign Up →
        </button>
      </div>
    </nav>
  );
}
