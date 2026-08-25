const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: String, required: true },
  jobTitle: { type: String },
  company: { type: String },
  seekerId: { type: String, default: 'seeker_demo_1' },
  seekerName: { type: String, default: 'Jordan Lee' },
  seekerEmail: { type: String, default: 'jordan.lee@example.com' },
  resumeId: { type: String },
  matchScore: { type: Number, default: 85 },
  matchDetails: { type: Object, default: {} },
  coverLetter: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['saved', 'applied', 'interviewing', 'offer', 'rejected'], 
    default: 'saved' 
  },
  notes: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);
