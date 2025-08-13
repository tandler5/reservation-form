import { ApolloClient as Client, createHttpLink, InMemoryCache } from '@apollo/client/core'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://127.0.0.1:8000/api'
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const ApolloClient = new Client({
  link: httpLink,
  cache
})
