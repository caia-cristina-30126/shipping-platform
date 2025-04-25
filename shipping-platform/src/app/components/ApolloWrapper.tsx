"use client";
import { ApolloProvider } from "@apollo/client";
import graphQLClient from "@/lib/apolloClient";

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={graphQLClient}>{children}</ApolloProvider>;
}
