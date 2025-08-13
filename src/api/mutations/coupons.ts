import gql from 'graphql-tag'

export const APPLY_COUPON = gql`
  mutation ApplyCoupon($code: String!, $services: [ID!]!) {
    applyCoupon(input: { code: $code, services: $services }) {
      id
      code
      description
      discount_type
      discount_value
      image
      name
    }
  }
`
