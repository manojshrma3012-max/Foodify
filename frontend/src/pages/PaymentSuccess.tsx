import { useNavigate, useParams } from "react-router-dom";
import { useAppdata } from "../context/AppContext";
import { useEffect } from "react";
import { CheckCircle, ArrowRight, ShoppingBag, Receipt } from "lucide-react";

const PaymentSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchcart } = useAppdata();

  useEffect(() => {
    fetchcart();
  }, []);

  return (
    <div className="min-h-[80vh] bg-gray-50 px-4 py-12 flex items-center justify-center">

      <div className="w-full max-w-lg">

        {/* Success Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg border border-gray-100">

          {/* Top Success Section */}
          <div className="px-6 pt-10 pb-8 text-center">

            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle
                  size={38}
                  strokeWidth={2.5}
                  className="text-green-500"
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Payment Successful!
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Your order has been placed successfully.
              <br />
              We'll start preparing it shortly.
            </p>

          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-200" />

          {/* Payment Details */}
          <div className="px-6 py-6">

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50">
                <Receipt className="h-5 w-5 text-pink-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Payment Details
                </p>

                <p className="text-xs text-gray-500">
                  Transaction information
                </p>
              </div>
            </div>

            {id && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Payment ID
                </p>

                <p className="break-all font-mono text-sm font-medium text-gray-700">
                  {id}
                </p>
              </div>
            )}

          </div>

          {/* Delivery Message */}
          <div className="mx-6 mb-6 rounded-xl bg-pink-50 p-4">
            <div className="flex items-start gap-3">

              <ShoppingBag className="mt-0.5 h-5 w-5 shrink-0 text-pink-600" />

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  What's next?
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-600">
                  Your restaurant will begin preparing your order.
                  You can track your order from the orders section.
                </p>
              </div>

            </div>
          </div>

          {/* Buttons */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Order More */}
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#E23644] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#cc3040] hover:shadow-md active:scale-[0.98]"
              >
                Order More
                <ArrowRight size={17} />
              </button>

              {/* Orders */}
              <button
                onClick={() => navigate("/order")}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-100 active:scale-[0.98]"
              >
                Your Orders
                <ArrowRight size={17} />
              </button>

            </div>

          </div>

        </div>

        {/* Bottom reassurance */}
        <p className="mt-5 text-center text-xs text-gray-400">
          Thank you for ordering with Foodify ❤️
        </p>

      </div>
    </div>
  );
};

export default PaymentSuccess;