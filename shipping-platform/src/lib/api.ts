import { DocumentNode } from "graphql"
import graphQLClient from "./apolloClient"

export const gqlQuery = async <T>(query: DocumentNode, variables?: object) => {
  try {
    const { data } = await graphQLClient.query<T>({
      query,
      variables,
    })
    return data
  } catch (error) {
    console.error('GraphQL Query Error:', error)
    throw error
  }
}

export const gqlMutation = async <T>(mutation: DocumentNode, variables?: object) => {
  try {
    const { data } = await graphQLClient.mutate<T>({
      mutation,
      variables,
    })
    return data
  } catch (error) {
    console.error('GraphQL Mutation Error:', error)
    throw error
  }
}
