export interface User {
    _id : string,
    name : string,
    email : string,
    image : string,
    role:string
}
export interface Restaurant{
    restId:string,
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
    setloading : React.Dispatch<React.SetStateAction<boolean>>
}