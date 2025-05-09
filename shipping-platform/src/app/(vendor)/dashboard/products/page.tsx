import { ProductsPage } from "@/app/components/vendor/ProductsPage"
import { auth } from "@/auth"

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth()
  console.log("session here", session)
  const filters = (await searchParams)
  console.log(filters)
  console.log(typeof filters)

  return (
    <ProductsPage filters={filters} />
  )
}
