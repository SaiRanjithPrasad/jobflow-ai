import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'JobFlow AI® — Minimalist AI Recruitment & Career Intelligence',
  description: 'A minimalist, high-end cinematic career platform powered by Next.js, Python AI, and MongoDB Atlas.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '24px 32px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: '24px'
          }}>
            {/* Left Col: Brand Logo in Instrument Serif at 30px */}
            <Link href="/" style={{ textDecoration: 'none', color: '#ffffff' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '30px',
                fontWeight: 400,
                letterSpacing: '-0.5px',
                display: 'inline-flex',
                alignItems: 'baseline'
              }}>
                JobFlow AI<sup style={{ fontSize: '13px', marginLeft: '2px' }}>®</sup>
              </span>
            </Link>

            {/* Center Col: 4 Links (Inter 14px Medium, 40px spacing) */}
            <nav style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px'
            }}>
              <Link href="/seeker" style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                opacity: 0.9,
                transition: 'opacity 0.2s ease'
              }}>
                Job Seeker
              </Link>
              <Link href="/recruiter" style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                opacity: 0.9,
                transition: 'opacity 0.2s ease'
              }}>
                Recruiter Hub
              </Link>
              <Link href="/seeker?tab=resume" style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                opacity: 0.9,
                transition: 'opacity 0.2s ease'
              }}>
                ATS Analyzer
              </Link>
              <Link href="/seeker?tab=interview" style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                opacity: 0.9,
                transition: 'opacity 0.2s ease'
              }}>
                AI Mock Interview
              </Link>
            </nav>

            {/* Right Col: Pill-shaped CTA Button 'Find my dream' */}
            <div>
              <Link href="/seeker" className="btn-pill btn-pill-small">
                Find my dream
              </Link>
            </div>
          </div>
        </header>

        <div style={{ paddingTop: '80px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
