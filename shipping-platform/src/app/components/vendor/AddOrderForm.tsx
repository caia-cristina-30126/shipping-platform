"use client";
import { createOrder } from "@/app/actions/order";
import { getProducts } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { orderSchema } from "@/lib/validation/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { auth } from "@/auth";
import { User } from "next-auth";

type Product = {
    id: number;
    name: string;
    quantity: number;
};

interface Props {
    user: User
}

export const AddOrderForm = ({ user }: Props) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof orderSchema>>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            orderItems: [{ productId: undefined, quantity: 1 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "orderItems",
    });

    const onSubmit = async (data: z.infer<typeof orderSchema>) => {
        const result = await createOrder(data);
        console.log("result", result)
        if (!result.success) {
            if (result.errors?.orderItems) {
                toast.error(result.errors?.orderItems);
            } else if (result.errors) {
                // Set form errors
                Object.entries(result.errors).forEach(([field, messages]) => {
                    form.setError(field as any, {
                        type: "manual",
                        message: messages[0],
                    });
                });
            }
            return;
        }

        toast.success("Order created successfully");
        form.reset();
        setIsAddDialogOpen(false);
    };

    // Fetch products when dialog opens using server action
    const handleDialogOpen = async (open: boolean) => {
        setIsAddDialogOpen(open);
        if (open) {
            const result = await getProducts(user);
            if (result.success && result.data) {
                setProducts(result.data);
            } else {
                toast.error("Failed to fetch products");
            }
        } else {
            form.reset();
        }
    };

    return (
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpen}>
            <DialogTrigger asChild>
                <Button>Create Order</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Order</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        {fields.map((field, index) => (
                            <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                                <FormField
                                    control={form.control}
                                    name={`orderItems.${index}.productId`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product</FormLabel>
                                            <Select
                                                onValueChange={(value: string) => field.onChange(Number(value))}
                                                defaultValue={field.value?.toString()}

                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a product" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {products.map((product) => (
                                                        <SelectItem
                                                            key={product.id}
                                                            value={product.id.toString()}
                                                        >
                                                            {product.name} (Available: {product.quantity})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`orderItems.${index}.quantity`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input type="number" min={1} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => remove(index)}
                                >
                                    Remove Item
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ productId: 0, quantity: 1 })}
                        >
                            Add Another Item
                        </Button>
                        <Button type="submit" className="w-full">
                            Create Order
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
