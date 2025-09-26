import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { prisma } from "@/context"
import { format } from "date-fns"
import { Order, OrderItem, Product } from "@prisma/client"
import { AddOrderForm } from "./AddOrderForm"
import { auth } from "@/auth"

type OrderWithItems = Order & {
    orderItems: (OrderItem & {
        product: Product
    })[]
}

export const OrdersPage = async () => {
    const session = await auth();
    const user = session?.user
    const orders = await prisma.order.findMany({
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    }) as OrderWithItems[]

    return (
        <div className="container mx-auto py-6 px-2 sm:px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Orders</h1>
                {user && <AddOrderForm user={user} />}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total Items</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Last Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell className="capitalize">{order.status}</TableCell>
                            <TableCell>
                                {order.orderItems.map((item) =>
                                    `${item.product.name} (${item.quantity})`
                                ).join(", ")}
                            </TableCell>
                            <TableCell>
                                {order.orderItems.reduce((sum: number, item) => sum + item.quantity, 0)}
                            </TableCell>
                            <TableCell>{format(order.createdAt, "MMM d, yyyy hh:mm:ss")}</TableCell>
                            <TableCell>{format(order.updatedAt, "MMM d, yyyy hh:mm:ss")}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    )
}
