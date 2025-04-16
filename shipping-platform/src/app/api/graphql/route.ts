import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { gql } from 'graphql-tag'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ✅ Define your GraphQL schema
const typeDefs = gql`
  type Product {
    id: Int!
    name: String!
    description: String
    quantity: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    products: [Product!]!
  }

`

// ✅ Define resolvers that use Prisma
const resolvers = {
  Query: {
    products: async () => await prisma.product.findMany(),
  },
}

// ✅ Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = startServerAndCreateNextHandler(server)

export { handler as GET, handler as POST } // GraphQL needs both
