import type { BookingInput } from './Booking'
import type { Coupon } from './Coupon'
import type { Customer } from './Customer'
import type { MultiStep } from './MultiStep'

export interface Form {
  bookings: BookingInput[]
  currentBookingEdit: number
  coupons: Coupon[]
  multiStep: MultiStep
  contact: {
    customer: Customer
  }
  [key: string]: unknown
}
