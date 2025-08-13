export interface ServiceExtra {
  id: string
  name: string
  short_description: string
  charge_amount: number
  maximum_quantity: string
  quantity?: number
  image: { url: string }
}
