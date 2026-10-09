
import axios from "axios";
import { useState } from "react";
import { adminserviceurl } from "../main";
import toast from "react-hot-toast";

const AdminRestcar = ({
  restaurant,
  onverify,
}: {
  restaurant: any;
  onverify: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    try {
      setLoading(true);

      await axios.patch(
        `${adminserviceurl}/admin/verify/rest/${restaurant._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Restaurant verified successfully");
      onverify();
    } catch (error) {
      toast.error("Failed to verify restaurant");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Restaurant Image */}
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name || "Restaurant"}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />

        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Pending Verification
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">

        {/* Restaurant Details */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Restaurant Profile
          </p>

          <h3 className="mt-1 break-words text-xl font-bold text-gray-900">
            {restaurant.name || "Unnamed Restaurant"}
          </h3>

          <p className="mt-2 text-xs text-gray-500">
            Restaurant ID
          </p>

          <p className="break-all text-sm font-medium text-gray-700">
            {restaurant._id}
          </p>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-900">
            Contact & Location
          </h4>

          {/* Phone */}
          <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M3 5a2 2 0 012-2h3l2 5-2 1.5a11 11 0 005.5 5.5L15 13l5 2v3a2 2 0 01-2 2C10 20 4 14 3 6V5z"
                />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">
                Phone Number
              </p>

              <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                {restaurant.PhoneNo || "Not provided"}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
                />
                <circle
                  cx="12"
                  cy="9"
                  r="2.5"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">
                Restaurant Address
              </p>

              <p className="mt-1 text-sm font-medium leading-relaxed text-gray-800">
                {restaurant.autolocation?.formattedAddress ||
                  "Address not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Verification Button */}
        <button
          onClick={verify}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Verifying...
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Verify Restaurant
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminRestcar;
