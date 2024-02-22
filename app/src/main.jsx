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
import WithdrawToWallet from "./Routes/WithrawToWallet";
import WithdrawFromWallet from "./Routes/WithdrawFromWallet";
import Settings from "./Routes/Settings";
import KYC from "./Routes/KYC";
import CollectKYC from "./Routes/CollectKYC";
import PayTuition from "./Routes/PayTuition";
import ConfirmTransaction from "./Routes/ConfirmTransaction";
import ErrorPage from "./Routes/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
    errorElement: <ErrorPage />,
  },
  {
    element: <RequireAuth />,
    errorElement: <ErrorPage />,
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
        path: "/send/",
        element: <Send />,
      },
      {
        path: "withdraw-to-wallet",
        element: <WithdrawToWallet />,
      },
      { path: "withdraw-from-wallet", element: <WithdrawFromWallet /> },
      {
        path: "/KYC",
        element: <KYC />,
      },
      {
        path: "/collect-kyc",
        element: <CollectKYC />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/pay-tuition",
        element: <PayTuition />,
      },
      {
        path: "/confirm-transaction",
        element: <ConfirmTransaction />,
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
