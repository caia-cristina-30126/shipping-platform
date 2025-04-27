import { objectType } from 'nexus'

export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('name')
    t.string('description')
    t.string('image')
    t.nonNull.int('quantity')
  },
})