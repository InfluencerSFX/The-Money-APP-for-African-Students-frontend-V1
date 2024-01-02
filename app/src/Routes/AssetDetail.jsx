import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AssetCard from "../Components/AssetCard";
import { mockTransactions } from "../utils/mockData";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

const mockAsset = mockTransactions.Wallets[0];

const AssetDetail = () => {
  const [asset] = useState(mockAsset);
  return (
    <>
      <div className="relative bg-[#000000] pt-4 mx-auto lg:max-w-md h-svh h-screen">
        <div className="border-b border-[#D4B998]">
          <button className=" bg-transparent inline-flex text-[#55BB6C] gap-3">
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
                  {`Only send USD Coin on (${asset.network_name}) network to this address. Other assets will be lost forever.`}
                </p>
              </div>
              <div className="flex flex-col place-items-center space-y-2 asset-btn p-4 rounded-lg">
                <img
                  className=" h-[35vw] sm:h-[40vw] lg:h-32"
                  src="/images/barcode.png"
                  alt="scan to get address"
                  srcSet=""
                />
                <p className=" text-white text-sm">{`Scan to receive ${asset.marker}`}</p>
              </div>

              <div className=" rounded-lg border border-[#e9ebd94d] p-4 space-y-2 w-full">
                <p className="text-white text-xs sm:text-sm break-words opacity-90 text-center mx-auto">
                  {asset.contract_address}
                </p>
                <button className="inline-flex gap-2 text-[#55BB6C] asset-btn w-full justify-center">
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
    </>
  );
};

export default AssetDetail;
