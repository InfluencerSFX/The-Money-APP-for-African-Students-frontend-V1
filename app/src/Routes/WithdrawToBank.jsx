import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import BankForm from "../Components/BankForm";

const WithdrawToBank = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate;

  return (
    <>
      <main className=" relative px-0 mobile-screen  bg-black text-white">
        <div className="border-b border-[#e9ebd94d]">
          <button
            className=" bg-transparent inline-flex text-[#55BB6C] gap-3 hover:border-black"
            onClick={() => {
              navigate("/account");
            }}
          >
            <ArrowLeftIcon className="h-6 text-[#D4B998] my-auto" />
            <p className="my-auto">{`Back`}</p>
          </button>
        </div>
        <br />
        <br />
        <div className="w-full flex flex-col gap-4 p-4 transition-all duration-300">
          <button
            className=" rounded-md inline-flex  border-[#3e4837] mx-auto gap-3 hover:bg-[#3e4837]"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <p className="my-auto">Add Bank Account</p>
            <FaPlus
              className={`h-6 text-[#D4B998] my-auto ${
                openDropdown && "rotate-90"
              } transition-transform duration-300`}
            />
          </button>
          {openDropdown && <BankForm />}
          {!openDropdown && (
            <div className="h-full grid place-items-center  w-full">
              <div className="flex flex-col gap-4 justify-center mx-auto rounded-md p-2 border border-[#3e4837] ">
                <p className="text-sm">
                  You can withdraw mone from the money app only to bank accounts
                  which are located in Turkey and in your name
                </p>
                <p className="text-sm">
                  Withdraw requests made to bank accounts NOT in your name, will
                  NOT be credited and will be refunded
                </p>
                <p className="text-sm">
                  Withdrawals are credited in 10 minutes
                </p>
              </div>
            </div>
          )}{" "}
        </div>
      </main>
    </>
  );
};

export default WithdrawToBank;
