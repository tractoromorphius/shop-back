import { ApolloServer } from '@apollo/server';
import { resolvers } from './resolvers';
import { startStandaloneServer, StartStandaloneServerOptions } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import { ListenOptions } from 'net';
import path from 'path';
import { GraphqlContext } from './context';

type ListenConfig = {
  listen?: ListenOptions
}

const typeDefs = gql(
  readFileSync(path.resolve(import.meta.dirname, "./schemes/schema.graphql"), {
    encoding: "utf8",
  }));

const server = new ApolloServer<GraphqlContext>({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ prismaOrm: new PrismaClient() }),
  listen: {
    port: 4000, 
    host: "0.0.0.0",
  },
});

console.log(`Server ready at: ${url}`);
