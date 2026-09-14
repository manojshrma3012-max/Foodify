
import { useForm } from "react-hook-form";
import { useAppdata } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { restserviceurl } from "../main";

interface RestaurantForm {
    name: string;
    image: FileList;
    PhoneNo: number;
    description?: string;
}

const AddRestaurant = () => {
    const { loadingLoc, location } = useAppdata();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RestaurantForm>({
        defaultValues: {
            name: "",
            PhoneNo: undefined,
            description: "",
        },
    });

    // Get selected image
    const image = watch("image");

    const addRestaurant = async (data: RestaurantForm) => {
        console.log("Restaurant data:", data);

        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("file", data.image[0]);
        formData.append("phone", String(data.PhoneNo));
        formData.append("description", data.description ?? "");

        // Location
        formData.append(
            "longitude",
            String(location?.longitude ?? "")
        );

        formData.append(
            "latitude",
            String(location?.latitude ?? "")
        );

        formData.append(
            "formattedaddress",
            String(location?.FormattedAddress ?? "")
        );

        try {
            const { data } = await axios.post(
                `${restserviceurl}/api/restaurants/addnew`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            console.log(data);

            toast.success("Restaurant added successfully");

            reset();
        } catch (error) {
            console.log(error);
            toast.error("Error while adding restaurant");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-2xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Add your restaurant
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Tell customers about your restaurant and make it easy
                        for them to discover you.
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    <form
                        onSubmit={handleSubmit(addRestaurant)}
                        className="space-y-6"
                    >

                        {/* Restaurant Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-gray-800"
                            >
                                Restaurant name
                            </label>

                            <input
                                id="name"
                                type="text"
                                placeholder="e.g. The Food House"
                                {...register("name", {
                                    required: "Restaurant name is required",
                                    minLength: {
                                        value: 3,
                                        message:
                                            "Restaurant name must be at least 3 characters",
                                    },
                                    maxLength: {
                                        value: 100,
                                        message:
                                            "Restaurant name cannot exceed 100 characters",
                                    },
                                })}
                                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                    errors.name
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-300 focus:border-red-500 focus:ring-red-100"
                                }`}
                            />

                            {errors.name && (
                                <p className="mt-1.5 text-sm text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>


                        {/* Phone Number */}
                        <div>
                            <label
                                htmlFor="PhoneNo"
                                className="mb-2 block text-sm font-medium text-gray-800"
                            >
                                Phone number
                            </label>

                            <input
                                id="PhoneNo"
                                type="tel"
                                placeholder="Enter restaurant phone number"
                                {...register("PhoneNo", {
                                    required: "Phone number is required",

                                    setValueAs: (value) =>
                                        value === ""
                                            ? undefined
                                            : Number(value),

                                    validate: (value) =>
                                        /^[6-9]\d{9}$/.test(String(value)) ||
                                        "Enter a valid 10-digit phone number",
                                })}
                                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                    errors.PhoneNo
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-300 focus:border-red-500 focus:ring-red-100"
                                }`}
                            />

                            {errors.PhoneNo && (
                                <p className="mt-1.5 text-sm text-red-500">
                                    {errors.PhoneNo.message}
                                </p>
                            )}
                        </div>


                        {/* Image */}
                        <div>
                            <label
                                htmlFor="image"
                                className="mb-2 block text-sm font-medium text-gray-800"
                            >
                                Restaurant image
                            </label>

                            <label
                                htmlFor="image"
                                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition ${
                                    errors.image
                                        ? "border-red-400 bg-red-50"
                                        : "border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50"
                                }`}
                            >

                                {/* Image Preview */}
                                {image?.length > 0 ? (
                                    <>
                                        <img
                                            src={URL.createObjectURL(image[0])}
                                            alt="Restaurant preview"
                                            className="mb-4 h-48 w-full rounded-xl object-cover"
                                        />

                                        <p className="text-sm font-medium text-gray-700">
                                            {image[0].name}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Click to change image
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
                                            📷
                                        </div>

                                        <p className="text-sm font-medium text-gray-700">
                                            Click to upload restaurant image
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            PNG, JPG or JPEG
                                        </p>
                                    </>
                                )}

                                <input
                                    id="image"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    className="hidden"
                                    {...register("image", {
                                        required:
                                            "Restaurant image is required",

                                        validate: {
                                            validType: (files) =>
                                                !files?.length ||
                                                [
                                                    "image/jpeg",
                                                    "image/png",
                                                ].includes(files[0].type) ||
                                                "Only JPG and PNG images are allowed",

                                            validSize: (files) =>
                                                !files?.length ||
                                                files[0].size <=
                                                    5 * 1024 * 1024 ||
                                                "Image must be smaller than 5MB",
                                        },
                                    })}
                                />
                            </label>

                            {errors.image && (
                                <p className="mt-1.5 text-sm text-red-500">
                                    {errors.image.message}
                                </p>
                            )}
                        </div>


                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-gray-800"
                            >
                                Description

                                <span className="ml-1 font-normal text-gray-400">
                                    (optional)
                                </span>
                            </label>

                            <textarea
                                id="description"
                                rows={4}
                                placeholder="Tell customers a little about your restaurant..."
                                {...register("description", {
                                    maxLength: {
                                        value: 500,
                                        message:
                                            "Description cannot exceed 500 characters",
                                    },
                                })}
                                className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                    errors.description
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-300 focus:border-red-500 focus:ring-red-100"
                                }`}
                            />

                            {errors.description && (
                                <p className="mt-1.5 text-sm text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>


                        {/* Location */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-800">
                                Restaurant location
                            </label>

                            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                                    📍
                                </div>

                                <div className="min-w-0">
                                    {loadingLoc ? (
                                        <p className="text-sm text-gray-500">
                                            Fetching your location...
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Your location
                                            </p>

                                            <p className="mt-0.5 truncate text-sm font-medium text-gray-800">
                                                {typeof location === "string"
                                                    ? location
                                                    : location?.FormattedAddress ||
                                                      "Location unavailable"}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* Buttons */}
                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() => reset()}
                                className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-[0.98]"
                            >
                                Reset
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting
                                    ? "Adding restaurant..."
                                    : "Add restaurant"}
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddRestaurant;
