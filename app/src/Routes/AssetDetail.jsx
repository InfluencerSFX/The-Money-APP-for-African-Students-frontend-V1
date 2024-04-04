import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AssetCard from "../Components/AssetCard";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { AxiosType, getMethod, postMethod } from "../api/axios";
import Spinner from "../Components/Spinner";
import { filterMarker } from "../utils/utilityFunctions";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

const AssetDetail = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const searchParams = new URLSearchParams(document.location.search);
  const i = searchParams.get("i");
  const m = searchParams.get("m");
  const [asset, setAsset] = useState(null);
  useEffect(() => {
    (async () => {
      const user = await getMethod("/auth/me", token, refreshToken);
      const bal = await postMethod(
        "/wallet/check-assets-balance",
        {},
        token,
        refreshToken
      );
      const wallet = user?.wallets?.[Number(i)];
      console.log("detail", wallet);
      setAsset({
        network: wallet.blockchain.toUpperCase(),
        network_name: wallet.blockchain,
        marker: m,
        value: bal[wallet.blockchain][m],
        // image: `/images/${a.toLowerCase()}.png`,
        contract_address: wallet.walletAddress,
      });
    })();
  }, []);

  const copyText = () => {
    console.log("copying...");
    const text = asset.contract_address;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying text: ", error);
      });
  };
  return (
    <>
      {!asset ? (
        <div className="flex items-center justify-center relative bg-[#000000] pt-4 mx-auto lg:max-w-md  mobile-screen">
          <Spinner />
        </div>
      ) : (
        <div className="relative bg-[#000000] pt-4 mx-auto lg:max-w-md  mobile-screen">
          <div className="border-b border-[#D4B998]">
            <button
              onClick={() => navigate(-1)}
              className=" bg-transparent inline-flex text-[#55BB6C] gap-3"
            >
              {" "}
              <ArrowLeftIcon className="h-6 text-[#D4B998] my-auto" />
              <p className="my-auto">Account details</p>
            </button>
          </div>
          <section className="p-4 space-y-4">
            <AssetCard asset={asset} />
            <div className="rounded-lg w-full  bg-[#161817] ">
              <p className="border-b border-[#e9ebd94d] text-[#55BB6C] p-4">
                {`Your ${asset.marker} Address`}
              </p>
              <div className="flex flex-col place-items-center p-4 space-y-3">
                <div className="">
                  <p className="text-sm text-[#D4B998]">
                    {`Only send ${asset.marker} on (${asset.network_name}) network to this address. Other assets will be lost forever.`}
                  </p>
                </div>
                <div className="flex flex-col place-items-center space-y-2 asset-btn p-4 rounded-lg">
                  {/* <img
                    className=" h-[35vw] sm:h-[40vw] lg:h-32"
                    src="/images/barcode.png"
                    alt="scan to get address"
                    srcSet=""
                  /> */}
                  <div className="h-[35vw] sm:h-[40vw] lg:h-32 qr-code">
                    <QRCode value={asset.contract_address} />
                  </div>
                  <p className=" text-white text-sm">{`Scan to receive ${asset.marker}`}</p>
                </div>

                <div className=" rounded-lg border border-[#e9ebd94d] p-4 space-y-2 w-full">
                  <p className="text-white text-xs sm:text-sm break-words opacity-90 text-center mx-auto">
                    {asset.contract_address}
                  </p>
                  <button
                    onClick={copyText}
                    className="inline-flex gap-2 text-[#55BB6C] asset-btn w-full justify-center"
                  >
                    <DocumentDuplicateIcon className="h-6 " />{" "}
                    <p className="text-xs my-auto">
                      {`Copy Address to Receive ${asset.marker}`}
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default AssetDetail;
