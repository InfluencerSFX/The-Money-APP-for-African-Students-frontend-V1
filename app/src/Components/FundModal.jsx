import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import AssetCard from "./AssetCard";
import { AxiosType, getMethod, postMethod } from "../api/axios";
import PartnerCard from "./PartnerCard";
import { filterMarker } from "../utils/utilityFunctions";

const FundModal = ({ isOpen, setIsOpen }) => {
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
        setWallets(
          user?.wallets?.map((a) => ({
            network: a.blockchain.toUpperCase(),
            network_name: a.blockchain,
            marker: filterMarker(a.asset),
            value: bal[a.blockchain],
            // image: `/images/${a.toLowerCase()}.png`,
            contract_address: a.walletAddress,
          }))
        );
        setBalances(bal);
      }
    })();
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 " />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full justify-bottom text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full transform overflow-hidden pb-8 rounded-t-2xl bg-[#161817] text-white self-end text-left align-middle shadow-xl transition-all mx-auto max-w-md">
                <div className="w-1/3 mx-auto">
                  <button
                    onClick={closeModal}
                    type="button"
                    className="bg-[#3c3f3d] p-0 h-1.5 w-full"
                  ></button>
                </div>

                <Dialog.Title
                  as="h3"
                  className=" text-[#55BB6C] border-b border-[#e9ebd94d] px-4 py-2 self-end"
                >
                  Fund Wallet
                </Dialog.Title>
                <section className="p-4 space-y-2">
                  <p className="text-sm text-white">
                    Select any of our partners to securely fund your SFX wallet
                  </p>
                  <PartnerCard
                    partner={"Paychant"}
                    email={userDetails?.email}
                    wallet={userDetails?.wallets?.find(
                      (w) => w.blockchain === "BSC" && w.asset.includes("USDT")
                    )}
                    action="buy"
                  />
                </section>
                <Dialog.Title
                  as="h3"
                  className=" text-[#f53d3a] border-b border-[#e9ebd94d] px-4 py-2 self-end"
                >
                  Withdraw from Wallet
                </Dialog.Title>
                <section className="p-4 space-y-2">
                  <p className="text-sm text-white">
                    Select any of our partners to securely withdraw from your
                    SFX wallet
                  </p>
                  <PartnerCard
                    partner={"Paychant"}
                    email={userDetails?.email}
                    wallet={userDetails?.wallets?.find(
                      (w) => w.blockchain === "BSC" && w.asset.includes("USDT")
                    )}
                    action="sell"
                  />
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FundModal;
