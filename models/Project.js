// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  healthScore: { type: Number, default: 100, min: 0, max: 100 },
  status: { 
    type: String, 
    enum: ['ON_TRACK', 'AT_RISK', 'CRITICAL', 'COMPLETED'], 
    default: 'ON_TRACK' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);