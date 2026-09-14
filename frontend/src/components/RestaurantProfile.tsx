import React, { useEffect, useState } from "react";
import type { Restaurant } from "../Types";
import axios from "axios";
import { restserviceurl } from "../main";
import toast from "react-hot-toast";

interface RestaurantProfileProps {
  restaurant: Restaurant;
  userRole?: string;
  onUpdate:(rest:Restaurant)=>void
}

const RestaurantProfile = ({
  restaurant,
  userRole,
  onUpdate
}: RestaurantProfileProps) => {
  

  const [name, setName] = useState(restaurant.name);
  const [description, setDescription] = useState(
    restaurant.description || ""
  );
  const [isOpen, setIsOpen] = useState(restaurant.isOpen);


  const [isEditing, setIsEditing] = useState(false);

  const canEdit = userRole === "seller";
  const toggleRest = async ()=>{
    try {
        const {data} = await axios.put(`${restserviceurl}/api/restaurants/status`,{status:!isOpen},{
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        onUpdate(data.restaurant)
        setIsOpen(data.restaurant.isOpen)
    } catch (error) {
        console.log(error)
        
    }
  }


  useEffect(() => {
    setName(restaurant.name);
    setDescription(restaurant.description || "");
    setIsOpen(restaurant.isOpen);
  }, [restaurant]);



  const handleSave = async () => {
    try {
        const {data} = await axios.put(`${restserviceurl}/api/restaurants/update`,{
            name : name,description:description
        },{
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        onUpdate(data.restaurant)
        toast.success("Edited Successfully")
        
    } catch (error) {
        
    }

   
    setIsEditing(false);
  };

  // -----------------------------
  // Cancel editing
  // -----------------------------

  const handleCancel = () => {
    setName(restaurant.name);
    setDescription(restaurant.description || "");
    setIsOpen(restaurant.isOpen);

    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-[#b47b4b] uppercase tracking-wider">
            Restaurant Profile
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#2f2925] mt-2">
            {restaurant.name}
          </h1>

          <p className="text-[#81766e] mt-2">
            Manage your restaurant information
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#eee7df]">

          {/* Restaurant Image */}
          <div className="relative h-[320px] md:h-[400px]">

            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Image Information */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">

              <div className="flex-1">

                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full max-w-xl text-3xl md:text-4xl font-bold text-white bg-transparent border-b-2 border-white/70 outline-none pb-2"
                  />
                ) : (
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {restaurant.name}
                  </h2>
                )}

                <p className="text-white/85 mt-2">
                  📍 {restaurant.autolocation?.formattedAddress}
                </p>
              </div>

              {/* Open / Closed */}
              {isEditing ? (
                <button
                  type="button"
                  onClick={toggleRest}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    isOpen
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {isOpen ? "Open" : "Closed"}
                </button>
              ) : (
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
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

          {/* Content */}
          <div className="p-6 md:p-8">

            {/* Verification + Edit */}
            <div className="flex items-center justify-between mb-8">

              <div>
                <p className="text-sm text-[#958b83]">
                  Verification Status
                </p>

                <div className="flex items-center gap-2 mt-2">

                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      restaurant.isverified
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  />

                  <span className="font-semibold text-[#3b342f]">
                    {restaurant.isverified
                      ? "Verified Restaurant"
                      : "Verification Pending"}
                  </span>

                </div>
              </div>

              {/* Editing buttons */}
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
                        className="px-5 py-2.5 rounded-xl border border-[#ded5cc] text-[#5c4033] font-medium hover:bg-[#faf9f6] transition"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleSave}
                        className="px-5 py-2.5 rounded-xl bg-[#5c4033] text-white font-medium hover:bg-[#493127] transition"
                      >
                        Save Changes
                      </button>
                    </>
                  )}

                </div>
              )}

            </div>

            {/* Description */}
            <div className="border-t border-[#eee7df] pt-6">

              <h3 className="text-lg font-semibold text-[#3b342f]">
                About Restaurant
              </h3>

              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full mt-3 p-4 rounded-xl border border-[#ded5cc] bg-[#faf9f6] text-[#3b342f] outline-none focus:border-[#5c4033] resize-none"
                  placeholder="Describe your restaurant..."
                />
              ) : (
                <p className="text-[#766c65] mt-3 leading-7">
                  {restaurant.description ||
                    "No description has been added yet."}
                </p>
              )}

            </div>

            {/* Restaurant Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

              {/* Phone */}
              <div className="bg-[#faf9f6] rounded-2xl p-5">

                <p className="text-sm text-[#958b83]">
                  Contact Number
                </p>

                <p className="text-[#3b342f] font-semibold mt-2">
                  📞{" "}
                  {restaurant.PhoneNo
                    ? String(restaurant.PhoneNo)
                    : "Not provided"}
                </p>

              </div>

              {/* Location */}
              <div className="bg-[#faf9f6] rounded-2xl p-5">

                <p className="text-sm text-[#958b83]">
                  Location
                </p>

                <p className="text-[#3b342f] font-semibold mt-2">
                  📍{" "}
                  {restaurant.autolocation?.formattedAddress ||
                    "Not available"}
                </p>

              </div>

            </div>

            {/* Coordinates */}
            {restaurant.autolocation?.coordinates && (
              <div className="mt-5 bg-[#faf9f6] rounded-2xl p-5">

                <p className="text-sm text-[#958b83]">
                  Coordinates
                </p>

                <p className="text-[#3b342f] font-medium mt-2">
                  Longitude:{" "}
                  {restaurant.autolocation.coordinates[0]}
                  {"  |  "}
                  Latitude:{" "}
                  {restaurant.autolocation.coordinates[1]}
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