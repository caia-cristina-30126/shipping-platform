'use client'

import { useEffect, useState } from 'react'
import { CustomCard } from "@/app/components/ui/common/CustomCard"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { GET_PRODUCTS, CREATE_PRODUCT } from '@/graphql/operations/product'
import { gqlQuery, gqlCreateMutation } from '@/lib/api'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

type Product = {
  id: string
  name: string
  quantity: number
  description?: string
}

type CreateProductResponse = {
  createProduct: {
    id: string
    name: string
    description?: string
    quantity: number
  }
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or greater"),
})

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: 0,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await gqlQuery<{ products: Product[] }>(GET_PRODUCTS)
        setProducts(data.products)
        setError(null)
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = await gqlCreateMutation<CreateProductResponse>(CREATE_PRODUCT, {
        name: values.name,
        description: values.description,
        quantity: values.quantity,
      })
      
      if (data?.createProduct) {
        setProducts(prev => prev ? [...prev, data.createProduct] : [data.createProduct])
        setIsAddDialogOpen(false)
        form.reset()
      }
    } catch (error) {
      console.error('Error creating product:', error)
      setError('Failed to create product')
    }
  }

  const filteredProducts = products?.filter(product => {
    const searchTerm = searchQuery.trim().replace(/\s+/g, ' ').toLowerCase()
    const productName = product.name.toLowerCase()
    const productDescription = product.description?.toLowerCase() || ''
    
    return productName.includes(searchTerm) || productDescription.includes(searchTerm)
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Product description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Add Product</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts?.map((product) => (
          <CustomCard
            key={product.id}
            title={product.name}
            description={product.description || 'No description available'}
            className="hover:shadow-lg transition-shadow"
            titleClassName="text-lg"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Quantity:</span>
              <span className="font-semibold">{product.quantity}</span>
            </div>
          </CustomCard>
        ))}
        {filteredProducts?.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
