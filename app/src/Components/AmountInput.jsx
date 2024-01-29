import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AssetCard from "../Components/AssetCard";
import { mockTransactions } from "../utils/mockData";
import { ExclamationTriangleIcon, QrCodeIcon } from "@heroicons/react/20/solid";
import Spinner from "../Components/Spinner";
import { delay } from "../utils/utilityFunctions";
import AssetModal from "../Components/AssetModal";
import TransactionCompleteModal from "../Components/TransactionCompleteModal";

const mockAsset = mockTransactions.Wallets;

const AmountInput = () => {
  const navigate = useNavigate();
  const minimumAmount = 10;
  const [amount, setAmount] = useState(minimumAmount.toFixed(2));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [assets] = useState(mockAsset);
  const [selected, setSelected] = useState(assets[0]);

  const handleInput = (inputValue) => {
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
    navigate("/confirm-transaction", { state: { amount: amount } });
    setValidated(true);
  };

  useEffect(() => {
    handleInput(amount);
  }, [amount]);

  return (
    <>
      <section className="p-4 space-y-2">
        <div className="p-2 grid bg-transparent mx-auto space-y-2">
          <p className="mx-auto text-sm">Amount</p>

          <div className="flex bg-transparent w-1/2 mx-auto px-3 space-x-1">
            <input
              type="number"
              className="w-full h-12 font-medium text-2xl text-start p-0 bg-transparent placeholder:text-white px-2"
              value={amount}
              placeholder="0.00"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
            <span className="text-sm my-auto">{selected.marker}</span>
          </div>
          <p className="flex-none text-xs text-center text-[#C4A383]">
            {`Available balance: ${selected.value}`}
          </p>

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
        <button
          onClick={() => {
            handleNext();
          }}
          className="inline-flex bg-[#336D21] rounded-md w-full justify-center place-content-center"
          disabled={error.length > 0}
        >
          {loading ? <Spinner /> : <p className="mx-auto my-auto pb-1">NEXT</p>}
        </button>
      </div>
    </>
  );
};

export default AmountInput;
