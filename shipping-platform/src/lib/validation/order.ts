import { z } from 'zod';

export const orderItemSchema = z.object({
    productId: z.number(),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
});

export const orderSchema = z.object({
    orderItems: z.array(orderItemSchema).min(1, 'At least one item is required'),
});

export type OrderSchema = z.infer<typeof orderSchema>;
export type OrderItemSchema = z.infer<typeof orderItemSchema>;

// Function to validate order items against available product quantities
export async function validateOrderItems(items: OrderItemSchema[]) {
    const { prisma } = await import('@/context');
    
    // Get all product IDs from the order items
    const productIds = items.map(item => item.productId);
    
    // Fetch the products with their current quantities
    const products = await prisma.product.findMany({
        where: {
            id: { in: productIds }
        },
        select: {
            id: true,
            name: true,
            quantity: true
        }
    });

    // Create a map of product quantities for easy lookup
    const productQuantities = new Map(
        products.map(product => [product.id, product.quantity])
    );

    // Validate each order item
    const errors: Record<string, string[]> = {};
    
    items.forEach((item, index) => {
        const availableQuantity = productQuantities.get(item.productId);
        if (availableQuantity === undefined) {
            errors[`orderItems.${index}.productId`] = ['Product not found'];
        } else if (item.quantity > availableQuantity) {
            const product = products.find(p => p.id === item.productId);
            errors[`orderItems.${index}.quantity`] = [
                `Only ${availableQuantity} ${product?.name} available`
            ];
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
} 