import { Resolvers } from "./types";

export const resolvers: Resolvers = {
  Query: {
    products: (_, __, { prismaOrm }) => {
      return prismaOrm.product.findMany();
    },
  },
}
