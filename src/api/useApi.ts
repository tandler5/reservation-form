import { GraphQLClient, type RequestDocument } from 'graphql-request'
import axios from 'axios'

export const useGraphQL = async <T>(
  QUERY: RequestDocument,
  variables?: any,
  authToken?: string
) => {
  const client = new GraphQLClient(import.meta.env.VITE_API_BASE_URL, {
    headers: {
      ...(authToken ? { authorization: `Bearer ${authToken}` } : {})
    }
  })
  return (await client.request(QUERY, variables)) as T
}

export const useApi = () => {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL.split('/api')[0]
  const get = <T>(path: string, params: object) => {
    return axios.get<T>(path, { params })
  }
  return { get }
}
