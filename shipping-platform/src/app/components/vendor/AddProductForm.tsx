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
    const [imagesURL, setImagesURL] = useState<string[] | undefined>(undefined)
    const [imagesFile, setImagesFile] = useState<File[] | undefined>(undefined)
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            quantity: 0,
        },
    });

    const onSubmit = async (data: ProductSchema) => {

        data.images = imagesURL
        const result = await createProduct(data);
        const supabase = createClient();
        if (result.success && imagesURL && imagesFile) {
            await Promise.all(
                imagesURL.map((imageURL, id) =>
                    supabase.storage
                        .from("test")
                        .upload(`product_${result.productId}/${imageURL}`, imagesFile[id])
                )
            );
        }
        if (!result.success) {
            console.error(result.errors);
            return;
        }

        setIsAddDialogOpen(false)
        setImagesURL(undefined)
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
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Images</FormLabel>
                                    <FormControl>
                                        <Input type="file" id="multiple" accept="image/*" multiple {...field} onChange={(event) => {

                                            if (!event.target.files || event.target.files.length === 0) {
                                                return
                                            }

                                            const files = Array.from(event.target.files);
                                            const previews = files.map((file) => URL.createObjectURL(file));
                                            setPreviewUrls(previews);
                                            // const file = event.target.files[0]
                                            // const fileExt = file.name.split('.').pop()
                                            // const filePath = `test-${Math.random()}.${fileExt}`

                                            // setImagesURL(filePath)
                                            // setImagesFile(file)

                                            const filePaths = files.map((file) => {
                                                const fileExt = file.name.split(".").pop();
                                                return `test-${Math.random()}.${fileExt}`;
                                            });


                                            setImagesFile(files);
                                            setImagesURL(filePaths);

                                        }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {previewUrls.map((url, id) => (
                                <img
                                    key={id}
                                    src={url}
                                    alt={`Preview ${id + 1}`}
                                    className="w-24 h-24 object-cover rounded-md border"
                                />
                            ))}
                        </div>

                        <Button type="submit" className="w-full">
                            Add Product
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
