import { PrismaClient } from "@prisma/client"

export type GraphqlContext = {
  prismaOrm: PrismaClient
}
