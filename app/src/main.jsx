import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./Routes/Root";
import Auth from "./Routes/Auth";
import RequireAuth from "./Components/RequireAuth";
import AuthProvider from "./context/AuthProvider";
import RegisterPasskey from "./Routes/RegisterPasskey";
import BackupFound from "./Routes/BackupFound";
import SecureWallet from "./Routes/SecureWallet";
import ConnectWallet from "./Routes/ConnectWallet";
import Dashboard from "./Routes/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/secure-wallet",
        element: <SecureWallet />,
      },
      {
        path: "/register-passkey",
        element: <RegisterPasskey />,
      },
      {
        path: "/connect-wallet",
        element: <ConnectWallet />,
      },
      {
        path: "/backup",
        element: <BackupFound />,
      },
      {
        path: "/account",
        element: <Dashboard />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
