import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      image
      quantity
    }
  }
`

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String
    $image: String
    $quantity: Int!
  ) {
    createProduct(
      name: $name
      description: $description
      image: $image
      quantity: $quantity
    ) {
      id
      name
      description
      image
      quantity
    }
  }
`


