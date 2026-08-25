const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: String, default: 'seeker_demo_1' },
  filename: { type: String, default: 'resume.pdf' },
  rawText: { type: String, required: true },
  extractedSkills: [{ type: String }],
  atsScore: { type: Number, default: 75 },
  atsFeedback: [{ type: String }],
  experienceYears: { type: Number, default: 3 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
