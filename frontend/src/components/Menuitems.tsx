import axios from "axios";
import { type menuItems } from "../Types";
import { useState } from "react";
import { restserviceurl } from "../main";
import toast from "react-hot-toast/headless";
import { useAppdata } from "../context/AppContext";
import { BiCartAdd } from "react-icons/bi";

interface Props {
  items: menuItems[];
  onItemdeleted: () => Promise<void>;
  isseller: boolean;
}

const Menuitems = ({
  items,
  onItemdeleted,
  isseller,
}: Props) => {
  const [loadingitemid, setloadingitemid] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) return;

    try {
      setloadingitemid(id);

      const { data } = await axios.delete(
        `${restserviceurl}/api/items/deleteitem/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(data);
      toast.success("Item Deleted Successfully");
      onItemdeleted();
    } catch (error: any) {
      console.log(error);
      toast.error("Deletion Failed");
    } finally {
      setloadingitemid(null);
    }
  };

  const handleAvailability = async (id: string) => {
    try {
      setloadingitemid(id);

      const { data } = await axios.put(
        `${restserviceurl}/api/items/stockstatus/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onItemdeleted();
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setloadingitemid(null);
    }
  };

  // -------------------------
  // USER ACTIONS
  // -------------------------
const {fetchcart} = useAppdata()
 const handleAddToCart = async (item: menuItems) => {
  if (!item.inStock || !item._id) return;

  try {
    setloadingitemid(item._id);

    const { data } = await axios.post(
      `${restserviceurl}/api/cart/add`,
      {
        restid: item.restID,
        itemid: item._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(data);
    toast.success(`${item.name} added to cart`);

    fetchcart();
  } catch (error) {
    console.log(error);
    toast.error("Error while adding");
  } finally {
    setloadingitemid(null);
  }
};

  const handleBuyNow = (item: menuItems) => {
    if (!item.inStock) return;

    console.log("Buy now:", item);

    // Navigate to checkout here
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            No menu items
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Your menu items will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

      {items.map((item) => {
        const isLoading = loadingitemid === item._id;

        return (
          <div
            key={item._id}
            className={`group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 ${
              !item.inStock ? "opacity-80" : ""
            } hover:border-gray-300 hover:shadow-md`}
          >

            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-gray-100">

              <img
                src={item.image}
                alt={item.name}
                className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  !item.inStock ? "grayscale" : ""
                }`}
              />

              {/* Availability */}
              <div className="absolute left-3 top-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium shadow-sm ${
                    item.inStock
                      ? "bg-white text-green-700"
                      : "bg-black/80 text-white"
                  }`}
                >
                  {item.inStock ? "Available" : "Unavailable"}
                </span>
              </div>

            </div>

            {/* Details */}
            <div className="p-4">

              {/* Name + Price */}
              <div className="flex items-start justify-between gap-3">

                <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
                  {item.name}
                </h3>

                <span className="shrink-0 text-base font-semibold text-orange-600">
                  ₹{item.price}
                </span>

              </div>

              {/* Description */}
              <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-gray-500">
                {item.description}
              </p>


              {/* ======================== */}
              {/* SELLER CONTROLS */}
              {/* ======================== */}

              {isseller && (
                <div className="mt-4 border-t border-gray-100 pt-3">

                  <div className="flex items-center justify-between gap-3">

                    {/* Availability */}
                    <button
                      disabled={isLoading}
                      onClick={() =>
                        handleAvailability(item._id)
                      }
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        item.inStock
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >

                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.inStock
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />

                      {item.inStock
                        ? "Mark unavailable"
                        : "Mark available"}

                    </button>


                    {/* Delete */}
                    <button
                      disabled={isLoading}
                      onClick={() =>
                        handleDelete(item._id)
                      }
                      className="rounded-lg px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-red-500" />
                          Processing
                        </span>
                      ) : (
                        "Delete"
                      )}

                    </button>

                  </div>

                </div>
              )}


              {/* ======================== */}
              {/* USER CONTROLS */}
              {/* ======================== */}

              {!isseller && (
                <div className="mt-4 border-t border-gray-100 pt-3">

                  <div className="flex gap-2">

                    {/* Add to cart */}
                   <button

  disabled={!item.inStock || !item._id || isLoading}
  onClick={() => handleAddToCart(item)}
  className={`flex-1 rounded-lg px-3 py-2.5 text-sm justify-center items-center  font-medium transition ${
    item.inStock && item._id
      ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
      : "cursor-not-allowed bg-gray-100 text-gray-400"
  }`}
>
  {!item._id
    ? "Unavailable"
    : !item.inStock
    ? "Unavailable"
    : isLoading
    ? "Adding..."
    : "Add to Cart"}
                   </button> 


                    {/* Buy Now */}
                    <button
                      disabled={!item.inStock}
                      onClick={() =>
                        handleBuyNow(item)
                      }
                      className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        item.inStock
                          ? "bg-[#5c4033] text-white hover:bg-[#493127]"
                          : "cursor-not-allowed bg-gray-200 text-gray-400"
                      }`}
                    >
                      Buy Now
                    </button>

                  </div>

                  <p className="mt-3 text-xs text-gray-400">
                    Added{" "}
                    {new Date(item.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                      }
                    )}
                  </p>

                </div>
              )}

            </div>
          </div>
        );
      })}

    </div>
  );
};

export default Menuitems;