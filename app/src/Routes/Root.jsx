import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AxiosType, getMethod, postMethod } from "../api/axios";

const Root = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  useEffect(() => {
    (async () => {
      const user = await getMethod(
        "/auth/me",
        AxiosType.Yuki,
        token,
        refreshToken
      );
      await postMethod(
        "/auth/user",
        { ...user, userId: user.id },
        AxiosType.Main,
        token,
        refreshToken
      );
    })();
  }, []);

  return (
    <div className=" bg-[#000000] max-w-sm mx-auto h-screen px-6">
      <Outlet />
    </div>
  );
};

export default Root;
