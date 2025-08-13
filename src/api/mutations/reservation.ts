import gql from 'graphql-tag'

export const MAKE_RESERVATION = gql`
  mutation MakeReservation($reservationData: [ReservationInputData!]!, $customer: CustomerInput) {
    makeReservation(reservationData: $reservationData, customer: $customer) {
      bookings {
        start_date
        start_time
        vehicle {
          vin
          year
          model {
            id
            brand_id
          }
        }
        service {
          id
          duration
          category {
            id
          }
        }
        id
        location {
          id
          full_address
        }
      }
      order {
        id
        customer {
          firstName: first_name
          lastName: last_name
          email
        }
      }
    }
  }
`
