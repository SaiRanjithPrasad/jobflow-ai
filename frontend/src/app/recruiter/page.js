'use client';
import { useState, useEffect } from 'react';

const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_NODE_API_URL) return process.env.NEXT_PUBLIC_NODE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://jobflow-ai-node.onrender.com';
  }
  return 'http://localhost:5002';
};

export default function RecruiterHub() {
  const NODE_API = getApiUrl();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New Job form state
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Remote');
  const [salaryRange, setSalaryRange] = useState('$140,000 - $180,000');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('React, Next.js, Node.js, Python, MongoDB');

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${NODE_API}/api/jobs`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setJobs(data);
      }
    } catch (e) {
      console.error("fetchJobs error:", e);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${NODE_API}/api/applications`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setApplications(data);
      }
    } catch (e) {
      console.error("fetchApplications error:", e);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!title || !company || !description) {
      alert("Please fill in job title, company, and description");
      return;
    }

    const skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch(`${NODE_API}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          company,
          location,
          salaryRange,
          description,
          requiredSkills: skillsArray,
          recruiterName: "Alex Mercer"
        })
      });

      if (res.ok) {
        alert("New Job Posting Created Successfully!");
        setShowCreateModal(false);
        setTitle('');
        setCompany('');
        setDescription('');
        fetchJobs();
      }
    } catch (err) {
      alert("Error posting new job");
    }
  };

  const handleGenerateAIDescription = () => {
    if (!title) {
      alert("Enter a Job Title first (e.g. Senior AI Engineer)");
      return;
    }
    setDescription(
      `We are looking for an exceptional ${title} to join our engineering team. ` +
      `In this role, you will lead end-to-end development of AI-driven web platforms using modern React/Next.js frontends, scalable Node.js microservices, and Python AI backends with MongoDB persistence. ` +
      `Requirements include proven hands-on experience in full-stack architecture, clean code practices, and strong problem-solving skills.`
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '28px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Recruiter Command Hub</h1>
            <span className="badge badge-purple">Recruiter: Alex Mercer</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage active job listings, post new requisitions with AI assistance, and review AI-ranked candidate applications.
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn-pill btn-pill-small" style={{ padding: '12px 24px' }}>
          ➕ Post New AI Job Requisition
        </button>
      </div>

      {/* Main Grid: Job Listings & Candidate Applications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
        {/* Active Job Postings */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Active Job Postings ({jobs.length})</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {jobs.map(job => (
              <div key={job._id} className="glass-card-editorial" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{job.title}</h3>
                  <span className="badge badge-cyan">{job.status}</span>
                </div>
                <div style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', marginBottom: '8px' }}>
                  {job.company} • {job.location}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  💰 {job.salaryRange}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.4' }}>
                  {job.description.slice(0, 140)}...
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Pipeline */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>AI-Ranked Applicants ({applications.length})</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {applications.map(app => (
              <div key={app._id} className="glass-card-editorial" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>{app.seekerName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{app.seekerEmail}</div>
                  </div>
                  <span className="badge badge-match-high" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
                    {app.matchScore}% Match
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                  Role: {app.jobTitle}
                </div>

                <div style={{ background: 'rgba(10, 13, 20, 0.5)', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Status: <strong style={{ color: '#fff', textTransform: 'uppercase' }}>{app.status}</strong> | {app.notes || 'Applied via JobFlow AI'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Post New Job Requisition</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', marginBottom: '6px' }}>Job Title</label>
                <input className="input-field-editorial" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Full Stack AI Engineer" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', marginBottom: '6px' }}>Company</label>
                  <input className="input-field-editorial" value={company} onChange={e => setCompany(e.target.value)} placeholder="ApexAI Labs" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', marginBottom: '6px' }}>Location</label>
                  <input className="input-field-editorial" value={location} onChange={e => setLocation(e.target.value)} placeholder="Remote / New York" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', marginBottom: '6px' }}>Salary Range</label>
                  <input className="input-field-editorial" value={salaryRange} onChange={e => setSalaryRange(e.target.value)} placeholder="$150,000 - $190,000" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', marginBottom: '6px' }}>Required Skills (comma separated)</label>
                  <input className="input-field-editorial" value={requiredSkills} onChange={e => setRequiredSkills(e.target.value)} placeholder="React, Next.js, Node.js, Python, MongoDB" />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: '600' }}>Job Description</label>
                  <button type="button" onClick={handleGenerateAIDescription} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                    ✨ Auto-Generate with AI
                  </button>
                </div>
                <textarea className="input-field-editorial" rows={5} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the responsibilities and technical qualifications..." required />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-pill btn-pill-small">🚀 Publish Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
