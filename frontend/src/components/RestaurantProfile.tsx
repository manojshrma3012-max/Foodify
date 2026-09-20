import { useEffect, useState } from "react";
import type { Restaurant } from "../Types";
import axios from "axios";
import { restserviceurl } from "../main";
import toast from "react-hot-toast";

interface RestaurantProfileProps {
  restaurant: Restaurant;
  userRole?: string;
  onUpdate: (rest: Restaurant) => void;
}

const RestaurantProfile = ({
  restaurant,
  userRole,
  onUpdate,
}: RestaurantProfileProps) => {
  const [name, setName] = useState(restaurant.name);
  const [description, setDescription] = useState(
    restaurant.description || ""
  );
  const [isOpen, setIsOpen] = useState(restaurant.isOpen);

  const [isEditing, setIsEditing] = useState(false);

  const canEdit = userRole === "seller";

  const toggleRest = async () => {
    try {
      const { data } = await axios.put(
        `${restserviceurl}/api/restaurants/status`,
        { status: !isOpen },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onUpdate(data.restaurant);
      setIsOpen(data.restaurant.isOpen);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setName(restaurant.name);
    setDescription(restaurant.description || "");
    setIsOpen(restaurant.isOpen);
  }, [restaurant]);

  const handleSave = async () => {
    try {
      const { data } = await axios.put(
        `${restserviceurl}/api/restaurants/update`,
        {
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onUpdate(data.restaurant);
      toast.success("Edited Successfully");
    } catch (error) {
      console.log(error);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(restaurant.name);
    setDescription(restaurant.description || "");
    setIsOpen(restaurant.isOpen);
    setIsEditing(false);
  };

  return (
    <div className="bg-[#faf9f6] px-4 py-5 md:px-6 md:py-6">
      <div className={`${canEdit ? "max-w-5xl" : "max-w-4xl"} mx-auto`}>

        {/* Header */}
        <div className={`${canEdit ? "mb-8" : "mb-4"}`}>
          <p className="text-xs font-medium text-[#b47b4b] uppercase tracking-wider">
            Restaurant Profile
          </p>

          <h1
            className={`font-bold text-[#2f2925] mt-1 ${
              canEdit
                ? "text-3xl md:text-4xl"
                : "text-2xl md:text-3xl"
            }`}
          >
            {restaurant.name}
          </h1>

          <p className="text-sm text-[#81766e] mt-1">
            {canEdit
              ? "Manage your restaurant information"
              : "Restaurant information"}
          </p>
        </div>

        {/* Restaurant Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#eee7df]">

          {/* Image */}
          <div
            className={`relative ${
              canEdit
                ? "h-[320px] md:h-[400px]"
                : "h-[180px] md:h-[220px]"
            }`}
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Image bottom content */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">

              <div className="min-w-0">

                {isEditing && canEdit ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-2xl md:text-4xl font-bold text-white bg-transparent border-b-2 border-white/70 outline-none pb-1"
                  />
                ) : (
                  <h2
                    className={`font-bold text-white truncate ${
                      canEdit
                        ? "text-3xl md:text-4xl"
                        : "text-2xl md:text-3xl"
                    }`}
                  >
                    {restaurant.name}
                  </h2>
                )}

                <p className="text-white/85 text-xs md:text-sm mt-1 truncate">
                  📍 {restaurant.autolocation?.formattedAddress}
                </p>
              </div>

              {/* Status */}
              {isEditing && canEdit ? (
                <button
                  type="button"
                  onClick={toggleRest}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    isOpen
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {isOpen ? "Open" : "Closed"}
                </button>
              ) : (
                <span
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    restaurant.isOpen
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {restaurant.isOpen ? "Open" : "Closed"}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className={`${canEdit ? "p-6 md:p-8" : "p-4 md:p-5"}`}>

            {/* Verification + Seller controls */}
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs text-[#958b83]">
                  Verification
                </p>

                <div className="flex items-center gap-2 mt-1">

                  <span
                    className={`w-2 h-2 rounded-full ${
                      restaurant.isverified
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  />

                  <span className="text-sm font-semibold text-[#3b342f]">
                    {restaurant.isverified
                      ? "Verified"
                      : "Verification Pending"}
                  </span>

                </div>
              </div>

              {/* Seller only */}
              {canEdit && (
                <div className="flex gap-3">

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 rounded-xl bg-[#5c4033] text-white font-medium hover:bg-[#493127] transition"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancel}
                        className="px-5 py-2.5 rounded-xl border border-[#ded5cc] text-[#5c4033] font-medium"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleSave}
                        className="px-5 py-2.5 rounded-xl bg-[#5c4033] text-white font-medium"
                      >
                        Save Changes
                      </button>
                    </>
                  )}

                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-[#eee7df] mt-4 pt-4">

              <h3 className="text-base font-semibold text-[#3b342f]">
                About Restaurant
              </h3>

              {isEditing && canEdit ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full mt-3 p-4 rounded-xl border border-[#ded5cc] bg-[#faf9f6] text-[#3b342f] outline-none resize-none"
                  placeholder="Describe your restaurant..."
                />
              ) : (
                <p className="text-sm text-[#766c65] mt-1.5 leading-6">
                  {restaurant.description ||
                    "No description has been added yet."}
                </p>
              )}
            </div>

            {/* Contact + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">

              <div className="bg-[#faf9f6] rounded-xl p-3.5">
                <p className="text-xs text-[#958b83]">
                  Contact Number
                </p>

                <p className="text-sm text-[#3b342f] font-semibold mt-1">
                  📞{" "}
                  {restaurant.PhoneNo
                    ? String(restaurant.PhoneNo)
                    : "Not provided"}
                </p>
              </div>

              <div className="bg-[#faf9f6] rounded-xl p-3.5">
                <p className="text-xs text-[#958b83]">
                  Location
                </p>

                <p className="text-sm text-[#3b342f] font-semibold mt-1">
                  📍{" "}
                  {restaurant.autolocation?.formattedAddress ||
                    "Not available"}
                </p>
              </div>

            </div>

            {/* Coordinates */}
            {restaurant.autolocation?.coordinates && (
              <div className="mt-3 bg-[#faf9f6] rounded-xl p-3.5">
                <p className="text-xs text-[#958b83]">
                  Coordinates
                </p>

                <p className="text-xs text-[#3b342f] font-medium mt-1">
                  Longitude: {restaurant.autolocation.coordinates[0]}
                  {"  |  "}
                  Latitude: {restaurant.autolocation.coordinates[1]}
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;