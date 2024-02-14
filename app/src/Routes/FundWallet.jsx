import { useState } from "react";
// import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AssetCard from "../Components/AssetCard";
import { mockTransactions } from "../utils/mockData";
// import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

const mockAsset = mockTransactions.Wallets;

const FundWallet = () => {
  const [providers] = useState(mockAsset);
  return (
    <>
      <div className="relative bg-[#000000] pt-4 mx-auto lg:max-w-md mobile-screen">
        <div className="border-b border-[#D4B998]">
          <button className=" bg-transparent inline-flex text-[#55BB6C] gap-3">
            <p className="my-auto">Fund Wallet</p>
          </button>
        </div>
        <section className="p-4 space-y-2">
          <div className="">
            <p className="text-sm text-white">
              Select any of our partners to securely fund your SFX wallet
            </p>
          </div>
          {providers.map((asset, index) => (
            <AssetCard asset={asset} key={index} />
          ))}
        </section>
      </div>
    </>
  );
};

export default FundWallet;
