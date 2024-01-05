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
import { AxiosType, getMethod } from "../api/axios";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const navigate = useNavigate();
  const location = useLocation();
  const [userDetails, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      const user = await getMethod(
        "/auth/me",
        AxiosType.Main,
        token,
        refreshToken
      );
      setUser(user);
    })();
  }, []);

  const [showBalance, setShowBalance] = useState(false);
  const [openFundModal, setOpenFundModal] = useState(false);
  return (
    <main className="relative mobile-screen bg-black">
      <section className="relative space-y-4 ">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <img
              // src="https://images.pexels.com/photos/19414563/pexels-photo-19414563/free-photo-of-a-woman-in-a-leather-jacket-sitting-on-the-ground.jpeg"
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

        <section className="flex justify-center">
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
                {showBalance ? "144" : "****"}
              </p>{" "}
              <span className="mt-auto">USD</span>
            </div>
            <div className="inline-flex space-x-2">
              <span className="mt-auto">₺</span>
              <p className="text-md font-thin">41562.15</p>{" "}
            </div>
            <br />
          </div>
        </section>

        <section>
          <VerifyEmail />
        </section>

        <section>
          <Transact />
        </section>
      </section>
      <footer className=" z-10 absolute inset-x-0 bottom-0 flex bg-[#161817] text-[#55BB6C] divide-x divide-[#e9ebd94d] rounded-t-xl">
        <button
          className="w-full flex p-4 bt-transparent transparent bg-transparent flex-row gap-2 justify-center border-0 rounded-none"
          onClick={() => setOpenFundModal(!openFundModal)}
        >
          <div className="p-2 rounded-full bg-[#e9ebd94d]">
            <ArrowDownRightIcon className="h-5 " />
          </div>{" "}
          <p className="my-auto">Fund Wallet</p>
        </button>
        {/* <button className=""> */}
        <Link
          to="/send"
          className="w-full flex p-4 bt-transparent text-[#55BB6C] transparent bg-transparent flex-row gap-2 justify-center border-0 rounded-none hover:text-[#55BB6C]"
        >
          <div className="p-2 rounded-full bg-[#e9ebd94d]">
            <ArrowUpRightIcon className="h-5" />
          </div>
          <p className="my-auto">Send USD</p>
        </Link>
        {/* </button> */}
      </footer>
      <FundModal isOpen={openFundModal} setIsOpen={setOpenFundModal} />
    </main>
  );
};

export default Dashboard;
