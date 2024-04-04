import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AssetCard from "../Components/AssetCard";
import { mockTransactions } from "../utils/mockData";
import { ExclamationTriangleIcon, QrCodeIcon } from "@heroicons/react/20/solid";
import Spinner from "../Components/Spinner";
import { BVN, delay } from "../utils/utilityFunctions";
import AssetModal from "../Components/AssetModal";
import TransactionCompleteModal from "../Components/TransactionCompleteModal";
import { AxiosType, getMethod, postMethod } from "../api/axios";

const mockAsset = mockTransactions.Wallets;

const MakePayment = () => {
  const navigate = useNavigate();
  const [assets] = useState(mockAsset);
  const minimumAmount = 6;
  const [amount, setAmount] = useState(minimumAmount.toFixed(2));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  let [isOpen, setIsOpen] = useState(false);
  let [transactionComplete, setTransactionComplete] = useState(false);
  let [transactionStatus, setTransactionStatus] = useState(false);

  const [wallets, setWallets] = useState([]);
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    (async () => {
      const user = await getMethod("/auth/me", token, refreshToken);
      if (user?.tier?.level > 0 || user?.bvn?.code === BVN.Success) {
        const bal = await postMethod(
          "/wallet/check-assets-balance",
          {},
          token,
          refreshToken
        );
        console.log(bal);
        const userWallets = user?.wallets?.map((a) => ({
          network: a.blockchain.toUpperCase(),
          network_name: a.blockchain,
          marker: filterMarker(a.asset),
          value: bal[a.blockchain],
          // image: `/images/${a.toLowerCase()}.png`,
          contract_address: a.walletAddress,
        }));
        const wallets = [];
        for (const userWallet of userWallets) {
          for (const marker of userWallet.marker) {
            wallets.push({
              network: userWallet.network,
              network_name: userWallet.network_name,
              marker,
              value: userWallet.value[marker],
              contract_address: userWallet.contract_address,
            });
          }
        }
        setWallets(wallets);
        setSelected(wallets?.[0]);
      }
    })();
  }, []);

  const [selected, setSelected] = useState(null);

  const handleInput = (inputValue) => {
    if (validated) {
      setWalletAddress(inputValue);
      if (!walletAddress.length) {
        setError("invalid address");
      } else {
        setError("");
      }
    } else {
      setAmount(inputValue);
      if (amount < minimumAmount || amount > selected.value) {
        setError("invalid amount");
      } else {
        setError("");
      }
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
    try {
      setTransactionStatus(true);
      throw new Error("transaction failed");
    } catch (error) {
      setTransactionStatus(false);
    }
    setLoading(false);
  };

  const handleClipboardPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setWalletAddress(text);
    } catch (error) {
      console.log("Failed to read clipboard");
    }
  };

  useEffect(() => {
    if (selected) handleInput(amount);
  }, [amount, selected]);

  useEffect(() => {
    if (selected) handleInput(walletAddress);
  }, [walletAddress, selected]);

  return !selected ? (
    <div className="flex items-center justify-center relative px-0 mobile-screen  bg-black text-white">
      <Spinner />
    </div>
  ) : (
    <main className="relative px-0 mobile-screen  bg-black text-white">
      <div className="border-b border-[#e9ebd94d] pt-5">
        <button
          className=" bg-transparent inline-flex text-[#55BB6C] gap-3 hover:border-black"
          onClick={() => {
            if (validated) {
              setValidated(false);
            } else {
              navigate(-1);
            }
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
                setAmount(e.target.value);
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
                value={walletAddress}
                onChange={(e) => {
                  setWalletAddress(e.target.value);
                }}
              />
              <span>
                <button
                  type="button"
                  className="p-0 m-0 focus:border-0"
                  onClick={handleClipboardPaste}
                >
                  <QrCodeIcon className="h-4" />
                </button>
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
        transactionStatus={transactionStatus}
      />
    </main>
  );
};

export default MakePayment;
