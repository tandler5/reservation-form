import gql from 'graphql-tag'

export const GET_SLOTS = gql`
  query MyQuery($locationId: ID, $serviceId: ID!, $year: Int!, $month: Int!, $page: Int) {
    availableSlots(
      location_id: $locationId
      service_id: $serviceId
      year: $year
      month: $month
      page: $page
    )
  }
`
