import { extendType, intArg, nonNull, stringArg } from 'nexus'


export const AlertMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createProduct', {
      type: 'Product',
      args: {
        name: nonNull(stringArg()),
        quantity: nonNull(intArg()),
      },
      resolve: async (_parent, {name, quantity}, ctx) => {
        const product = await ctx.prisma.product.create({
         data: {
            name: name,
            quantity: quantity
         }
        })

        return product
      },
    })
  },
})
