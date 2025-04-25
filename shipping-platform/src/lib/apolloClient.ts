import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const graphQLClient = new ApolloClient({
  link: new HttpLink({
    uri: '/api/graphql', // The GraphQL API endpoint we created in Next.js
  }),
  cache: new InMemoryCache(),
});

export default graphQLClient;
