import type { Service } from './Service'

export interface ServiceCategory {
  id: number
  name: string
  short_description: string
  selection_image_id: string
  order_number: string
  price_min: string
  price_max: string
  services: {
    [key: string]: Service
  }
}
