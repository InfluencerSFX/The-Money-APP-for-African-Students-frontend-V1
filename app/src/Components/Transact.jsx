import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import AssetCard from "./AssetCard";
import TransactionCard from "./TransactionCard";
import NoHistory from "./NoHistory";
import { mockTransactions } from "../utils/mockData";
import { AxiosType, getMethod, postMethod } from "../api/axios";
import { filterMarker } from "../utils/utilityFunctions";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Transact() {
  let [categories] = useState(mockTransactions);
  const [wallets, setWallets] = useState([]);
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
        console.log(bal);
        const userWallets = user?.wallets?.map((a) => ({
          network: a.blockchain.toUpperCase(),
          network_name: a.blockchain,
          marker: filterMarker(a.asset),
          value: bal[a.blockchain],
          // image: `/images/${a.toLowerCase()}.png`,
          contract_address: a.walletAddress,
        }));
        console.log(user);
        setWallets(userWallets);
        setBalances(bal);
      }
    })();
  }, []);

  return (
    <div className="w-full sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-[#161817] p-1 border border-[#e9ebd94d]">
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
            key={Object.keys(wallets)}
            className={classNames(
              "rounded-xl",
              "ring-white/60 ring-offset-2 focus:outline-none focus:ring-2"
            )}
          >
            <ul className=" space-y-2 overflow-auto no-scrollbar focus:none pb-4">
              {wallets.map((obj, index) => (
                <li key={index}>
                  <AssetCard asset={obj} />
                </li>
              ))}
            </ul>
          </Tab.Panel>
          <Tab.Panel
            key={Object.keys(categories["Transactions"])}
            className={classNames("rounded-xl", "")}
          >
            {categories["Transactions"].length && (
              <>
                <div className="rounded-t-lg bg-[#161817] w-full border-b border-[#e9ebd94d] my-2 px-4 py-2">
                  <p className="text-sm text-[#55BB6C]">Transaction History</p>
                </div>

                <ul className=" space-y-2 no-scroll h-[40vh] focus:none overflow-auto pb-12">
                  {categories["Transactions"].map((obj, index) => (
                    <li key={index}>
                      <TransactionCard transaction={obj} />
                    </li>
                  ))}
                </ul>
              </>
            )}

            {!categories.Transactions.length && <NoHistory />}
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
