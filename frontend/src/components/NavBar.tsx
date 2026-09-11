import { Link, useLocation, useSearchParams } from "react-router-dom"
import { useAppdata } from "../context/AppContext"
import { useEffect, useState } from "react"
import { CgShoppingCart } from "react-icons/cg"
import { BiMapPin, BiSearch } from "react-icons/bi"


const NavBar = () => {
    const {isAuth,city} = useAppdata()
    const Location = useLocation()
    const isHome = Location.pathname ==='/'
     const [SearchParams, setSearchParams] = useSearchParams()
     const [Search, setSearch] = useState(SearchParams.get("search")||"")
     useEffect(() => {
    const timer = setTimeout(() => {
        if (Search) {
            setSearchParams({ search: Search })
        } else {
            setSearchParams({})
        }
    }, 400)

    return () => clearTimeout(timer)
}, [Search, setSearchParams])

  return (
    <div className="w-full bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link to ={'/'} className="text-2xl font-bold text-[#E23744] cursor-pointer">Foodify</Link>
            <div className="flex justify center gap-4">
                <Link to={'/cart'} className="relative"><CgShoppingCart className="h-6 w-6  "/>
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-900 text-xs font-semibold text-white">0</span>
                </Link>
                {
                    isAuth ? <Link to={'/account'} className="font-medium text-[#E23744]">Account</Link> : <Link to={'/login'} className="font-medium text-[#E23744]">Account</Link>
                }
            </div>
        </div>
        {
            isHome && <div className="border-t px-4 py-5">
                <div className="mx-auto flex max-w-7xl items-center rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 px-4 py-5 border-r text-gray-700">
                        <BiMapPin className="h-4 w-4 text-[#E23744]"/>
                        <span className="text-sm truncate max-w-35 ">{city}</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2 px-3 ">
                        <BiSearch className="h-4 w-4 text-gray-200"/>
                        <input type="text" placeholder="Search Restaurants" value={Search} onChange={(e)=>setSearch(e.target.value)} className="w-full px-4 py-5 text-sm outline-none "/>
                    </div>
                </div>
            </div>
        }

    </div>
  )
}

export default NavBar