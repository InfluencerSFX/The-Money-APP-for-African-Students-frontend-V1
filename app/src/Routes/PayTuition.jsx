import {
  ArrowLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";

const PayTuition = () => {
  const [universityName, setUniversityName] = useState("");
  const [bankName, setBankName] = useState("");
  const [address, setAddress] = useState("");
  const [IBANNumber, setIBANNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <main className=" relative px-0 mobile-screen  bg-black text-white">
      <div className="border-b border-[#e9ebd94d]">
        <button className=" bg-transparent inline-flex text-[#55BB6C] gap-3 hover:border-black">
          <ArrowLeftIcon className="h-6 text-[#D4B998] my-auto" />
          <p className="my-auto">Pay Tuition</p>
        </button>
      </div>
      <div className="h-full grid p-4 place-items-center">
        <form action="" className="space-y-3 ">
          <div className="bg-[#e9ebd94d] inline-flex gap-2 p-2 rounded-lg w-full">
            <InformationCircleIcon className="h-4 place-self-center" />
            <p className="text-sm"> Fill transaction details</p>
          </div>
          <input
            type="text"
            className="form-style form-validation"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder="First Name"
          />
          <input
            type="text"
            className="form-style form-validation"
            value={surName}
            onChange={(e) => {
              setSurName(e.target.value);
            }}
            placeholder="Surname"
          />
          <input
            type="text"
            className="form-style form-validation"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            placeholder="Your Address"
          />
          <input
            type="text"
            className="form-style form-validation"
            value={universityName}
            onChange={(e) => {
              setUniversityName(e.target.value);
            }}
            placeholder="University Name"
          />
          <input
            type="text"
            className="form-style form-validation"
            value={bankName}
            onChange={(e) => {
              setBankName(e.target.value);
            }}
            placeholder="Bank Name"
          />

          <input
            type="number"
            className="form-style form-validation"
            value={IBANNumber}
            onChange={(e) => {
              setIBANNumber(e.target.value);
            }}
            placeholder="IBAN Number"
          />
          <input
            type="number"
            className="form-style form-validation"
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value);
            }}
            placeholder="Account Number"
          />
          <input
            type="text"
            className="form-style form-validation"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="Transaction Description"
          />

          <button className="bg-[#55BB6C] w-full rounded-lg" type="submit">
            submit
          </button>
        </form>
      </div>
    </main>
  );
};

export default PayTuition;
