export function calculateHealth({ satisfaction, confidence, progress, penalty }) {
  let score = 0
  score += satisfaction * 6
  score += confidence * 5
  score += progress * 0.25
  score -= penalty
  score = Math.max(0, Math.min(100, score))

  let status = 'ON_TRACK'
  if (score < 80) status = 'AT_RISK'
  if (score < 60) status = 'CRITICAL'

  return { score, status }
}
