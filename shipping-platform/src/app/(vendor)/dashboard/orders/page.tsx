import { OrdersPage } from "@/app/components/vendor/OrdersPage"

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const filters = (await searchParams)

    return (
        <OrdersPage  />
    )
}
