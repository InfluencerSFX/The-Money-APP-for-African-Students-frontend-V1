import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AxiosType, getMethod, postMethod } from "../api/axios";

const Root = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  useEffect(() => {
    (async () => {
      const data = await getMethod(
        "/auth/credential",
        AxiosType.Yuki,
        token,
        refreshToken
      );
      const credentialOnDevice = localStorage.getItem("credential");
      const credentialOnDeviceParsed = JSON.parse(credentialOnDevice);
      if (!credentialOnDeviceParsed || data.length == 0) {
        navigate("/register-passkey", {
          state: { from: location },
        });
      } else
        navigate("/account", {
          state: { from: location },
        });
    })();
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default Root;
