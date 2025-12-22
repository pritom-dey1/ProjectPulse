import mongoose from "mongoose";

const CheckInSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // Employee submissions
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },    // Client submissions
  progressSummary: String,
  feedbackSummary: String,
  confidenceLevel: Number, // 1-5
  satisfaction: Number,    // 1-5
  date: { type: Date, default: Date.now },
});

export default mongoose.models.CheckIn || mongoose.model("CheckIn", CheckInSchema);
