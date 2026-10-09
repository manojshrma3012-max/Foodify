
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { adminserviceurl } from "../main";
import AdminRestcar from "../components/AdminRestcar";
import AdminRiderCard from "../components/AdminRiderCard";

const Admin = () => {
  const [rests, setrests] = useState<any[]>([]);
  const [riders, setriders] = useState<any[]>([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState("");
  const [tabs, settabs] = useState<"restaurant" | "rider">("restaurant");
  const [search, setsearch] = useState("");

  const fetchdata = useCallback(async () => {
    try {
      seterror("");

      const token = localStorage.getItem("token");

      const [data1, data2] = await Promise.all([
        axios.get(`${adminserviceurl}/admin/rest/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${adminserviceurl}/admin/rider/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setrests(data1.data.restaurant ?? []);
      setriders(data2.data.riders ?? []);
    } catch (error) {
      console.error(error);
      seterror("Unable to load verification requests. Please try again.");
    } finally {
      setloading(false);
    }
  }, []);

  useEffect(() => {
    fetchdata();
  }, [fetchdata]);

  const activeItems = tabs === "restaurant" ? rests : riders;

  const filteredItems = activeItems.filter((item) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    const searchableText =
      tabs === "restaurant"
        ? `${item.name ?? ""} ${item.PhoneNo ?? ""} ${
            item.autolocation?.formattedAddress ?? ""
          } ${item._id ?? ""}`
        : `${item.phoneNo ?? ""} ${item._id ?? ""}`;

    return searchableText.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
        <p className="text-sm font-medium text-gray-600">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

        {/* Dashboard Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Verification Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Review and approve restaurant and rider registrations.
            </p>
          </div>

          <button
            onClick={() => {
              setloading(true);
              fetchdata();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h5M20 20v-5h-5M5.6 9A7 7 0 0118 6l2 3M18.4 15A7 7 0 016 18l-2-3"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M8 10h1m6 0h1m-8 3h1m6 0h1"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Restaurants
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {rests.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21v-2a8 8 0 0116 0v2M19 8h3m-1.5-1.5v3"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Riders
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {riders.length}
              </p>
            </div>
          </div>
        </div>

        {/* Main Verification Section */}
        <div className="space-y-6">

          {/* Tabs */}
          <div className="flex flex-col gap-4 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-6">
              <button
                onClick={() => {
                  settabs("restaurant");
                  setsearch("");
                }}
                className={`relative flex items-center gap-2 pb-4 text-sm font-semibold transition ${
                  tabs === "restaurant"
                    ? "text-green-700"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Restaurants

                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    tabs === "restaurant"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {rests.length}
                </span>

                {tabs === "restaurant" && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-green-600" />
                )}
              </button>

              <button
                onClick={() => {
                  settabs("rider");
                  setsearch("");
                }}
                className={`relative flex items-center gap-2 pb-4 text-sm font-semibold transition ${
                  tabs === "rider"
                    ? "text-green-700"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Riders

                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    tabs === "rider"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {riders.length}
                </span>

                {tabs === "rider" && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-green-600" />
                )}
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3 sm:w-80">
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  strokeWidth="1.8"
                />
                <path
                  strokeLinecap="round"
                  strokeWidth="1.8"
                  d="m16 16 4 4"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                placeholder={
                  tabs === "restaurant"
                    ? "Search name, phone or address..."
                    : "Search rider phone or ID..."
                }
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>

          {/* Section Heading */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {tabs === "restaurant"
                  ? "Restaurant Requests"
                  : "Rider Requests"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredItems.length} request
                {filteredItems.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-red-700">{error}</p>

              <button
                onClick={() => {
                  setloading(true);
                  fetchdata();
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {!error && (
            <>
              {filteredItems.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    {search
                      ? "No matching requests"
                      : "All caught up!"}
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                    {search
                      ? "Try a different search term."
                      : `There are no pending ${
                          tabs === "restaurant"
                            ? "restaurant"
                            : "rider"
                        } verifications right now.`}
                  </p>

                  {search && (
                    <button
                      onClick={() => setsearch("")}
                      className="mt-4 text-sm font-semibold text-green-700 hover:text-green-800"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {tabs === "restaurant"
                    ? filteredItems.map((restaurant) => (
                        <AdminRestcar
                          key={restaurant._id}
                          restaurant={restaurant}
                          onverify={fetchdata}
                        />
                      ))
                    : filteredItems.map((rider) => (
                        <AdminRiderCard
                          key={rider._id}
                          rider={rider}
                          onverify={fetchdata}
                        />
                      ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
