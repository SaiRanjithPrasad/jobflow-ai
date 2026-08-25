import os
import re
import math
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2
import io

app = FastAPI(
    title="JobFlow AI - Python AI Engine",
    description="Resume parsing, ATS scoring, Job Matching, Cover Letter Generator & AI Interviewer",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Common Skills Taxonomy for Extraction
KNOWN_SKILLS = [
    "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular", "Node.js", "Express",
    "Python", "FastAPI", "Flask", "Django", "Java", "C++", "Go", "Rust", "SQL", "MongoDB",
    "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Git",
    "GraphQL", "REST API", "Tailwind CSS", "HTML5", "CSS3", "Machine Learning", "NLP",
    "PyTorch", "TensorFlow", "Scikit-Learn", "OpenAI", "Pandas", "System Design", "Microservices"
]

class ResumeParseRequest(BaseModel):
    text: str

class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str

class CoverLetterRequest(BaseModel):
    candidate_name: str
    target_role: str
    company_name: str
    resume_summary: str
    job_description: str

class InterviewEvalRequest(BaseModel):
    question: str
    user_answer: str
    target_role: str

def extract_skills_from_text(text: str) -> List[str]:
    text_lower = text.lower()
    found = []
    for skill in KNOWN_SKILLS:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found.append(skill)
    return list(set(found))

def calculate_ats_score(text: str, skills: List[str]) -> dict:
    word_count = len(text.split())
    has_contact = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text) or re.search(r'\+?\d[\d -]{8,}\d', text))
    has_experience = bool(re.search(r'experience|work history|employment', text, re.IGNORECASE))
    has_education = bool(re.search(r'education|university|bachelor|master|degree|bs|ms', text, re.IGNORECASE))
    has_projects = bool(re.search(r'projects|key accomplishments', text, re.IGNORECASE))
    
    score = 40
    feedback = []

    if word_count > 150:
        score += 15
    else:
        feedback.append("Resume is too short. Aim for at least 300-500 words for proper ATS parsing.")

    if len(skills) >= 5:
        score += 20
    else:
        feedback.append("Found few technical skills. Highlight more industry keywords.")

    if has_contact:
        score += 10
    else:
        feedback.append("Missing or unparseable email/phone contact information.")

    if has_experience:
        score += 10
    else:
        feedback.append("Add a clear 'Work Experience' heading.")

    if has_education:
        score += 5
    if has_projects:
        score += 5

    score = min(98, max(35, score))

    return {
        "ats_score": score,
        "word_count": word_count,
        "has_contact": has_contact,
        "has_experience": has_experience,
        "has_education": has_education,
        "feedback": feedback if feedback else ["Resume meets high ATS formatting standards!"]
    }

@app.get("/")
def health_check():
    return {"status": "ok", "service": "JobFlow AI Python Engine", "version": "1.0.0"}

@app.post("/api/ai/parse-resume")
def parse_resume(payload: ResumeParseRequest):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Resume text is empty")
    
    skills = extract_skills_from_text(text)
    ats = calculate_ats_score(text, skills)
    
    # Estimate years experience
    exp_matches = re.findall(r'(\d+)\+?\s*years?', text, re.IGNORECASE)
    exp_years = max([int(x) for x in exp_matches]) if exp_matches else 3
    
    return {
        "raw_text": text[:1000] + ("..." if len(text) > 1000 else ""),
        "extracted_skills": skills,
        "estimated_experience_years": exp_years,
        "ats": ats
    }

@app.post("/api/ai/parse-file")
async def parse_resume_file(file: UploadFile = File(...)):
    contents = await file.read()
    text = ""
    if file.filename.endswith(".pdf"):
        try:
            reader = PyPDF2.PdfReader(io.BytesIO(contents))
            for page in reader.pages:
                text += page.extract_text() or ""
        except Exception as e:
            text = contents.decode("utf-8", errors="ignore")
    else:
        text = contents.decode("utf-8", errors="ignore")
    
    skills = extract_skills_from_text(text)
    ats = calculate_ats_score(text, skills)
    exp_matches = re.findall(r'(\d+)\+?\s*years?', text, re.IGNORECASE)
    exp_years = max([int(x) for x in exp_matches]) if exp_matches else 3

    return {
        "filename": file.filename,
        "text": text,
        "extracted_skills": skills,
        "estimated_experience_years": exp_years,
        "ats": ats
    }

