
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppdata } from "../context/AppContext";
import { useEffect, useState } from "react";
import type { Restaurant } from "../Types";
import axios from "axios";
import { restserviceurl } from "../main";

const Home = () => {
  const { location } = useAppdata();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") || "";

  const [rests, setrests] = useState<Restaurant[]>([]);
  const [loading, setloading] = useState(true);

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;

    const dlat = ((lat2 - lat1) * Math.PI) / 180;
    const dlon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dlat / 2) * Math.sin(dlat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dlon / 2) *
        Math.sin(dlon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return +(R * c).toFixed(2);
  };

  const fetchrest = async () => {
    if (!location?.latitude || !location.longitude) {
      return;
    }

    try {
      setloading(true);

      const { data } = await axios.get(
        `${restserviceurl}/api/restaurants/all`,
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            search,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(data.rest || []);
      setrests(data.rest || []);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchrest();
  }, [location, search]);

  if (loading || !location) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
          <p className="text-sm font-medium text-gray-500">
            Finding restaurants near you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">

      {/* Page Header */}
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-orange-500">
          Discover delicious food
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Restaurants Near You
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Find the best restaurants around your location
        </p>
      </div>

      {rests.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {rests.map((rest) => {
            const [lng, lat] = rest.autolocation.coordinates;

            const distance = getDistance(
              location.latitude,
              location.longitude,
              lat,
              lng
            );

            return (
              <div
                key={rest._id}
                onClick={() => {
                  if (rest.isOpen) {
                    navigate(`/restaurant/${rest._id}`);
                  }
                }}
                className={`group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 ${
                  rest.isOpen
                    ? "cursor-pointer hover:-translate-y-1 hover:shadow-2xl"
                    : "cursor-not-allowed opacity-65"
                }`}
              >

                {/* Restaurant Image */}
                <div className="relative h-56 overflow-hidden">

                  <img
                    src={rest.image}
                    alt={rest.name}
                    className={`h-full w-full object-cover transition duration-500 ${
                      rest.isOpen
                        ? "group-hover:scale-110"
                        : "grayscale"
                    }`}
                  />

                  {/* Image Gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Open / Closed Badge */}
                  <div
                    className={`absolute left-4 top-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md ${
                      rest.isOpen
                        ? "bg-green-500/90"
                        : "bg-gray-800/90"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        rest.isOpen
                          ? "bg-white"
                          : "bg-gray-400"
                      }`}
                    />

                    {rest.isOpen ? "Open Now" : "Closed"}
                  </div>

                  {/* Distance Badge */}
                  <div className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-md backdrop-blur-sm">
                    📍 {distance} km
                  </div>

                  {/* Closed Overlay */}
                  {!rest.isOpen && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <div className="rounded-xl bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                        Currently Closed
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5">

                  {/* Restaurant Name */}
                  <h2 className="truncate text-xl font-bold text-gray-900">
                    {rest.name}
                  </h2>

                  {/* Description */}
                  {rest.description ? (
                    <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-gray-500">
                      {rest.description}
                    </p>
                  ) : (
                    <p className="mt-2 min-h-[40px] text-sm text-gray-400">
                      Delicious food waiting for you.
                    </p>
                  )}

                  {/* Divider */}
                  <div className="my-4 border-t border-gray-100" />

                  {/* Bottom */}
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs text-gray-400">
                        Distance
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-gray-700">
                        {distance} km away
                      </p>
                    </div>

                    {rest.isOpen ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/restaurant/${rest._id}`);
                        }}
                        className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-orange-600 hover:shadow-md active:scale-95"
                      >
                        View Menu →
                      </button>
                    ) : (
                      <button
                        disabled
                        className="cursor-not-allowed rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-400"
                      >
                        Closed
                      </button>
                    )}

                  </div>
                </div>
              </div>
            );
          })}

        </div>
      ) : (

        /* Empty State */
        <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-gray-50 px-6 text-center">

          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
            🍽️
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            No Restaurants Found
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            We couldn't find any restaurants matching your search nearby.
            Try searching for something else.
          </p>

        </div>
      )}
    </div>
  );
};

export default Home;


