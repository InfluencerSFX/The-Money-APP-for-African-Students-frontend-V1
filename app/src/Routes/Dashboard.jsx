import {
  AdjustmentsVerticalIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import VerifyEmail from "../Components/VefityEmail";
import CompleteKYC from "../Components/CompleteKYC";
import Transact from "../Components/Transact";
import FundModal from "../Components/FundModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AxiosType, getMethod, postMethod } from "../api/axios";
import { getBalance } from "../utils/utilityFunctions";
import { env } from "../utils/env";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const navigate = useNavigate();
  const location = useLocation();
  const [userDetails, setUser] = useState(null);
  const [balances, setBalances] = useState();
  const [liraRate, setLiraRate] = useState(0);
  useEffect(() => {
    (async () => {
      const data = await getMethod(
        "/auth/credential",
        AxiosType.Main,
        token,
        refreshToken
      );
      const credentialOnDevice = localStorage.getItem("credential");
      const credentialOnDeviceParsed = JSON.parse(credentialOnDevice);
      if (!credentialOnDeviceParsed || data.length == 0) {
        navigate("/register-passkey", {
          state: { from: location },
        });
      }
      const user = await getMethod(
        "/auth/me",
        AxiosType.Main,
        token,
        refreshToken
      );
      console.log(user);
      setUser(user);
      if (user?.tier?.level > 0) {
        const bal = await postMethod(
          "/wallet/check-assets-balance",
          {},
          AxiosType.Main,
          token,
          refreshToken
        );
        setBalances(bal);
      }
      const latest = await fetch(
        "https://cdn.moneyconvert.net/api/latest.json"
      );
      const latestJSON = await latest.json();
      setLiraRate(latestJSON.rates["TRY"]);
    })();
  }, []);

  // install pop-up
  useEffect(() => {
    if ("serviceWorker" in navigator && "BeforeInstallPromptEvent" in window) {
      window.addEventListener("load", () => {
        // Wait for the beforeinstallprompt event
        window.addEventListener("beforeinstallprompt", (event) => {
          // Prevent the default "Add to Home Screen" prompt
          event.preventDefault();

          // Automatically show the "Add to Home Screen" prompt on page load
          event.prompt();
        });
      });
    }
  }, []);

  const [showBalance, setShowBalance] = useState(false);
  const [openFundModal, setOpenFundModal] = useState(false);
  return (
    <main className="relative px-2 mobile-screen min-h-full bg-black">
      <div className="flex justify-between w-full px-4 py-2 z-10">
        <div className="flex space-x-2 w-full">
          <img
            src={
              userDetails?.picture ||
              "https://images.pexels.com/photos/19414563/pexels-photo-19414563/free-photo-of-a-woman-in-a-leather-jacket-sitting-on-the-ground.jpeg"
            }
            alt="user image"
            srcSet=""
            className="rounded-full h-9 w-9 my-auto"
          />
          <div className="">
            <p className="text-sm text-[#55BB6C]">Welcome</p>
            <p className="text-xs text-[#D4B998]">
              {userDetails?.firstName} {userDetails?.lastName}
            </p>
          </div>
        </div>
        <div
          className="w-auto"
          onClick={() =>
            navigate("/settings", {
              state: { from: location },
            })
          }
        >
          <AdjustmentsVerticalIcon className="h-7 w-auto text-[#D4B998]" />
        </div>
      </div>
      <section className="w-full h-full space-y-3 pt-2  pb-20 mb-auto overflow-scroll no-scrollbar">
        <section className="relative flex justify-center">
          <img
            src="/images/stacked-cards.png"
            className="absolute"
            alt=""
            srcSet=""
          />
          <div className="z-10 text-white flex flex-col place-items-center space-y-2 pt-4 mb-3">
            <div className="inline-flex mx-auto space-x-2 align-middle">
              <p className="text-sm my-auto font-light">
                Available Asset Balance
              </p>
              {!showBalance ? (
                <button
                  className="bg-transparent w-auto h-auto p-0 border-0"
                  onClick={() => {
                    setShowBalance(true);
                  }}
                >
                  <EyeIcon className="h-4 w-auto" />
                </button>
              ) : (
                <button
                  className="bg-transparent w-auto h-auto p-0 hover:blur-none"
                  onClick={() => {
                    setShowBalance(false);
                  }}
                >
                  <EyeSlashIcon className="h-4 w-auto" />
                </button>
              )}
            </div>

            <div className="inline-flex space-x-2 align-text-bottom text-white">
              <p className="text-4xl font-semibold">
                {showBalance ? getBalance(balances) : "****"}
              </p>{" "}
              <span className="mt-auto">USD</span>
            </div>
            <div className="inline-flex space-x-2">
              <span className="mt-auto">₺</span>
              <p className="text-md font-thin">
                {showBalance ? getBalance(balances) * liraRate : "****"}
              </p>{" "}
            </div>
            <br />
          </div>
        </section>

        <section>
          <CompleteKYC />
        </section>

        <section className="min-h-40">
          <Transact />
        </section>
      </section>
      <footer className=" z-10 absolute bottom-0 inset-x-0 flex bg-[#161817] text-[#55BB6C] divide-x divide-[#e9ebd94d] rounded-t-xl">
        <button
          className="w-full flex p-4 bt-transparent transparent bg-transparent flex-row gap-2 justify-center border-0 rounded-none"
          onClick={() => setOpenFundModal(!openFundModal)}
        >
          <div className="p-2 rounded-full bg-[#e9ebd94d]">
            <ArrowDownRightIcon className="h-5 " />
          </div>{" "}
          <p className="my-auto text-sm">Fund / Withdraw</p>
        </button>
        {/* <button className=""> */}
        <Link
          to="/send"
          className="w-full flex p-4 bt-transparent text-[#55BB6C] transparent bg-transparent flex-row gap-2 justify-center border-0 rounded-none hover:text-[#55BB6C]"
        >
          <div className="p-2 rounded-full bg-[#e9ebd94d]">
            <ArrowUpRightIcon className="h-5" />
          </div>
          <p className="my-auto text-sm">Send USD</p>
        </Link>
        {/* </button> */}
      </footer>
      <FundModal isOpen={openFundModal} setIsOpen={setOpenFundModal} />
    </main>
  );
};

export default Dashboard;
