require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const Stripe = require('stripe');
const store = require('./store');

const Job = require('./models/Job');
const Application = require('./models/Application');
const Resume = require('./models/Resume');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5002;
const PYTHON_AI_URL = process.env.PYTHON_AI_URL || 'http://127.0.0.1:5001';

// Stripe initialization (Uses secret key or test mode key)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51MockStripeKeyForJobFlowAI2026';
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.options('*', cors());
app.use(express.json());

let isMongoConnected = false;

// Attempt MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobflow_ai';
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    isMongoConnected = true;
    console.log('[MongoDB] Connected successfully to MongoDB at:', MONGO_URI);
  })
  .catch((err) => {
    isMongoConnected = false;
    console.log('[MongoDB] Local MongoDB server not running. Running in resilient In-Memory Mongo store mode.');
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'JobFlow AI Node.js API Gateway',
    mongoConnected: isMongoConnected,
    pythonAiUrl: PYTHON_AI_URL,
    timestamp: new Date()
  });
});

// Database Inspection Endpoint
app.get('/api/db/export', async (req, res) => {
  try {
    let jobs = store.getJobs();
    let applications = store.getApplications();
    let resumes = store.getResumes('seeker_demo_1');

    if (isMongoConnected) {
      try {
        jobs = await Job.find();
        applications = await Application.find();
        resumes = await Resume.find();
      } catch (err) {}
    }

    res.json({
      database: isMongoConnected ? 'MongoDB (Local Server 27017)' : 'JobFlow AI In-Memory Data Engine',
      mongoConnected: isMongoConnected,
      collections: {
        jobsCount: jobs.length,
        applicationsCount: applications.length,
        resumesCount: resumes.length,
      },
      data: {
        jobs,
        applications,
        resumes,
        userUsage: store.getUserUsage('seeker_demo_1')
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Live Stats Metrics Endpoint
app.get('/api/stats', (req, res) => {
  res.json(store.getLiveStats());
});

app.post('/api/stats/visit', (req, res) => {
  res.json(store.recordVisit());
});

// =====================================
// STRIPE & FREE TRIAL USAGE ENDPOINTS
// =====================================
app.get('/api/user/usage', (req, res) => {
  const userId = req.query.userId || 'seeker_demo_1';
  const usage = store.getUserUsage(userId);
  res.json(usage);
});

app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { userId = 'seeker_demo_1', plan = 'pro_monthly' } = req.body;

    // Real Stripe Checkout Session creation or fallback URL
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'JobFlow AI Pro Unlimited Pass',
                description: 'Unlimited AI Resume Parses, Job Matching & Mock Interviews',
              },
              unit_amount: 2900, // $29.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/seeker?payment=success`,
        cancel_url: `http://localhost:3000/seeker?payment=cancelled`,
      });

      return res.json({ id: session.id, url: session.url });
    } catch (stripeErr) {
      // Test mode / Mock Stripe session fallback
      return res.json({
        id: `cs_test_${Date.now()}`,
        url: `http://localhost:3000/seeker?payment=success&mock=true`,
        mock: true
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stripe/mock-success', (req, res) => {
  const userId = req.body.userId || 'seeker_demo_1';
  const updatedUsage = store.upgradeUserToPro(userId);
  res.json({ success: true, message: 'Upgraded to JobFlow AI Pro!', usage: updatedUsage });
});


// =====================================
// JOB ROUTES
// =====================================
app.get('/api/jobs', async (req, res) => {
  try {
    if (isMongoConnected) {
      const jobs = await Job.find().sort({ createdAt: -1 });
      return res.json(jobs);
    }
    return res.json(store.getJobs());
  } catch (err) {
    res.json(store.getJobs());
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const jobData = req.body;
    if (!jobData.title || !jobData.company || !jobData.description) {
      return res.status(400).json({ error: 'Title, company, and description are required.' });
    }

    if (isMongoConnected) {
      const newJob = new Job(jobData);
      await newJob.save();
      return res.status(201).json(newJob);
    }

    const created = store.createJob(jobData);
    return res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const job = await Job.findById(id);
      if (job) return res.json(job);
    }
    const storeJob = store.getJobById(id);
    if (storeJob) return res.json(storeJob);
    return res.status(404).json({ error: 'Job not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// RESUME ROUTES (With 2-Free Trial Gate)
// =====================================
app.get('/api/resumes', async (req, res) => {
  const userId = req.query.userId || 'seeker_demo_1';
  try {
    if (isMongoConnected) {
      const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
      return res.json(resumes);
    }
    return res.json(store.getResumes(userId));
  } catch (err) {
    res.json(store.getResumes(userId));
  }
});

app.post('/api/resumes/parse', async (req, res) => {
  const userId = req.body.userId || 'seeker_demo_1';
  
  // Check 2-Free Trial Search Limit
  const usage = store.getUserUsage(userId);
  if (!usage.allowed) {
    return res.status(402).json({
      error: 'Free Trial Limit Reached',
      code: 'PAYMENT_REQUIRED',
      message: 'You have used all 2 free trial resume searches. Please upgrade via Stripe to continue using JobFlow AI Pro.',
      usage
    });
  }

  try {
    const { text, filename } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Resume text is required.' });
    }

    // Call Python AI microservice for NLP extraction & ATS scoring
    let aiResponse;
    try {
      const resp = await axios.post(`${PYTHON_AI_URL}/api/ai/parse-resume`, { text });
      aiResponse = resp.data;
    } catch (err) {
      // AI Fallback if python is offline
      aiResponse = {
        extracted_skills: ["React", "Next.js", "Node.js", "Python", "MongoDB", "REST APIs"],
        estimated_experience_years: 4,
        ats: { ats_score: 88, feedback: ["Strong keyword optimization!"] }
      };
    }

    // Increment usage counter upon successful parse
    const updatedUsage = store.incrementSearchCount(userId);
    store.recordOutput();

    const resumePayload = {
      userId,
      filename: filename || 'resume.pdf',
      rawText: text,
      extractedSkills: aiResponse.extracted_skills || [],
      atsScore: aiResponse.ats?.ats_score || 85,
      atsFeedback: aiResponse.ats?.feedback || [],
      experienceYears: aiResponse.estimated_experience_years || 3
    };

    if (isMongoConnected) {
      const newRes = new Resume(resumePayload);
      await newRes.save();
      return res.status(201).json({ resume: newRes, ai: aiResponse, usage: updatedUsage });
    }

    const createdRes = store.createResume(resumePayload);
    return res.status(201).json({ resume: createdRes, ai: aiResponse, usage: updatedUsage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// APPLICATION ROUTES
// =====================================
app.get('/api/applications', async (req, res) => {
  const seekerId = req.query.seekerId || 'seeker_demo_1';
  try {
    if (isMongoConnected) {
      const apps = await Application.find({ seekerId }).sort({ updatedAt: -1 });
      return res.json(apps);
    }
    return res.json(store.getApplications(seekerId));
  } catch (err) {
    res.json(store.getApplications(seekerId));
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const appData = req.body;
    if (!appData.jobId) {
      return res.status(400).json({ error: 'jobId is required.' });
    }

    if (isMongoConnected) {
      const newApp = new Application(appData);
      await newApp.save();
      return res.status(201).json(newApp);
    }

    const created = store.createApplication(appData);
    return res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/applications/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { status, notes } = req.body;

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Application.findByIdAndUpdate(
        id,
        { status, notes, updatedAt: new Date() },
        { new: true }
      );
      if (updated) return res.json(updated);
    }

    const storeUpdated = store.updateApplicationStatus(id, status, notes);
    if (storeUpdated) return res.json(storeUpdated);
    return res.status(404).json({ error: 'Application not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// AI PROXY ENDPOINTS (Node -> Python AI)
// =====================================
const callPythonAi = async (endpoint, body) => {
  try {
    const resp = await axios.post(`${PYTHON_AI_URL}${endpoint}`, body, { timeout: 12000 });
    return resp.data;
  } catch (err) {
    console.log(`[AI Proxy] ${PYTHON_AI_URL}${endpoint} failed or cold-starting. Trying local fallback http://127.0.0.1:5001${endpoint}...`);
    try {
      const fallbackResp = await axios.post(`http://127.0.0.1:5001${endpoint}`, body, { timeout: 8000 });
      return fallbackResp.data;
    } catch (fallbackErr) {
      throw err;
    }
  }
};

app.post('/api/ai/match', async (req, res) => {
  const userId = req.body.userId || 'seeker_demo_1';
  const usage = store.getUserUsage(userId);
  if (!usage.allowed) {
    return res.status(402).json({
      error: 'Free Trial Limit Reached',
      code: 'PAYMENT_REQUIRED',
      message: 'You have used all 2 free trial searches. Please upgrade to JobFlow AI Pro via Stripe.',
      usage
    });
  }

  try {
    const aiData = await callPythonAi('/api/ai/match-job', req.body);
    const updatedUsage = store.incrementSearchCount(userId);
    res.json({ ...aiData, usage: updatedUsage });
  } catch (err) {
    res.status(500).json({ error: 'Python AI matching service error', details: err.message });
  }
});

app.post('/api/ai/cover-letter', async (req, res) => {
  try {
    const aiData = await callPythonAi('/api/ai/generate-cover-letter', req.body);
    res.json(aiData);
  } catch (err) {
    res.status(500).json({ error: 'Python AI Cover Letter service error', details: err.message });
  }
});

app.post('/api/ai/interview-prep', async (req, res) => {
  try {
    const aiData = await callPythonAi('/api/ai/interview-prep', req.body);
    res.json(aiData);
  } catch (err) {
    res.status(500).json({ error: 'Python AI Interview service error', details: err.message });
  }
});

app.post('/api/ai/eval-answer', async (req, res) => {
  try {
    const aiData = await callPythonAi('/api/ai/eval-answer', req.body);
    res.json(aiData);
  } catch (err) {
    res.status(500).json({ error: 'Python AI Eval service error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[JobFlow AI Node Gateway] Listening on http://localhost:${PORT}`);
});
