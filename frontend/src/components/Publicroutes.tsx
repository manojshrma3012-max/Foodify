
import { Navigate,Outlet } from 'react-router-dom';
import { useAppdata } from '../context/AppContext';

const Publicroutes = () => {
  const { isAuth, loading } = useAppdata();
  console.log(isAuth,loading)

  if(loading){
    return <div>Loading....</div>
  }
  if(isAuth){
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default Publicroutes;