import { useContext } from "react";
import { AuthContext } from "../context/Context";

const useAuth = () => {
  const { token, refreshToken } = useContext(AuthContext);
  return useContext(AuthContext);
};

export default useAuth;
