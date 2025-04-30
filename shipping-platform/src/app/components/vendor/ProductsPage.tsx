
import { CustomCard } from "@/app/components/ui/common/CustomCard"
import { prisma } from '@/context'
import { z } from "zod"
import { SearchInput } from '../search/SearchInput'
import Link from "next/link"

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

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

  const filters = (await searchParams).filters

  console.log(filters)
  console.log(typeof filters)

  // add product button
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     name: "",
  //     description: "",
  //     quantity: 0,
  //   },
  // })


  const products = await prisma.product.findMany()

  console.log("products", products)


  // add product dialog
  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //   try {
  //     const data = await gqlCreateMutation<CreateProductResponse>(CREATE_PRODUCT, {
  //       name: values.name,
  //       description: values.description,
  //       quantity: values.quantity,
  //     })

  //     if (data?.createProduct) {
  //       // setProducts(prev => prev ? [...prev, data.createProduct] : [data.createProduct])
  //       setIsAddDialogOpen(false)
  //       form.reset()
  //     }
  //   } catch (error) {
  //     console.error('Error creating product:', error)
  //     setError('Failed to create product')
  //   }
  // }



  return (
    <div className="container mx-auto py-6">
      {/* add button dialog */}
      {/* <div className="flex justify-between items-center mb-6">
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
      </div> */}

      <div className="mb-4">
        <SearchInput />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products?.map((product) => (
          <CustomCard
            key={product.id}
            title={product.name}
            description={product.description || 'No description available'}
            className="hover:shadow-lg transition-shadow"
            titleClassName="text-lg"

            footer={<Link href={`/dashboard/products/${product.id}`}>Details</Link>}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Quantity:</span>
              <span className="font-semibold">{product.quantity}</span>
            </div>
          </CustomCard>

        ))}
        {products?.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
