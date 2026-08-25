'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '20px 0' }}>
      {/* Hero Section */}
      <section className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'var(--gradient-glow)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div className="badge badge-cyan" style={{ marginBottom: '16px', fontSize: '0.85rem', padding: '6px 16px' }}>
          ✨ Powered by Next.js, Node.js, Python AI & MongoDB
        </div>

        <h1 style={{ fontSize: '3.2rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.03em' }}>
          Supercharge Your Job Search & Hiring Flow with <span className="gradient-text">JobFlow AI</span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '760px', margin: '0 auto 36px', lineHeight: 1.6 }}>
          Automate your resume ATS scoring, job skill matching, cover letter generation, Kanban application tracking, and AI mock interview preparation in one seamless intelligent system.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/seeker" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '1.05rem' }}>
            🚀 Launch Seeker Portal
          </Link>
          <Link href="/recruiter" className="btn-secondary" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '1.05rem' }}>
            📋 Post Jobs & Rank Applicants
          </Link>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📄</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>AI Resume & ATS Parser</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Python NLP engine extracts skills, computes ATS readiness score, and identifies formatting and keyword improvements.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎯</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>Cosine Job Matcher</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            TF-IDF vector matching measures your skill alignment against job postings, revealing exact skill matches & gaps.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✍️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>1-Click Cover Letters</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Instant AI cover letter synthesis tailored specifically to company values, target role, and candidate highlights.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>Kanban Pipeline</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Track application progression across Saved, Applied, Interviewing, Offer, and Rejected stages with MongoDB state persistence.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎙️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>AI Mock Interviewer</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Interactive AI interview practice with real-time technical evaluation, scoring (1-10), and actionable improvement tips.
          </p>
        </div>
      </section>

      {/* Footer status bar */}
      <footer className="glass-panel" style={{ padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          JobFlow AI © 2026 • Next.js + Node.js (Port 5002) + Python AI (Port 5001) + MongoDB
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className="badge badge-match-high">🟢 Node API Online</span>
          <span className="badge badge-purple">🟣 Python AI Active</span>
        </div>
      </footer>
    </div>
  );
}
