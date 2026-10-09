
import axios from "axios";
import { adminserviceurl } from "../main";
import toast from "react-hot-toast";
import { useState } from "react";

const AdminRiderCard = ({
  rider,
  onverify,
}: {
  rider: any;
  onverify: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    try {
      setLoading(true);

      await axios.patch(
        `${adminserviceurl}/admin/verify/rider/${rider._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Rider verified successfully");
      onverify();
    } catch (error) {
      toast.error("Failed to verify rider");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
            Rider Verification
          </p>
          <h3 className="mt-1 text-lg font-bold text-gray-900">
            Rider Profile
          </h3>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Pending
        </span>
      </div>

      <div className="space-y-5 p-5">
        {/* Rider profile */}
        <div className="flex items-center gap-4">
          <img
            src={rider.image}
            alt="Rider profile"
            className="h-20 w-20 shrink-0 rounded-xl border border-gray-200 object-cover"
          />

          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500">
              Rider ID
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-gray-900">
              {rider._id}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              {rider.phoneNo || "Phone number unavailable"}
            </p>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h4 className="mb-3 text-sm font-bold text-gray-900">
            Identity & Documents
          </h4>

          <div className="space-y-3">
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
                    d="M12 11a3 3 0 100-6 3 3 0 000 6zM5 20v-1a7 7 0 0114 0v1H5z"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Aadhaar Number</p>
                <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                  {rider.adhaarnumber || "Not provided"}
                </p>
              </div>
            </div>

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
                    d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-9 0h10a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2zm3 5h4m-4 3h4"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">
                  Driving License Number
                </p>
                <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                  {rider.drivingLiscenseNumber || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verify button */}
        <button
          disabled={loading}
          onClick={verify}
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
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
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
              Verify Rider
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminRiderCard;