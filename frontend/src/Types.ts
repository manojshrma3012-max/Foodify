import type React from "react"

export interface User {
    _id : string,
    name : string,
    email : string,
    image : string,
    role:string
}
export interface Restaurant{
    _id:string,
    name : string,
    image : string,
    ownerId : string,
    PhoneNo : Number,
    description?:string,
    isverified:boolean

    autolocation :{
        type:"Point",
        coordinates : [number,number]
        formattedAddress:string
    }
    isOpen:boolean,
    createdAt:Date
}
export interface LocationData{
    latitude : number,
    longitude : number,
    FormattedAddress : string,
}
export interface AppContext {
    user : User | null,
    isAuth : boolean,
    location : LocationData | null,
    loadingLoc : boolean,
    city : string,
    loading : boolean,
    setUser : React.Dispatch<React.SetStateAction<User | null>>,
    setisAuth : React.Dispatch<React.SetStateAction<boolean>>,
    setLocation : React.Dispatch<React.SetStateAction<LocationData | null>>,
    setloadingLoc : React.Dispatch<React.SetStateAction<boolean>>,
    setCity : React.Dispatch<React.SetStateAction<string>>,
    setloading : React.Dispatch<React.SetStateAction<boolean>>,
    cart : cart[] | []
    fetchcart : ()=>Promise<void>
    subtotal : number,
    quantity : number
}
export interface menuItems {
    _id:string
    restID : string,
    name : string,
    description : string,
    image : string,
    price : number,
    inStock : boolean,
    createdAt:Date,
    updatedAt:Date
}
export interface cart{
    userid : string
    restid : string
    itemid : string
    quantity : number
    createdAt : Date
    updatedAt:Date 
}

export interface ordertype{
_id:string,
  userId: string;
  restid: string;
  restname: string;
  riderId?: string | null;
  riderphoneno: number | null;
  ridername: string | null;
  distance: number;
  rideramount: number;

  items: {
    itemid: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  subtotal: number;
  deliveryfee: number;
  platformfee: number;
  totalamount: number;

  addressid: string;

  deliveryaddress: {
    formattedAddredd: string;
    mobileno: number;
    latitude: number;
    longitude: number;
  };
  status:
    | "placed"
    | "accepted"
    | "preparing"
    | "ready_for_rider"
    | "rider-assigned"
    | "picked-up"
    | "delivered"
    | "cancelled";

  paymentmethod: "razorpay" | "stripe";
  paymentstatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
}