@app.post("/api/ai/match-job")
def match_job(payload: JobMatchRequest):
    r_text = payload.resume_text.strip()
    j_text = payload.job_description.strip()

    if not r_text or not j_text:
        raise HTTPException(status_code=400, detail="Both resume_text and job_description required")

    # Scikit-learn Cosine Similarity
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([r_text, j_text])
    cos_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

    resume_skills = extract_skills_from_text(r_text)
    job_skills = extract_skills_from_text(j_text)

    # Skill match breakdown
    matched_skills = [s for s in job_skills if s.lower() in [rs.lower() for rs in resume_skills]]
    missing_skills = [s for s in job_skills if s not in matched_skills]

    # Calculate final match score normalized (50% vector similarity + 50% skill match ratio)
    skill_match_ratio = (len(matched_skills) / len(job_skills)) if job_skills else cos_sim
    final_score = int(round((cos_sim * 0.45 + skill_match_ratio * 0.55) * 100))
    final_score = min(98, max(25, final_score))

    match_level = "Excellent" if final_score >= 85 else ("Good" if final_score >= 70 else "Moderate")

    return {
        "match_score": final_score,
        "match_level": match_level,
        "similarity_vector": float(round(cos_sim, 4)),
        "candidate_skills": resume_skills,
        "job_required_skills": job_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendation": f"Add missing keywords ({', '.join(missing_skills[:3]) if missing_skills else 'All core skills matched'}) to boost your ATS pass rate!"
    }

@app.post("/api/ai/generate-cover-letter")
def generate_cover_letter(payload: CoverLetterRequest):
    c_name = payload.candidate_name or "Applicant"
    role = payload.target_role or "Full Stack AI Engineer"
    company = payload.company_name or "Innovate Tech"

    letter = f"""Dear Hiring Team at {company},

I am writing to express my enthusiastic interest in the {role} position. With my background in building high-performance scalable web applications, AI integration, and modern cloud systems, I am confident in my ability to deliver immediate value to your engineering team.

In reviewing the requirements for the {role} position at {company}, I noted your focus on scalable architecture, user-focused design, and cutting-edge feature delivery. Throughout my career, I have consistently turned complex technical requirements into intuitive, reliable products.

Key highlights of my qualifications include:
• Expertise in modern web stacks (React, Next.js, Node.js, Python, MongoDB) and AI workflow optimization.
• Proven track record of end-to-end product delivery, reducing latency and raising user engagement.
• Strong collaborative mindset, working closely with cross-functional teams to solve critical challenges.

I am eager to bring my skills, passion for innovation, and dedication to excellence to {company}. Thank you for your time and consideration. I welcome the opportunity to discuss how my experience aligns with your team's goals.

Sincerely,
{c_name}
"""
    return {
        "candidate_name": c_name,
        "company": company,
        "target_role": role,
        "cover_letter": letter
    }

@app.post("/api/ai/interview-prep")
def interview_prep(payload: JobMatchRequest):
    j_text = payload.job_description or "Software Engineer"
    skills = extract_skills_from_text(j_text)
    primary_skill = skills[0] if skills else "Full Stack Development"

    questions = [
        {
            "id": 1,
            "type": "Technical Architecture",
            "question": f"How would you design a high-throughput microservice using {primary_skill} to handle thousands of concurrent requests while maintaining data consistency?",
            "ideal_topics": ["Load balancing", "Caching strategies", "Database indexing", "Asynchronous processing"]
        },
        {
            "id": 2,
            "type": "System Performance",
            "question": "Describe a scenario where you diagnosed and resolved a memory leak or database performance bottleneck in production.",
            "ideal_topics": ["Profiling tools", "Query optimization", "Garbage collection", "Metrics monitoring"]
        },
        {
            "id": 3,
            "type": "Behavioral & Delivery",
            "question": "Tell me about a time you had to pivot engineering priorities rapidly under a tight deadline. How did you maintain code quality?",
            "ideal_topics": ["Pragmatic trade-offs", "Unit testing", "Stakeholder communication", "Modular design"]
        },
        {
            "id": 4,
            "type": "AI & Innovation",
            "question": "How do you evaluate and integrate new AI/LLM models or automated flows into an existing production stack safely?",
            "ideal_topics": ["Prompt evaluation", "Fallback handling", "Security & data privacy", "API latency budgeting"]
        }
    ]

    return {
        "target_role_skills": skills,
        "questions": questions
    }

@app.post("/api/ai/eval-answer")
def eval_answer(payload: InterviewEvalRequest):
    ans = payload.user_answer.strip()
    word_cnt = len(ans.split())

    if word_cnt < 10:
        score = 4
        feedback = "Answer is too brief. Elaborate with specific technical details using the STAR method (Situation, Task, Action, Result)."
    elif word_cnt < 40:
        score = 7
        feedback = "Good foundation. Try adding concrete metrics or tools you used in your experience."
    else:
        score = 9
        feedback = "Comprehensive and structured response! Excellent detail on technical trade-offs and implementation steps."

    return {
        "score": score,
        "feedback": feedback,
        "strengths": ["Clear structure", "Directly addresses core prompt"] if score >= 7 else ["Initial concept stated"],
        "improvement_tips": ["Mention specific monitoring metrics or automated test coverage."]
    }
