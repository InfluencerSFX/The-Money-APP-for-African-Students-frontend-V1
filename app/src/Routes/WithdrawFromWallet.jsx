import React, { useEffect, useState } from "react";
import { AxiosType, getMethod, postMethod } from "../api/axios";
import { paramsToObject } from "../utils/utilityFunctions";
import { env } from "../utils/env";

const WithdrawFromWallet = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const searchParams = new URLSearchParams(document.location.search);
  const partner = searchParams.get("partner");
  const [userDetails, setUser] = useState(null);

  async function paychantWithdraw(user) {
    const wallet = user?.wallets?.find(
      (w) => w.blockchain === "BSC" && w.asset.includes("USDT")
    );
    const url = await postMethod(
      "/wallet/paychant-fund?assetAmount=10",
      {},
      AxiosType.Main,
      token,
      refreshToken
    );
    console.log(wallet.walletAddress);

    const urlFormatted = url.replace(/\s|\n/g, "").split("?")[1];

    const obj = paramsToObject(urlFormatted);
    new PaychantWidget({
      env: obj["env"],
      action: "sell",
      partnerApiKey: obj["partnerApiKey"],
      partnerLogoUrl: obj["partnerLogoUrl"],
      partnerThemeColor: obj["partnerThemeColor"].slice(1),
      fiatAmount: "15000",
      selectedAsset: "bsc_usdt",
      userEmailAddress: user?.email,
      walletAddress: wallet.walletAddress,
      webhookStatusUrl: `${env.VITE_SFX_BACKEND_BASE_URL}/wallet/paychant-webhook`,
      callback: {
        onClose: function () {},
        onStatus: function (txStatus) {
          console.log("txStatus", txStatus);
        },
      },
    }).openWindow();
  }

  useEffect(() => {
    (async () => {
      const user = await getMethod(
        "/auth/me",
        AxiosType.Main,
        token,
        refreshToken
      );
      setUser(user);
      await paychantWithdraw(user);
    })();
  }, []);
  return <div></div>;
};

export default WithdrawFromWallet;
