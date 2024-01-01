import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AxiosType, getMethod, postMethod } from "../api/axios";

const Root = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <div className=" bg-[#000000] max-w-sm mx-auto h-screen px-6">
      <Outlet />
    </div>
  );
};

export default Root;
