import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AuthenLayout = () => {
  const location = useLocation();
  return true ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default AuthenLayout;
