import type { Booking, BookingInput } from './Booking'
import type { Order } from './Order'

export interface MakeReservationInput {
  order: Order
  bookings: BookingInput[]
}

export interface MakeReservation {
  order: Order
  bookings: Booking[]
}
