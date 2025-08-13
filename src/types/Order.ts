import type { Customer } from './Customer'

export interface Order {
  id: number
  customer: Customer
}
