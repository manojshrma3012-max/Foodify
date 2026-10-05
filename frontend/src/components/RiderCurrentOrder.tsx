
import axios from "axios"
import type { ordertype } from "../Types"
import { riderserviceurl } from "../main"
import toast from "react-hot-toast"
import {
    MapPin,
    Phone,
    Store,
    Package,
    IndianRupee,
    CheckCircle2,
    Navigation,
} from "lucide-react"

interface Props {
    order: ordertype
    onstatusupdate: () => void
}

const RiderCurrentOrder = ({
    order,
    onstatusupdate,
}: Props) => {

    const updatestatus = async () => {
        try {
            await axios.put(
                `${riderserviceurl}/api/rider/update-order/${order._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )

            toast.success("Order Updated")
            onstatusupdate()
        } catch (error) {
            console.log(error)
            toast.error("Failed to update order")
        }
    }

    const statusText = order.status
        .replaceAll("_", " ")
        .replace("-", " ")

    const isPickupStage = order.status === "rider-assigned"
    const isDeliveryStage = order.status === "picked-up"

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                        <Package size={20} />
                    </div>

                    <div>
                        <h2 className="font-bold text-gray-900">
                            Current Order
                        </h2>

                        <p className="text-xs text-gray-500">
                            #{order._id.slice(-6).toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* Status */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-blue-600">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    {statusText}
                </span>
            </div>


            {/* Route */}
            <div className="space-y-4 px-5 py-5">

                {/* Pickup */}
                <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Store size={18} />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Pick-up
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                            {order.restname}
                        </p>
                    </div>
                </div>


                {/* Connecting line */}
                <div className="ml-[17px] h-5 border-l-2 border-dashed border-gray-200" />


                {/* Delivery */}
                <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <MapPin size={18} />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Drop-off
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-5 text-gray-900">
                            {order.deliveryaddress.formattedAddredd}
                        </p>
                    </div>
                </div>

            </div>


            {/* Customer contact */}
            {order.deliveryaddress.mobileno && (
                <div className="mx-5 mb-4 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Customer
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                            {order.deliveryaddress.mobileno}
                        </p>
                    </div>

                    <a
                        href={`tel:${order.deliveryaddress.mobileno}`}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Phone size={16} />
                        Call
                    </a>

                </div>
            )}


            {/* Earnings */}
            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 px-5 py-4">

                <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-400">
                        Order Total
                    </p>

                    <div className="mt-1 flex items-center gap-1 font-bold text-gray-900">
                        <IndianRupee size={15} />
                        {order.totalamount}
                    </div>
                </div>


                <div className="rounded-xl bg-green-50 p-3">
                    <p className="text-xs font-medium text-green-600">
                        Your Earnings
                    </p>

                    <div className="mt-1 flex items-center gap-1 font-bold text-green-700">
                        <IndianRupee size={15} />
                        {order.rideramount}
                    </div>
                </div>

            </div>


            {/* Action */}
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">

                {isPickupStage && (
                    <button
                        type="button"
                        onClick={updatestatus}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-yellow-600 active:scale-[0.98]"
                    >
                        <Navigation size={18} />
                        Reached Restaurant
                    </button>
                )}

                {isDeliveryStage && (
                    <button
                        type="button"
                        onClick={updatestatus}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.98]"
                    >
                        <CheckCircle2 size={18} />
                        Mark as Delivered
                    </button>
                )}

            </div>

        </div>
    )
}

export default RiderCurrentOrder
