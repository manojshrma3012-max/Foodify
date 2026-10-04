import axios from "axios";
import type { ordertype } from "../Types";

import {
  Package,
  MapPin,
  Phone,
  Bike,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { restserviceurl } from "../main";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const STATUS_LABELS: Record<string, string> = {
  placed: "New Order",
  accepted: "Accepted",
  preparing: "Preparing",
  ready_for_rider: "Ready for Rider",
  "rider-assigned": "Rider Assigned",
  "picked-up": "Picked Up",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

interface OrderCardProps {
    order: ordertype;
    expanded: boolean;
    onToggle: () => void;
    formatDate: (date: string) => string;
    onStatusUpdated: (orderId: string, status: string) => void;
}

const OrderCard = ({
  order,
  expanded,
  onToggle,
  formatDate,
  onStatusUpdated

}: OrderCardProps) => {

  const isNew = order.status === "placed";

  const [loading, setloading] = useState(false)
  const [retryvisible, setretryvisible] = useState(false)
  useEffect(()=>{
    if(order.status!=="ready_for_rider"){
      setretryvisible(false)
      return 
    }
    const timer = setTimeout(()=>{
      setretryvisible(true)
  },10000)
  return ()=>{
    clearTimeout(timer)
  }
  },[order.status])

  const updateOrderStatus = async (status: string) => {
    try {
      setretryvisible(false)
        setloading(true)
        const {data} = await axios.put(`${restserviceurl}/api/order/update/${order._id}`,{
            status:status
        },{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        toast.success("Order Updated")
        onStatusUpdated(order._id,status)
        console.log(data)
    } catch (error) {
        console.log(error) 
    }finally{
        setloading(true) 
    }

    // TODO:
    // Implement API call here
  };

  const statusStyles: Record<string, string> = {
    placed: "bg-orange-100 text-orange-700",
    accepted: "bg-blue-100 text-blue-700",
    preparing: "bg-yellow-100 text-yellow-700",
    ready_for_rider: "bg-purple-100 text-purple-700",
    "rider-assigned": "bg-indigo-100 text-indigo-700",
    "picked-up": "bg-cyan-100 text-cyan-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition ${
        isNew
          ? "border-orange-300 shadow-orange-100"
          : "border-gray-200"
      }`}
    >

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}
          <div className="flex items-start gap-4">

            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isNew
                  ? "bg-orange-100"
                  : "bg-gray-100"
              }`}
            >
              <Package
                size={23}
                className={
                  isNew
                    ? "text-orange-600"
                    : "text-gray-600"
                }
              />
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="font-bold text-gray-900">
                  Order #
                  {order._id
                    .slice(-6)
                    .toUpperCase()}
                </h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    statusStyles[order.status] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {STATUS_LABELS[order.status] ||
                    order.status}
                </span>

              </div>

              <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <Clock size={14} />
                {formatDate(order.createdAt)}
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-between gap-6 lg:justify-end">

            <div className="text-right">

              <p className="text-xs text-gray-400">
                Order Total
              </p>

              <p className="text-xl font-bold text-gray-900">
                ₹{order.totalamount}
              </p>

            </div>

            <button
              onClick={onToggle}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              {expanded
                ? "Hide Details"
                : "View Details"}

              {expanded ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

          </div>

        </div>

      </div>

      {/* =========================================
          QUICK INFORMATION
      ========================================= */}

      <div className="grid grid-cols-2 border-t border-gray-100 md:grid-cols-4">

        <div className="border-r border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-400">
            Items
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-700">
            {order.items.length} items
          </p>
        </div>

        <div className="border-r border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-400">
            Distance
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-700">
            {order.distance} km
          </p>
        </div>

        <div className="border-r border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-400">
            Payment
          </p>

          <p className="mt-1 text-sm font-semibold capitalize text-gray-700">
            {order.paymentmethod}
          </p>
        </div>

        <div className="p-4">
          <p className="text-xs font-medium text-gray-400">
            Payment Status
          </p>

          <p
            className={`mt-1 text-sm font-semibold capitalize ${
              order.paymentstatus === "paid"
                ? "text-green-600"
                : "text-orange-600"
            }`}
          >
            {order.paymentstatus}
          </p>
        </div>

      </div>

      {/* =========================================
          EXPANDED DETAILS
      ========================================= */}

      {expanded && (
        <div className="border-t border-gray-200 p-5">

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* =====================================
                ORDER ITEMS
            ===================================== */}

            <div>

              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Order Items
              </h3>

              <div className="overflow-hidden rounded-xl border border-gray-200">

                {order.items.map((item, index) => (

                  <div
                    key={item.itemid}
                    className={`flex items-center justify-between p-4 ${
                      index !== order.items.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold">
                        {item.quantity}x
                      </div>

                      <div>

                        <p className="font-medium text-gray-800">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          ₹{item.price} each
                        </p>

                      </div>

                    </div>

                    <p className="font-semibold text-gray-900">
                      ₹{item.price * item.quantity}
                    </p>

                  </div>

                ))}

              </div>

            </div>

            {/* =====================================
                DELIVERY DETAILS
            ===================================== */}

            <div>

              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Delivery Details
              </h3>

              <div className="rounded-xl border border-gray-200 p-5">

                <div className="mb-5 flex gap-3">

                  <MapPin
                    size={20}
                    className="mt-1 shrink-0 text-gray-500"
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Delivery Address
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      {order.deliveryaddress.formattedAddredd}
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div className="flex gap-2">
                    <Phone
                      size={17}
                      className="mt-1 text-gray-400"
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Customer Mobile
                      </p>

                      <p className="mt-1 font-medium text-gray-800">
                        {order.deliveryaddress.mobileno}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Distance
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {order.distance} km
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Latitude
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {order.deliveryaddress.latitude}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Longitude
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {order.deliveryaddress.longitude}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =====================================
              SELLER STATUS CONTROL
          ===================================== */}

          {[
            "placed",
            "accepted",
            "preparing",
            "ready_for_rider",
          ].includes(order.status) && (

            <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50 p-5">

              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Update Order Status
              </h3>

              <div className="flex flex-wrap gap-3">

                {order.status === "placed" && (
                  <button
                    onClick={() =>
                      updateOrderStatus("accepted")
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Accept Order
                  </button>
                )}

                {order.status === "accepted" && (
                  <button
                    onClick={() =>
                      updateOrderStatus("preparing")
                    }
                    className="rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-yellow-600"
                  >
                    Start Preparing
                  </button>
                )}

                {order.status === "preparing" && (
                  <button
                    onClick={() =>
                      updateOrderStatus("ready_for_rider")
                    }
                    className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    Ready for Rider
                  </button>
                )}

                {order.status === "ready_for_rider" && (
                  <div className="rounded-lg bg-green-100 px-4 py-2.5 text-sm font-semibold text-green-700">
                    Ready for Rider
                  </div>
                )}

              </div>

            </div>
          )}

          {/* =====================================
              RIDER DETAILS
          ===================================== */}

          <div className="mt-7">

            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Rider Details
            </h3>

            {order.riderId ? (

              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Bike size={22} />
                  </div>

                  <div>

                    <p className="font-semibold text-gray-900">
                      {order.ridername}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.riderphoneno}
                    </p>

                  </div>

                </div>

                <div>

                  <p className="text-xs text-gray-400">
                    Rider Earnings
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    ₹{order.rideramount}
                  </p>

                </div>

              </div>

            ) : (

              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center">

                <Bike
                  size={28}
                  className="mx-auto text-gray-400"
                />

                <p className="mt-2 font-medium text-gray-700">
                  No rider assigned
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  A rider has not been assigned to this order yet.
                </p>

              </div>

            )}

          </div>

          {/* =====================================
              PAYMENT DETAILS
          ===================================== */}

          <div className="mt-7">

            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Payment Details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-gray-200 p-4">

                <div className="flex items-center gap-2">
                  <CreditCard
                    size={16}
                    className="text-gray-400"
                  />

                  <p className="text-xs text-gray-400">
                    Payment Method
                  </p>
                </div>

                <p className="mt-2 font-semibold capitalize text-gray-800">
                  {order.paymentmethod}
                </p>

              </div>

              <div className="rounded-xl border border-gray-200 p-4">

                <p className="text-xs text-gray-400">
                  Payment Status
                </p>

                <p
                  className={`mt-1 font-semibold capitalize ${
                    order.paymentstatus === "paid"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {order.paymentstatus}
                </p>

              </div>

              <div className="rounded-xl border border-gray-200 p-4">

                <p className="text-xs text-gray-400">
                  Order Status
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {STATUS_LABELS[order.status] ||
                    order.status}
                </p>

              </div>

            </div>

          </div>

          {/* =====================================
              PRICE BREAKDOWN
          ===================================== */}

          <div className="mt-7 flex justify-end">

            <div className="w-full rounded-xl border border-gray-200 p-5 sm:max-w-md">

              <h3 className="mb-4 font-semibold text-gray-900">
                Price Breakdown
              </h3>

              <div className="space-y-3">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹{order.subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Delivery Fee
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹{order.deliveryfee}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Platform Fee
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹{order.platformfee}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">

                  <div className="flex items-center justify-between">

                    <span className="font-bold text-gray-900">
                      Total
                    </span>

                    <span className="text-xl font-bold text-gray-900">
                      ₹{order.totalamount}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {order.status==="ready_for_rider" && retryvisible && 
      <div className="pt-2">
        <button className="w-full rounded-lg border border-[#e23744] py-2 text-xs font-semibold text-[#e23744] hover:bg-red-50 disabled:opacity-50"
        onClick={()=>updateOrderStatus("ready_for_rider")}>Retry Ready For rider</button>
      </div>}

    </div>
  );
};

export default OrderCard;