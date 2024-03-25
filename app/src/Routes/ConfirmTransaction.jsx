import {
  ArrowLeftIcon,
  InformationCircleIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosType, getMethod, postMethod } from "../api/axios";
import TransactionCompleteModal from "../Components/TransactionCompleteModal";
import { delay } from "../utils/utilityFunctions";

const ConfirmTransaction = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [commission] = useState(2);
  // const [wallet] = useState("TYduRhBwZcSZ26K9thBanjiLLHNZFaWf8W");
  const [wallet] = useState("0x7d45ff6af69b9882e9ffb1823046fda94951f7bf");
  // 0x7d45ff6af69b9882e9ffb1823046fda94951f7bf
  const [amount] = useState(location.state.amount);
  const [fee] = useState((commission * amount) / 100);
  const [finalAmount] = useState(amount - fee);
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  async function handleCopyToClipboard() {
    setCopied(true);
    navigator.clipboard.writeText("copyText.value");
    await delay();
    setCopied(false);
  }

  async function completeTransaction() {
    const user = await getMethod(
      "/auth/me",
      AxiosType.Main,
      token,
      refreshToken
    );
    const tuition = localStorage.getItem("tuition");
    if (!tuition) return alert("Tuition form not filled");
    const tuitionObj = JSON.parse(tuition);
    const tuitionData = await postMethod(
      "/wallet/submit-tuition",
      { ...tuitionObj, amountPaid: amount, finalAmount },
      AxiosType.Main,
      token,
      refreshToken
    );
    const userWallet = user?.wallets?.find(
      (w) => w.blockchain === "BSC" && w.asset.includes("USDT")
    );
    console.log(userWallet);
    console.log(finalAmount);
    console.log(wallet);
    const data = await postMethod(
      "/wallet/send-bsc-usdt",
      {
        sendAddress: userWallet.walletAddress,
        receiverAddress: wallet,
        amount: finalAmount.toString(),
        tuition: tuitionData,
      },
      AxiosType.Main,
      token,
      refreshToken
    );
    console.log(data);

    if (data?.txId) {
      setTransactionStatus(true);
      setTransactionComplete(true);
      setTransactionMessage("SUCCESS");
    } else {
      setTransactionStatus(false);
      setTransactionComplete(true);
      setTransactionMessage(data?.cause);
    }
  }

  return (
    <main className=" relative px-0 mobile-screen  bg-black text-white">
      <div className="border-b border-[#e9ebd94d]">
        <button
          className=" bg-transparent inline-flex text-[#55BB6C] gap-3 hover:border-black"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeftIcon className="h-6 text-[#D4B998] my-auto" />
          <p className="my-auto">Confirm Transaction</p>
        </button>
      </div>
      <div className="h-full grid p-4 place-items-center">
        <div className="relative my-auto space-y-3 place-items-center">
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
                {commission}
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
              <button
                className="p-0 bg-transparent hover:none focus:none"
                onClick={async () => {
                  await handleCopyToClipboard();
                }}
              >
                {copied ? (
                  <ClipboardDocumentCheckIcon className="h-5" />
                ) : (
                  <ClipboardDocumentIcon className="h-5" />
                )}
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
        </div>
      </div>
      <button
        className="bg-[#55BB6C] w-full rounded-lg absolute bottom-0 mx-auto inset-x-0"
        type="submit"
        onClick={async () => {
          await completeTransaction();
        }}
      >
        Complete Transaction
      </button>
      <TransactionCompleteModal
        transactionComplete={transactionComplete}
        setTransactionComplete={setTransactionComplete}
        transactionStatus={transactionStatus}
        transactionMessage={transactionMessage}
      />
    </main>
  );
};

export default ConfirmTransaction;
