// In-memory Mongo-compatible Data Store fallback with seed data and Stripe Trial state
const initialJobs = [
  {
    _id: "job_101",
    title: "Senior Full Stack AI Engineer",
    company: "ApexAI Labs",
    location: "Remote / San Francisco",
    salaryRange: "$150,000 - $190,000",
    jobType: "Full-time",
    experienceLevel: "Senior Level (4+ yrs)",
    description: "We are seeking a Senior Full Stack AI Engineer to build next-generation agentic workflows. You will design web interfaces with Next.js/React, engineer backend APIs with Node.js/Python, and integrate LLM models with MongoDB.",
    requiredSkills: ["React", "Next.js", "Node.js", "Python", "MongoDB", "FastAPI", "TypeScript"],
    status: "active",
    recruiterName: "Elena Rostova",
    createdAt: new Date()
  },
  {
    _id: "job_102",
    title: "AI Solutions Architect",
    company: "NeuralFlow Cloud",
    location: "New York / Hybrid",
    salaryRange: "$165,000 - $210,000",
    jobType: "Full-time",
    experienceLevel: "Lead / Architect",
    description: "Lead architectural decisions for enterprise AI agents. Experience in cloud deployment, vector embeddings, Python, Microservices, and REST API optimization.",
    requiredSkills: ["Python", "FastAPI", "Docker", "AWS", "System Design", "MongoDB", "Kubernetes"],
    status: "active",
    recruiterName: "Marcus Vance",
    createdAt: new Date()
  },
  {
    _id: "job_103",
    title: "Frontend UI/UX Systems Lead",
    company: "Vortex Interactive",
    location: "Remote",
    salaryRange: "$135,000 - $170,000",
    jobType: "Full-time",
    experienceLevel: "Mid-Senior",
    description: "Craft stunning high-performance user interfaces with React, Next.js 14, modern CSS animation systems, and responsive design components.",
    requiredSkills: ["React", "Next.js", "Tailwind CSS", "JavaScript", "HTML5", "CSS3", "Git"],
    status: "active",
    recruiterName: "Sarah Chen",
    createdAt: new Date()
  }
];

const initialApplications = [
  {
    _id: "app_201",
    jobId: "job_101",
    jobTitle: "Senior Full Stack AI Engineer",
    company: "ApexAI Labs",
    seekerId: "seeker_demo_1",
    seekerName: "Jordan Lee",
    seekerEmail: "jordan.lee@example.com",
    matchScore: 94,
    matchDetails: {
      matched_skills: ["React", "Next.js", "Node.js", "Python", "MongoDB"],
      missing_skills: ["TypeScript"]
    },
    coverLetter: "Dear Hiring Team at ApexAI Labs, I am excited to submit my application...",
    status: "interviewing",
    notes: "Technical phone screen scheduled for Friday 2 PM PST",
    updatedAt: new Date(),
    createdAt: new Date()
  },
  {
    _id: "app_202",
    jobId: "job_103",
    jobTitle: "Frontend UI/UX Systems Lead",
    company: "Vortex Interactive",
    seekerId: "seeker_demo_1",
    seekerName: "Jordan Lee",
    seekerEmail: "jordan.lee@example.com",
    matchScore: 88,
    matchDetails: {
      matched_skills: ["React", "Next.js", "JavaScript"],
      missing_skills: ["Tailwind CSS"]
    },
    coverLetter: "",
    status: "applied",
    notes: "Applied via JobFlow AI One-Click",
    updatedAt: new Date(),
    createdAt: new Date()
  }
];

const initialResumes = [
  {
    _id: "res_301",
    userId: "seeker_demo_1",
    filename: "jordan_lee_resume.pdf",
    rawText: "Jordan Lee | Senior Full Stack AI Engineer\nEmail: jordan.lee@example.com | Phone: +1-555-0199\n\nSUMMARY:\nResults-driven Full Stack Engineer with 5+ years experience building cloud-native web applications and AI microservices using React, Next.js, Node.js, Python, MongoDB, and FastAPI.\n\nSKILLS:\nJavaScript, TypeScript, React, Next.js, Node.js, Express, Python, FastAPI, MongoDB, SQL, Docker, Git, REST APIs, GraphQL, System Design.\n\nEXPERIENCE:\nFull Stack AI Engineer at CloudScale Tech (2022 - Present)\n- Architected high-performance web dashboard using Next.js and Tailwind CSS.\n- Built Python AI microservice processing 50k+ daily document parses with PyPDF2 and scikit-learn.\n- Designed MongoDB schema optimizing query response latency by 45%.",
    extractedSkills: ["React", "Next.js", "Node.js", "Express", "Python", "FastAPI", "MongoDB", "SQL", "Docker", "Git", "REST API", "GraphQL", "System Design"],
    atsScore: 92,
    atsFeedback: ["Excellent skill formatting and keyword density!", "Strong action verbs throughout work experience."],
    experienceYears: 5,
    createdAt: new Date()
  }
];

