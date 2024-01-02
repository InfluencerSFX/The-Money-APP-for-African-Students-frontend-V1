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
    <>
      <Outlet />
    </>
  );
};

export default Root;
