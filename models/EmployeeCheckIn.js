  import mongoose from 'mongoose'

  const EmployeeCheckInSchema = new mongoose.Schema(
    {
      projectId: mongoose.Schema.Types.ObjectId,
      employeeId: mongoose.Schema.Types.ObjectId,
      weekStart: Date,
      progressSummary: String,
      blockers: String,
      confidence: Number,
      completion: Number
    },
    { timestamps: true }
  )

  export default mongoose.models.EmployeeCheckIn ||
    mongoose.model('EmployeeCheckIn', EmployeeCheckInSchema)
