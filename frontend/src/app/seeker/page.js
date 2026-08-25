'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_NODE_API_URL) return process.env.NEXT_PUBLIC_NODE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://jobflow-ai-node.onrender.com';
  }
  return 'http://localhost:5002';
};

function SeekerContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'resume';
  const NODE_API = getApiUrl();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [usage, setUsage] = useState({ searchCount: 0, maxFreeSearches: 2, remaining: 2, isPro: false, allowed: true });
  const [showPaywall, setShowPaywall] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);

  // Resume tab state
  const [resumeText, setResumeText] = useState(
    "Jordan Lee | Senior Full Stack AI Engineer\nEmail: jordan.lee@example.com | Phone: +1-555-0199\n\nSUMMARY:\nResults-driven Full Stack Engineer with 5+ years experience building cloud web applications using React, Next.js, Node.js, Python, MongoDB, and FastAPI.\n\nSKILLS:\nJavaScript, TypeScript, React, Next.js, Node.js, Express, Python, FastAPI, MongoDB, SQL, Docker, Git, REST APIs, System Design."
  );
  const [parsedResume, setParsedResume] = useState(null);
  const [parsingLoading, setParsingLoading] = useState(false);

  // Job match modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobMatches, setJobMatches] = useState({});
  const [matchLoading, setMatchLoading] = useState(false);

  // Cover letter state
  const [selectedJobForLetter, setSelectedJobForLetter] = useState(null);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [letterLoading, setLetterLoading] = useState(false);

  // Mock interview state
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [evalResult, setEvalResult] = useState(null);
  const [interviewLoading, setInterviewLoading] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchResumes();
    fetchUserUsage();

    if (typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search);
      if (query.get('payment') === 'success') {
        handleStripeSuccessUpgrade();
      }
    }
  }, []);

  const fetchUserUsage = async () => {
    try {
      const res = await fetch(`${NODE_API}/api/user/usage`);
      if (res.ok) {
        const data = await res.json();
        if (data) setUsage(data);
      }
    } catch (e) {
      console.error("fetchUserUsage error:", e);
    }
  };

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

  const fetchResumes = async () => {
    try {
      const res = await fetch(`${NODE_API}/api/resumes`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setResumes(data);
          if (data.length > 0 && !parsedResume) {
            setParsedResume({
              extracted_skills: data[0].extractedSkills,
              ats: { ats_score: data[0].atsScore, feedback: data[0].atsFeedback }
            });
          }
        }
      }
    } catch (e) {
      console.error("fetchResumes error:", e);
    }
  };

  const handleParseResume = async () => {
    setParsingLoading(true);
    try {
      const res = await fetch(`${NODE_API}/api/resumes/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: resumeText, filename: 'jordan_lee_resume.pdf' })
      });

      if (res.status === 402) {
        setShowPaywall(true);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        if (data.ai) {
          setParsedResume(data.ai);
          if (data.usage) setUsage(data.usage);
          fetchResumes();
        }
      } else {
        alert("Server response error. Please verify backend connection.");
      }
    } catch (e) {
      alert("Error connecting to API Gateway: " + e.message);
    } finally {
      setParsingLoading(false);
    }
  };

  const handleCheckMatch = async (job) => {
    setSelectedJob(job);
    setMatchLoading(true);
    try {
      const res = await fetch(`${NODE_API}/api/ai/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: job.description
        })
      });

      if (res.status === 402) {
        setShowPaywall(true);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        if (data.usage) setUsage(data.usage);
        setJobMatches(prev => ({ ...prev, [job._id]: data }));
      }
    } catch (e) {
      console.error("Check match error:", e);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch(`${NODE_API}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'seeker_demo_1' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (e) {
      alert("Stripe checkout error");
    } finally {
      setStripeLoading(false);
    }
  };

  const handleStripeSuccessUpgrade = async () => {
    try {
      const res = await fetch(`${NODE_API}/api/stripe/mock-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'seeker_demo_1' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.usage) {
          setUsage(data.usage);
          setShowPaywall(false);
          alert("🎉 Stripe Payment Successful! You now have Unlimited JobFlow AI Pro access.");
        }
      }
    } catch (e) {
      console.error("Stripe upgrade error:", e);
    }
  };

  const handleApplyToJob = async (job) => {
    const match = jobMatches[job._id] || { match_score: 85 };
    try {
      const res = await fetch(`${NODE_API}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job._id,
          jobTitle: job.title,
          company: job.company,
          matchScore: match.match_score || 85,
          matchDetails: match,
          status: 'applied'
        })
      });
      if (res.ok) {
        alert(`Successfully applied to ${job.title} at ${job.company}!`);
        fetchApplications();
        setActiveTab('kanban');
      }
    } catch (e) {
      alert("Error submitting application");
    }
  };

  const handleMoveKanban = async (appId, newStatus) => {
    try {
      const res = await fetch(`${NODE_API}/api/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (e) {
      console.error("Kanban update error:", e);
    }
  };

  const handleGenerateCoverLetter = async (job) => {
    setSelectedJobForLetter(job);
    setLetterLoading(true);
    try {
      const res = await fetch(`${NODE_API}/api/ai/cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_name: "Jordan Lee",
          target_role: job.title,
          company_name: job.company,
          job_description: job.description
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cover_letter) setGeneratedLetter(data.cover_letter);
      }
    } catch (e) {
      console.error("Cover letter error:", e);
    } finally {
      setLetterLoading(false);
    }
  };

  const handleStartInterview = async (job) => {
    setInterviewLoading(true);
    setEvalResult(null);
    setUserAnswer("");
    try {
      const res = await fetch(`${NODE_API}/api/ai/interview-prep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: job.description
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.questions) {
          setInterviewQuestions(data.questions);
          setCurrentQuestionIdx(0);
          setActiveTab('interview');
        }
      }
    } catch (e) {
      console.error("Interview prep error:", e);
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    const currentQ = interviewQuestions[currentQuestionIdx];
    try {
      const res = await fetch(`${NODE_API}/api/ai/eval-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          user_answer: userAnswer,
          target_role: selectedJob?.title || "Software Engineer"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setEvalResult(data);
      }
    } catch (e) {
      console.error("Answer eval error:", e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Job Seeker AI Portal</h1>
            <span className="badge badge-cyan">Candidate: Jordan Lee</span>

            {/* Trial & Stripe Badge */}
            {usage.isPro ? (
              <span className="badge badge-match-high" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                ⭐ PRO UNLIMITED PASS
              </span>
            ) : (
              <span 
                onClick={() => setShowPaywall(true)}
                className={`badge ${usage.remaining > 0 ? 'badge-purple' : 'badge-match-mid'}`} 
                style={{ padding: '6px 14px', fontSize: '0.85rem', cursor: 'pointer' }}>
                💳 Free Trial: {usage.remaining} / {usage.maxFreeSearches} Searches Left
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            2 Free Trial Searches included. Stripe Payment required for unlimited parses & job matches.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(10, 13, 20, 0.6)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <button 
            onClick={() => setActiveTab('resume')} 
            className={activeTab === 'resume' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            📄 Resume AI
          </button>
          <button 
            onClick={() => setActiveTab('jobs')} 
            className={activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            🎯 AI Job Matcher ({jobs.length})
          </button>
          <button 
            onClick={() => setActiveTab('kanban')} 
            className={activeTab === 'kanban' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            📊 Kanban Tracker ({applications.length})
          </button>
          <button 
            onClick={() => setActiveTab('cover')} 
            className={activeTab === 'cover' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            ✍️ Cover Letter
          </button>
          <button 
            onClick={() => setActiveTab('interview')} 
            className={activeTab === 'interview' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            🎙️ AI Interview
          </button>
        </div>
      </div>

      {/* TAB 1: RESUME AI ANALYZER */}
      {activeTab === 'resume' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Input / Paste Your Resume</h2>
              <span className="badge badge-cyan">Trial Uses: {usage.searchCount} / {usage.maxFreeSearches}</span>
            </div>
            <textarea
              className="input-field-editorial"
              rows={14}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your plain text resume here..."
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', marginBottom: '16px' }}
            />
            <button 
              onClick={handleParseResume} 
              disabled={parsingLoading} 
              className="btn-pill btn-pill-hero" 
              style={{ width: '100%', justifyContent: 'center' }}>
              {parsingLoading ? '⚡ Python AI Parsing Resume...' : '🔍 Parse Resume with Python AI'}
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>AI ATS Analysis Results</h2>

            {parsedResume ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: 'conic-gradient(var(--accent-cyan) 0% 92%, rgba(255, 255, 255, 0.1) 92% 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-glow)'
                  }}>
                    <div style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      background: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '1.4rem',
                      color: 'var(--accent-cyan)'
                    }}>
                      {parsedResume.ats?.ats_score || 92}%
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>ATS Readiness Score</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>High pass rate for automated screening</div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>Extracted Skill Tags:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(parsedResume.extracted_skills || []).map((skill, idx) => (
                      <span key={idx} className="badge badge-purple">{skill}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>ATS Feedback & Recommendations:</h4>
                  <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(parsedResume.ats?.feedback || []).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
                Click "Parse Resume" to run Python NLP skill extraction and ATS analysis.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI JOB MATCHING */}
      {activeTab === 'jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {jobs.map((job) => {
              const matchData = jobMatches[job._id];
              return (
                <div key={job._id} className="glass-card-editorial" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{job.title}</h3>
                      {matchData && (
                        <span className={`badge ${matchData.match_score >= 80 ? 'badge-match-high' : 'badge-match-mid'}`}>
                          {matchData.match_score}% AI Match
                        </span>
                      )}
                    </div>
                    <div style={{ color: 'var(--accent-cyan)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '8px' }}>
                      {job.company} • {job.location}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      💰 {job.salaryRange} | ⏳ {job.jobType}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px' }}>
                      {job.description}
                    </p>

                    {matchData && (
                      <div style={{ background: 'rgba(10, 13, 20, 0.5)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#34d399', marginBottom: '4px' }}>
                          ✅ Matched Skills: {matchData.matched_skills?.join(', ') || 'None'}
                        </div>
                        {matchData.missing_skills?.length > 0 && (
                          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#f87171' }}>
                            ⚠️ Missing Keywords: {matchData.missing_skills?.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleCheckMatch(job)} 
                      disabled={matchLoading} 
                      className="btn-secondary" 
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                      🧠 AI Cosine Match
                    </button>
                    <button 
                      onClick={() => handleApplyToJob(job)} 
                      className="btn-pill btn-pill-small" 
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                      🚀 1-Click Apply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: KANBAN APPLICATION TRACKER */}
      {activeTab === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
          {[
            { key: 'saved', title: '📌 Saved', color: 'var(--text-muted)' },
            { key: 'applied', title: '🚀 Applied', color: 'var(--accent-blue)' },
            { key: 'interviewing', title: '💬 Interviewing', color: 'var(--accent-amber)' },
            { key: 'offer', title: '🎉 Offer Received', color: 'var(--accent-emerald)' },
            { key: 'rejected', title: '🛑 Closed', color: 'var(--accent-rose)' }
          ].map(col => {
            const colApps = applications.filter(a => a.status === col.key);
            return (
              <div key={col.key} className="kanban-column">
                <div style={{ fontWeight: '700', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span>{col.title}</span>
                  <span className="badge badge-purple">{colApps.length}</span>
                </div>

                {colApps.map(app => (
                  <div key={app._id} className="glass-card-editorial" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{app.jobTitle}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{app.company}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-match-high">{app.matchScore}% Score</span>
                      <button 
                        onClick={() => handleStartInterview({ title: app.jobTitle, company: app.company, description: app.jobTitle })}
                        className="btn-secondary" 
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                        🎙️ Practice
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                      {['applied', 'interviewing', 'offer'].map(nextSt => (
                        <button 
                          key={nextSt}
                          onClick={() => handleMoveKanban(app._id, nextSt)}
                          style={{
                            background: app.status === nextSt ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '0.7rem',
                            cursor: 'pointer'
                          }}>
                          {nextSt[0].toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: COVER LETTER GENERATOR */}
      {activeTab === 'cover' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '28px' }}>
          <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Select Target Job</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {jobs.map(job => (
                <div 
                  key={job._id} 
                  onClick={() => handleGenerateCoverLetter(job)}
                  className="glass-card-editorial" 
                  style={{
                    padding: '16px',
                    cursor: 'pointer',
                    borderColor: selectedJobForLetter?._id === job._id ? 'var(--accent-cyan)' : 'var(--border-subtle)'
                  }}>
                  <div style={{ fontWeight: '700' }}>{job.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{job.company}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Tailored AI Cover Letter</h2>
              {generatedLetter && (
                <button onClick={() => navigator.clipboard.writeText(generatedLetter)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  📋 Copy to Clipboard
                </button>
              )}
            </div>

            {letterLoading ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                ⚡ Python AI synthesizing tailored cover letter...
              </div>
            ) : (
              <textarea
                className="input-field-editorial"
                rows={16}
                value={generatedLetter}
                onChange={e => setGeneratedLetter(e.target.value)}
                placeholder="Click any job on the left to generate a tailored cover letter..."
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: '1.6' }}
              />
            )}
          </div>
        </div>
      )}

      {/* TAB 5: AI MOCK INTERVIEW */}
      {activeTab === 'interview' && (
        <div className="glass-panel" style={{ padding: '36px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>AI Interactive Mock Interviewer</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Practice answering technical and behavioral questions generated specifically for your target role.
          </p>

          {interviewQuestions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-purple">Question {currentQuestionIdx + 1} of {interviewQuestions.length}</span>
                <span className="badge badge-cyan">{interviewQuestions[currentQuestionIdx].type}</span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '20px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600' }}>
                {interviewQuestions[currentQuestionIdx].question}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>Your Response:</label>
                <textarea
                  className="input-field-editorial"
                  rows={6}
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Type your response using the STAR method..."
                />
              </div>

              <button onClick={handleSubmitAnswer} className="btn-pill btn-pill-hero" style={{ justifyContent: 'center' }}>
                🤖 Evaluate Response with Python AI
              </button>

              {evalResult && (
                <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-active)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>AI Evaluation Score</span>
                    <span className="badge badge-match-high" style={{ fontSize: '1rem', padding: '6px 14px' }}>{evalResult.score} / 10</span>
                  </div>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{evalResult.feedback}</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Select a job from the Matcher or Kanban to initiate your mock interview practice session.</p>
              <button onClick={() => handleStartInterview(jobs[0] || { title: "Full Stack Engineer", description: "React Node Python MongoDB" })} className="btn-pill btn-pill-hero">
                🚀 Start Practice for Senior Full Stack AI Engineer
              </button>
            </div>
          )}
        </div>
      )}

      {/* STRIPE PAYWALL MODAL */}
      {showPaywall && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '36px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ fontSize: '3rem', lineHeight: 1 }}>💳</div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
              Free Trial Limit Reached (2/2)
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
              You've used all <strong>2 free trial AI searches</strong>. Upgrade to <strong>JobFlow AI Pro</strong> to unlock unlimited resume ATS parses, AI job matching, cover letter tailoring, and mock interview coaching!
            </p>

            <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '18px', borderRadius: '14px', border: '1px solid var(--border-active)', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>JobFlow AI Pro Unlimited Pass</span>
                <span className="badge badge-match-high" style={{ fontSize: '1rem' }}>$29 / mo</span>
              </div>
              <ul style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Unlimited AI Resume & ATS Parsing</li>
                <li>Unlimited Cosine Job Match Analysis</li>
                <li>Instant Cover Letter Tailoring</li>
                <li>Interactive AI Mock Interview Evaluation</li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={handleStripeCheckout} 
                disabled={stripeLoading} 
                className="btn-pill btn-pill-hero" 
                style={{ padding: '14px 28px', fontSize: '1.05rem', justifyContent: 'center' }}>
                {stripeLoading ? 'Connecting to Stripe Checkout...' : '💳 Pay $29 with Stripe & Upgrade'}
              </button>

              <button 
                onClick={handleStripeSuccessUpgrade} 
                className="btn-secondary" 
                style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                ⚡ Test Instant Activation (Dev Override)
              </button>

              <button 
                onClick={() => setShowPaywall(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', marginTop: '4px' }}>
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SeekerPortal() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#fff' }}>Loading Seeker Portal...</div>}>
      <SeekerContent />
    </Suspense>
  );
}
