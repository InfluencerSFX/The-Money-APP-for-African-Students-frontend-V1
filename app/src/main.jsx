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
import AssetDetail from "./Routes/AssetDetail";
import FundWallet from "./Routes/FundWallet";
import Send from "./Routes/Send";
import Settings from "./Routes/Settings";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <Root />,
      },
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
      {
        path: "/asset",
        element: <AssetDetail />,
      },
      {
        path: "/fund",
        element: <FundWallet />,
      },
      {
        path: "/send",
        element: <Send />,
      },
      {
        path: "/settings",
        element: <Settings />,
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
