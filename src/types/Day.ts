import type { SLOT } from './Slot'

export interface Day {
  date: Date
  past: boolean
  availableSlots: SLOT
  availableSlotsCount: number
  slotsAreAvailable: boolean
  prevMonth: boolean
  isCurrentMonth: boolean
}
