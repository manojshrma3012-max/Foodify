
import { useEffect, useState } from "react";
import { useAppdata } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { riderserviceurl } from "../main";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface Rider {
    _id: string;
    phoneNo: string;
    adhaarnumber: string;
    drivingLiscenceNumber: string;
    isverified: boolean;
    isAvailable: boolean;
    image: string;
}

interface RiderForm {
    image: FileList;
    phoneNo: string;
    adhaarnumber: string;
    drivingLiscenceNumber: string;
}

const RiderDashboard = () => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RiderForm>({
        defaultValues: {
            phoneNo: "",
            adhaarnumber: "",
            drivingLiscenceNumber: "",
        },
    });

    const image = watch("image");

    const { location } = useAppdata();
    const { user } = useAppdata();
    const { socket } = useSocket();

    const [profile, setprofile] = useState<Rider | null>(null);
    const [loading, setloading] = useState(true);
    const [toggling, settoggling] = useState(false);

    const fetchprofile = async () => {
        try {
            const { data } = await axios.get(
                `${riderserviceurl}/api/rider/get-rider`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            console.log(data);
            setprofile(data.rider);
        } catch (error) {
            setprofile(null);
        } finally {
            setloading(false);
        }
    };
    const toggleavailability = async () => {
        if (!navigator.geolocation) {
            toast.error("Location access is required");
            return;
        }

        settoggling(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    await axios.patch(
                        `${riderserviceurl}/api/rider/togglestatus`,
                        {
                            isAvailable: !profile?.isAvailable,
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                            },
                        }
                    );

                    const wasAvailable = profile?.isAvailable;

                    await fetchprofile();

                    toast.success(
                        wasAvailable
                            ? "You are Offline Now"
                            : "You are Online Now"
                    );
                } catch (error) {
                    console.log(error);
                    toast.error("Failed to update availability");
                } finally {
                    settoggling(false);
                }
            },
            () => {
                toast.error("Unable to get your location");
                settoggling(false);
            }
        );
    };
    const addRiderprofile = async (data: RiderForm) => {
        console.log("Rider data:", data);

        if (!location) {
            toast.error("Location is required");
            return;
        }

        const formData = new FormData();

        formData.append("adhaarnumber", data.adhaarnumber);
        formData.append(
            "drivingLiscenceNumber",
            data.drivingLiscenceNumber.toUpperCase()
        );
        formData.append("phoneNo", data.phoneNo);

        formData.append("longitude", String(location.longitude));
        formData.append("latitude", String(location.latitude));

        if (data.image && data.image[0]) {
            formData.append("file", data.image[0]);
        }

        try {
            const { data } = await axios.post(
                `${riderserviceurl}/api/rider/addrider`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            console.log(data);
            await fetchprofile();
            toast.success("Profile added successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to add rider profile");
        }
    };

    // =========================
    // Fetch Profile on Mount
    // =========================

    useEffect(() => {
        if (user?.role === "rider") {
            fetchprofile();
        } else {
            setloading(false);
        }
    }, [user]);

    // =========================
    // Non Rider
    // =========================

    if (user?.role !== "rider") {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
                You are not registered as a rider
            </div>
        );
    }

    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-2xl font-bold text-gray-500">
                Loading Rider details...
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Add Your Rider Profile
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Enter your details to create your rider profile.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <form
                            onSubmit={handleSubmit(addRiderprofile)}
                            className="space-y-6"
                        >
                            {/* Rider Name */}

                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-gray-800"
                                >
                                    Rider Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={user.name || ""}
                                    disabled
                                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none"
                                />
                            </div>

                            {/* Phone Number */}

                            <div>
                                <label
                                    htmlFor="phoneNo"
                                    className="mb-2 block text-sm font-medium text-gray-800"
                                >
                                    Phone Number
                                </label>

                                <input
                                    id="phoneNo"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    placeholder="Enter your 10-digit phone number"
                                    {...register("phoneNo", {
                                        required:
                                            "Phone number is required",

                                        pattern: {
                                            value: /^[6-9]\d{9}$/,
                                            message:
                                                "Enter a valid 10-digit Indian phone number",
                                        },
                                    })}
                                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                        errors.phoneNo
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-300 focus:border-red-500 focus:ring-red-100"
                                    }`}
                                />

                                {errors.phoneNo && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {errors.phoneNo.message}
                                    </p>
                                )}
                            </div>

                            {/* Aadhaar Number */}

                            <div>
                                <label
                                    htmlFor="adhaarnumber"
                                    className="mb-2 block text-sm font-medium text-gray-800"
                                >
                                    Aadhaar Number
                                </label>

                                <input
                                    id="adhaarnumber"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={12}
                                    placeholder="Enter your 12-digit Aadhaar number"
                                    {...register("adhaarnumber", {
                                        required:
                                            "Aadhaar number is required",

                                        pattern: {
                                            value: /^[2-9]\d{11}$/,
                                            message:
                                                "Enter a valid 12-digit Aadhaar number",
                                        },
                                    })}
                                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                        errors.adhaarnumber
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-300 focus:border-red-500 focus:ring-red-100"
                                    }`}
                                />

                                {errors.adhaarnumber && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {errors.adhaarnumber.message}
                                    </p>
                                )}

                                <p className="mt-1.5 text-xs text-gray-400">
                                    Enter exactly 12 digits.
                                </p>
                            </div>

                            {/* Driving Licence Number */}

                            <div>
                                <label
                                    htmlFor="drivingLiscenceNumber"
                                    className="mb-2 block text-sm font-medium text-gray-800"
                                >
                                    Driving Licence Number
                                </label>

                                <input
                                    id="drivingLiscenceNumber"
                                    type="text"
                                    maxLength={20}
                                    placeholder="Example: PB0120230012345"
                                    {...register(
                                        "drivingLiscenceNumber",
                                        {
                                            required:
                                                "Driving licence number is required",

                                            setValueAs: (value) =>
                                                value
                                                    .toUpperCase()
                                                    .replace(/[\s-]/g, ""),

                                            validate: (value) => {
                                                const licence =
                                                    String(value)
                                                        .toUpperCase()
                                                        .replace(
                                                            /[\s-]/g,
                                                            ""
                                                        );

                                                /*
                                                 * Common Indian DL format:
                                                 *
                                                 * State code : 2 letters
                                                 * RTO code   : 2 digits
                                                 * Year       : 4 digits
                                                 * Number     : 7 digits
                                                 *
                                                 * Example:
                                                 * PB0120230012345
                                                 *
                                                 * Some states/older licences can
                                                 * have slightly different formats,
                                                 * so we allow 4-5 digits in the
                                                 * middle section.
                                                 */

                                                const dlRegex =
                                                    /^[A-Z]{2}\d{2}\d{4,5}\d{7}$/;

                                                return (
                                                    dlRegex.test(licence) ||
                                                    "Enter a valid driving licence number"
                                                );
                                            },
                                        }
                                    )}
                                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm uppercase text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                        errors.drivingLiscenceNumber
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-300 focus:border-red-500 focus:ring-red-100"
                                    }`}
                                />

                                {errors.drivingLiscenceNumber && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {
                                            errors.drivingLiscenceNumber
                                                .message
                                        }
                                    </p>
                                )}

                                <p className="mt-1.5 text-xs text-gray-400">
                                    Example: PB0120230012345
                                </p>
                            </div>

                            {/* Image */}

                            <div>
                                <label
                                    htmlFor="image"
                                    className="mb-2 block text-sm font-medium text-gray-800"
                                >
                                    Rider Image
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
                                                src={URL.createObjectURL(
                                                    image[0]
                                                )}
                                                alt="Rider preview"
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
                                                Click to upload rider image
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
                                                "Rider image is required",

                                            validate: {
                                                validType: (files) =>
                                                    !files?.length ||
                                                    [
                                                        "image/jpeg",
                                                        "image/png",
                                                    ].includes(
                                                        files[0].type
                                                    ) ||
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
                                        ? "Adding profile..."
                                        : "Add Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900">
                    Rider Dashboard
                </h1>

                <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">
                        Welcome, {user.name}
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Phone: {profile.phoneNo}
                    </p>

                    <div className="mt-4">
                        <span
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                profile.isAvailable
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {profile.isAvailable
                                ? "Online"
                                : "Offline"}
                        </span>
                    </div>

                    <button
                        onClick={toggleavailability}
                        disabled={toggling}
                        className="mt-6 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {toggling
                            ? "Updating..."
                            : profile.isAvailable
                            ? "Go Offline"
                            : "Go Online"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;
