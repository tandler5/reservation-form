/**
 * YYYY-MM-DD
 */
export const toShortDatefromDate = (date: Date): string => {
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const calcEndDateTime = (
  startDate: string,
  startTimeMinutes: number,
  durationMinutes: number
) => {
  // startDate jako YYYY-MM-DD
  const [year, month, day] = startDate.split('-').map(Number)

  // vytvoříme Date objekt od půlnoci + startTimeMinutes
  const start = new Date(year, month - 1, day, 0, startTimeMinutes)

  // přidáme duration v minutách
  const end = new Date(start.getTime() + durationMinutes * 60000)

  // výsledky
  const endDate = end.toISOString().split('T')[0] // YYYY-MM-DD
  const endTime = end.toTimeString().slice(0, 5) // HH:MM

  return { endDate, endTime }
}
