import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  return (
    <div className=" bg-[#000000] max-w-sm mx-auto h-screen px-6">
      <Outlet />
    </div>
  );
  // return token && refreshToken ? (
  //   <div className=" bg-[#000000] max-w-sm mx-auto h-screen px-6">
  //     <Outlet />
  //   </div>
  // ) : (
  //   <Navigate to="/auth" state={{ from: location }} replace />
  // );
};

export default RequireAuth;
