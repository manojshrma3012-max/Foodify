
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
       <Route path = 'select-role' element={<SelectRoles/>}></Route>
       <Route path='/account' element={<Account/>}></Route>
      </Route>
      
     
    </Routes>
    <Toaster/>
    </BrowserRouter>
    </>
  )
}

export default App