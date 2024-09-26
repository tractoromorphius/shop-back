import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import path from 'path';

const typeDefs = gql(
  readFileSync(path.resolve(import.meta.dirname, "./schemes/schema.graphql"), {
    encoding: "utf8",
  }));

const server = new ApolloServer({
  typeDefs,
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000, 
    host: "0.0.0.0",
  },
});

console.log(`Server ready at: ${url}`);
