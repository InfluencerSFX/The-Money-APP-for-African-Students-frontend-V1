import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { AxiosType, postMethod } from "../api/axios";
import { paramsToObject } from "../utils/utilityFunctions";
import { env } from "../utils/env";

const CardBody = ({ partner }) => {
  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <>
      <div className={`flex flex-row gap-3`}>
        <img
          className={"basis-1/5 h-7 my-auto"}
          src={
            "https://res.cloudinary.com/dow1kghsa/image/upload/v1707139648/paychant_tywdri.png"
          }
          alt=""
        />
        <div className="space-y-1">
          <p className="text-md text-start text-[#C4A383]">{partner}</p>
        </div>
      </div>
    </>
  );
};

const PartnerCard = ({ partner, email, wallet, action }) => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  async function paychantFund() {
    if (action === "sell")
      return window.open(`/withdraw-from-wallet`, "_blank");
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
      action,
      partnerApiKey: obj["partnerApiKey"],
      partnerLogoUrl: obj["partnerLogoUrl"],
      partnerThemeColor: obj["partnerThemeColor"].slice(1),
      fiatAmount: "15000",
      selectedAsset: "tron_usdt",
      userEmailAddress: email,
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

  return (
    <div
      onClick={paychantFund}
      className="flex justify-between w-full p-4 bg-[#161817] rounded-lg border border-[#e9ebd94d] cursor-pointer"
    >
      <CardBody partner={partner} />
    </div>
  );
};

export default PartnerCard;
