import type { BookingInput, SerializedBookingData } from '@/types/Booking'
import type { ServiceExtra } from '@/types/ServiceExtra'
import type { Tax } from '@/types/Tax'
import { calcPriceWithoutVats } from './vat'
import type { SERIALIZED_INITIAL_DATA_TS } from '@/api/queries/initialQuery'
import type { Form } from '@/types/Form'
import { timeStringToMinutes } from './time'

export const getSumOfBookingsWithoutVats = (
  data: SERIALIZED_INITIAL_DATA_TS,
  bookings: BookingInput[],
  extras: ServiceExtra[] = [],
  taxes?: Tax[]
) =>
  bookings.reduce(
    (acc, booking) =>
      acc +
      calcPriceWithoutVats(
        parseInt(data?.categories[booking.category]?.services?.[booking.service]?.price_min!),
        taxes ?? []
      ) *
        (booking.quantity ?? 1),
    0
  ) +
  extras.reduce(
    (acc, extra) => acc + calcPriceWithoutVats(extra.charge_amount * extra.quantity!, taxes ?? []),
    0
  )

export const serializeBookingData = (bookings: Form['bookings']) => {
  const serializedBookings: SerializedBookingData[] = []
  bookings.forEach((b) => {
    const { model, ccm, performance, vin, year } = b.car ?? {}
    const serialized = {
      service: b.service,
      date: new Intl.DateTimeFormat('fr-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date(b.day!)),
      vehicle: {
        id: b.carId,
        model,
        engine_size: ccm,
        performance,
        vin,
        year
      },
      time: timeStringToMinutes(b.time!)
    }
    serializedBookings.push(serialized)
  })
  return serializedBookings
}
