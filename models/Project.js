// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      // এখান থেকে validator অংশটা সম্পূর্ণ রিমুভ করা হয়েছে
      // যাতে update-এর সময় আর কোনো validation error না আসে
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client is required'],
    },
    employeeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    healthScore: {
      type: Number,
      default: 100,
      min: [0, 'Health score cannot be below 0'],
      max: [100, 'Health score cannot exceed 100'],
    },
    status: {
      type: String,
      enum: ['ON_TRACK', 'AT_RISK', 'CRITICAL', 'COMPLETED'],
      default: 'ON_TRACK',
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;