import { prisma } from "@/context"
import Link from "next/link"


export default async function Page({
    params,
}: {
    params: Promise<{ productId: string }>
}) {
    const { productId } = await params
    console.log(productId)
    //   const products = await prisma.product.findMany()

    return <Link href="/dashboard/products">Back to products</Link>
}