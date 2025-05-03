'use server'

import { prisma } from "@/context";
import { orderSchema, validateOrderItems } from "@/lib/validation/order";
import { revalidatePath } from "next/cache";

export async function createOrder(formData: unknown) {
    const result = orderSchema.safeParse(formData);

    if (!result.success) {
        console.log(result.error.flatten().fieldErrors);
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
        };
    }

    // Validate product availability
    const validationResult = await validateOrderItems(result.data.orderItems);
    if (!validationResult.isValid) {
        return {
            success: false,
            errors: validationResult.errors,
        };
    }

    try {
        // Start a transaction to ensure both order creation and product updates succeed or fail together
        await prisma.$transaction(async (tx) => {
            // Create the order
            const order = await tx.order.create({
                data: {
                    orderItems: {
                        create: result.data.orderItems.map(item => ({
                            quantity: item.quantity,
                            productId: item.productId,
                        })),
                    },
                },
            });

            // Update product quantities
            for (const item of result.data.orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        quantity: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return order;
        });

        revalidatePath('/dashboard/orders');
        return { success: true };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            errors: {
                _form: ['Failed to create order.'],
            },
        };
    }
} 