import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
const Send = () => {
  const navigate = useNavigate();

  return (
    <main className=" relative px-0 mobile-screen  bg-black text-white">
      <div className="border-b border-[#e9ebd94d]">
        <button className=" bg-transparent inline-flex text-[#55BB6C] gap-3 hover:border-black">
          <ArrowLeftIcon className="h-6 text-[#D4B998] my-auto" />
          <p className="my-auto">Send</p>
        </button>
      </div>
      <div className="h-full grid place-items-center w-full">
        <div className="flex flex-col gap-4 justify-center mx-auto ">
          <button
            className="w-full bg-[#3e4837]"
            type="button"
            onClick={() => {
              navigate("/pay-tuition");
            }}
          >
            Withdraw to Wallet Address
          </button>
          <button
            className="w-full bg-[#436913]"
            type="button"
            onClick={() => {
              navigate("/pay-tuition");
            }}
          >
            Pay Tuition
          </button>
          <button className="w-full bg-[#336d22]" type="button">
            Withdraw TRY to Bank Account
          </button>
        </div>
      </div>
    </main>
  );
};

export default Send;
