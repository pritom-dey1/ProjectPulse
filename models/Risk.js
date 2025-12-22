import mongoose from 'mongoose'

const RiskSchema = new mongoose.Schema(
  {
    projectId: mongoose.Schema.Types.ObjectId,
    createdBy: mongoose.Schema.Types.ObjectId,
    title: String,
    severity: String,
    mitigation: String,
    status: String
  },
  { timestamps: true }
)

export default mongoose.models.Risk || mongoose.model('Risk', RiskSchema)
