import type { Car } from './Car'
import type { Service } from './Service'
import type { ServiceExtra } from './ServiceExtra'
import type { Location } from './Location'

export interface BookingInput {
  id: string
  name: string
  price_min: string
  category: string
  quantity?: number
  service: string
  day?: Date
  time?: string
  carId?: number
  car?: Car
  extras?: { [key: string]: ServiceExtra }
}

export interface Booking {
  id: string
  price_min: string
  category: string
  quantity?: number
  service: Service
  start_date?: Date
  end_date?: Date
  start_time?: string
  end_time?: string
  vehicle?: Car
  location?: Location
  extras?: { [key: string]: ServiceExtra }
}

export interface SerializedBookingData {
  service: string
  date: string
  car: {
    id?: number
  }
  time: number
}
