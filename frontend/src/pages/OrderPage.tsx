import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { ordertype } from "../Types"
import axios from "axios"
import { restserviceurl } from "../main"
import {
    ArrowLeft,
    Check,
    Clock3,
    MapPin,
    Package,
    Phone,
    Receipt,
    ShoppingBag,
    Bike,
    UserRound,
    Circle
} from "lucide-react"
import { useSocket } from "../context/SocketContext"

const ORDER_STATUSES = [
    "placed",
    "accepted",
    "preparing",
    "ready_for_rider",
    "rider-assigned",
    "picked-up",
    "delivered"
]

const OrderPage = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setloading] = useState(false)
    const [order, setorder] = useState<ordertype | null>(null)
    const {socket} = useSocket()
    useEffect(()=>{
        if(!socket) return 
        const onupdated = ()=>{
            refreshorder()     
        }
        socket.on("order:updated",onupdated)
         socket.on("order:rider_assigned",onupdated)
        return ()=> {
            socket.off("order:updated",onupdated)
            socket.off("order:rider_assigned", onupdated);
        }
    },[socket])

    const fetchsingleorder = async () => {
        if (!id) return
        try {
            setloading(true)
            const { data } = await axios.get(
                `${restserviceurl}/api/order/single/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(data)

            setorder(data || null)

        } catch (error) {
            console.log(error)
            setorder(null)
        } finally {
            setloading(false)
        }
    }
    const refreshorder = async () => {
        if (!id) return
        try {
            const { data } = await axios.get(
                `${restserviceurl}/api/order/single/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(data)

            setorder(data || null)

        } catch (error) {
            console.log(error)
            setorder(null)
        }
    }
    useEffect(() => {
        fetchsingleorder()
    }, [id])
    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <p className="text-gray-500">
                    Loading order...
                </p>
            </div>
        )
    }


    if (!order) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
                <Package
                    size={40}
                    className="text-gray-300"
                />

                <p className="text-gray-500">
                    Order not found
                </p>

                <button
                    onClick={() => navigate("/orders")}
                    className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                    Go back to orders
                </button>
            </div>
        )
    }


    const currentStatusIndex = ORDER_STATUSES.indexOf(order.status)

    const itemCount = order.items.reduce(
        (total, item) => total + item.quantity,
        0
    )


    return (
        <div className="mx-auto max-w-3xl px-4 py-8">

            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-5 flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
            >
                <ArrowLeft size={17} />
                Back to orders
            </button>


            {/* Header */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-start justify-between gap-4">

                    <div>
                        <div className="flex items-center gap-2">
                            <ShoppingBag
                                size={20}
                                className="text-orange-500"
                            />

                            <h1 className="text-xl font-bold text-gray-900">
                                {order.restname}
                            </h1>
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                            Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                    </div>


                    <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                        }`}
                    >
                        {order.status.replaceAll("_", " ")}
                    </span>

                </div>

            </div>


            {/* Order status */}
            <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="mb-5 flex items-center gap-2">
                    <Clock3
                        size={19}
                        className="text-orange-500"
                    />

                    <h2 className="font-semibold text-gray-900">
                        Order Status
                    </h2>
                </div>


                <div className="space-y-4">

                    {ORDER_STATUSES.map((status, index) => {

                        const completed = index <= currentStatusIndex
                        const current = index === currentStatusIndex

                        return (
                            <div
                                key={status}
                                className="flex items-center gap-3"
                            >

                                <div
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                                        completed
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-400"
                                    }`}
                                >
                                    {completed ? (
                                        <Check size={15} />
                                    ) : (
                                        <Circle size={10} />
                                    )}
                                </div>


                                <div className="flex-1">

                                    <p
                                        className={`text-sm ${
                                            current
                                                ? "font-semibold text-gray-900"
                                                : completed
                                                    ? "text-gray-700"
                                                    : "text-gray-400"
                                        }`}
                                    >
                                        {status.replaceAll("_", " ")}
                                    </p>

                                </div>

                                {current && (
                                    <span className="text-xs font-medium text-orange-600">
                                        Current
                                    </span>
                                )}

                            </div>
                        )
                    })}

                </div>

            </section>


            {/* Items */}
            <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="mb-4 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                        <ShoppingBag
                            size={19}
                            className="text-orange-500"
                        />

                        <h2 className="font-semibold text-gray-900">
                            Order Items
                        </h2>
                    </div>

                    <span className="text-sm text-gray-500">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>

                </div>


                <div className="divide-y divide-gray-100">

                    {order.items.map((item) => (

                        <div
                            key={item.itemid}
                            className="flex items-center justify-between py-3"
                        >

                            <div className="flex min-w-0 items-center gap-3">

                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-sm font-semibold text-orange-600">
                                    {item.quantity}×
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-900">
                                        {item.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        ₹{item.price} each
                                    </p>
                                </div>

                            </div>


                            <p className="ml-4 shrink-0 text-sm font-semibold text-gray-900">
                                ₹{item.price * item.quantity}
                            </p>

                        </div>

                    ))}

                </div>

            </section>


            {/* Bill */}
            <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="mb-4 flex items-center gap-2">
                    <Receipt
                        size={19}
                        className="text-orange-500"
                    />

                    <h2 className="font-semibold text-gray-900">
                        Bill Details
                    </h2>
                </div>


                <div className="space-y-3 text-sm">

                    <div className="flex justify-between">
                        <span className="text-gray-500">
                            Subtotal
                        </span>

                        <span className="text-gray-900">
                            ₹{order.subtotal}
                        </span>
                    </div>


                    <div className="flex justify-between">
                        <span className="text-gray-500">
                            Delivery fee
                        </span>

                        <span className="text-gray-900">
                            ₹{order.deliveryfee}
                        </span>
                    </div>


                    <div className="flex justify-between">
                        <span className="text-gray-500">
                            Platform fee
                        </span>

                        <span className="text-gray-900">
                            ₹{order.platformfee}
                        </span>
                    </div>


                    <div className="border-t border-gray-100 pt-3">

                        <div className="flex justify-between">

                            <span className="font-semibold text-gray-900">
                                Total
                            </span>

                            <span className="text-lg font-bold text-gray-900">
                                ₹{order.totalamount}
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* Delivery Address */}
            <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="mb-3 flex items-center gap-2">

                    <MapPin
                        size={19}
                        className="text-orange-500"
                    />

                    <h2 className="font-semibold text-gray-900">
                        Delivery Address
                    </h2>

                </div>


                <p className="text-sm leading-6 text-gray-600">
                    {order.deliveryaddress.formattedAddredd}
                </p>


                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">

                    <Phone size={13} />

                    <span>
                        {order.deliveryaddress.mobileno}
                    </span>

                </div>

            </section>


            {/* Rider */}
            <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="mb-4 flex items-center gap-2">

                    <Bike
                        size={20}
                        className="text-orange-500"
                    />

                    <h2 className="font-semibold text-gray-900">
                        Delivery Partner
                    </h2>

                </div>


                {/* Static rider for now */}
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">

                            <UserRound
                                size={21}
                                className="text-gray-500"
                            />

                        </div>


                        <div>

                            <p className="font-medium text-gray-900">
                                Raj Kumar
                            </p>

                            <p className="text-xs text-gray-500">
                                Delivery Partner
                            </p>

                        </div>

                    </div>


                    <button
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition hover:bg-orange-100"
                        title="Call rider"
                    >
                        <Phone size={16} />
                    </button>

                </div>

            </section>


            {/* Order information */}
            <div className="rounded-xl bg-gray-50 p-4">

                <div className="flex items-center justify-between text-xs text-gray-500">

                    <span>
                        Order ID
                    </span>

                    <span className="font-mono text-gray-700">
                        {order._id}
                    </span>

                </div>

            </div>

        </div>
    )
}

export default OrderPage