import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import type { ordertype } from "../Types";
import { useSocket } from "../context/SocketContext";
import audio from "../assets/sounds/new-order.mp3";
import { restserviceurl } from "../main";
import OrderCard from "../components/OrderCard";

import {
  Bell,
  Package,
  ChefHat,
  CheckCircle,
} from "lucide-react";

const ACTIVE_STATUSES = [
  "placed",
  "accepted",
  "ready_for_rider",
  "preparing",
  "rider-assigned",
  "picked-up",
];

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

const RestaurantOrders = ({ restid }: { restid: string }) => {
  const [orders, setOrders] = useState<ordertype[]>([]);
  const [loading, setLoading] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { socket } = useSocket();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const handleStatusUpdated = (
    orderId: string,
    status: ordertype["status"]
  ) => {
    setOrders(prev =>
        prev.map(order =>
            order._id === orderId
                ? { ...order, status }
                : order
        )
    );
};

  // ---------------------------------------
  // AUDIO SETUP
  // ---------------------------------------

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

    audioRef.current.play().catch((error) => {
      console.log("Failed to play notification:", error);
    });
  };

  // ---------------------------------------
  // FETCH ORDERS
  // ---------------------------------------

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

  // ---------------------------------------
  // SOCKET
  // ---------------------------------------

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

  // ---------------------------------------
  // FILTER
  // ---------------------------------------

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

  // ---------------------------------------
  // COUNTS
  // ---------------------------------------

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

  // ---------------------------------------
  // DATE
  // ---------------------------------------

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ---------------------------------------
  // TOGGLE ORDER
  // ---------------------------------------

  const toggleOrder = (id: string) => {
    setExpandedOrder((previous) =>
      previous === id ? null : id
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">

      {/* HEADER */}
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
              className="flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <Bell size={18} />
              Enable Order Notifications
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              Notifications enabled
            </div>
          )}
        </div>

      </div>

      {/* ERROR */}
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

      {/* STATISTICS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Orders
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Package size={22} />
            </div>

          </div>
        </div>

        {/* NEW */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                New Orders
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {newOrders}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Bell size={22} />
            </div>

          </div>
        </div>

        {/* ACTIVE */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Orders
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {activeOrders}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <ChefHat size={22} />
            </div>

          </div>
        </div>

        {/* COMPLETED */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Completed
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {completedOrders}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <CheckCircle size={22} />
            </div>

          </div>
        </div>

      </div>

      {/* FILTERS */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max gap-2">

          {[
            ["all", `All (${orders.length})`],
            ["active", `Active (${activeOrders})`],
            ["placed", `New (${newOrders})`],
            ["preparing", "Preparing"],
            ["ready_for_rider", "Ready"],
            ["rider-assigned", "Rider Assigned"],
            ["picked-up", "Picked Up"],
            ["delivered", `Delivered (${completedOrders})`],
            ["cancelled", `Cancelled (${cancelledOrders})`],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                setFilter(value as FilterType)
              }
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                filter === value
                  ? "bg-black text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}

        </div>
      </div>

      {/* ORDERS */}
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
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">

          <Package
            size={48}
            className="mx-auto mb-4 text-gray-400"
          />

          <h2 className="text-xl font-semibold text-gray-800">
            No orders found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Orders matching the selected filter will appear here.
          </p>

        </div>
      ) : (
        <div className="space-y-5">

          {filteredOrders.map((order) => (
           <OrderCard
    key={order._id}
    order={order}
    expanded={expandedOrder === order._id}
    onToggle={() => toggleOrder(order._id)}
    formatDate={formatDate}
    onStatusUpdated={(orderId, status) =>
      handleStatusUpdated(orderId, status as ordertype["status"])
    }
/>
          ))}

        </div>
      )}

    </div>
  );
};

export default RestaurantOrders;