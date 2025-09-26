'use server'

import { auth } from "@/auth";
import { prisma } from "@/context";
import { productSchema } from "@/lib/validation/product";
import { createClient } from "@/supabase/client";
import { User } from "next-auth";
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
  let imagesPath: string[] = []
  result.data.images?.forEach((image) => imagesPath.push(image))
  let product: any
  try {
    product = await prisma.product.create({
      data: { ...result.data, userId: session.user.id }
    })
    if (result.data.images) {
      let imagesURL: string[] = []
      result.data.images.forEach((image) => imagesURL.push(supabase.storage.from("test").getPublicUrl(`product_${product.id}/${image}`).data.publicUrl));
      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: imagesURL
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

export async function getProducts(user: User) {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        quantity: true,
      }, where: { userId: user.id }
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