import { resolvers } from './resolvers';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import http from 'http';
import cors from 'cors';
import gql from 'graphql-tag';
import path from 'path';
import { GraphqlContext } from './context';

const app = express();
const httpServer = http.createServer(app);
const typeDefs = gql(
  readFileSync(path.resolve(import.meta.dirname, "./schemes/schema.graphql"), {
    encoding: "utf8",
  }));

const server = new ApolloServer<GraphqlContext>({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ]
});

await server.start();

app.use(
  '/',
  cors<cors.CorsRequest>(),
  express.json({ limit: '50mb' }),
  expressMiddleware(server, {
    context: async () => ({ prismaOrm: new PrismaClient() }),
  }),
);

await new Promise<void>((resolve) => {
  return httpServer.listen({ port: 4000, host: "0.0.0.0" }, resolve)
});
