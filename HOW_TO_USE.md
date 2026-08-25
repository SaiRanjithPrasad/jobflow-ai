# HOW TO USE JOBFLOW AI®
> **End-to-End AI Job Application & Recruitment Intelligence Platform**  
> *Version: v1.2.0*

---

## 1. Platform Overview & Value Proposition

**JobFlow AI®** is a full-stack, AI-powered recruitment platform designed to streamline both sides of the hiring equation: career management for job seekers and candidate sourcing for recruiters.

### Tech Stack
- **Frontend**: Next.js 14 (React) Minimalist Editorial UI
- **Node Gateway**: Express API Gateway + MongoDB Atlas Cloud Persistence
- **Python AI Engine**: FastAPI microservice for scikit-learn TF-IDF Cosine Match Vectors & NLP Parsing
- **Monetization**: Stripe Payment Gateway with 2 Free Trial Searches & $29/mo Pro Pass

---

## 2. Who is JobFlow AI Helpful For?

### 💼 [A] Job Seekers & Software Engineers
* **The Problem**:
  - Resumes get silently rejected by automated Applicant Tracking Systems (ATS).
  - Writing customized cover letters for dozens of applications is time-consuming.
  - Uncertainty about which skills match a job posting vs. what keywords are missing.
  - Nervousness during technical and behavioral interviews.

* **How JobFlow AI Helps**:
  1. **AI Resume Parser & ATS Score Gauge**: Analyzes resumes, computes a 0-100 ATS pass readiness score, extracts skills, and provides formatting recommendations.
  2. **Cosine Vector Job Matcher**: Uses scikit-learn TF-IDF vector math to calculate semantic fit percentage and list missing keywords.
  3. **1-Click Tailored Cover Letters**: Synthesizes high-converting cover letters customized for target role responsibilities.
  4. **Kanban Application Tracker**: Organizes applications across 5 stages (`Saved`, `Applied`, `Interviewing`, `Offer Received`, `Closed`) backed by MongoDB state.
  5. **Interactive AI Mock Interviewer**: Generates targeted technical/behavioral questions and evaluates typed answers (score 1-10 plus feedback).

---

### 🎯 [B] Recruiters, HR Managers & Hiring Teams
* **The Problem**:
  - Spending hours manually reviewing hundreds of unranked candidate resumes.
  - Difficulty drafting detailed technical job descriptions quickly.
  - Fragmented candidate tracking across spreadsheets.

* **How JobFlow AI Helps**:
  1. **AI Job Requisition Generator**: Auto-generates technical job descriptions with required skill tags in 1 click.
  2. **Automated Candidate Ranking**: Automatically ranks applicants by AI Match Score percentage, highlighting top-tier candidates immediately.
  3. **Centralized Candidate Pipeline**: Track applicant progression from initial screening to final offer.

---

### 🛠️ [C] Freelancers & Contract Consultants
* **How JobFlow AI Helps**:
  - Quickly tailor proposals and resumes for multiple client requisitions to maximize acceptance rates.

---

## 3. Step-by-Step User Guide

### 💼 For Job Seekers
1. Open the **Job Seeker Portal** at `http://localhost:3000/seeker`
2. Go to **"Resume AI"** -> Paste your resume text -> Click **"Parse Resume with Python AI"**.
   - Review your ATS score, extracted skill tags, and formatting feedback.
3. Go to **"AI Job Matcher"** -> Browse active job postings.
   - Click **"AI Cosine Match"** to view your match percentage and missing keywords.
4. Click **"1-Click Apply"** to save the job into your Kanban tracker.
5. Go to **"Cover Letter"** -> Select your target job -> Click **"Generate Cover Letter"**.
6. Go to **"AI Interview"** -> Select your target job -> Click **"Start Practice"**.
   - Type your response using the STAR method and click **"Evaluate Response"** for AI scoring (1-10).

---

### 🎯 For Recruiters
1. Open the **Recruiter Hub** at `http://localhost:3000/recruiter`
2. Click **"Post New AI Job Requisition"**.
3. Enter Job Title -> Click **"Auto-Generate with AI"** to generate the description.
4. Click **"Publish Requisition"** to make it live for candidates.
5. View the **"AI-Ranked Applicants"** column to review top-matching candidates.

---

## 4. Stripe & Free Trial Pricing Model
- **2 Free Trial Searches**: Included out of the box per user.
- **Stripe Paywall**: On the 3rd search attempt, an interactive Stripe Checkout paywall modal is triggered for the **$29/month JobFlow AI Pro Unlimited Pass**.

---

## 5. Deployment Quick Reference
- **Frontend**: [Vercel](https://vercel.com) (Next.js 14)
- **Node Gateway**: [Render](https://render.com) (Express + Mongoose)
- **Python AI Engine**: [Render](https://render.com) (FastAPI)
- **Database**: [MongoDB Atlas Cloud](https://www.mongodb.com/cloud/atlas) (`mongodb+srv://...`)
