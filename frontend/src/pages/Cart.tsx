import { useNavigate } from "react-router-dom";
import { useAppdata } from "../context/AppContext";
import { useState } from "react";
import axios from "axios";
import { restserviceurl } from "../main";
import toast from "react-hot-toast";

const Cart = () => {
  const { cart, subtotal, quantity, fetchcart } = useAppdata();

  const navigate = useNavigate();

  const [loadingitem, setloadingitem] = useState<string | null>(null);
  const [clearingcart, setclearingcart] = useState(false);

  const deliveryfee = subtotal > 250 ? 49 : 0;
  const platformfee = 7;
  const grandtotal = subtotal + deliveryfee + platformfee;

  // Increase quantity
  const increaseQty = async (itemid: string) => {
    try {
      setloadingitem(itemid);

      await axios.put(
        `${restserviceurl}/api/cart/inc`,
        {
          itemid,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchcart();
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    } finally {
      setloadingitem(null);
    }
  };

  // Decrease quantity
  const decreaseQty = async (itemid: string) => {
    try {
      setloadingitem(itemid);

      await axios.put(
        `${restserviceurl}/api/cart/dec`,
        {
          itemid,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchcart();
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    } finally {
      setloadingitem(null);
    }
  };

  // Clear cart
  const clearcart = async () => {
    setclearingcart(true);

    try {
      await axios.delete(`${restserviceurl}/api/cart/clearcart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await fetchcart();

      toast.success("Cart cleared");
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    } finally {
      setclearingcart(false);
    }
  };

  // Empty cart
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f6] px-4 py-10">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-wider text-[#b47b4b]">
              Your Cart
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#2f2925]">
              Shopping Cart
            </h1>
          </div>

          {/* Empty Cart */}
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-[#eee7df] bg-white shadow-sm">

            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#faf3ed]">
              <span className="text-4xl">🛒</span>
            </div>

            <h2 className="text-xl font-bold text-[#3b342f]">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-sm text-center text-sm text-[#81766e]">
              Looks like you haven't added anything to your cart yet.
              Explore restaurants and find something delicious.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 rounded-xl bg-[#5c4033] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#493127]"
            >
              Browse Restaurants
            </button>

          </div>
        </div>
      </div>
    );
  }

  /*
    Since your cart only contains items from one restaurant,
    we can take the restaurant from the first cart item.
  */
  const restaurant: any = cart[0].restid;
  console.log(restaurant)

  return (
    <div className="min-h-screen bg-[#faf9f6] px-4 py-8 md:px-6">

      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex items-end justify-between">

          <div>

            <p className="text-sm font-medium uppercase tracking-wider text-[#b47b4b]">
              Your Cart
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#2f2925]">
              Shopping Cart
            </h1>

            <p className="mt-1 text-sm text-[#81766e]">
              Review your items before checkout
            </p>

          </div>

          {/* Quantity */}
          <div className="hidden rounded-full bg-white px-4 py-2 text-sm font-medium text-[#5c4033] shadow-sm md:block">
            {quantity} {quantity === 1 ? "Item" : "Items"}
          </div>

        </div>


        {/* ================= MAIN LAYOUT ================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">


          {/* ================= LEFT SIDE ================= */}

          <div className="space-y-4 lg:col-span-2">


            {/* ================= RESTAURANT ================= */}

            <div className="rounded-2xl border border-[#eee7df] bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-wide text-[#958b83]">
                    Restaurant
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-[#3b342f]">
                    {restaurant.name}
                  </h2>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    restaurant.isOpen
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {restaurant.isOpen ? "Open" : "Closed"}
                </span>

              </div>

            </div>


            {/* ================= CART ITEMS ================= */}

            {cart.map((cartItem: any) => {

              /*
                cartItem.itemid contains the populated item document.
                Example:

                cartItem.itemid = {
                  _id: "...",
                  name: "Burger",
                  price: 200
                }
              */

              const item = cartItem.itemid;

              const itemId = item._id;

              return (

                <div
                  key={cartItem._id}
                  className="rounded-2xl border border-[#eee7df] bg-white p-4 shadow-sm"
                >

                  <div className="flex gap-4">


                    {/* ================= IMAGE ================= */}

                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl">
                          🍔
                        </div>
                      )}

                    </div>


                    {/* ================= ITEM INFORMATION ================= */}

                    <div className="flex min-w-0 flex-1 flex-col justify-between">


                      {/* Item details */}

                      <div className="flex justify-between gap-3">

                        <div>

                          <h3 className="font-semibold text-[#3b342f]">
                            {item.name}
                          </h3>

                          <p className="mt-1 line-clamp-2 text-sm text-[#81766e]">
                            {item.description}
                          </p>

                        </div>


                        {/* Price */}

                        <p className="shrink-0 font-bold text-[#b47b4b]">
                          ₹{item.price}
                        </p>

                      </div>


                      {/* ================= QUANTITY CONTROLS ================= */}

                      <div className="mt-3 flex items-center justify-between">


                        <div className="flex items-center rounded-lg border border-[#ded5cc]">


                          {/* DECREASE */}

                          <button
                            disabled={loadingitem === itemId}
                            onClick={() => decreaseQty(itemId)}
                            className="px-3 py-1.5 text-[#5c4033] hover:bg-[#faf9f6] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            −
                          </button>


                          {/* QUANTITY */}

                          <span className="border-x border-[#ded5cc] px-4 py-1.5 text-sm font-medium">
                            {loadingitem === itemId
                              ? "..."
                              : cartItem.quantity}
                          </span>


                          {/* INCREASE */}

                          <button
                            disabled={loadingitem === itemId}
                            onClick={() => increaseQty(itemId)}
                            className="px-3 py-1.5 text-[#5c4033] hover:bg-[#faf9f6] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            +
                          </button>

                        </div>


                        {/* REMOVE */}

                        <button
                          className="text-xs font-medium text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              );
            })}


            {/* ================= CLEAR CART ================= */}

            <div className="flex justify-end pt-1">

              <button
                onClick={clearcart}
                disabled={clearingcart}
                className="text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
              >
                {clearingcart ? "Clearing..." : "Clear Cart"}
              </button>

            </div>

          </div>


          {/* ================= ORDER SUMMARY ================= */}

          <div className="lg:col-span-1">

            <div className="sticky top-6 rounded-2xl border border-[#eee7df] bg-white p-6 shadow-sm">


              <h2 className="text-lg font-bold text-[#3b342f]">
                Order Summary
              </h2>


              <div className="mt-5 space-y-3 text-sm">


                {/* Items */}

                <div className="flex justify-between text-[#81766e]">

                  <span>Items</span>

                  <span>{quantity}</span>

                </div>


                {/* Subtotal */}

                <div className="flex justify-between text-[#81766e]">

                  <span>Subtotal</span>

                  <span>₹{subtotal}</span>

                </div>


                {/* Delivery */}

                <div className="flex justify-between text-[#81766e]">

                  <span>Delivery</span>

                  <span>
                    ₹{deliveryfee}
                  </span>

                </div>


                {/* Platform fee */}

                <div className="flex justify-between text-[#81766e]">

                  <span>Platform Fee</span>

                  <span>
                    ₹{platformfee}
                  </span>

                </div>


                {/* Total */}

                <div className="border-t border-[#eee7df] pt-4">

                  <div className="flex justify-between">

                    <span className="font-semibold text-[#3b342f]">
                      Total
                    </span>

                    <span className="text-xl font-bold text-[#5c4033]">
                      ₹{grandtotal}
                    </span>

                  </div>

                </div>

              </div>


              {/* ================= CHECKOUT ================= */}

              <button
              disabled = {!restaurant.isOpen}
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-xl bg-[#5c4033] py-3.5 text-sm font-semibold text-white transition hover:bg-[#493127]"
              >
                {restaurant.isOpen ? "Proceed To Checkout" : "Restaurant is Closed"}
              </button>


              {/* Continue Shopping */}

              <button
                onClick={() => navigate("/")}
                className="mt-3 w-full rounded-xl border border-[#ded5cc] py-3 text-sm font-medium text-[#5c4033] transition hover:bg-[#faf9f6]"
              >
                Continue Shopping
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;