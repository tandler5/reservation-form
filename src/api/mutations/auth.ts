import type { User } from '@/types/User'
import gql from 'graphql-tag'

export const LOGIN = gql`
  mutation Login($provider: String!, $token: String!) {
    login(provider: $provider, token: $token) {
      token
      user {
        id
        first_name
        last_name
        email
        phone
        status
      }
    }
  }
`

export interface LOGIN {
  login: {
    token: string
    user: User
  }
}
