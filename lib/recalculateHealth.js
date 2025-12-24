// lib/recalculateHealth.js
import Project from '@/models/Project';
import Risk from '@/models/Risk';
import EmployeeCheckIn from '@/models/EmployeeCheckIn';   // ধরে নিচ্ছি নাম এটাই
import ClientFeedback from '@/models/ClientFeedback';

export async function recalculateHealth(projectId) {
  await connectDB();

  const project = await Project.findById(projectId);
  if (!project) return;

  const openRisks = await Risk.countDocuments({ projectId, status: 'OPEN' });

  const recentCheckIns = await EmployeeCheckIn.find({ projectId });
  const recentFeedbacks = await ClientFeedback.find({ projectId });

  let score = 100;

  // Open risks penalty
  score -= openRisks * 8;           // প্রতি open risk-এ ৮ পয়েন্ট কাটা (adjust করতে পারো)

  // Employee confidence
  if (recentCheckIns.length > 0) {
    const avgConfidence = recentCheckIns.reduce((sum, ci) => sum + ci.confidenceLevel, 0) / recentCheckIns.length;
    score -= (5 - avgConfidence) * 6;
  }

  // Client satisfaction
  if (recentFeedbacks.length > 0) {
    const avgSatisfaction = recentFeedbacks.reduce((sum, f) => sum + f.satisfaction, 0) / recentFeedbacks.length;
    score -= (5 - avgSatisfaction) * 8;
  }

  if (new Date() > new Date(project.endDate) && project.status !== 'COMPLETED') {
    score -= 15;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status = 'ON_TRACK';
  if (score < 60) status = 'CRITICAL';
  else if (score < 80) status = 'AT_RISK';

  await Project.findByIdAndUpdate(projectId, {
    healthScore: score,
    status,
    updatedAt: new Date()
  });
}