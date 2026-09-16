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
    setloading : React.Dispatch<React.SetStateAction<boolean>>
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
// "message": "tiem added successfully",
//     "item": {
//         "restID": "6aa7fe57cdf0cf6dca7c3be8",
//         "name": "Butter Chicken",
//         "image": "https://res.cloudinary.com/gmc51ylf/image/upload/v1789497913/restaurants/hfhxencitzo5cdirlje2.jpg",
//         "description": "Freshly Prepared",
//         "price": 600,
//         "inStock": true,
//         "_id": "6aa9923a0429642d1a39a037",
//         "createdAt": "2026-09-15T18:45:14.297Z",
//         "updatedAt": "2026-09-15T18:45:14.297Z",
//         "__v": 0
//     }
