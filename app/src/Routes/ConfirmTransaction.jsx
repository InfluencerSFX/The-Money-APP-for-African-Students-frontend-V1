import {
  ArrowLeftIcon,
  WalletIcon,
  InformationCircleIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";

const ConfirmTransaction = () => {
  const [amount] = useState(450);
  const [fee] = useState(9);
  const [commision] = useState(2);
  const [wallet] = useState("0x35bD54aEe54aD4154754aD414554aD414aD54aD4");
  const [finalAmount] = useState(447);

  return (
    <main className=" relative px-0 mobile-screen  bg-black text-white">
      <div className="border-b border-[#e9ebd94d]">
        <button className=" bg-transparent inline-flex text-[#55BB6C] gap-3 hover:border-black">
          <ArrowLeftIcon className="h-6 text-[#D4B998] my-auto" />
          <p className="my-auto">Connfirm Transaction</p>
        </button>
      </div>
      <div className="h-full grid p-4 place-items-center">
        <div className="relative h-full space-y-3 place-items-center">
          <div className="bg-[#e9ebd94d] gap-2 p-2  rounded-lg">
            <div className="flex flex-row justify-between">
              <p className="text-sm">You send:</p>
              <p className="">
                {" "}
                {amount}
                <span className="text-[xx-small] ms-0.5">USDT</span>
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-sm">Fee:</p>
              <p className="">
                {" "}
                {fee}
                <span className="text-[xx-small] ms-0.5">USDT</span>
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-sm">Commision:</p>
              <p className="">
                {" "}
                {commision}
                <span className="text-[xx-small] ms-0.5">%</span>
              </p>
            </div>
          </div>
          <div className="text-sm flex">
            <span>
              <InformationCircleIcon className="h-5 mx-1" />
            </span>
            <p>
              Only send the amount you provided below to this wallet to make
              your tuition payments
            </p>
          </div>

          <div className="bg-[#e9ebd94d] space-y-2 p-2 mx-auto w-full rounded-lg">
            <div className="flex w-full justify-between">
              <p className="text-xs place-self-center wrap text-center underline underline-offset-2">
                {wallet}
              </p>
              <button className="p-0 bg-transparent hover:none focus:none">
                <ClipboardDocumentCheckIcon className="h-5" />
              </button>
            </div>
          </div>
          <div className="bg-[#e9ebd94d] gap-2 p-2  rounded-lg">
            <div className="flex flex-row justify-between place-content-center">
              <p className="text-sm">Your University will recieve:</p>
              <p className="">
                {" "}
                {finalAmount}
                <span className="text-[xx-small] ms-0.5">USDT</span>
              </p>
            </div>
          </div>
          <button
            className="bg-[#55BB6C] w-full rounded-lg absolute inset-x-0 bottom-8"
            type="submit"
          >
            Complete Transaction
          </button>
        </div>
      </div>
    </main>
  );
};

export default ConfirmTransaction;
