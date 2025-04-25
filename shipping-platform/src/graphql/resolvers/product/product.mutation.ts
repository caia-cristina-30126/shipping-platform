import { extendType, intArg, nonNull, stringArg } from 'nexus'


export const AlertMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createProduct', {
      type: 'Product',
      args: {
        name: nonNull(stringArg()),
        quantity: nonNull(intArg()),
        description: stringArg()
      },
      resolve: async (_parent, {name, quantity, description}, ctx) => {
        const product = await ctx.prisma.product.create({
         data: {
            name,
            quantity,
            description
         }
        })

        return product
      },
    })
  },
})
