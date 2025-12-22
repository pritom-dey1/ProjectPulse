import Project from '@/models/Project'
import EmployeeCheckIn from '@/models/EmployeeCheckIn'
import ClientFeedback from '@/models/ClientFeedback'
import Risk from '@/models/Risk'
import { calculateHealth } from './healthScore'

export async function recalculateHealth(projectId) {
  const project = await Project.findById(projectId)

  const checkins = await EmployeeCheckIn
    .find({ projectId })
    .sort({ createdAt: -1 })
    .limit(3)

  const feedbacks = await ClientFeedback
    .find({ projectId })
    .sort({ createdAt: -1 })
    .limit(3)

  const openRisks = await Risk.countDocuments({
    projectId,
    status: 'OPEN'
  })

  const avgConfidence =
    checkins.reduce((a, c) => a + c.confidenceLevel, 0) /
    (checkins.length || 1)

  const avgSatisfaction =
    feedbacks.reduce((a, f) => a + f.satisfaction, 0) /
    (feedbacks.length || 1)

  const progress =
    checkins.length > 0
      ? checkins[0].completionPercent
      : 0

  const { score, status } = calculateHealth({
    satisfaction: avgSatisfaction,
    confidence: avgConfidence,
    progress,
    penalty: openRisks * 10
  })

  project.healthScore = score
  project.status = status
  await project.save()
}
