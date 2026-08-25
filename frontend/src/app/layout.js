import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'JobFlow AI - End to End AI Job & Recruitment Platform',
  description: 'AI-powered resume parsing, job matching, cover letter tailoring, and mock interview simulator.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{
          background: 'rgba(10, 13, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '14px 28px'
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--gradient-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                color: '#fff',
                fontSize: '1.2rem',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
              }}>
                ⚡
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>
                JobFlow<span style={{ color: 'var(--accent-cyan)' }}>.AI</span>
              </span>
            </Link>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link href="/seeker" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
                💼 Job Seeker Portal
              </Link>
              <Link href="/recruiter" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
                🎯 Recruiter Hub
              </Link>
            </nav>
          </div>
        </header>

        <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
