import type { SERIALIZED_INITIAL_DATA_TS } from '@/api/queries/initialQuery'
import type { BookingInput } from '@/types/Booking'
import type { Tax } from '@/types/Tax'

export const calcPriceWithoutVats = (price: number, taxes: Tax[]) => {
  let newValue = price
  taxes.forEach(({ type, value }) => {
    if (type === 'percentage') {
      newValue = newValue / (1 + value / 100)
    } else {
      newValue = newValue - value
    }
  })
  return parseInt(newValue.toFixed(0))
}

export const getVatSymbol = (type: string) => (type === 'percentage' ? '%' : 'Kč')

const getSum = (bookings: BookingInput[], data: SERIALIZED_INITIAL_DATA_TS) => {
  return bookings.reduce(
    (acc, booking) =>
      acc +
      parseInt(data?.categories[booking.category]?.services?.[booking.service]?.price_min!) *
        (booking.quantity ?? 1),
    0
  )
}

export const calcVat = (
  data: SERIALIZED_INITIAL_DATA_TS,
  taxValue: number,
  bookings: BookingInput[],
  extras: number
) => {
  const taxPercentege = taxValue / 100
  const totalBookingPrice = getSum(bookings, data)
  const total = totalBookingPrice + extras
  return Math.ceil(total - total / (1 + taxPercentege))
}
