import { useEffect, useState } from "react"
import type { ordertype } from "../Types"
import { useNavigate } from "react-router-dom"
import { useSocket } from "../context/SocketContext"
import axios from "axios"
import { restserviceurl } from "../main"
import {
    ChevronRight,
    Clock3,
    IndianRupee,
    Package,
    ShoppingBag
} from "lucide-react"

const ACTIVE_STATUSES = [
    "placed",
    "accepted",
    "preparing",
    "ready_for_rider",
    "rider-assigned",
    "picked-up"
]

const Orders = () => {
    const [orders, setorders] = useState<ordertype[]>([])
    const [loading, setloading] = useState(false)

    const navigate = useNavigate()
    const { socket } = useSocket()

    // Initial fetch
    const fetchorders = async () => {
        try {
            setloading(true)

            const { data } = await axios.get(
                `${restserviceurl}/api/order/get-all`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            setorders(data.orders || [])
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
    }

    // Silent fetch for realtime updates
    const refreshorders = async () => {
        try {
            const { data } = await axios.get(
                `${restserviceurl}/api/order/get-all`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            setorders(data.orders || [])
        } catch (error) {
            console.log(error)
        }
    }

    // Initial load
    useEffect(() => {
        fetchorders()
    }, [])

    // Realtime updates
    useEffect(() => {
        if (!socket) return

        const onupdated = () => {
            refreshorders()
        }

        socket.on("order:updated", onupdated)

        return () => {
            socket.off("order:updated", onupdated)
        }
    }, [socket])

    if (loading) {
        return (
            <p className="text-center text-gray-500 mt-10">
                Loading your orders...
            </p>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-gray-500">
                    No Orders Yet
                </p>
            </div>
        )
    }

    const activeorders = orders.filter((order) =>
        ACTIVE_STATUSES.includes(order.status)
    )

    const completedorders = orders.filter(
        (order) => !ACTIVE_STATUSES.includes(order.status)
    )

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    My Orders
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Track and view your recent orders
                </p>
            </div>

            {/* Active Orders */}
            <section className="space-y-3">
                <h2 className="text-lg font-semibold">
                    Active Orders
                </h2>

                {activeorders.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No active orders
                    </p>
                ) : (
                    activeorders.map((order) => (
                        <OrderRow
                            key={order._id}
                            order={order}
                            onClick={() =>
                                navigate(`/order/${order._id}`)
                            }
                        />
                    ))
                )}
            </section>

            {/* Completed Orders */}
            <section className="space-y-3">
                <h2 className="text-lg font-semibold">
                    Completed Orders
                </h2>

                {completedorders.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No completed orders
                    </p>
                ) : (
                    completedorders.map((order) => (
                        <OrderRow
                            key={order._id}
                            order={order}
                            onClick={() =>
                                navigate(`/order/${order._id}`)
                            }
                        />
                    ))
                )}
            </section>
        </div>
    )
}

export default Orders


const OrderRow = ({
    order,
    onClick
}: {
    order: ordertype
    onClick: () => void
}) => {

    const itemCount = order.items.reduce(
        (total, item) => total + item.quantity,
        0
    )

    const visibleItems = order.items.slice(0, 2)

    const remainingItems = order.items.length - visibleItems.length

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md"
        >

            {/* Top section */}
            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                    <div className="flex items-center gap-2">
                        <ShoppingBag
                            size={17}
                            className="shrink-0 text-orange-500"
                        />

                        <p className="truncate font-semibold text-gray-900">
                            {order.restname}
                        </p>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                        Order #{order._id.slice(-6).toUpperCase()}
                    </p>

                </div>

                {/* Status */}
                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        ACTIVE_STATUSES.includes(order.status)
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    {order.status.replaceAll("_", " ")}
                </span>

            </div>


            {/* Items */}
            <div className="mt-4 border-t border-gray-100 pt-3">

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Package size={14} />

                    <span>
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                </div>

                <div className="space-y-1">

                    {visibleItems.map((item) => (
                        <div
                            key={item.itemid}
                            className="flex items-center justify-between text-sm"
                        >
                            <div className="flex min-w-0 items-center gap-2">

                                <span className="text-gray-500">
                                    {item.quantity} ×
                                </span>

                                <span className="truncate text-gray-700">
                                    {item.name}
                                </span>

                            </div>

                            <span className="ml-3 shrink-0 text-gray-600">
                                ₹{item.price * item.quantity}
                            </span>
                        </div>
                    ))}

                </div>

                {remainingItems > 0 && (
                    <p className="mt-1 text-xs text-gray-400">
                        + {remainingItems} more{" "}
                        {remainingItems === 1 ? "item" : "items"}
                    </p>
                )}

            </div>


            {/* Bottom section */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">

                <div className="flex items-center gap-4">

                    {/* Total */}
                    <div className="flex items-center gap-1.5">
                        <IndianRupee
                            size={15}
                            className="text-gray-500"
                        />

                        <span className="font-semibold text-gray-900">
                            {order.totalamount}
                        </span>
                    </div>

                    {/* Item count */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock3 size={14} />

                        <span>
                            {order.items.length}{" "}
                            {order.items.length === 1
                                ? "product"
                                : "products"}
                        </span>
                    </div>

                </div>

                <div className="flex items-center gap-1 text-sm text-gray-400 transition group-hover:text-gray-600">

                    <span>
                        View
                    </span>

                    <ChevronRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                    />

                </div>

            </div>

        </div>
    )
}