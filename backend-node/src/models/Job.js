const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  salaryRange: { type: String, default: '$120,000 - $160,000' },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], default: 'Full-time' },
  experienceLevel: { type: String, default: 'Mid-Senior Level' },
  description: { type: String, required: true },
  requiredSkills: [{ type: String }],
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  recruiterName: { type: String, default: 'Alex Mercer' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema);
