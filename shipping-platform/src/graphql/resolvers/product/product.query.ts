import { PrismaClient } from '@prisma/client'
import { extendType } from 'nexus'

const prisma = new PrismaClient()
export const PostQuery = extendType({
  type: 'Query',                        
  definition(t) {
    t.nonNull.list.field('products', {     
      type: 'Product', 
       resolve: async (_parent, _args, ctx) =>  await ctx.prisma.product.findMany()
    })
  },
})