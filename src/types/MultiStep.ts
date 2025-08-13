import type { Customer } from './Customer'
import type { MakeReservation } from './Reservation'
import type { Service } from './Service'
import type { ServiceCategory } from './ServiceCategory'
import type { ServiceExtra } from './ServiceExtra'

export interface MultiStep {
  coupon: {
    code: string
  }
  service_extras: {
    extras: {
      [key: string]: ServiceExtra
    }
  }
  services: {
    service: Service
    category: ServiceCategory | null
  }
  datepicker: {
    date?: {
      day: string
      time?: string
    }
  }
  custom_fields_for_booking: {
    carId?: string
    car?: {
      brand?: string
      model?: string
      ccm?: string
      performance?: string
      year?: Date
      vin?: string
    }
  }
  contact: {
    customer: Customer
  }
  confirmation: MakeReservation
}
