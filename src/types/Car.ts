export interface Car {
  id?: string
  spz?: string
  year?: number
  vin?: string
  model: {
    id?: string
    name: string
    brand_id: string
    brand: {
      id?: string
      logo: string
      name: string
    }
  }
}
