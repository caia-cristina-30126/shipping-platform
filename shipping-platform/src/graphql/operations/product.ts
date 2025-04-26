import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      quantity
    }
  }
`

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String
    $quantity: Int!
  ) {
    createProduct(
      name: $name
      description: $description
      quantity: $quantity
    ) {
      id
      name
      description
      quantity
    }
  }
`


