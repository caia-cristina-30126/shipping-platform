'use server'

import { auth } from "@/auth";
import { prisma } from "@/context";
import { productSchema } from "@/lib/validation/product";
import { createClient } from "@/supabase/client";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: unknown) {
  const session = await auth();

  if (!session?.user?.id) {
    throw Error("User id is undefined")
  }

  const result = productSchema.safeParse(formData);
  const supabase = createClient();
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  const imagePath = result.data.image
  let product
  try {
    product = await prisma.product.create({
      data: { ...result.data, userId: session.user.id }
    })
    if (imagePath) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          image: supabase.storage.from("test").getPublicUrl(`product_${product.id}/${imagePath}`).data.publicUrl
        },
      })
    }

    revalidatePath('/dashboard/products')
    return {
      success: true,
      productId: product.id
    };
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