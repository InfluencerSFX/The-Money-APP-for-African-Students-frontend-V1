import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Bridge from "@ngnc/bridge";
import { useEffect } from "react";
import { AxiosType, getMethod, postMethod } from "../api/axios";
import { paramsToObject } from "../utils/utilityFunctions";
import { env } from "../utils/env";
import { useNavigate } from "react-router-dom";

const CardBody = ({ partner }) => {
  useEffect(() => {
    (async () => {})();
  }, []);

  const images = {
    Paychant:
      "https://res.cloudinary.com/dow1kghsa/image/upload/v1707139648/paychant_tywdri.png",
    NGNC: "https://res.cloudinary.com/dow1kghsa/image/upload/v1709646487/ngng-link_yotzcx.png",
  };

  return (
    <>
      <div className={`flex flex-row gap-3`}>
        <img className={"basis-1/5 h-7 my-auto"} src={images[partner]} alt="" />
        <div className="space-y-1">
          <p className="text-md text-start text-[#C4A383]">{partner}</p>
        </div>
      </div>
    </>
  );
};

const PartnerCard = ({ partner, email, wallet, action }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  async function Paychant() {
    if (action === "sell")
      return window.open(`/withdraw-from-wallet?partner=paychant`, "_blank");
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
      selectedAsset: "bsc_usdt",
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

  async function ngncBuy() {
    if (action === "sell")
      return window.open(`/withdraw-from-wallet?partner=ngnc`, "_blank");
    const amount = prompt("Enter amount to buy in NGN (Minimum 20000 NGN): ");
    if (!amount) return;
    if (Number(amount) < 20000) return alert("Minimum amount is 20000 NGN");
    const rates = await getMethod(
      "/wallet/ngnc-rates",
      AxiosType.Main,
      token,
      refreshToken
    );
    console.log(rates);
    alert(
      `You will receive approx. ${(Number(amount) / rates?.ngnUSD?.USD).toFixed(
        2
      )} USDT`
    );
    const ngncWidget = new Bridge({
      key: env.VITE_NGNC_PUBLIC_KEY,
      type: action,
      data: {
        amount,
        network: "Polygon",
        wallet_address: wallet.walletAddress,
      },
      onSuccess: (response) => console.log("SUCCESS", response),
      onLoad: () => console.log("Bridge widget loaded successfully"),
      onEvent: (eventName, eventDetail) => {
        console.log("EVENT_NAME", eventName);
        console.log("EVENT_DETAIL", eventDetail);
      },
      onClose: () => console.log("Bridge widget has been closed"),
    });
    ngncWidget.setup();
    ngncWidget.open();
  }

  async function kotaniBuy() {
    navigate("/Kotani");
  }

  const partnerFunction = {
    NGNC: ngncBuy,
    Paychant,
    KotaniPay: kotaniBuy,
  };

  return (
    <div
      onClick={partnerFunction[partner]}
      className="flex justify-between w-full p-4 bg-[#161817] rounded-lg border border-[#e9ebd94d] cursor-pointer"
    >
      <CardBody partner={partner} />
    </div>
  );
};

export default PartnerCard;
