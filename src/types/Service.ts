import type { ServiceExtra } from './ServiceExtra'

export interface Service {
  id: string
  name: string
  short_description: string
  image: {
    url: string
  }
  price_min: string
  price_max: string
  extras: ServiceExtra[]
  duration: number
}
