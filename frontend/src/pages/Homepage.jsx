import React, { useState, useEffect, useRef } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

/* ─── Inline Styles (self-contained, no external CSS needed beyond Google Fonts) ─── */
const injectFonts = () => {
  if (document.getElementById('polished-fonts')) return;
  const link = document.createElement('link');
  link.id = 'polished-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800&family=Outfit:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);

  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --g1: #52D68A;
      --g2: #A8EFC8;
      --s1: #38C5F5;
      --s2: #A2E4FB;
      --navy: #071E3D;
      --navy2: #0D2E5A;
      --white: #FFFFFF;
      --off: #F2FCF7;
      --muted: #64748B;
      --card-r: 22px;
      --transition: all 0.38s cubic-bezier(0.34,1.56,0.64,1);
    }
    body { font-family: 'Outfit', sans-serif; }

    @keyframes floatUp {
      from { opacity: 0; transform: translateY(36px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1);   opacity: 0.6; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes blob {
      0%,100% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 70%; }
      50%      { border-radius: 40% 60% 30% 70% / 60% 40% 70% 50%; }
    }
    @keyframes badge-in {
      from { opacity: 0; transform: translateX(-28px) scale(0.9); }
      to   { opacity: 1; transform: translateX(0)   scale(1); }
    }
    @keyframes stats-in {
      from { opacity: 0; transform: translateX(28px) scale(0.9); }
      to   { opacity: 1; transform: translateX(0)    scale(1); }
    }
    @keyframes count-up {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .pe-hero        { animation: fadeIn .6s ease both; }
    .pe-hero-text   { animation: floatUp .7s .15s ease both; }
    .pe-hero-img    { animation: floatUp .7s .3s ease both; }
    .pe-badge-anim  { animation: badge-in .65s .55s ease both; }
    .pe-stats-anim  { animation: stats-in .65s .7s ease both; }

    .pe-service-card {
      transition: var(--transition);
    }
    .pe-service-card:hover {
      transform: translateY(-10px) scale(1.02);
    }
    .pe-event-card {
      transition: transform 0.35s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.35s ease;
    }
    .pe-event-card:hover {
      transform: translateY(-12px);
      box-shadow: 0 28px 56px rgba(56,197,245,0.2) !important;
    }
    .pe-btn-primary {
      position: relative; overflow: hidden;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .pe-btn-primary::after {
      content: '';
      position: absolute; inset: 0;
      background: rgba(255,255,255,0.15);
      transform: translateX(-100%) skewX(-15deg);
      transition: transform 0.4s ease;
    }
    .pe-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(82,214,138,0.4) !important; }
    .pe-btn-primary:hover::after { transform: translateX(120%) skewX(-15deg); }

    .pe-search-box { transition: box-shadow 0.3s ease, transform 0.3s ease; }
    .pe-search-box:focus-within {
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(56,197,245,0.25) !important;
    }
    .pe-tag { transition: background 0.25s, color 0.25s; }

    .blob-1 { animation: blob 8s ease-in-out infinite; }
    .blob-2 { animation: blob 10s 2s ease-in-out infinite reverse; }

    /* Floating dots pattern */
    .dot-grid {
      background-image: radial-gradient(rgba(82,214,138,0.25) 1.5px, transparent 1.5px);
      background-size: 28px 28px;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Animated Counter ─── */
const AnimatedNumber = ({ target, suffix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 50;
        const t = setInterval(() => {
          start = Math.min(start + step, target);
          setVal(Math.round(start));
          if (start >= target) clearInterval(t);
        }, 28);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref} style={{ animation: 'count-up .5s ease both' }}>{val}{suffix}</span>;
};

/* ─── Section fade-in on scroll ─── */
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.12 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
};

/* ═══════════════════════════════════════════════════
   HOMEPAGE COMPONENT
═══════════════════════════════════════════════════ */
const HomePage = ({ setCurrentPage }) => {
  useEffect(() => { injectFonts(); }, []);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [svcRef, svcVisible] = useReveal();
  const [evtRef, evtVisible] = useReveal();

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/events`);
        const data = await res.json();
        if (res.ok && data.events) setEvents(data.events.slice(0, 3));
        else setError('Failed to load events');
      } catch { setError('Error loading events'); }
      finally { setLoading(false); }
    })();
  }, []);

  const services = [
    { icon: '💍', title: 'Wedding Events',   desc: 'Make your special day unforgettable — venue, décor, catering, and every detail crafted with love.', accent: 'var(--g1)' },
    { icon: '🎂', title: 'Birthday Parties',  desc: 'Celebrate every milestone with custom themes, entertainment, and treats that wow guests of all ages.',  accent: 'var(--s1)' },
    { icon: '🏢', title: 'Corporate Events',  desc: 'Conferences, galas, team-building — professionally managed so your brand shines without the stress.',       accent: 'var(--g1)' },
  ];

  const stats = [
    { icon: '🎯', value: 420,  suffix: '+', label: 'Events Delivered' },
    { icon: '⭐', value: 98,   suffix: '%', label: 'Happy Clients' },
    { icon: '🏙️', value: 12,   suffix: '',  label: 'Cities Covered' },
  ];

  // Function to get image URL based on event type
  const getEventImage = (eventType) => {
    const imageMap = {
      'Wedding': '/images/elegant%20wedding.jfif',
      'Birthday': '/images/bd%20party%202.jfif',
      'Anniversary': '/images/elegant%20wedding.jfif',
      'Corporate': '/images/tech-summit.jpg',
      'Other': '/images/garden%20events.jpg'
    };
    return imageMap[eventType] || '/images/garden%20events.jpg';
  };

  /* ── Styles ── */
  const S = {
    page: { width: '100%', fontFamily: "'Outfit', sans-serif", color: 'var(--navy)', overflowX: 'hidden' },

    /* Hero */
    hero: {
      background: 'linear-gradient(145deg, #E6FBF2 0%, #EAF8FF 55%, #F0FBFF 100%)',
      padding: '90px 24px 110px',
      position: 'relative', overflow: 'hidden', minHeight: 660,
    },
    heroBlob1: {
      position: 'absolute', top: '-120px', right: '-80px',
      width: 440, height: 440,
      background: 'radial-gradient(circle, rgba(82,214,138,0.22) 0%, transparent 68%)',
      borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%',
      pointerEvents: 'none',
    },
    heroBlob2: {
      position: 'absolute', bottom: '-140px', left: '-60px',
      width: 360, height: 360,
      background: 'radial-gradient(circle, rgba(56,197,245,0.2) 0%, transparent 68%)',
      borderRadius: '40% 60% 30% 70% / 60% 40% 70% 50%',
      pointerEvents: 'none',
    },
    heroGrid: { maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 },

    pill: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(82,214,138,0.14)', border: '1.5px solid rgba(82,214,138,0.55)', borderRadius: 50, padding: '7px 18px', fontSize: '.82rem', fontWeight: 700, color: '#1E8A50', marginBottom: 20, letterSpacing: '.3px' },

    heroTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem,4vw,3.8rem)', fontWeight: 800, lineHeight: 1.12, color: 'var(--navy)', marginBottom: 20 },
    heroSpan: { background: 'linear-gradient(120deg, #1E8A50, #0E85BF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },

    heroPara: { fontSize: '1.07rem', color: 'rgba(7,30,61,.68)', lineHeight: 1.78, marginBottom: 34, fontWeight: 500, maxWidth: 460 },

    searchBox: { display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 50, padding: '13px 22px', boxShadow: '0 10px 32px rgba(56,197,245,0.14)', maxWidth: 460, border: '1.5px solid rgba(82,214,138,0.3)', gap: 10 },
    searchIcon: { fontSize: '1.15rem', color: 'var(--s1)', flexShrink: 0 },
    searchInput: { border: 'none', outline: 'none', fontSize: '0.97rem', flex: 1, color: 'var(--navy)', fontWeight: 500, background: 'transparent', fontFamily: 'inherit' },

    /* Hero image column */
    heroImgCol: { position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' },

    imgFrame: {
      width: 340, height: 410,
      borderRadius: 28,
      background: 'linear-gradient(145deg, var(--navy) 0%, var(--navy2) 100%)',
      overflow: 'hidden',
      boxShadow: '0 30px 60px rgba(7,30,61,.22)',
      border: '3px solid rgba(82,214,138,0.28)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    },
    imgFrameGlow: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(7,30,61,.55))', zIndex: 1, borderRadius: 28, pointerEvents: 'none' },
    heroImg: { width: '100%', height: '100%', objectFit: 'cover' },

    ratingBadge: {
      position: 'absolute', top: 28, left: -16,
      background: '#fff', borderRadius: 50, padding: '12px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 12px 32px rgba(82,214,138,0.22)',
      border: '2px solid var(--g2)', zIndex: 3,
    },
    ratingIcon: {
      width: 44, height: 44, borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--g1), var(--s1))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.3rem', flexShrink: 0,
    },
    ratingTitle: { fontSize: '1rem', fontWeight: 800, color: 'var(--navy)' },
    ratingSub: { fontSize: '.82rem', color: 'var(--muted)', fontWeight: 500 },

    statsCard: {
      position: 'absolute', bottom: 24, right: -24,
      background: '#fff', borderRadius: 20, padding: '18px 20px',
      boxShadow: '0 14px 40px rgba(56,197,245,0.16)',
      border: '1.5px solid rgba(56,197,245,0.2)', zIndex: 3, minWidth: 190,
    },
    statRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
    statIcon: (c) => ({ width: 44, height: 44, borderRadius: 12, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }),
    statVal: { fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-.5px' },
    statLbl: { fontSize: '.82rem', color: 'var(--muted)', fontWeight: 600 },

    /* Services */
    servicesSection: { padding: '110px 24px', background: 'linear-gradient(180deg,#F2FCF7 0%,#fff 55%)', position: 'relative' },
    servicesInner: { maxWidth: 1200, margin: '0 auto' },
    sectionEyebrow: { textAlign: 'center', fontSize: '.8rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--g1)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 },
    sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,3.2vw,2.9rem)', fontWeight: 800, color: 'var(--navy)', textAlign: 'center', marginBottom: 10 },
    sectionSub: { textAlign: 'center', color: 'var(--muted)', fontSize: '1.02rem', marginBottom: 60, fontWeight: 500 },
    servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28, marginBottom: 48 },
    serviceCard: (accent) => ({
      padding: '40px 30px', borderRadius: 'var(--card-r)',
      background: '#fff',
      border: '1.5px solid rgba(0,0,0,0.06)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
      position: 'relative', overflow: 'hidden', cursor: 'default',
    }),
    svcAccentBar: (accent) => ({ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${accent}, #A2E4FB)` }),
    svcIconWrap: (accent) => ({
      width: 68, height: 68, borderRadius: 18,
      background: `linear-gradient(135deg, ${accent}22, ${accent}44)`,
      border: `1.5px solid ${accent}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '2rem', marginBottom: 22,
      transition: 'transform 0.3s ease',
    }),
    svcTitle: { fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 12 },
    svcDesc: { fontSize: '.96rem', color: 'var(--muted)', lineHeight: 1.75, fontWeight: 500 },

    ctaWrap: { textAlign: 'center' },
    btnPrimary: {
      padding: '15px 44px', fontSize: '1rem', fontWeight: 700,
      background: 'linear-gradient(135deg, var(--g1), var(--s1))',
      color: '#fff', border: 'none', borderRadius: 50, cursor: 'pointer',
      fontFamily: 'inherit', letterSpacing: '.3px',
      boxShadow: '0 8px 24px rgba(82,214,138,0.3)',
    },

    /* Featured / Events */
    featuredSection: {
      padding: '110px 24px',
      background: 'linear-gradient(140deg, var(--navy) 0%, var(--navy2) 60%, #0b2e52 100%)',
      position: 'relative', overflow: 'hidden',
    },
    featBlob1: { position: 'absolute', top: -80, right: -60, width: 380, height: 380, background: 'radial-gradient(circle, rgba(82,214,138,.1) 0%, transparent 65%)', pointerEvents: 'none', borderRadius: '50%' },
    featBlob2: { position: 'absolute', bottom: -60, left: -40, width: 320, height: 320, background: 'radial-gradient(circle, rgba(56,197,245,.1) 0%, transparent 65%)', pointerEvents: 'none', borderRadius: '50%' },
    featInner: { maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 },

    eventsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 },
    eventCard: {
      background: '#fff', borderRadius: 'var(--card-r)', overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,.15)',
    },
    eventImgBox: {
      height: 200,
      background: 'linear-gradient(135deg, #1E8A50 0%, #0E85BF 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    },
    eventImgOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.3))', zIndex: 1 },
    eventImgText: { color: '#fff', fontSize: '2.4rem', zIndex: 2 },
    eventImg: { width: '100%', height: '100%', objectFit: 'cover' },
    eventBody: { padding: '22px 24px 26px' },
    eventTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 10 },
    eventTypePill: { display: 'inline-block', padding: '3px 13px', borderRadius: 50, fontSize: '.76rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--g1), var(--s1))', color: '#fff', marginBottom: 10 },
    eventMeta: { fontSize: '.87rem', color: 'var(--muted)', marginBottom: 10, display: 'flex', gap: 10, flexWrap: 'wrap' },
    eventDesc: { fontSize: '.92rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 },
    eventBudget: { fontWeight: 700, color: 'var(--navy)', fontSize: '.97rem', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 6 },
    btnSecondary: {
      width: '100%', padding: '12px', fontSize: '.93rem', fontWeight: 700,
      background: 'linear-gradient(135deg, var(--g1), var(--s1))',
      color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer',
      fontFamily: 'inherit', letterSpacing: '.2px',
      transition: 'opacity .25s, transform .25s',
    },

    stateBox: { textAlign: 'center', padding: '56px 0', color: 'rgba(255,255,255,.6)', fontSize: '1rem' },

    /* Responsive override injected via media query in useEffect */
  };

  return (
    <div className="pe-page" style={S.page}>

      {/* ══════ HERO ══════ */}
      <section className="pe-hero" style={S.hero}>
        <div className="blob-1" style={S.heroBlob1} />
        <div className="blob-2" style={S.heroBlob2} />
        <div className="dot-grid" style={{ position: 'absolute', inset: 0, opacity: .5, pointerEvents: 'none', zIndex: 0 }} />

        <div style={S.heroGrid}>

          {/* Left — Text */}
          <div className="pe-hero-text">
            <div style={S.pill}>✦ &nbsp;Premium Event Management</div>
            <h1 style={S.heroTitle}>
              Craft <span style={S.heroSpan}>Unforgettable</span><br />
              Moments, Every Time
            </h1>
            <p style={S.heroPara}>
              Polished Events takes your vision and turns it into reality — seamlessly managing weddings,
              birthdays, corporate galas, and more with world-class vendors and meticulous planning.
            </p>

            {/* Search */}
            <div className="pe-search-box" style={S.searchBox}>
              <span style={S.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search events, vendors, services…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={S.searchInput}
              />
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 20, marginTop: 28, flexWrap: 'wrap' }}>
              {['🔒 Secure Booking', '🎯 Verified Vendors', '💬 24/7 Support'].map(t => (
                <span key={t} className="pe-tag" style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--navy)', background: 'rgba(82,214,138,.12)', borderRadius: 50, padding: '5px 14px', border: '1px solid rgba(82,214,138,.3)' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="pe-hero-img" style={S.heroImgCol}>
            {/* Rating badge */}
            <div className="pe-badge-anim" style={S.ratingBadge}>
              <div style={S.ratingIcon}>⭐</div>
              <div>
                <div style={S.ratingTitle}>5.0 Star Rating</div>
                <div style={S.ratingSub}>Based on 420 reviews</div>
              </div>
            </div>

            {/* Main image frame */}
            <div style={S.imgFrame}>
              <div style={S.imgFrameGlow} />
              <img src="/images/hero-professional.jpg" alt="Event Planning" style={S.heroImg}
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
              />
              <div style={{ display:'none', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, color:'rgba(255,255,255,.5)', fontSize:'1rem', fontWeight:600, textAlign:'center', padding:24, height:'100%', width:'100%' }}>
                <span style={{ fontSize:'3.5rem' }}>📸</span>
                <span>Hero Image</span>
              </div>
            </div>

            {/* Stats card */}
            <div className="pe-stats-anim" style={S.statsCard}>
              {[
                { icon: '🎯', v: 420, s: '+', l: 'Events Done',    c: 'linear-gradient(135deg,var(--g1),var(--g2))' },
                { icon: '⭐', v: 98,  s: '%', l: 'Satisfaction',   c: 'linear-gradient(135deg,var(--s1),var(--s2))' },
              ].map((st, i) => (
                <div key={i} style={{ ...S.statRow, marginBottom: i === 0 ? 14 : 0 }}>
                  <div style={S.statIcon(st.c)}>{st.icon}</div>
                  <div>
                    <div style={S.statVal}><AnimatedNumber target={st.v} suffix={st.s} /></div>
                    <div style={S.statLbl}>{st.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ STATS STRIP ══════ */}
      <section style={{ background: 'var(--navy)', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: "'Cormorant Garamond',serif", background: 'linear-gradient(135deg,var(--g1),var(--s1))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                <AnimatedNumber target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '.88rem', color: 'rgba(255,255,255,.6)', fontWeight: 600, marginTop: 4 }}>{s.icon} {s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ SERVICES ══════ */}
      <section
        ref={svcRef}
        style={{ ...S.servicesSection, opacity: svcVisible ? 1 : 0, transform: svcVisible ? 'none' : 'translateY(32px)', transition: 'opacity .7s ease, transform .7s ease' }}
      >
        <div style={S.servicesInner}>
          <div style={S.sectionEyebrow}><span style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,var(--g1))' }} /> WHAT WE DO <span style={{ flex:1, height:1, background:'linear-gradient(90deg,var(--g1),transparent)' }} /></div>
          <h2 style={S.sectionTitle}>Services Tailored for You</h2>
          <p style={S.sectionSub}>From intimate gatherings to grand galas — we handle every detail.</p>

          <div style={S.servicesGrid}>
            {services.map((svc, i) => (
              <div
                key={i}
                className="pe-service-card"
                style={{
                  ...S.serviceCard(svc.accent),
                  animationDelay: `${i * 0.12}s`,
                  opacity: svcVisible ? 1 : 0,
                  transform: svcVisible ? 'none' : 'translateY(24px)',
                  transition: `opacity .6s ${i*0.12}s ease, transform .6s ${i*0.12}s ease, box-shadow .35s ease`,
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 48px ${svc.accent}33`; e.currentTarget.querySelector('.svc-icon').style.transform = 'scale(1.12) rotate(6deg)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)'; e.currentTarget.querySelector('.svc-icon').style.transform = 'none'; }}
              >
                <div style={S.svcAccentBar(svc.accent)} />
                <div className="svc-icon" style={{ ...S.svcIconWrap(svc.accent), transition: 'transform .35s ease' }}>{svc.icon}</div>
                <h3 style={S.svcTitle}>{svc.title}</h3>
                <p style={S.svcDesc}>{svc.desc}</p>
                <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 6, fontSize: '.87rem', fontWeight: 700, color: svc.accent, cursor: 'pointer' }}
                  onClick={() => setCurrentPage('services')}>
                  Learn More <span>→</span>
                </div>
              </div>
            ))}
          </div>

          <div style={S.ctaWrap}>
            <button className="pe-btn-primary" style={S.btnPrimary} onClick={() => setCurrentPage('services')}>
              Explore All Services &nbsp;✦
            </button>
          </div>
        </div>
      </section>

      {/* ══════ EVENTS ══════ */}
      <section ref={evtRef} style={{ ...S.featuredSection, opacity: evtVisible ? 1 : 0, transition: 'opacity .8s ease' }}>
        <div style={S.featBlob1} />
        <div style={S.featBlob2} />
        <div style={S.featInner}>
          <div style={{ ...S.sectionEyebrow, color: 'var(--g2)' }}><span style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,var(--g1))' }} /> UPCOMING <span style={{ flex:1, height:1, background:'linear-gradient(90deg,var(--g1),transparent)' }} /></div>
          <h2 style={{ ...S.sectionTitle, color: '#fff' }}>Featured Events</h2>
          <p style={{ ...S.sectionSub, color: 'rgba(255,255,255,.6)' }}>Browse our curated selection of upcoming events and find inspiration.</p>

          {loading ? (
            <div style={S.stateBox}>
              <div style={{ fontSize:'2rem', marginBottom:12 }}>⏳</div>
              Loading events…
            </div>
          ) : error ? (
            <div style={{ ...S.stateBox, color:'#f87171' }}>
              <div style={{ fontSize:'2rem', marginBottom:12 }}>⚠️</div>
              {error}
            </div>
          ) : events.length === 0 ? (
            <div style={S.stateBox}>
              <div style={{ fontSize:'2rem', marginBottom:12 }}>📭</div>
              No events available yet
            </div>
          ) : (
            <div style={S.eventsGrid}>
              {events.map((ev, i) => (
                <div
                  key={ev.id}
                  className="pe-event-card"
                  style={{
                    ...S.eventCard,
                    opacity: evtVisible ? 1 : 0,
                    transform: evtVisible ? 'none' : 'translateY(32px)',
                    transition: `opacity .65s ${i*0.15}s ease, transform .65s ${i*0.15}s ease, box-shadow .35s ease`,
                  }}
                >
                  {/* Image */}
                  <div style={S.eventImgBox}>
                    <div style={S.eventImgOverlay} />
                    {ev.imageUrl
                      ? <img src={ev.imageUrl} alt={ev.title} style={S.eventImg} />
                      : <img src={getEventImage(ev.eventType)} alt={ev.title} style={S.eventImg} />
                    }
                    {/* Date chip */}
                    <div style={{ position:'absolute', top:14, right:14, background:'rgba(255,255,255,.9)', borderRadius:10, padding:'5px 12px', fontSize:'.78rem', fontWeight:700, color:'var(--navy)', zIndex:2 }}>
                      📅 {new Date(ev.eventDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={S.eventBody}>
                    <span style={S.eventTypePill}>{ev.eventType}</span>
                    <h3 style={S.eventTitle}>{ev.title}</h3>
                    <div style={S.eventMeta}>
                      <span>📍 {ev.location}</span>
                      <span>📅 {new Date(ev.eventDate).toLocaleDateString()}</span>
                    </div>
                    <p style={S.eventDesc}>{ev.description?.substring(0, 72)}…</p>
                    <div style={S.eventBudget}>
                      <span style={{ background:'linear-gradient(135deg,var(--g1),var(--s1))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                        💰 NPR{Number(ev.budget).toLocaleString()}
                      </span>
                      <span style={{ fontSize:'.8rem', color:'var(--muted)', fontWeight:500 }}>budget</span>
                    </div>
                    <button
                      style={S.btnSecondary}
                      onMouseEnter={e => { e.target.style.opacity='.88'; e.target.style.transform='translateY(-2px)'; }}
                      onMouseLeave={e => { e.target.style.opacity='1';    e.target.style.transform='none'; }}
                      onClick={() => setCurrentPage('events')}
                    >
                      View All Events →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════ FOOTER CTA ══════ */}
      <section style={{ background: 'linear-gradient(135deg, var(--g1) 0%, var(--s1) 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.9rem,3vw,2.8rem)', fontWeight:800, color:'var(--navy)', marginBottom:14 }}>
          Ready to Plan Your Perfect Event?
        </h2>
        <p style={{ color:'rgba(7,30,61,.7)', fontSize:'1.05rem', marginBottom:36, fontWeight:500 }}>
          Join hundreds of happy clients who trusted Polished Events to deliver excellence.
        </p>
        <button
          className="pe-btn-primary"
          style={{ ...S.btnPrimary, background:'var(--navy)', boxShadow:'0 10px 32px rgba(7,30,61,.25)', padding:'16px 52px', fontSize:'1.05rem' }}
          onClick={() => setCurrentPage('events')}
        >
          Get Started Today
        </button>
      </section>

    </div>
  );
};

export default HomePage;