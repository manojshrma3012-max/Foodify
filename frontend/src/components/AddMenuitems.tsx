import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { restserviceurl } from "../main"

const AddMenuitems = ({ onItemAdded }: { onItemAdded: () => void }) => {
    const [name, setname] = useState("")
    const [desciption, setdesciption] = useState("")
    const [price, setprice] = useState("")
    const [image, setimage] = useState<File | null>(null)
    const [loading, setloading] = useState(false)

    const restetform = () => {
        setname("")
        setdesciption("")
        setprice("")
        setimage(null)

        // Reset file input
        const fileInput = document.getElementById(
            "image"
        ) as HTMLInputElement

        if (fileInput) {
            fileInput.value = ""
        }
    }

    const hadlesubmit = async () => {
        if (!name || !image || !price) {
            toast.error("Required Fields")
            return
        }

        const formdata = new FormData()

        formdata.append("name", name)
        formdata.append("file", image)
        formdata.append("description", desciption)
        formdata.append("price", price)

        try {
            setloading(true)

            const { data } = await axios.post(
                `${restserviceurl}/api/items/new`,
                formdata,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )

            console.log(data)

            toast.success("Item Added Successfully")

            onItemAdded()

            restetform()
        } catch (error: any) {
            console.log(error)

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong"
            )
        } finally {
            setloading(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-8">

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Add Menu Item
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Add a new item to your restaurant menu.
                    </p>
                </div>

                <div className="space-y-5">

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Item Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                            placeholder="e.g. Paneer Butter Masala"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={desciption}
                            onChange={(e) => setdesciption(e.target.value)}
                            placeholder="Describe your menu item..."
                            rows={4}
                            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Price
                        </label>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                ₹
                            </span>

                            <input
                                id="price"
                                type="number"
                                min="0"
                                value={price}
                                onChange={(e) => setprice(e.target.value)}
                                placeholder="299"
                                className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    {/* Image */}
                    <div>
                        <label
                            htmlFor="image"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Item Image
                        </label>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 sm:p-6 text-center hover:border-blue-400 transition">
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null
                                    setimage(file)
                                }}
                                className="hidden"
                            />

                            <label
                                htmlFor="image"
                                className="cursor-pointer"
                            >
                                <div className="text-4xl mb-2">
                                    📷
                                </div>

                                <p className="text-sm font-medium text-gray-700">
                                    {image
                                        ? image.name
                                        : "Click to upload an image"}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    PNG, JPG or JPEG
                                </p>
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="button"
                        onClick={hadlesubmit}
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Adding Item...
                            </span>
                        ) : (
                            "Add Menu Item"
                        )}
                    </button>

                </div>
            </div>
        </div>
    )
}

export default AddMenuitems