import { useEffect, useState } from "react"
import { useAppdata } from "../context/AppContext"
import axios from "axios"
import { restserviceurl, utilsserviceurl } from "../main"
import { useNavigate } from "react-router-dom"
import type { Restaurant } from "../Types"
import toast from "react-hot-toast"
type IconProps = { className?: string }

import {
  MapPin,
  Plus,
  CheckCircle2,
  CreditCard,
  WalletCards,
  ShoppingBag,
  Bike,
  Receipt,
  Loader2,
  ChevronRight,
  Lock,
  Store,
} from "lucide-react"
interface Address{
  _id:string,
  formattedAddress : string,
  mobile:number
}
const Checkout = () => {
  const {cart,subtotal,quantity} = useAppdata()
  const [loadingaddress, setloadingaddress] = useState(false)
  const [Addresses, setAddresses] = useState<Address[]>([])
  const [selectedaddressid, setselectedaddressid] = useState<string|null>(null)
  const [loading, setloading] = useState(true)
  const [loadingrazorpay, setloadingrazorpay] = useState(false)
  const [stripeloading, setstripeloading] = useState(false)
  const [ordercreaate, setordercreaate] = useState(false)
  useEffect(()=>{
    const fetchaddress = async()=>{
      if(!cart || cart.length==0){
        setloadingaddress(false)
        return
      }
      try {
        setloadingaddress(true)
        const {data} = await axios.get(`${restserviceurl}/api/address/all`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        })
        console.log(data)
        setAddresses(data.address)
        
      } catch (error) {
      console.log(error)
      }finally{
        setloadingaddress(false)
      }

    }
    fetchaddress()
  },[])
  if(!cart || cart.length==0){
    return <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-gray-500 text-lg"> Cart Empty</p>
    </div>
  }
  const navigate = useNavigate()
  const restaurant = cart[0].restid as unknown as Restaurant
  const deliveryfee = subtotal <250 ? 49 : 0
  const platformfee = 7
  const total = subtotal+deliveryfee+platformfee
  const createorder = async(paymethod : "razorpay" | "stripe")=>{
    if(!selectedaddressid) return null
    setordercreaate(true)
    try {
      const {data} = await axios.post(`${restserviceurl}/api/order/create-order`,{
        paymentmethod:paymethod,
        addressid : selectedaddressid,
        distance: 0,
      },{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      })
      return data
      
    } catch (error) { 
      console.log(error)
    }finally{
      setordercreaate(false)
    }
  }
  const paywithrazorpay = async()=>{
    try {
      setloadingrazorpay(true)
      const order = await createorder("razorpay")
      if(!order){
        return 
      }
      const {orderId,amount} = order
      const {data} = await axios.post(`${utilsserviceurl}/api/payment/create`,{
        orderid : orderId
      })
      
      console.log(data)
      const {razorpayid,key} = data
    const options = {
    description: 'Order Payment',
    currency: 'INR',
    key: key,
    amount: amount,
    name: 'Foodify',
    order_id: razorpayid,
    handler:async(response:any)=>{
      console.log(response)
      try {
        await axios.post(`${utilsserviceurl}/api/payment/verify`,{
          razorpayorderid:response.razorpay_order_id,
          razorpaypaymentid:response.razorpay_payment_id,
          razorpay_signature : response.razorpay_signature,
          orderid:orderId
        })
        toast.success("Payment Successfull")
        navigate('/paymentsuccess/'+response.razorpay_payment_id)
      } catch (error) {
        toast.error("payment verification failed")

      }

    },
    theme: {color: '#E23774'}
  }
  const razorpay = new (window as any).Razorpay(options)
  razorpay.open()
    } catch (error) {
      console.log(error)
      toast.error("Payment Failed Refresh Page")
    }finally{
      setloadingrazorpay(false)
    }
  }
  return (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete your order and choose your payment method
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">

        {/* ================= LEFT SIDE ================= */}
        <div className="space-y-6">

          {/* Delivery Address */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50">
                  <MapPin className="h-5 w-5 text-pink-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Delivery Address
                  </h2>
                  <p className="text-xs text-gray-500">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <button
                className="flex items-center gap-1 rounded-lg border border-pink-200 px-3 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-50"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            {loadingaddress ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-pink-600" />
              </div>
            ) : Addresses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-400" />

                <p className="font-medium text-gray-700">
                  No saved addresses
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Add an address to continue with your order.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {Addresses.map((address) => {
                  const selected =
                    selectedaddressid === address._id
                  return (
                    <button
                      key={address._id}
                      onClick={() =>
                        setselectedaddressid(address._id)
                      }
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-pink-500 bg-pink-50/50 ring-1 ring-pink-500"
                          : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected
                              ? "border-pink-600 bg-pink-600"
                              : "border-gray-300"
                          }`}
                        >
                          {selected && (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">
                              Delivery Address
                            </p>
                            {selected && (
                              <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-pink-600">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm leading-5 text-gray-600">
                            {address.formattedAddress}
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            📞 {address.mobile}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Restaurant */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                <Store className="h-5 w-5 text-orange-500" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  {restaurant?.name || "Restaurant"}
                </h2>
                <h2 className="leading-5 mt-1 text-gray-600 text-sm">
                  {restaurant?.autolocation.formattedAddress || "Restaurant"}
                </h2>

                <p className="text-xs text-gray-500">
                  Your order
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {cart.map((item: any, index: number) => (
                <div
                  key={item._id || index}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                      <ShoppingBag className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.itemid?.name || "Food Item"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    ₹{(item.itemid?.price || 0) * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  Payment Method
                </h2>
                <p className="text-xs text-gray-500">
                  Choose how you want to pay
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Razorpay */}
              <button
                disabled={
                  loadingrazorpay ||
                  ordercreaate ||
                  !selectedaddressid
                }
                onClick={paywithrazorpay}
                className="group flex items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:border-pink-500 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Razorpay
                    </p>
                    <p className="text-xs text-gray-500">
                      UPI, Cards & Net Banking
                    </p>
                  </div>
                </div>

                {loadingrazorpay || ordercreaate ? (
                  <Loader2 className="h-5 w-5 animate-spin text-pink-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400 transition group-hover:text-pink-600" />
                )}
              </button>

              {/* Stripe */}
              <button
                disabled={!selectedaddressid}
                onClick={async () => {
                  const order = await createorder("stripe")
                  console.log(order)
                }}
                className="group flex items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:border-pink-500 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
                    <WalletCards className="h-5 w-5 text-purple-600" />
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">
                      Stripe
                    </p>

                    <p className="text-xs text-gray-500">
                      Secure card payment
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-gray-400 transition group-hover:text-pink-600" />
              </button>

            </div>

            {!selectedaddressid && (
              <p className="mt-3 text-center text-xs text-red-500">
                Please select a delivery address before paying.
              </p>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock className="h-3.5 w-3.5" />
              Secure and encrypted payment
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="lg:sticky lg:top-6 lg:h-fit">

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">

            {/* Summary Header */}
            <div className="border-b border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50">
                  <Receipt className="h-5 w-5 text-pink-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Order Summary
                  </h2>
                  <p className="text-xs text-gray-500">
                    {quantity} {quantity === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bill */}
            <div className="p-5">

              <div className="space-y-4 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Item total
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹{subtotal}
                  </span>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Bike className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">
                      Delivery fee
                    </span>
                  </div>

                  {deliveryfee === 0 ? (
                    <span className="font-medium text-green-600">
                      FREE
                    </span>
                  ) : (
                    <span className="font-medium text-gray-800">
                      ₹{deliveryfee}
                    </span>
                  )}
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Platform fee
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹{platformfee}
                  </span>
                </div>
              </div>
              <div className="my-5 border-t border-dashed border-gray-200" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    To Pay
                  </p>

                  <p className="text-xs text-gray-400">
                    Inclusive of all charges
                  </p>
                </div>

                <p className="text-xl font-bold text-gray-900">
                  ₹{total}
                </p>
              </div>

              {/* Delivery info */}
              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <div className="flex gap-3">
                  <Bike className="mt-0.5 h-5 w-5 shrink-0 text-pink-600" />

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Fast delivery
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your food will be delivered to your selected
                      address once the order is confirmed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Lock className="h-3.5 w-3.5" />
                Safe & secure checkout
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
)
}

export default Checkout