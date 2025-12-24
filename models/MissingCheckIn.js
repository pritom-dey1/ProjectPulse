// models/MissingCheckIn.js
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  weekStart:   { type: Date, required: true },
  resolved:    { type: Boolean, default: false },
  resolvedAt:  { type: Date },
  resolvedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models.MissingCheckIn || mongoose.model('MissingCheckIn', schema);