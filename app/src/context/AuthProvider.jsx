import { useState } from "react";
import { AuthContext } from "./Context";

const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  return (
    <AuthContext.Provider value={{ token, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
