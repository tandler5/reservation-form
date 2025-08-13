import type { Car } from '@/types/Car'
import gql from 'graphql-tag'

export const GET_USER_CARS = gql`
  query GetUserCars {
    myVehicles {
      id
      color
      doors
      performance
      seats
      spz
      vin
      year
      model {
        brand {
          slug
          name
        }
        name
        slug
      }
    }
  }
`

export interface GET_USER_CARS_TS {
  myVehicles: Car[]
}
