import { ProductsPage } from "@/app/components/vendor/ProductsPage"

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

  const filters = (await searchParams)
  console.log(filters)
  console.log(typeof filters)

  return (
    <ProductsPage filters={filters} />
  )
}
