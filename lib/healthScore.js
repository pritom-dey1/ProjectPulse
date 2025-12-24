export function calculateHealth({ satisfaction, confidence, progress, penalty }) {
  let score = 100

  score -= (5 - satisfaction) * 8
  score -= (5 - confidence) * 8

  if (progress < 30) score -= 20
  else if (progress < 60) score -= 10

  score -= penalty

  if (score < 0) score = 0
  if (score > 100) score = 100

  let status = 'ON_TRACK'
  if (score < 60) status = 'CRITICAL'
  else if (score < 80) status = 'AT_RISK'

  return { score: Math.round(score), status }
}
