'use server'

import { prisma } from "@/context";
import { productSchema } from "@/lib/validation/product";
import { createClient } from "@/supabase/client";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: unknown) {
  const result = productSchema.safeParse(formData);
  const supabase = createClient();
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  const imagePath = result.data.image
  try {
    if (imagePath) {
      await prisma.product.create({
        data: { ...result.data, image: supabase.storage.from("test").getPublicUrl(imagePath).data.publicUrl }
      })
    } else {
      await prisma.product.create({
        data: result.data
      })
    }

    revalidatePath('/dashboard/products')
    return { success: true };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      errors: {
        _form: ['Failed to create product.'],
      },
    };
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        quantity: true,
      },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return {
      success: false,
      error: 'Failed to fetch products'
    };
  }
}