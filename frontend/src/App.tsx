
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'
import Publicroutes from './components/Publicroutes'
import Protectedroutes from './components/Protectedroutes'
import SelectRoles from './pages/SelectRoles'
import NavBar from './components/NavBar'
import Account from './pages/Account'
import { useAppdata } from './context/AppContext'
import Restaurants from './pages/Restaurants'
import Restpage from './pages/Restpage'
import Cart from './pages/Cart'
import Address from './pages/Address'
import Checkout from './pages/Checkout'
const App = () => {
  const {user} = useAppdata()
  if(user && user?.role==="seller"){
    return <Restaurants/>
  }
  return (
    <>
    <BrowserRouter>
    <NavBar/>
    <Routes>
      <Route element = {<Publicroutes/>}>
       <Route path='/login' element={<Login/>}/></Route>
      <Route element = {<Protectedroutes/>}>
       <Route path='/' element={<Home/>}/> 
       <Route path='/address' element={<Address/>}/> 
       <Route path='/checkout' element={<Checkout/>}/> 
       <Route path='/restaurant/:id' element={<Restpage/>}/> 
       <Route path='/cart' element={<Cart/>}/> 
       <Route path = 'select-role' element={<SelectRoles/>}></Route>
       <Route path='/account' element={<Account/>}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App