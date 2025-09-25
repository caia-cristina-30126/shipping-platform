import { CustomCard } from "@/app/components/ui/common/CustomCard";
import { prisma } from "@/context";
import Link from "next/link";
import { SearchInput } from "../search/SearchInput";
import { AddProductForm } from "./AddProductForm";
import { auth } from "@/auth";

type Product = {
  id: string;
  name: string;
  quantity: number;
  description?: string;
};

type CreateProductResponse = {
  createProduct: {
    id: string;
    name: string;
    description?: string;
    quantity: number;
  };
};

interface Props {
  filters: {
    [key: string]: string | string[] | undefined;
  };
}

export const ProductsPage = async ({ filters }: Props) => {
  const session = await auth();
  const products = await prisma.product.findMany({
    where: { name: { contains: filters.q as string }, userId: session?.user?.id },
  });
  console.log("user id", session)
  console.log("products", products)

  return (
    <div className="container mx-auto py-6 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <AddProductForm />
      </div>

      <div className="mb-4">
        <SearchInput />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products?.map((product) => (
          <CustomCard
            key={product.id}
            title={product.name}
            description={product.description || "No description available"}
            className="hover:shadow-lg transition-shadow"
            titleClassName="text-lg"
            footer={
              <Link href={`/dashboard/products/${product.id}`}>Details</Link>
            }
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Quantity:</span>
              <span className="font-semibold">{product.quantity}</span>
              {product.image && <img src={product.image} alt={product.name} width={70}
                height={70} />}

            </div>
          </CustomCard>
        ))}
        {products?.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
