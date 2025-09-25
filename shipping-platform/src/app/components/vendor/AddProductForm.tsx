"use client";
import { createProduct } from "@/app/actions/product";
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
import { ProductSchema, productSchema } from "@/lib/validation/product";
import { createClient } from "@/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


export const AddProductForm = () => {
    const [imageURL, setImageURL] = useState<string | undefined>(undefined)
    const [imageFile, setImageFile] = useState<File | undefined>(undefined)
    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            quantity: 0,
        },
    });

    const onSubmit = async (data: ProductSchema) => {

        data.image = imageURL
        const result = await createProduct(data);
        const supabase = createClient();
        if (result.success && imageURL && imageFile) { await supabase.storage.from('test').upload(`product_${result.productId}/${imageURL}`, imageFile) }
        if (!result.success) {
            console.error(result.errors);
            return;
        }

        setIsAddDialogOpen(false)
        setImageURL(undefined)
        form.reset();

    };


    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    return (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" id="single" accept="image/*" {...field} onChange={(event) => {

                                            if (!event.target.files || event.target.files.length === 0) {
                                                return
                                            }

                                            const file = event.target.files[0]
                                            const fileExt = file.name.split('.').pop()
                                            const filePath = `test-${Math.random()}.${fileExt}`

                                            setImageURL(filePath)
                                            setImageFile(file)

                                        }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Add Product
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
