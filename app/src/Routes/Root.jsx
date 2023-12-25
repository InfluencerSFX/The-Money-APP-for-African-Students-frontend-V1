import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getMethod } from "../api/axios";

const Root = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  useEffect(() => {
    (async () => {
      await getMethod("/auth/me", true, token, refreshToken);
    })();
  }, []);

  return (
    <div className=" bg-[#000000] max-w-sm mx-auto h-screen px-6">
      <Outlet />
    </div>
  );
};

export default Root;
