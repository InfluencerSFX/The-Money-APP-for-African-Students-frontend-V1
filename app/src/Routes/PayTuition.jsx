import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import TuitionForm from "../Components/TuitionForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AmountInput from "../Components/AmountInput";

const PayTuition = () => {
  const [formValidated, setFormValidated] = useState(false);
  const [amountValidated, setAmountValidated] = useState(false);
  const navigate = useNavigate();

  return (
    <main className=" relative px-0 mobile-screen  bg-black text-white overflow-y-auto no-scrollbar">
      <div className="border-b border-[#e9ebd94d]">
        <button
          className=" bg-transparent inline-flex text-[#55BB6C] gap-3 hover:border-black"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-6 text-[#D4B998] my-auto" />
          <p className="my-auto">Pay Tuition</p>
        </button>
      </div>
      {formValidated ? (
        <AmountInput />
      ) : (
        <TuitionForm setValidated={setFormValidated} />
      )}
    </main>
  );
};

export default PayTuition;
