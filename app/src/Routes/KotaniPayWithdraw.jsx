import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosType, getMethod, postMethod } from "../api/axios";
import Snackbar from "../Components/Snackbar";
import TransactionCompleteModal from "../Components/TransactionCompleteModal";
import { show } from "../utils/utilityFunctions";

const KotaniPayWithdraw = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  const navigate = useNavigate();

  const [escrowAddress, setEscrowAddress] = useState("");
  const [requestId, setRequestId] = useState("");
  const [amount, setAmount] = useState(0);
  const [transactionHash, setTransactionHash] = useState("");

  const copyText = () => {
    navigator.clipboard
      .writeText(escrowAddress)
      .then(() => {
        show("Copied to clipboard");
        console.log(`${escrowAddress} copied to clipboard`);
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  };

  useEffect(() => {
    (async () => {
      const user = await getMethod("/auth/me", token, refreshToken);
      if (!user?.customerKey) {
        alert("Please create a mobile money wallet with SFX");
        return navigate(`/mobile-money`);
      }
      const cachedRequestDataJSON = localStorage.getItem("kotanipayWithdraw");
      if (cachedRequestDataJSON) {
        const cachedRequestData = JSON.parse(cachedRequestDataJSON);
        setEscrowAddress(cachedRequestData?.escrow_address);
        setRequestId(cachedRequestData?.request_id);
        setAmount(Number(cachedRequestData?.amount));
      } else {
        const amount = prompt("Enter amount to sell in USDT");
        if (!amount) return;
        setAmount(Number(amount));
        const wallet = user?.wallets?.find(
          (w) => w.blockchain === "Polygon" && w.asset.includes("USDT")
        );
        const requestData = await postMethod(
          "/wallet/kotanipay-withdraw-request",
          {
            amount: Number(amount),
            senderAddress: wallet.walletAddress,
            asset: "USDT",
          },
          token,
          refreshToken
        );
        console.log(requestData);
        if (!requestData) {
          alert(requestData?.message);
          return;
        }
        setEscrowAddress(requestData?.escrow_address);
        setRequestId(requestData?.request_id);
        localStorage.setItem(
          "kotanipayWithdraw",
          JSON.stringify({ ...requestData, amount })
        );
      }
      const copyButton = document.getElementById(`copyBtn`);
      if (copyButton) {
        copyButton.addEventListener("click", copyText);
        return () => copyButton.removeEventListener("click", copyText);
      }
    })();
  }, []);

  let [transactionComplete, setTransactionComplete] = useState(false);
  let [transactionStatus, setTransactionStatus] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState("");

  async function offramp() {
    console.log(transactionHash, requestId);
    const offrampData = await postMethod(
      "/wallet/kotanipay-withdraw",
      {
        transactionHash,
        requestId,
        asset: "USDT",
      },
      token,
      refreshToken
    );
    console.log(offrampData);

    if (offrampData?.isError || !offrampData) {
      setTransactionStatus(false);
      setTransactionComplete(true);
      setTransactionMessage("ERROR");
    } else {
      setTransactionStatus(true);
      setTransactionComplete(true);
      setTransactionMessage("SUCCESS");
    }
  }

  return (
    amount > 0 &&
    escrowAddress &&
    requestId && (
      <main className="flex flex-col flex-wrap items-center mobile-screen justify-center relative space-y-4 bg-black text-white overflow-y-auto no-scrollbar">
        <Snackbar />
        <div className="flex flex-col space-y-4">
          <div className="border border-gray-400 rounded-md p-3">
            Transfer {amount} USDT to{" "}
            <span className="font-bold cursor-pointer" id={`copyBtn`}>
              {escrowAddress.slice(0, 5)}...
              {escrowAddress.slice(escrowAddress.length - 4)}{" "}
              <FontAwesomeIcon icon={faCopy} />
            </span>
          </div>
          <div className="form-style form-validation space-y-3">
            <p>Copy the transaction hash from the transaction history tab</p>
            <input
              placeholder="Transaction Hash"
              type="string"
              className="w-full border border-[#55bb6c] px-2 py-3 rounded font-medium text-start bg-transparent placeholder:text-gray-600"
              value={transactionHash}
              onChange={(e) => setTransactionHash(e.target.value)}
            />
            <button
              onClick={() => offramp()}
              className="w-full border border-[#55bb6c] hover:bg-[#55bb6c]"
            >
              I HAVE PAID
            </button>
            <button
              onClick={() => navigate("/withdraw-to-wallet")}
              className="w-full border border-[#55bb6c] hover:bg-[#55bb6c]"
            >
              SEND USDT
            </button>
            <button
              onClick={() => localStorage.removeItem("kotanipayWithdraw")}
              className="w-full border border-[#55bb6c] hover:bg-[#55bb6c]"
            >
              CANCEL
            </button>
          </div>
        </div>
        <TransactionCompleteModal
          transactionComplete={transactionComplete}
          setTransactionComplete={setTransactionComplete}
          transactionStatus={transactionStatus}
          transactionMessage={transactionMessage}
          to={"/account"}
        />
      </main>
    )
  );
};

export default KotaniPayWithdraw;
