import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import AssetCard from "./AssetCard";
import TransactionCard from "./TransactionCard";
import NoHistory from "./NoHistory";
import { AxiosType, getMethod, postMethod } from "../api/axios";
import { filterMarker } from "../utils/utilityFunctions";
import { useNavigate } from "react-router-dom";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Transact() {
  const navigate = useNavigate();
  const categories = {
    Wallets: [],
    Transactions: [],
  };

  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userDetails, setUser] = useState(null);
  const [balances, setBalances] = useState();
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  useEffect(() => {
    (async () => {
      const user = await getMethod(
        "/auth/me",
        AxiosType.Main,
        token,
        refreshToken
      );
      setUser(user);
      if (user?.tier?.level > 0) {
        const bal = await postMethod(
          "/wallet/check-assets-balance",
          {},
          AxiosType.Main,
          token,
          refreshToken
        );
        const txs = await getMethod(
          "/wallet/tx-history",
          AxiosType.Main,
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
        const userTxs = txs?.map((tx) => ({
          type:
            user?.email === tx.senderEmail
              ? tx.transactionType === "Tuition"
                ? "Tuition"
                : "Sent"
              : "Received",
          date: tx.transactionDate,
          status: tx.transactionStatus,
          amount: tx.amount,
          asset:
            tx.transactionType === "Tuition" || tx.transactionType === "P2P"
              ? "USDT"
              : "USDC",
          // asset:
          //   user?.email === tx.senderEmail
          //     ? tx.senderWallet?.asset?.[0]
          //     : tx.receiverWallet?.asset?.[0],
        }));
        console.log(userTxs);
        setWallets(userWallets);
        setTransactions(userTxs);
        setBalances(bal);
      }
    })();
  }, []);

  return (
    <div className="w-full h-full sm:px-0 no-scrollbar">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-[#161817] p-1 border border-[#e9ebd94d] no-scrollbar">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 hover:ring-none",
                  selected
                    ? "bg-black text-[#55BB6C]"
                    : "text-[#D4B998] hover:text-white"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2 space-y-2 h-auto overflow-y-auto">
          <Tab.Panel
            // key={Object.keys(wallets)}
            key={"wallets"}
            className={classNames(
              "rounded-xl",
              "ring-white/60 ring-offset-2 focus:outline-none focus:ring-2"
            )}
          >
            <ul className=" space-y-2 overflow-auto no-scrollbar focus:none pb-4">
              {wallets.map((obj, index) =>
                obj.marker.map((m, i) => (
                  <li
                    key={i}
                    onClick={() => navigate(`/asset?i=${index}&m=${m}`)}
                  >
                    <AssetCard
                      asset={{
                        network: obj.network,
                        network_name: obj.network_name,
                        marker: m,
                        value: obj.value[m],
                        // image: `/images/${a.toLowerCase()}.png`,
                        contract_address: obj.contract_address,
                      }}
                    />
                  </li>
                ))
              )}
            </ul>
          </Tab.Panel>
          <Tab.Panel
            // key={Object.keys(transactions)}
            key={"transactions"}
            className={classNames("rounded-xl", "")}
          >
            {transactions.length ? (
              <>
                <div className="rounded-t-lg bg-[#161817] w-full border-b border-[#e9ebd94d] my-2 px-4 py-2">
                  <p className="text-sm text-[#55BB6C]">Transaction History</p>
                </div>

                <ul className=" space-y-2 no-scrollbar h-[100vw] focus:none overflow-auto pb-20 mb-auto">
                  {transactions.map((obj, index) => (
                    <li key={index}>
                      <TransactionCard transaction={obj} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <NoHistory />
            )}

            {/* {!transactions.length && <NoHistory />} */}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

/**
 *           {/* {Object.values(categories).map((obj, idx) => (
 * ))}
 *
 */
