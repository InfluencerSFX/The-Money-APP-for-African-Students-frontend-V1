import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  // return auth?.authenticated === true ? (
  //   <div className=" bg-[#000000] max-w-sm mx-auto h-screen px-6">
  //     <Outlet />
  //   </div>
  // ) : (
  //   <Navigate to="/" state={{ from: location }} replace />
  // );

  return (
    <div className=" bg-[#000000] max-w-sm mx-auto h-screen px-6">
      <Outlet />
    </div>
  );
};

export default RequireAuth;
