import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AssetCard from "../Components/AssetCard";
import { mockTransactions } from "../utils/mockData";
import { ExclamationTriangleIcon, QrCodeIcon } from "@heroicons/react/20/solid";
import Spinner from "../Components/Spinner";
import { delay } from "../utils/utilityFunctions";
import AssetModal from "../Components/AssetModal";
import TransactionCompleteModal from "../Components/TransactionCompleteModal";

const mockAsset = mockTransactions.Wallets;

const Send = () => {
  const [assets] = useState(mockAsset);
  const [selected, setSelected] = useState(assets[0]);
  const [minimumAmount] = useState(10);
  const [amount, setAmount] = useState(minimumAmount.toFixed(2));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  let [transactionComplete, setTransactionComplete] = useState(false);

  const handleAmountInput = (inputValue) => {
    setAmount(inputValue);
    if (amount < minimumAmount || amount > selected.value) {
      setError("invalid amount");
    } else {
      setError("");
    }
  };

  const handleNext = async () => {
    setLoading(true);
    await delay();
    setLoading(false);
    setValidated(true);
  };

  const handleTransaction = async () => {
    setLoading(true);
    await delay();
    setTransactionComplete(true);
    setLoading(false);
  };

  useEffect(() => {
    handleAmountInput(amount);
  }, [amount]);

  useEffect(() => {
    console.log(validated);
  }, [validated]);

  return (
    <main className=" relative px-0 mobile-screen border border-dashed border-lime-300 bg-black text-white">
      <div className="border-b border-[#e9ebd94d] pt-5">
        <button
          className=" bg-transparent inline-flex text-[#55BB6C] gap-3 hover:border-black"
          onClick={() => {
            setValidated(false);
          }}
        >
          <ArrowLeftIcon className="h-6 text-[#D4B998] my-auto" />
          <p className="my-auto">{`Send ${selected.marker}`}</p>
        </button>
      </div>
      <section className="p-4 space-y-2">
        <div className="p-2 grid bg-transparent mx-auto space-y-2">
          {validated ? (
            <p className="text-sm opacity-60 mx-auto">
              {`Only send ${selected.marker} Coin (${selected.network}) network to this address. Other
                assets will be lost forever.`}
            </p>
          ) : (
            <>
              <p className="mx-auto">Amount</p>
              <button
                className="w-1/2 mx-auto p-0 m-0"
                onClick={() => setIsOpen(!isOpen)}
              >
                <AssetCard asset={selected} dropdown={true} />
              </button>
            </>
          )}
          <div className="flex bg-transparent w-1/2 mx-auto px-3 space-x-1">
            <input
              type="number"
              className="w-full h-12 font-medium text-2xl text-start p-0 bg-transparent placeholder:text-white px-2"
              value={amount}
              placeholder="0.00"
              onChange={(e) => {
                handleAmountInput(e.target.value);
              }}
            />
            <span className="text-sm my-auto">{selected.marker}</span>
          </div>
          <p className="flex-none text-xs text-center text-[#C4A383]">
            {`Available balance: ${selected.value}`}
          </p>

          {validated && (
            <div className="p-4 text-xs bg-blend-hard-light border rounded-lg w-fit inline-flex mx-auto">
              <input
                type="text"
                className="text-start p-0 bg-transparent placeholder:text-white px-2 placeholder:opacity-70"
                placeholder="Recipient Address or ID"
              />
              <span>
                <QrCodeIcon className="h-4" />
              </span>
            </div>
          )}
          {error.length > 0 && (
            <div className="px-3 py-1 text-xs bg-red-700 rounded-xl w-fit inline-flex space-x-1 mx-auto">
              <span>
                <ExclamationTriangleIcon className="h-4" />
              </span>
              <p className="my-auto">{error}</p>
            </div>
          )}
        </div>
      </section>
      <div className="absolute w-full bottom-0 -left-0 max-w-md px-4 mb-4  text-white">
        {validated ? (
          <button
            onClick={() => {
              handleTransaction();
            }}
            className="inline-flex bg-[#336D21] rounded-md w-full justify-center place-content-center"
            disabled={error.length > 0}
          >
            {loading ? (
              <Spinner />
            ) : (
              <p className="mx-auto my-auto pb-1">COMPLETE TRANSACTION</p>
            )}
          </button>
        ) : (
          <button
            onClick={() => {
              handleNext();
            }}
            className="inline-flex bg-[#336D21] rounded-md w-full justify-center place-content-center"
            disabled={error.length > 0}
          >
            {loading ? (
              <Spinner />
            ) : (
              <p className="mx-auto my-auto pb-1">NEXT</p>
            )}
          </button>
        )}
      </div>
      <AssetModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        assets={assets}
        setSelected={setSelected}
      />

      <TransactionCompleteModal
        transactionComplete={transactionComplete}
        setTransactionComplete={setTransactionComplete}
      />
    </main>
  );
};

export default Send;
