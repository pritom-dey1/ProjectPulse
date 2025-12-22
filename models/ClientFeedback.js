import mongoose from 'mongoose'

const ClientFeedbackSchema = new mongoose.Schema(
  {
    projectId: mongoose.Schema.Types.ObjectId,
    clientId: mongoose.Schema.Types.ObjectId,
    weekStart: Date,
    satisfaction: Number,
    communication: Number,
    comments: String,
    issueFlag: Boolean
  },
  { timestamps: true }
)

export default mongoose.models.ClientFeedback ||
  mongoose.model('ClientFeedback', ClientFeedbackSchema)
