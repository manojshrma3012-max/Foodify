import type { ordertype } from "../Types";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import axios from "axios";
import { serviceurl, socketserviceurl } from "../main";
import { Navigation, MapPin } from "lucide-react";

declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
    function osrmv1(options?: any): any;
  }
}

/* ---------------- MARKERS ---------------- */

const riderIcon = L.divIcon({
  html: `
    <div style="
      width:42px;
      height:42px;
      border-radius:50%;
      background:#e23744;
      display:flex;
      align-items:center;
      justify-content:center;
      border:4px solid white;
      box-shadow:0 3px 10px rgba(0,0,0,0.25);
      font-size:22px;
    ">
      🛵
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -20],
  className: "",
});

const deliveryIcon = L.divIcon({
  html: `
    <div style="
      width:42px;
      height:42px;
      border-radius:50%;
      background:#2563eb;
      display:flex;
      align-items:center;
      justify-content:center;
      border:4px solid white;
      box-shadow:0 3px 10px rgba(0,0,0,0.25);
      font-size:22px;
    ">
      📍
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -20],
  className: "",
});

/* ---------------- FIT MAP ---------------- */

const FitBounds = ({
  rider,
  delivery,
}: {
  rider: [number, number];
  delivery: [number, number];
}) => {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([
      rider,
      delivery,
    ]);

    map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 15,
    });
  }, [map, rider, delivery]);

  return null;
};

/* ---------------- ROUTING ---------------- */

const Routing = ({
  from,
  to,
}: {
  from: [number, number];
  to: [number, number];
}) => {
  const map = useMap();

  useEffect(() => {
    const control = L.Routing.control({
      waypoints: [
        L.latLng(from[0], from[1]),
        L.latLng(to[0], to[1]),
      ],

      lineOptions: {
        styles: [
          {
            color: "#e23744",
            weight: 6,
            opacity: 0.85,
          },
        ],
      },

      addWaypoints: false,
      draggableWaypoints: false,

      createMarker: () => null,

      show: false,

      router: L.Routing.osrmv1({
        serviceUrl:
          "https://router.project-osrm.org/route/v1",
      }),
    }).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map, from, to]);

  return null;
};

/* ---------------- MAIN COMPONENT ---------------- */

interface props {
  order: ordertype;
}

const RiderOrderMap = ({ order }: props) => {
  const [riderLocation, setRiderLocation] =
    useState<[number, number] | null>(null);

  if (
    order.deliveryaddress.latitude == null ||
    order.deliveryaddress.longitude == null
  ) {
    return null;
  }

  const deliveryLocation: [number, number] = [
    order.deliveryaddress.latitude,
    order.deliveryaddress.longitude,
  ];

  /* ---------------- GET RIDER LOCATION ---------------- */

  useEffect(() => {
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;

          setRiderLocation([
            latitude,
            longitude,
          ]);

          axios.post(
            `${socketserviceurl}/api/v1/internal/emit`,
            {
              event: "rider:location",
              room: `user:${order.userId}`,
              payload: {
                latitude,
                longitude,
              },
            },
            {
              headers: {
                "x-internal-key":
                  import.meta.env.VITE_INTERNAL_SERVICE_KEY,
              },
            }
          );
        },
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,
        }
      );
    };

    fetchLocation();

    const interval = setInterval(
      fetchLocation,
      10000
    );

    return () => {
      clearInterval(interval);
    };
  }, [order.userId]);

  if (!riderLocation) {
    return (
      <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />

          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-3 w-48 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">

      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Navigation
              size={20}
              className="text-red-500"
            />

            Delivery Route
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your current location to the customer's location
          </p>
        </div>

        <div className="hidden items-center gap-4 sm:flex">

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            You
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            Delivery
          </div>

        </div>

      </div>

      {/* MAP */}

      <div className="relative">

        <MapContainer
          center={riderLocation}
          zoom={14}
          scrollWheelZoom={true}
          zoomControl={true}
          className="h-[500px] w-full"
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Rider */}

          <Marker
            position={riderLocation}
            icon={riderIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>You</strong>
                <br />
                Rider location
              </div>
            </Popup>
          </Marker>

          {/* Delivery */}

          <Marker
            position={deliveryLocation}
            icon={deliveryIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>Delivery Location</strong>
                <br />
                Customer address
              </div>
            </Popup>
          </Marker>

          {/* Route */}

          <Routing
            from={riderLocation}
            to={deliveryLocation}
          />

          {/* Automatically show both markers */}

          <FitBounds
            rider={riderLocation}
            delivery={deliveryLocation}
          />

        </MapContainer>

        {/* DELIVERY LABEL */}

        <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <MapPin
                size={19}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Deliver to
              </p>

              <p className="max-w-[220px] truncate text-sm font-medium text-gray-900">
                {order.deliveryaddress.formattedAddredd}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default RiderOrderMap;