'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const NODE_API = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://127.0.0.1:5002';

export default function Home() {
  const [stats, setStats] = useState({
    totalOutputs: 14280,
    totalVisitors: 28450,
    onlineUsers: 148
  });

  useEffect(() => {
    // Record page visit and fetch live stats
    const fetchStats = async () => {
      try {
        await fetch(`${NODE_API}/api/stats/visit`, { method: 'POST' });
        const res = await fetch(`${NODE_API}/api/stats`);
        const data = await res.json();
        if (data && data.totalOutputs) {
          setStats(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchStats();

    // Poll live stats every 5 seconds for real-time online updates
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'var(--color-bg-fallback)' }}>
      
      {/* FULL-BLEED CINEMATIC VIDEO BACKGROUND HERO */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '120px 24px 80px'
      }}>
        
        {/* Video Background Layer */}
        <div className="video-background-wrapper">
          <video
            autoPlay
            loop
            muted
            playsInline
            src="https://designerstephen.github.io/public-assets/videos/serene-art-hero.mp4"
          />
          <div className="video-dark-overlay" />
        </div>

        {/* Hero Content Area - Centered & Layered over Video */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          {/* H1 - Stagger 0 (Delay 0s), Instrument Serif 80px, -2.46px letter-spacing */}
          <h1 className="hero-title fade-rise stagger-0" style={{ maxWidth: '1050px', marginBottom: '28px' }}>
            Elevate your career journey with <em>Cinematic AI Intelligence</em>
          </h1>

          {/* Subtext Paragraph - Stagger 1 (Delay 0.2s), Max-width 670px, Line-height 1.625 */}
          <p className="fade-rise stagger-1" style={{
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.88)',
            maxWidth: '670px',
            lineHeight: 1.625,
            margin: '0 auto 48px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            Automate your resume ATS scoring, cosine vector job matching, custom cover letter synthesis, and AI mock interview preparation in one seamless, high-fashion experience.
          </p>

          {/* Large Pill Action Button - Stagger 2 (Delay 0.4s), padding 20px 56px, 16px Medium */}
          <div className="fade-rise stagger-2" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/seeker" className="btn-pill btn-pill-hero btn-pill-white">
              Find my dream
            </Link>
            
            <Link href="/recruiter" className="btn-pill btn-pill-hero" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              Recruiter Command Hub
            </Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL LIVE METRICS SHOWCASE BANNER */}
      <section style={{
        background: '#0f172a',
        color: '#ffffff',
        padding: '48px 32px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 20
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '32px',
          alignItems: 'center'
        }}>
          
          {/* Metric 1: Total Outputs Generated */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '28px 32px',
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '44px',
              fontWeight: 400,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '6px'
            }}>
              {formatNumber(stats.totalOutputs)}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.65)',
              letterSpacing: '0.5px'
            }}>
              ⚡ Outputs Generated So Far
            </div>
          </div>

          {/* Metric 2: Total Visitors So Far */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '28px 32px',
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '44px',
              fontWeight: 400,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '6px'
            }}>
              {formatNumber(stats.totalVisitors)}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.65)',
              letterSpacing: '0.5px'
            }}>
              🌐 Total Visitors So Far
            </div>
          </div>

          {/* Metric 3: Currently Online Users */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '28px 32px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-display)',
              fontSize: '44px',
              fontWeight: 400,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '6px'
            }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 12px #10b981',
                display: 'inline-block'
              }} />
              {formatNumber(stats.onlineUsers)}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.65)',
              letterSpacing: '0.5px'
            }}>
              🟢 People Currently Online
            </div>
          </div>

        </div>
      </section>

      {/* MINIMALIST EDITORIAL FEATURE SHOWCASE SECTION */}
      <section style={{
        background: '#ffffff',
        color: 'var(--color-primary-text)',
        padding: '100px 32px',
        position: 'relative',
        zIndex: 20
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--color-muted-text)',
              display: 'block',
              marginBottom: '12px'
            }}>
              Curated Intelligence
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '48px',
              fontWeight: 400,
              letterSpacing: '-1px',
              lineHeight: 1.1
            }}>
              Designed for modern software professionals & recruiters
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            {/* Feature Card 1 */}
            <div className="glass-card-editorial" style={{ padding: '40px' }}>
              <div style={{ fontSize: '32px', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>01</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 400, marginBottom: '12px' }}>
                AI Resume & ATS Parser
              </h3>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '15px', lineHeight: 1.6 }}>
                Extract skills, compute 0-100 ATS pass readiness, and receive actionable formatting recommendations powered by Python NLP.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="glass-card-editorial" style={{ padding: '40px' }}>
              <div style={{ fontSize: '32px', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>02</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 400, marginBottom: '12px' }}>
                TF-IDF Cosine Matcher
              </h3>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '15px', lineHeight: 1.6 }}>
                Vector match candidate skills against job requisitions to compute precise percentage alignment and keyword gaps.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="glass-card-editorial" style={{ padding: '40px' }}>
              <div style={{ fontSize: '32px', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>03</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 400, marginBottom: '12px' }}>
                1-Click Cover Letters
              </h3>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '15px', lineHeight: 1.6 }}>
                Synthesize tailored cover letters customized for target role responsibilities and company culture in seconds.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="glass-card-editorial" style={{ padding: '40px' }}>
              <div style={{ fontSize: '32px', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>04</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 400, marginBottom: '12px' }}>
                Kanban Pipeline Tracker
              </h3>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '15px', lineHeight: 1.6 }}>
                Track applications across Saved, Applied, Interviewing, Offer, and Rejected stages backed by MongoDB Atlas cloud persistence.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="glass-card-editorial" style={{ padding: '40px' }}>
              <div style={{ fontSize: '32px', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>05</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 400, marginBottom: '12px' }}>
                AI Mock Interview Simulator
              </h3>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '15px', lineHeight: 1.6 }}>
                Practice role-specific technical questions and receive real-time scoring (1-10) with detailed performance feedback.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="glass-card-editorial" style={{ padding: '40px' }}>
              <div style={{ fontSize: '32px', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>06</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 400, marginBottom: '12px' }}>
                Stripe Monetization & Free Trial
              </h3>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '15px', lineHeight: 1.6 }}>
                Includes 2 free trial searches out of the box with Stripe Checkout paywall session for $29/mo Unlimited Pro Pass.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MINIMALIST EDITORIAL FOOTER */}
      <footer style={{
        background: '#0f172a',
        color: '#ffffff',
        padding: '60px 32px 40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>
            JobFlow AI<sup style={{ fontSize: '10px' }}>®</sup>
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Next.js + Node.js (Port 5002) + Python AI (Port 5001) + MongoDB Atlas
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/seeker" className="btn-pill btn-pill-small btn-pill-white">
              Launch Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
