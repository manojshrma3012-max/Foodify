import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import type { ordertype } from "../Types";
import { useSocket } from "../context/SocketContext";
import audio from "../assets/sounds/new-order.mp3";
import { restserviceurl } from "../main";


const ACTIVE_STATUSES = [
  "placed",
  "accepted",
  "ready_for_rider",
  "preparing",
  "rider-assigned",
  "picked-up",
];

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


type FilterType =
  | "all"
  | "active"
  | "placed"
  | "accepted"
  | "preparing"
  | "ready_for_rider"
  | "rider-assigned"
  | "picked-up"
  | "delivered"
  | "cancelled";


const RestauranOrders = ({ restid }: { restid: string }) => {
  const [orders, setOrders] = useState<ordertype[]>([]);

  const [loading, setLoading] = useState(false);

  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const [filter, setFilter] = useState<FilterType>("all");

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [error, setError] = useState("");

  const { socket } = useSocket();

  const audioRef = useRef<HTMLAudioElement | null>(null);



  useEffect(() => {

    const newAudio = new Audio(audio);

    newAudio.preload = "auto";

    audioRef.current = newAudio;

    return () => {

      newAudio.pause();

      newAudio.currentTime = 0;

      audioRef.current = null;

    };

  }, []);




  const unlockAudio = async () => {

    if (!audioRef.current) return;

    try {

      await audioRef.current.play();

      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      setAudioUnlocked(true);

      console.log("Order notification sound unlocked");

    } catch (error) {

      console.log("Failed to unlock audio:", error);

    }

  };


  const playNotificationSound = () => {

    if (!audioUnlocked || !audioRef.current) return;

    audioRef.current.currentTime = 0;

    audioRef.current
      .play()
      .catch((error) => {

        console.log("Failed to play notification:", error);

      });

  };


  const fetchOrders = async () => {

    setLoading(true);

    setError("");

    try {

      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${restserviceurl}/api/order/${restid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Orders:", data);

      setOrders(data.orders || []);

    } catch (error) {

      console.log("Failed to fetch orders:", error);

      setError("Unable to load orders. Please try again.");

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    if (!restid) return;

    fetchOrders();

  }, [restid]);

  useEffect(() => {

    if (!socket) return;

    const handleNewOrder = () => {

      console.log("New order received through socket");

      playNotificationSound();

      fetchOrders();

    };


    socket.on("order:new", handleNewOrder);


    return () => {

      socket.off("order:new", handleNewOrder);

    };

  }, [socket, audioUnlocked, restid]);


  const filteredOrders = useMemo(() => {

    if (filter === "all") {

      return orders;

    }


    if (filter === "active") {

      return orders.filter((order) =>
        ACTIVE_STATUSES.includes(order.status)
      );

    }


    return orders.filter(
      (order) => order.status === filter
    );

  }, [orders, filter]);



  const newOrders = orders.filter(
    (order) => order.status === "placed"
  ).length;


  const activeOrders = orders.filter(
    (order) => ACTIVE_STATUSES.includes(order.status)
  ).length;


  const completedOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;


  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  const formatDate = (date: string) => {

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  };


  // ==========================================================
  // TOGGLE ORDER
  // ==========================================================

  const toggleOrder = (id: string) => {

    setExpandedOrder((previous) =>
      previous === id ? null : id
    );

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your restaurant orders
          </p>

        </div>


        <div>

          {!audioUnlocked ? (

            <button
              onClick={unlockAudio}
              className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              🔔 Enable Order Notifications
            </button>

          ) : (

            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">

              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

              Notifications enabled

            </div>

          )}

        </div>

      </div>



      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <span>{error}</span>

          <button
            onClick={fetchOrders}
            className="font-semibold underline"
          >
            Retry
          </button>

        </div>

      )}



      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


        <StatCard
          title="Total Orders"
          value={orders.length}
          icon="📦"
        />


        <StatCard
          title="New Orders"
          value={newOrders}
          icon="🔔"
        />


        <StatCard
          title="Active Orders"
          value={activeOrders}
          icon="🍳"
        />


        <StatCard
          title="Completed"
          value={completedOrders}
          icon="✓"
        />


      </div>



      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="mb-6 overflow-x-auto">

        <div className="flex min-w-max gap-2">


          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All ({orders.length})
          </FilterButton>


          <FilterButton
            active={filter === "active"}
            onClick={() => setFilter("active")}
          >
            Active ({activeOrders})
          </FilterButton>


          <FilterButton
            active={filter === "placed"}
            onClick={() => setFilter("placed")}
          >
            New ({newOrders})
          </FilterButton>


          <FilterButton
            active={filter === "preparing"}
            onClick={() => setFilter("preparing")}
          >
            Preparing
          </FilterButton>


          <FilterButton
            active={filter === "ready_for_rider"}
            onClick={() => setFilter("ready_for_rider")}
          >
            Ready
          </FilterButton>


          <FilterButton
            active={filter === "rider-assigned"}
            onClick={() => setFilter("rider-assigned")}
          >
            Rider Assigned
          </FilterButton>


          <FilterButton
            active={filter === "picked-up"}
            onClick={() => setFilter("picked-up")}
          >
            Picked Up
          </FilterButton>


          <FilterButton
            active={filter === "delivered"}
            onClick={() => setFilter("delivered")}
          >
            Delivered ({completedOrders})
          </FilterButton>


          <FilterButton
            active={filter === "cancelled"}
            onClick={() => setFilter("cancelled")}
          >
            Cancelled ({cancelledOrders})
          </FilterButton>


        </div>

      </div>



      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading ? (

        <div className="flex min-h-[400px] items-center justify-center">

          <div className="flex flex-col items-center gap-3">

            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="text-sm text-gray-500">
              Loading orders...
            </p>

          </div>

        </div>

      ) : filteredOrders.length === 0 ? (


        /* ====================================================
           EMPTY STATE
        ==================================================== */

        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">

          <div className="mb-4 text-5xl">
            📦
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            No orders found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Orders matching the selected filter will appear here.
          </p>

        </div>


      ) : (


        /* ====================================================
           ORDERS
        ==================================================== */

        <div className="space-y-5">

          {filteredOrders.map((order) => (

            <OrderCard
              key={order._id}
              order={order}
              expanded={expandedOrder === order._id}
              onToggle={() => toggleOrder(order._id)}
              formatDate={formatDate}
            />

          ))}

        </div>

      )}

    </div>

  );

};



// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) => {

  return (

    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>

        </div>


        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
          {icon}
        </div>

      </div>

    </div>

  );

};



// ============================================================
// FILTER BUTTON
// ============================================================

const FilterButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {

  return (

    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-black text-white shadow-sm"
          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
      }`}
    >

      {children}

    </button>

  );

};



// ============================================================
// ORDER CARD
// ============================================================

const OrderCard = ({
  order,
  expanded,
  onToggle,
  formatDate,
}: {
  order: ordertype;
  expanded: boolean;
  onToggle: () => void;
  formatDate: (date: string) => string;
}) => {

  const isNew = order.status === "placed";


  return (

    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition ${
        isNew
          ? "border-orange-300 shadow-orange-100"
          : "border-gray-200"
      }`}
    >


      {/* ======================================================
          ORDER HEADER
      ====================================================== */}

      <div className="p-5">


        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


          {/* LEFT */}

          <div className="flex items-start gap-4">


            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
                isNew
                  ? "bg-orange-100"
                  : "bg-gray-100"
              }`}
            >
              📦
            </div>


            <div>

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="font-bold text-gray-900">

                  Order #
                  {order._id
                    .slice(-6)
                    .toUpperCase()}

                </h2>


                <StatusBadge
                  status={order.status}
                />

              </div>


              <p className="mt-1 text-sm text-gray-500">

                {order.createdAt}

              </p>

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
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >

              {expanded
                ? "Hide Details"
                : "View Details"}

            </button>


          </div>


        </div>


      </div>



      {/* ======================================================
          QUICK INFORMATION
      ====================================================== */}

      <div className="grid grid-cols-2 border-t border-gray-100 md:grid-cols-4">


        <InfoBox
          label="Items"
          value={`${order.items.length} items`}
        />


        <InfoBox
          label="Distance"
          value={`${order.distance} km`}
        />


        <InfoBox
          label="Payment"
          value={order.paymentmethod}
        />


        <InfoBox
          label="Payment Status"
          value={order.paymentstatus}
        />


      </div>



      {/* ======================================================
          EXPANDED DETAILS
      ====================================================== */}

      {expanded && (

        <div className="border-t border-gray-200 p-5">


          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">


            {/* ==================================================
                ITEMS
            ================================================== */}

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



            {/* ==================================================
                DELIVERY DETAILS
            ================================================== */}

            <div>

              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Delivery Details
              </h3>


              <div className="rounded-xl border border-gray-200 p-5">


                <div className="mb-5">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Delivery Address
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {order.deliveryaddress.formattedAddredd}
                  </p>

                </div>


                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">


                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Customer Mobile
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {order.deliveryaddress.mobileno}
                    </p>

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



          {/* ==================================================
              RIDER DETAILS
          ================================================== */}

          <div className="mt-7">


            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Rider Details
            </h3>


            {order.riderId ? (


              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">


                <div className="flex items-center gap-4">


                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                    🛵
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

                <div className="text-2xl">
                  🛵
                </div>

                <p className="mt-2 font-medium text-gray-700">
                  No rider assigned
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  A rider has not been assigned to this order yet.
                </p>

              </div>


            )}


          </div>



          {/* ==================================================
              PAYMENT DETAILS
          ================================================== */}

          <div className="mt-7">


            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Payment Details
            </h3>


            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">


              <div className="rounded-xl border border-gray-200 p-4">

                <p className="text-xs text-gray-400">
                  Payment Method
                </p>

                <p className="mt-1 font-semibold capitalize text-gray-800">
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



          {/* ==================================================
              PRICE BREAKDOWN
          ================================================== */}

          <div className="mt-7 flex justify-end">


            <div className="w-full rounded-xl border border-gray-200 p-5 sm:max-w-md">


              <h3 className="mb-4 font-semibold text-gray-900">
                Price Breakdown
              </h3>


              <div className="space-y-3">


                <PriceRow
                  label="Subtotal"
                  value={order.subtotal}
                />


                <PriceRow
                  label="Delivery Fee"
                  value={order.deliveryfee}
                />


                <PriceRow
                  label="Platform Fee"
                  value={order.platformfee}
                />


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

    </div>

  );

};



// ============================================================
// STATUS BADGE
// ============================================================

const StatusBadge = ({
  status,
}: {
  status: string;
}) => {

  const statusStyles: Record<string, string> = {

    placed:
      "bg-orange-100 text-orange-700",

    accepted:
      "bg-blue-100 text-blue-700",

    preparing:
      "bg-yellow-100 text-yellow-700",

    ready_for_rider:
      "bg-purple-100 text-purple-700",

    "rider-assigned":
      "bg-indigo-100 text-indigo-700",

    "picked-up":
      "bg-cyan-100 text-cyan-700",

    delivered:
      "bg-green-100 text-green-700",

    cancelled:
      "bg-red-100 text-red-700",

  };


  return (

    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >

      {STATUS_LABELS[status] || status}

    </span>

  );

};



// ============================================================
// INFO BOX
// ============================================================

const InfoBox = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {

  return (

    <div className="border-r border-gray-100 p-4 last:border-r-0">

      <p className="text-xs font-medium text-gray-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold capitalize text-gray-700">
        {value}
      </p>

    </div>

  );

};



// ============================================================
// PRICE ROW
// ============================================================

const PriceRow = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {

  return (

    <div className="flex items-center justify-between text-sm">

      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-medium text-gray-800">
        ₹{value}
      </span>

    </div>

  );

};


export default RestauranOrders;