export interface SLOT {
  [date: string]: {
    [time: string]: {
      avaibleEmployes: number[]
      time: string
      slots?: number
    }
  }
}
