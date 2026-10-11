import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { EarlyAccessModal } from '../components/landing/EarlyAccessModal';

export function LandingPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const gradientText: React.CSSProperties = {
    background: 'linear-gradient(100deg, #60A5FA 0%, #38BDF8 40%, #818CF8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const sectionWrap = (extra?: React.CSSProperties): React.CSSProperties => ({
    maxWidth: '1120px',
    margin: '0 auto',
    padding: '0 32px',
    ...extra,
  });

  const pillLabel: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '999px',
    padding: '5px 14px 5px 10px',
    fontSize: '12px',
    color: '#A5B4FC',
    fontWeight: 600,
    letterSpacing: '0.02em',
    marginBottom: '28px',
  };

  const primaryBtn: React.CSSProperties = {
    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
    border: 'none',
    color: '#fff',
    fontWeight: 700,
    padding: '14px 30px',
    borderRadius: '999px',
    cursor: 'pointer',
    fontSize: '15px',
    boxShadow: '0 0 28px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    letterSpacing: '0.01em',
  };

  const ghostBtn: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.14)',
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 600,
    padding: '14px 30px',
    borderRadius: '999px',
    cursor: 'pointer',
    fontSize: '15px',
    backdropFilter: 'blur(8px)',
    transition: 'background 0.2s, border-color 0.2s, color 0.2s',
    letterSpacing: '0.01em',
  };

  const roles = [
    {
      icon: '🎓',
      title: 'Students',
      sub: 'Be heard without chasing.',
      desc: 'Submit requests, track outcomes, and stay informed — without sending a single WhatsApp message.',
      color: '#3B82F6',
      glow: 'rgba(59,130,246,0.12)',
      items: ['One-tap issue submission', 'Live request tracking', 'Class-wide announcements', 'Instant outcome visibility'],
    },
    {
      icon: '📋',
      title: 'Class Reps',
      sub: 'Manage without the mess.',
      desc: 'Your dashboard shows everything your class needs — organized, prioritized, and ready to escalate.',
      color: '#8B5CF6',
      glow: 'rgba(139,92,246,0.14)',
      items: ['Centralized request inbox', 'Memo drafting & formatting', 'Contribution heatmap', 'Escalation management'],
      featured: true,
    },
    {
      icon: '👨‍🏫',
      title: 'Teachers',
      sub: 'Stay informed without the noise.',
      desc: 'Receive clean, rep-formatted memos. Manage 10+ sections and see per-class analytics instantly.',
      color: '#06B6D4',
      glow: 'rgba(6,182,212,0.12)',
      items: ['Structured memo inbox', 'Multi-section dashboard', 'Per-class analytics', 'Appointment scheduler'],
    },
  ];

  const steps = [
    { num: '01', icon: '✍️', title: 'Student Submits', desc: 'A student raises an issue or request in seconds — structured, tracked, never lost.', color: '#3B82F6' },
    { num: '02', icon: '📝', title: 'Rep Formats', desc: 'The class rep reviews, organizes, and drafts a professional memo — one voice for the whole class.', color: '#8B5CF6' },
    { num: '03', icon: '📬', title: 'Teacher Receives', desc: 'The teacher gets a clean, concise memo — not 60 individual messages.', color: '#06B6D4' },
    { num: '04', icon: '✅', title: 'Everyone Knows', desc: 'Resolution is shared with the whole class automatically. Closure for everyone.', color: '#10B981' },
  ];

  const stats = [
    { val: '4', label: 'Stakeholder Roles', suffix: '' },
    { val: '10', label: 'Sections per Teacher', suffix: '+' },
    { val: '0', label: 'WhatsApp Groups Needed', suffix: '' },
    { val: '100', label: 'Transparency', suffix: '%' },
  ];

  return (
    <div style={{ background: '#080E1C', minHeight: '100vh', color: '#fff', fontFamily: '"Inter", -apple-system, sans-serif', overflowX: 'hidden' }}>
      <LandingNavbar />
      <EarlyAccessModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', paddingTop: '148px', paddingBottom: '100px', textAlign: 'center', overflow: 'hidden' }}>

        {/* Deep ambient glows */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* Center blue */}
          <div style={{
            position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
            width: '900px', height: '700px',
            background: 'radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.22) 0%, rgba(99,102,241,0.1) 35%, transparent 65%)',
            filter: 'blur(1px)',
          }} />
          {/* Left violet */}
          <div style={{
            position: 'absolute', top: '10%', left: '-5%',
            width: '420px', height: '420px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.13) 0%, transparent 70%)',
          }} />
          {/* Right cyan */}
          <div style={{
            position: 'absolute', top: '15%', right: '-5%',
            width: '380px', height: '380px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)',
          }} />
          {/* Grid overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          }} />
        </div>

        <div style={sectionWrap()}>
          {/* Pill badge */}
          <div style={pillLabel}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818CF8', display: 'inline-block', boxShadow: '0 0 6px #818CF8' }} />
            Built for Ethiopian Universities · Now in Early Access
          </div>

          {/* Main headline */}
          <h1 style={{
            fontSize: 'clamp(52px, 8.5vw, 96px)',
            fontWeight: 900,
            lineHeight: 1.0,
            margin: '0 0 12px',
            letterSpacing: '-0.04em',
            color: '#fff',
          }}>
            Your class.
          </h1>
          <h1 style={{
            fontSize: 'clamp(52px, 8.5vw, 96px)',
            fontWeight: 900,
            lineHeight: 1.0,
            margin: '0 0 32px',
            letterSpacing: '-0.04em',
            ...gradientText,
          }}>
            In flow.
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '560px',
            margin: '0 auto 48px',
            lineHeight: 1.7,
            fontWeight: 400,
          }}>
            One platform for students to speak, class reps to manage, and teachers to act — without the WhatsApp chaos.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '64px' }}>
            <button
              style={primaryBtn}
              onClick={() => setModalOpen(true)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.02)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 48px rgba(99,102,241,0.65), 0 4px 16px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.3)';
              }}
            >
              Get Early Access ✦
            </button>
            <button
              style={ghostBtn}
              onClick={() => navigate('/login')}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.28)';
                (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)';
              }}
            >
              Explore Prototype →
            </button>
          </div>

          {/* Floating App Preview */}
          <div style={{ position: 'relative', maxWidth: '820px', margin: '0 auto' }}>

            {/* Floating stat cards — left */}
            <div style={{
              position: 'absolute', left: '-60px', top: '60px', zIndex: 10,
              background: 'rgba(15,23,42,0.85)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '14px', padding: '14px 18px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              textAlign: 'left', minWidth: '150px',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', fontWeight: 500 }}>Open Requests</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#3B82F6', lineHeight: 1 }}>8</div>
              <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px', fontWeight: 500 }}>↑ 3 need attention</div>
            </div>

            {/* Floating stat cards — right */}
            <div style={{
              position: 'absolute', right: '-50px', top: '80px', zIndex: 10,
              background: 'rgba(15,23,42,0.85)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '14px', padding: '14px 18px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              textAlign: 'left', minWidth: '150px',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', fontWeight: 500 }}>Resolved This Week</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#8B5CF6', lineHeight: 1 }}>24</div>
              <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px', fontWeight: 500 }}>↑ 12 from last week</div>
            </div>

            {/* Resolved badge bottom-right */}
            <div style={{
              position: 'absolute', right: '-30px', bottom: '80px', zIndex: 10,
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.35)',
              borderRadius: '12px', padding: '10px 16px',
              backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ fontSize: '16px' }}>✅</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#10B981' }}>Just Resolved</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Lab Equipment Issue</div>
              </div>
            </div>

            {/* Main app window */}
            <div style={{
              background: 'rgba(13,18,34,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.08)',
            }}>
              {/* Window chrome */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                {['#FF5F57', '#FFBD2E', '#28C840'].map((c) => (
                  <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, flexShrink: 0 }} />
                ))}
                <div style={{
                  flex: 1, background: 'rgba(255,255,255,0.05)',
                  borderRadius: '6px', padding: '4px 12px',
                  marginLeft: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.3)',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{ fontSize: '9px' }}>🔒</span> classflow.app/dashboard
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }}>Class Rep Portal</div>
              </div>

              {/* App body */}
              <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', minHeight: '320px' }}>

                {/* Sidebar */}
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '16px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Navigation</div>
                  {[
                    { label: '📊 Dashboard', active: true },
                    { label: '📋 Requests', active: false },
                    { label: '✉️ Memos', active: false },
                    { label: '👥 Class', active: false },
                    { label: '📅 Meetings', active: false },
                  ].map((item) => (
                    <div key={item.label} style={{
                      padding: '8px 10px', borderRadius: '8px', marginBottom: '2px',
                      background: item.active ? 'rgba(99,102,241,0.18)' : 'transparent',
                      color: item.active ? '#A5B4FC' : 'rgba(255,255,255,0.4)',
                      fontSize: '13px', fontWeight: item.active ? 600 : 400,
                      border: item.active ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                    }}>{item.label}</div>
                  ))}
                </div>

                {/* Main content */}
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>
                    Mission Control
                  </div>
                  {/* Metric cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    {[
                      { label: 'Pending', val: '8', color: '#F59E0B' },
                      { label: 'Resolved', val: '24', color: '#10B981' },
                      { label: 'Escalated', val: '3', color: '#EF4444' },
                    ].map((m) => (
                      <div key={m.label} style={{
                        background: `${m.color}0D`, border: `1px solid ${m.color}22`,
                        borderRadius: '10px', padding: '12px',
                      }}>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>{m.label}</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: m.color }}>{m.val}</div>
                      </div>
                    ))}
                  </div>
                  {/* Request rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {[
                      { title: 'Exam rescheduling — Dr. Samuel', badge: 'HIGH', badgeColor: '#EF4444', status: 'Forwarded', statusColor: '#F59E0B' },
                      { title: 'Lab equipment Room 204', badge: 'MED', badgeColor: '#F59E0B', status: 'Resolved', statusColor: '#10B981' },
                      { title: 'Grade clarification mid-term', badge: 'LOW', badgeColor: '#3B82F6', status: 'Under Review', statusColor: '#3B82F6' },
                    ].map((r) => (
                      <div key={r.title} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '8px', padding: '8px 12px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '9px', fontWeight: 700, padding: '2px 6px',
                            borderRadius: '4px', background: `${r.badgeColor}20`, color: r.badgeColor,
                          }}>{r.badge}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>{r.title}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: r.statusColor, fontWeight: 600, flexShrink: 0 }}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Glow beneath */}
            <div style={{
              position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)',
              width: '70%', height: '100px',
              background: 'radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, transparent 70%)',
              filter: 'blur(24px)', pointerEvents: 'none',
            }} />
          </div>

          {/* Social proof strip */}
          <div style={{ marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { icon: '🏛️', text: 'AAU' },
              { icon: '🎓', text: 'Jimma University' },
              { icon: '📚', text: 'Bahir Dar University' },
              { icon: '🔬', text: 'Adama Science & Tech' },
            ].map((u) => (
              <div key={u.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.4, fontSize: '13px', fontWeight: 500 }}>
                <span>{u.icon}</span>
                <span>{u.text}</span>
              </div>
            ))}
            <span style={{ opacity: 0.3, fontSize: '12px' }}>& more joining soon</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ ...sectionWrap(), display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              textAlign: 'center', padding: '20px',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}>
              <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-0.04em', ...gradientText }}>
                {s.val}{s.suffix}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ROLES
      ══════════════════════════════════════════════════════════════ */}
      <section id="roles" style={{ padding: '120px 0' }}>
        <div style={sectionWrap()}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ color: '#818CF8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
              Everyone Wins
            </p>
            <h2 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 900, margin: '0 0 18px', letterSpacing: '-0.03em' }}>
              One platform.{' '}
              <span style={gradientText}>Three clear roles.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
              ClassFlow gives every stakeholder exactly what they need — nothing more, nothing less.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {roles.map((role) => (
              <div
                key={role.title}
                style={{
                  position: 'relative',
                  background: role.featured
                    ? `linear-gradient(160deg, ${role.glow} 0%, rgba(255,255,255,0.02) 100%)`
                    : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${role.featured ? `${role.color}45` : `${role.color}20`}`,
                  borderRadius: '22px',
                  padding: '36px 32px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 24px 56px ${role.color}20, 0 0 0 1px ${role.color}30`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                {/* BG glow orb */}
                <div style={{
                  position: 'absolute', bottom: '-40px', right: '-40px',
                  width: '150px', height: '150px', borderRadius: '50%',
                  background: `radial-gradient(ellipse, ${role.color}15 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {role.featured && (
                  <div style={{
                    position: 'absolute', top: '18px', right: '18px',
                    background: `${role.color}20`, border: `1px solid ${role.color}40`,
                    color: role.color, fontSize: '10px', fontWeight: 700,
                    padding: '3px 10px', borderRadius: '999px', letterSpacing: '0.1em',
                  }}>FEATURED</div>
                )}

                {/* Icon */}
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: `${role.color}18`, border: `1px solid ${role.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', marginBottom: '22px',
                }}>{role.icon}</div>

                <h3 style={{ fontSize: '21px', fontWeight: 800, margin: '0 0 6px', color: '#fff', letterSpacing: '-0.01em' }}>{role.title}</h3>
                <p style={{ fontSize: '13.5px', fontWeight: 600, color: role.color, margin: '0 0 14px', opacity: 0.9 }}>{role.sub}</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: '0 0 24px' }}>{role.desc}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {role.items.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: `${role.color}20`, border: `1px solid ${role.color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: '10px', color: role.color, fontWeight: 800,
                      }}>✓</div>
                      <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        {/* BG accent */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '800px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={sectionWrap()}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ color: '#818CF8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
              The Flow
            </p>
            <h2 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>
              How it works
            </h2>
          </div>

          {/* Steps grid with connecting line */}
          <div style={{ position: 'relative' }}>
            {/* Horizontal connector */}
            <div style={{
              position: 'absolute', top: '36px', left: '10%', right: '10%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3) 20%, rgba(6,182,212,0.3) 80%, transparent)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {steps.map((step) => (
                <div key={step.num} style={{
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${step.color}1A`,
                  borderRadius: '18px', padding: '32px 20px',
                  transition: 'transform 0.25s, border-color 0.25s',
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${step.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${step.color}1A`;
                  }}
                >
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: `${step.color}15`, border: `2px solid ${step.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '22px',
                  }}>{step.icon}</div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: step.color, letterSpacing: '0.1em', marginBottom: '8px', opacity: 0.7 }}>
                    STEP {step.num}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 10px', color: '#fff' }}>{step.title}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CHAOS VS CLARITY
      ══════════════════════════════════════════════════════════════ */}
      <section id="why" style={{ padding: '120px 0' }}>
        <div style={sectionWrap()}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <h2 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 900, margin: '0 0 18px', letterSpacing: '-0.03em' }}>
              Less chaos.{' '}
              <span style={gradientText}>More clarity.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '17px', maxWidth: '480px', margin: '0 auto' }}>
              University communication shouldn't depend on who saw which WhatsApp message.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Before */}
            <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: '22px', padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>😵</div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'rgba(239,68,68,0.9)' }}>Without ClassFlow</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>The everyday chaos</div>
                </div>
              </div>
              {[
                '"Did the teacher even see our request?"',
                '"Which WhatsApp group was it posted in?"',
                '"The class rep forgot to follow up again"',
                '"We never heard back about the exam"',
                '"60 students all messaging one teacher"',
              ].map((line) => (
                <div key={line} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(239,68,68,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '10px', color: '#EF4444', marginTop: '1px',
                  }}>✕</div>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', textDecorationColor: 'rgba(239,68,68,0.35)', lineHeight: 1.5 }}>
                    {line}
                  </span>
                </div>
              ))}
            </div>

            {/* After */}
            <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: '22px', padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>✨</div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'rgba(16,185,129,0.9)' }}>With ClassFlow</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Crystal clear flow</div>
                </div>
              </div>
              {[
                'Every request tracked, timestamped, assigned',
                'Class reps filter and format before escalating',
                'Teachers receive one clean memo per issue',
                'Students see live resolution status always',
                'One system. Defined roles. Zero chaos.',
              ].map((line) => (
                <div key={line} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '10px', color: '#10B981', marginTop: '1px',
                  }}>✓</div>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: '120px 0', background: 'rgba(255,255,255,0.012)' }}>
        <div style={sectionWrap()}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ color: '#818CF8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>Features</p>
            <h2 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>
              Built for how universities{' '}
              <span style={gradientText}>actually work</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
            {[
              { icon: '📊', title: 'Circular Contribution Graph', desc: 'Class reps see their activity as a GitHub-style circular heatmap. 52 weeks. Every resolved request counts.', color: '#3B82F6' },
              { icon: '🏫', title: 'Multi-Section Teaching', desc: 'Teachers manage 10+ sections from one dashboard — click any section for full analytics.', color: '#8B5CF6' },
              { icon: '📄', title: 'Structured Memo System', desc: 'Reps draft, teachers approve. No more informal messages — structured records for everything.', color: '#06B6D4' },
              { icon: '⚡', title: 'Real-Time Status Tracking', desc: '"Did they get our message?" — never again. Every request shows live status for all parties.', color: '#F59E0B' },
              { icon: '🔐', title: 'Role-Based Portals', desc: 'Four distinct portals — Student, Class Rep, Teacher, Admin — each purpose-designed, nothing shared unnecessarily.', color: '#10B981' },
              { icon: '🇪🇹', title: 'Ethiopian University First', desc: 'Workflows, terminologies, and structures built around the actual Ethiopian university system.', color: '#EF4444' },
            ].map((feat) => (
              <div key={feat.title} style={{
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${feat.color}18`,
                borderRadius: '18px', padding: '28px',
                transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 40px ${feat.color}18`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${feat.color}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${feat.color}18`;
                }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: `${feat.color}15`, border: `1px solid ${feat.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', marginBottom: '18px',
                }}>{feat.icon}</div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 10px', color: '#fff', letterSpacing: '-0.01em' }}>{feat.title}</h4>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.65, margin: 0 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '140px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.14) 0%, transparent 70%)',
        }} />
        {/* Top border glow */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(6,182,212,0.5), transparent)',
        }} />

        <div style={sectionWrap()}>
          <div style={pillLabel}>✦ Join the Movement</div>
          <h2 style={{ fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: 900, margin: '0 0 20px', letterSpacing: '-0.04em' }}>
            Ready to bring{' '}
            <span style={gradientText}>flow</span>
            {' '}to your class?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', margin: '0 0 48px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
            Be part of the future of Ethiopian university communication.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              style={{ ...primaryBtn, padding: '16px 36px', fontSize: '16px' }}
              onClick={() => setModalOpen(true)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.02)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 60px rgba(99,102,241,0.65), 0 4px 16px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.3)';
              }}
            >
              Get Early Access ✦
            </button>
            <button
              style={{ ...ghostBtn, padding: '16px 36px', fontSize: '16px' }}
              onClick={() => navigate('/login')}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.28)';
                (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)';
              }}
            >
              Try the Prototype →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '48px 0' }}>
        <div style={{ ...sectionWrap(), display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em',
              boxShadow: '0 0 16px rgba(99,102,241,0.4)',
            }}>CF</div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px', letterSpacing: '0.05em' }}>CLASSFLOW</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>Your class. In flow.</div>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', margin: 0 }}>
            © 2026 ClassFlow · Built for Ethiopian Universities
          </p>

          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.3)')}
              >{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
