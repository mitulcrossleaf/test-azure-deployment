export function getDayDifferenceLabel(dateString: string) {
  const inputDate = new Date(dateString)
  const today = new Date()

  // Set both dates to midnight to ignore time difference
  inputDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffInMs = today.getTime() - inputDate.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return '1 day ago'
  return `${diffInDays} days ago`
}
