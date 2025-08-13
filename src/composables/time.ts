export const timeStringToMinutes = (time: string) => {
  const [hours, mins] = time.split(':').map(Number) // Rozdělí string na hodiny a minuty a převede je na čísla
  return hours * 60 + mins // Přepočítá hodiny na minuty a přičte minuty
}
export const minutesToTimeString = (minutes: number) => {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0') // počítá hodiny a doplní 0, pokud je třeba
  const mins = String(minutes % 60).padStart(2, '0') // zbytek jsou minuty a také doplní 0
  return `${hours}:${mins}`
}
