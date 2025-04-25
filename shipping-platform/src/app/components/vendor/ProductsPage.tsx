'use client'

import { useEffect, useState } from 'react'

import { GET_PRODUCTS } from '@/graphql/operations/product'
import graphQLClient from '@/lib/apolloClient'
import { Card, CardContent } from '@/components/ui/card'

type Product = {
  id: string
  name: string
quantity: number
  description?: string
}

export const ProductsPage =() => {
  const [products, setProducts] = useState<Product[] | null>(null)

  useEffect(() => {
  const fetchData = async () => {
      try {
        const { data } = await graphQLClient.query({
         query: GET_PRODUCTS,
        })
        setProducts(data.products)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchData()
  }, [])


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {products?.map((product) => (
        <Card key={product.id}>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
            <p className="mt-2 font-bold">quantity: {product.quantity}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
