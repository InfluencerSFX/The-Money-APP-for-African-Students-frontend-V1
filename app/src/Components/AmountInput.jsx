import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon, QrCodeIcon } from "@heroicons/react/20/solid";
import Spinner from "../Components/Spinner";
import { BVN, delay, filterMarker } from "../utils/utilityFunctions";
import { AxiosType, getMethod, postMethod } from "../api/axios";

const AmountInput = () => {
  const navigate = useNavigate();
  const minimumAmount = 6;
  const [amount, setAmount] = useState(minimumAmount.toFixed(2));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

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
        console.log(wallets);
        setSelected(wallets?.find((w) => w.marker === "USDT"));
      }
    })();
  }, []);

  const [selected, setSelected] = useState(null);

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
    if (selected) handleInput(amount);
  }, [amount, selected]);

  return !selected ? (
    <div className="flex items-center justify-center relative px-0 mobile-screen  bg-black text-white">
      <Spinner />
    </div>
  ) : (
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

          <p className="flex-none text-xs text-center mb-1 text-[#C4A383]">
            {`Available balance: ${selected.value}`}
          </p>
          <p className="flex-none text-xs text-center mb-1 text-[#C4A383]">
            {`Minimum withdrawal: ${minimumAmount} USDT`}
          </p>
          <p className="flex-none text-xs text-center mb-1 text-[#C4A383]">
            {`Fee: 2 USDT`}
          </p>
          <p className="flex-none text-xs text-center mb-1 text-[#336D21]">
            {`Arrival time: 2 mins`}
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
