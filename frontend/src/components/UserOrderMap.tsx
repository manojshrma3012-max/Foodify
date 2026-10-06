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
import { useEffect } from "react";
import { MapPin, Navigation, Bike } from "lucide-react";

declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
    function osrmv1(options?: any): any;
  }
}

/* ---------------- RIDER ICON ---------------- */

const riderIcon = L.divIcon({
  html: `
    <div style="
      width:46px;
      height:46px;
      border-radius:50%;
      background:#e23744;
      display:flex;
      align-items:center;
      justify-content:center;
      border:4px solid white;
      box-shadow:0 4px 12px rgba(0,0,0,0.3);
      font-size:24px;
    ">
      🛵
    </div>
  `,
  iconSize: [46, 46],
  iconAnchor: [23, 23],
  popupAnchor: [0, -23],
  className: "",
});

/* ---------------- DELIVERY ICON ---------------- */

const deliveryIcon = L.divIcon({
  html: `
    <div style="
      width:46px;
      height:46px;
      border-radius:50%;
      background:#2563eb;
      display:flex;
      align-items:center;
      justify-content:center;
      border:4px solid white;
      box-shadow:0 4px 12px rgba(0,0,0,0.3);
      font-size:23px;
    ">
      📍
    </div>
  `,
  iconSize: [46, 46],
  iconAnchor: [23, 23],
  popupAnchor: [0, -23],
  className: "",
});

interface props {
  riderloc: [number, number];
  deliveryloc: [number, number];
}

/* ---------------- FIT BOTH LOCATIONS ---------------- */

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
      padding: [70, 70],
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

/* ---------------- MAIN MAP ---------------- */

const UserOrderMap = ({
  riderloc,
  deliveryloc,
}: props) => {
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

            Track Your Order
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your rider is on the way
          </p>
        </div>

        {/* LIVE BADGE */}

        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5">

          <span className="relative flex h-2.5 w-2.5">

            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />

          </span>

          <span className="text-xs font-medium text-green-700">
            Live
          </span>

        </div>

      </div>

      {/* MAP */}

      <div className="relative">

        <MapContainer
          center={riderloc}
          zoom={14}
          scrollWheelZoom={true}
          className="h-[500px] w-full"
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* RIDER */}

          <Marker
            position={riderloc}
            icon={riderIcon}
          >
            <Popup>

              <div className="text-center">

                <div className="text-lg">
                  🛵
                </div>

                <strong>
                  Your Rider
                </strong>

                <p className="mt-1 text-xs text-gray-500">
                  Current location
                </p>

              </div>

            </Popup>
          </Marker>

          {/* DELIVERY LOCATION */}

          <Marker
            position={deliveryloc}
            icon={deliveryIcon}
          >
            <Popup>

              <div className="text-center">

                <div className="text-lg">
                  📍
                </div>

                <strong>
                  Your Location
                </strong>

                <p className="mt-1 text-xs text-gray-500">
                  Delivery destination
                </p>

              </div>

            </Popup>
          </Marker>

          {/* ROUTE */}

          <Routing
            from={riderloc}
            to={deliveryloc}
          />

          {/* FIT BOTH MARKERS */}

          <FitBounds
            rider={riderloc}
            delivery={deliveryloc}
          />

        </MapContainer>

        {/* MAP LEGEND */}

        <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">

          <div className="flex flex-col gap-2">

            <div className="flex items-center gap-2">

              <span className="h-3 w-3 rounded-full bg-red-500" />

              <span className="text-sm text-gray-700">
                Rider
              </span>

            </div>

            <div className="flex items-center gap-2">

              <span className="h-3 w-3 rounded-full bg-blue-500" />

              <span className="text-sm text-gray-700">
                Your location
              </span>

            </div>

          </div>

        </div>

        {/* RIDER LOCATION CARD */}

        <div className="absolute right-4 bottom-4 z-[1000] hidden rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:block">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">

              <Bike
                size={19}
                className="text-red-500"
              />

            </div>

            <div>

              <p className="text-xs text-gray-500">
                Rider
              </p>

              <p className="text-sm font-medium text-gray-900">
                On the way
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UserOrderMap;