class DataStore {
  constructor() {
    this.jobs = [...initialJobs];
    this.applications = [...initialApplications];
    this.resumes = [...initialResumes];
    this.stats = {
      totalOutputs: 14280,
      totalVisitors: 28450,
      baseOnline: 148
    };
    this.userUsage = {
      seeker_demo_1: {
        searchCount: 0,
        maxFreeSearches: 2,
        isPro: false
      }
    };
  }

  getLiveStats() {
    // Dynamic fluctuation for realistic online user count
    const randomVariation = Math.floor(Math.sin(Date.now() / 3000) * 12);
    const onlineUsers = Math.max(85, this.stats.baseOnline + randomVariation);
    
    return {
      totalOutputs: this.stats.totalOutputs,
      totalVisitors: this.stats.totalVisitors,
      onlineUsers: onlineUsers
    };
  }

  recordVisit() {
    this.stats.totalVisitors += 1;
    return this.getLiveStats();
  }

  recordOutput() {
    this.stats.totalOutputs += 1;
    return this.getLiveStats();
  }

  getUserUsage(userId = 'seeker_demo_1') {
    if (!this.userUsage[userId]) {
      this.userUsage[userId] = {
        searchCount: 0,
        maxFreeSearches: 2,
        isPro: false
      };
    }
    const usage = this.userUsage[userId];
    const remaining = Math.max(0, usage.maxFreeSearches - usage.searchCount);
    const allowed = usage.isPro || remaining > 0;
    return {
      searchCount: usage.searchCount,
      maxFreeSearches: usage.maxFreeSearches,
      remaining: usage.isPro ? 999 : remaining,
      isPro: usage.isPro,
      allowed
    };
  }

  incrementSearchCount(userId = 'seeker_demo_1') {
    const current = this.getUserUsage(userId);
    if (!current.isPro) {
      this.userUsage[userId].searchCount += 1;
    }
    return this.getUserUsage(userId);
  }

  upgradeUserToPro(userId = 'seeker_demo_1') {
    if (!this.userUsage[userId]) {
      this.getUserUsage(userId);
    }
    this.userUsage[userId].isPro = true;
    return this.getUserUsage(userId);
  }

  getJobs() { return this.jobs; }
  getJobById(id) { return this.jobs.find(j => j._id === id); }
  createJob(jobData) {
    const newJob = {
      _id: `job_${Date.now()}`,
      ...jobData,
      status: jobData.status || 'active',
      createdAt: new Date()
    };
    this.jobs.unshift(newJob);
    return newJob;
  }

  getApplications(seekerId) {
    return seekerId ? this.applications.filter(a => a.seekerId === seekerId) : this.applications;
  }

  createApplication(appData) {
    const newApp = {
      _id: `app_${Date.now()}`,
      ...appData,
      status: appData.status || 'applied',
      updatedAt: new Date(),
      createdAt: new Date()
    };
    this.applications.unshift(newApp);
    return newApp;
  }

  updateApplicationStatus(id, status, notes) {
    const app = this.applications.find(a => a._id === id);
    if (app) {
      app.status = status;
      if (notes !== undefined) app.notes = notes;
      app.updatedAt = new Date();
    }
    return app;
  }

  getResumes(userId) {
    return this.resumes.filter(r => r.userId === userId);
  }

  createResume(resumeData) {
    const newRes = {
      _id: `res_${Date.now()}`,
      ...resumeData,
      createdAt: new Date()
    };
    this.resumes.unshift(newRes);
    return newRes;
  }
}

module.exports = new DataStore();
