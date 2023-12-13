import {
  AdjustmentsVerticalIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const Transact = () => {
  const [showBalance, setShowBalance] = useState(false);
  return (
    <>
      <br />
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <img
            src="https://images.pexels.com/photos/19414563/pexels-photo-19414563/free-photo-of-a-woman-in-a-leather-jacket-sitting-on-the-ground.jpeg"
            alt="user image"
            srcset=""
            className="rounded-full h-9 w-9 my-auto"
          />
          <div className="">
            <p className="text-sm text-[#55BB6C]">Welcome</p>
            <p className="text-xs text-[#D4B998]">Victoria Menace</p>
          </div>
        </div>
        <div className="w-auto">
          <AdjustmentsVerticalIcon className="h-7 w-auto" />
        </div>
      </div>
      <br />
      <div className="flex flex-col place-items-center space-y-3 p-4 bg-no-repeat  bg-[url('/images/stacked-cards.png')]">
        <div className="inline-flex mx-auto space-x-2 align-middle">
          <p className="text-sm my-auto font-light">Available Asset Balance</p>
          {!showBalance ? (
            <button
              className="bg-transparent w-auto h-auto p-0 hover:blur-none"
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

        <div className="inline-flex space-x-2 align-text-bottom">
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
    </>
  );
};

export default Transact;
