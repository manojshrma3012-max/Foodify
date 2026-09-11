
import { Navigate,Outlet, useLocation } from 'react-router-dom';
import { useAppdata } from '../context/AppContext';
export const Protectedroutes = () => {
  const { isAuth, loading,user } = useAppdata();
  const location = useLocation()

  if(loading){
    return <div>Loading....</div>
  }

  if(!isAuth){
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if(user?.role === null  && location.pathname !== '/select-role'){
    return <Navigate to="/select-role" state={{ from: location }} replace />;
  }
  if(user?.role && location.pathname === '/select-role'){
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />; 
}
export default Protectedroutes;
