"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CREATE_PRODUCT } from "@/graphql/operations/product";
import { gqlCreateMutation } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CreateProductResponse = {
  createProduct: {
    id: number
    name: string
    description?: string
    quantity: number
  }
}

export const NewProductPage = () => {
  const formSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    quantity: z.coerce.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: 0,
    },
  });

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  console.log("values", values)
  try {
   const data = await gqlCreateMutation<CreateProductResponse>(CREATE_PRODUCT, {
 
        name: values.name,
        description: values.description,
        quantity: values.quantity,
    
    })

    console.log('Product created:', data?.createProduct)
    form.reset() 
  } catch (error) {
    console.error('Error creating product:', error)
  }
}

  return (
    <Card className="max-w-lg mx-auto">
      Create your Product
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Set a name for your product..." {...field} />
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
                  <Input placeholder="Set a description for your product..." {...field} />
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
                  <Input  {...field} type='number' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </Card>
  );
};
