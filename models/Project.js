import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,
    status: String,
    healthScore: Number,
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    employeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
)

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)
