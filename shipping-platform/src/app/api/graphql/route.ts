import { createContext } from '@/context';
import { schema } from '@/graphql/schema';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';


// Set up Apollo Server
const server = new ApolloServer({
  schema
})

const handler = startServerAndCreateNextHandler(server, {
  context: async () => createContext(),
})

export { handler as GET, handler as POST }; // GraphQL needs both

