import gql from 'graphql-tag'
import type { Brand } from '@/types/Brand'
import type { Tax } from '@/types/Tax'
import type { CustomField } from '@/types/CustomField'
import type { ServiceCategory } from '@/types/ServiceCategory'
import type { Service } from '@/types/Service'
import type { OpeningHour } from '@/types/OpeningHour'

export interface GET_INITIAL_DATA_TS {
  stepSettings: {
    label: string
    step: string
    value: string
    image?: string
  }[]
  socialLogin: {
    facebook_app_id: string | null
    google_client_id: string | null
  }
  customFields: {
    [key: string]: CustomField
  }
  categories: (Omit<ServiceCategory, 'services'> & { services: Service[] })[]
  brands: Brand[]
  taxes: Tax[]
  timeBlockInterval: number
  openingHours: OpeningHour[]
}

export type SERIALIZED_INITIAL_DATA_TS = Omit<GET_INITIAL_DATA_TS, 'categories'> & {
  categories: { [key: string]: ServiceCategory }
}

export const GET_INITIAL_DATA = gql`
  query MyQuery {
    stepSettings {
      label
      step
      value
      image
    }
    categories {
      id
      name
      description
      order_number
      image {
        url
      }
      services {
        id
        name
        short_description
        is_price_variable
        price_min
        price_max
        duration
        buffer_before
        buffer_after
        extras {
          id
          name
          short_description
          charge_amount
          maximum_quantity
          image {
            url
          }
        }
      }
    }
    brands {
      id
      name
      logo
      slug
      models {
        id
        name
        slug
      }
    }
    customFields
    timeBlockInterval
    taxes {
      id
      name
      type
      value
    }
    openingHours {
      start_time
      week_day
      end_time
    }
    socialLogin
  }
`
