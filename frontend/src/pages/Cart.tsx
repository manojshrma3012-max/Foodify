import { useNavigate } from "react-router-dom";
import { useAppdata } from "../context/AppContext";
import { useState } from "react";

const Cart = () => {
  const { cart, subtotal, quantity, fetchcart } = useAppdata();

  const navigate = useNavigate();

  const [loadingitem, setloadingitem] = useState<string | null>(null);
  const [clearingcart, setclearingcart] = useState(false);

  // Temporary empty cart check
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f6] px-4 py-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-wider text-[#b47b4b]">
              Your Cart
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#2f2925]">
              Shopping Cart
            </h1>
          </div>

          {/* Empty cart */}
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
  const rest = cart[0].restid
  const deliveryfee = subtotal <250 ? 49 : 0
  return (
    <div className="min-h-screen bg-[#faf9f6] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
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


        {/* Main layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">

            {/* Restaurant */}
            <div className="rounded-2xl border border-[#eee7df] bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#958b83]">
                    Restaurant
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-[#3b342f]">
                    Restaurant Name
                  </h2>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  Open
                </span>

              </div>

            </div>


            {/* Item */}
            <div className="rounded-2xl border border-[#eee7df] bg-white p-4 shadow-sm">

              <div className="flex gap-4">

                {/* Image */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <div className="flex h-full items-center justify-center text-3xl">
                    🍔
                  </div>
                </div>


                {/* Information */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">

                  <div className="flex justify-between gap-3">

                    <div>
                      <h3 className="font-semibold text-[#3b342f]">
                        Menu Item
                      </h3>

                      <p className="mt-1 line-clamp-2 text-sm text-[#81766e]">
                        Delicious menu item description goes here.
                      </p>
                    </div>

                    <p className="shrink-0 font-bold text-[#b47b4b]">
                      ₹500
                    </p>

                  </div>


                  {/* Quantity controls */}
                  <div className="mt-3 flex items-center justify-between">

                    <div className="flex items-center rounded-lg border border-[#ded5cc]">

                      <button
                        className="px-3 py-1.5 text-[#5c4033] hover:bg-[#faf9f6]"
                      >
                        −
                      </button>

                      <span className="border-x border-[#ded5cc] px-4 py-1.5 text-sm font-medium">
                        1
                      </span>

                      <button
                        className="px-3 py-1.5 text-[#5c4033] hover:bg-[#faf9f6]"
                      >
                        +
                      </button>

                    </div>

                    <button
                      className="text-xs font-medium text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            </div>


            {/* Another static item */}
            <div className="rounded-2xl border border-[#eee7df] bg-white p-4 shadow-sm">

              <div className="flex gap-4">

                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <div className="flex h-full items-center justify-center text-3xl">
                    🍕
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between">

                  <div className="flex justify-between gap-3">

                    <div>
                      <h3 className="font-semibold text-[#3b342f]">
                        Pizza
                      </h3>

                      <p className="mt-1 text-sm text-[#81766e]">
                        Freshly prepared pizza.
                      </p>
                    </div>

                    <p className="shrink-0 font-bold text-[#b47b4b]">
                      ₹450
                    </p>

                  </div>

                  <div className="mt-3 flex items-center justify-between">

                    <div className="flex items-center rounded-lg border border-[#ded5cc]">

                      <button className="px-3 py-1.5 text-[#5c4033] hover:bg-[#faf9f6]">
                        −
                      </button>

                      <span className="border-x border-[#ded5cc] px-4 py-1.5 text-sm font-medium">
                        2
                      </span>

                      <button className="px-3 py-1.5 text-[#5c4033] hover:bg-[#faf9f6]">
                        +
                      </button>

                    </div>

                    <button className="text-xs font-medium text-red-500 hover:text-red-600">
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            </div>


            {/* Clear cart */}
            <div className="flex justify-end pt-1">

              <button
                disabled={clearingcart}
                className="text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
              >
                {clearingcart ? "Clearing..." : "Clear Cart"}
              </button>

            </div>

          </div>


          {/* Order Summary */}
          <div className="lg:col-span-1">

            <div className="sticky top-6 rounded-2xl border border-[#eee7df] bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-[#3b342f]">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">

                <div className="flex justify-between text-[#81766e]">
                  <span>Items</span>
                  <span>{quantity}</span>
                </div>

                <div className="flex justify-between text-[#81766e]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-[#81766e]">
                  <span>Delivery</span>
                  <span>₹40</span>
                </div>

                <div className="border-t border-[#eee7df] pt-4">

                  <div className="flex justify-between">

                    <span className="font-semibold text-[#3b342f]">
                      Total
                    </span>

                    <span className="text-xl font-bold text-[#5c4033]">
                      ₹{subtotal + 40}
                    </span>

                  </div>

                </div>

              </div>


              {/* Checkout */}
              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-xl bg-[#5c4033] py-3.5 text-sm font-semibold text-white transition hover:bg-[#493127]"
              >
                Proceed to Checkout
              </button>

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