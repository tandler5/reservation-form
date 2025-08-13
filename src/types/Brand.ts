import type { Model } from '@/types/Model'
export interface Brand {
  id: string
  name: string
  logo: string
  slug: string
  models: Model[]
}

export interface SerializedBrand {
  id: string
  name: string
  logo: string
  models: { [key: string]: Model }
}
