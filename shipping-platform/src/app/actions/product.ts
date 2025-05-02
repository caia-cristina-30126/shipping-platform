'use server'

import { prisma } from "@/context";
import { productSchema } from "@/lib/validation/product";
import { revalidatePath } from "next/cache";

export async function createProduct( formData: unknown){
 const result = productSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

   try {
    await prisma.product.create({
        data: result.data
    })
    revalidatePath('/dashboard/products')
     return { success: true };
   } catch  (e){
console.error(e);
    return {
      success: false,
      errors: {
        _form: ['Failed to create product.'],
      },
    };
   }
}