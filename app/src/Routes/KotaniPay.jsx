/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Listbox } from "@headlessui/react";
import { Kotani } from "../utils/Kotani";
import Spinner from "../Components/Spinner";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import usdt from "../../public/images/usdt.png";
import { AxiosType, getMethod, postMethod } from "../api/axios";
import TransactionCompleteModal from "../Components/TransactionCompleteModal";

const phoneRegExp = /^[1-9]\d{7,9}$/;

const schema = yup.object({
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "invalid phone No eg: 1234567890")
    .required(),
});

const KotaniPay = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  let [transactionComplete, setTransactionComplete] = useState(false);
  let [transactionStatus, setTransactionStatus] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState("");

  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  const onSubmit = async (data) => {
    const user = await getMethod(
      "/auth/me",
      AxiosType.Main,
      token,
      refreshToken
    );
    console.log(data);
    console.log({
      selectedCountry,
      USDTValue,
      fiatAmount,
      serviceProvider,
    });
    let customerKey = user?.customerKey;
    if (!customerKey) {
      console.log("mobile money");
      customerKey = await postMethod(
        "/auth/mobile-money",
        {
          phoneNumber: data.phoneNumber,
          network: serviceProvider,
          countryCode: selectedCountry.letter,
        },
        AxiosType.Main,
        token,
        refreshToken
      );
    }
    const wallet = user?.wallets?.find(
      (w) => w.blockchain === "Polygon" && w.asset.includes("USDT")
    );
    console.log(wallet);
    const onrampData = await postMethod(
      "/wallet/kotanipay-fund",
      {
        publicAddress: wallet.walletAddress,
        token: "USDT",
        amount: USDTValue,
      },
      AxiosType.Main,
      token,
      refreshToken
    );

    if (onrampData?.isError) {
      console.log("onramp", onrampData);
      setTransactionStatus(false);
      setTransactionComplete(true);
      setTransactionMessage(onrampData?.message);
    } else {
      setTransactionStatus(true);
      setTransactionComplete(true);
      setTransactionMessage("SUCCESS");
    }
  };

  // const onSubmit = async (data) => {
  // try {
  //   const user = await getMethod(
  //     "/auth/me",
  //     AxiosType.Main,
  //     token,
  //     refreshToken
  //   );
  //   console.log(data);
  //   localStorage.setItem(
  //     "tuition",
  //     JSON.stringify({ ...data, email: user?.email })
  //   );
  //   // await new Promise((resolve) => setTimeout(resolve, 1000));
  //   // throw new Error();
  //   alert("form submitted successfully");
  //   //   setValidated(true);
  // } catch (error) {
  //   setError("root", { message: "something went wrong" });
  // }
  // };

  const [selectedCountry, setSelectedCountry] = useState(Kotani[0]);

  const [serviceProvider, setServiceProvider] = useState(
    selectedCountry.serviceProviders[0]
  );

  const [USDTValue, setUSDTValue] = useState(0);
  const [USDTValueError, setUSDTValueError] = useState("");
  const [fiatAmount, setFiatAmount] = useState(0);
  const [fiatAmountError, setFiatAmountError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setServiceProvider(selectedCountry.serviceProviders[0]);
  }, [selectedCountry]);

  useEffect(() => {
    // check for error here and setUSDTError
    setFiatAmount(USDTValue * 2);
  }, [USDTValue]);

  useEffect(() => {
    // check for error here and setUGXError
    setUSDTValue(fiatAmount / 2);
  }, [fiatAmount]);

  return (
    <main className=" relative px-0 mobile-screen space-y-4 bg-black text-white overflow-y-auto no-scrollbar">
      <div className="border-b border-[#e9ebd94d]">
        <button
          className=" bg-transparent inline-flex text-[#55BB6C] gap-3 hover:border-black"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeftIcon className="h-6 text-[#D4B998] my-auto" />
          <p className="my-auto">Kotani Pay</p>
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative p-4 max-w-full min-h-fit space-y-2"
      >
        <p className="font-semi-bold mb-4 text-lg">
          Send and Receive through KotaniPay
        </p>
        <div className=" space-y-2">
          <div className="w-full p-3 bg-[#e9ebd94d] inline-flex justify-between rounded-md">
            <div className="space-y-1">
              <p className="">USDT</p>
              <p className="text-sm">Polygon</p>
            </div>
            <img src={usdt} />
          </div>
          <div className="inline-flex w-full gap-2">
            <div className="flex-none w-fit h-fit bg-[#161817] rounded-md border border-[#e9ebd94d]">
              <Listbox value={selectedCountry} onChange={setSelectedCountry}>
                <div className="flex-none">
                  <Listbox.Button className={"w-full inline-flex gap-1 px-2"}>
                    <img
                      src={selectedCountry.img}
                      className="h-5 w-7 my-auto"
                      alt={selectedCountry.name}
                    />
                    <p className="my-auto">{selectedCountry.code}</p>
                  </Listbox.Button>
                </div>
                <Listbox.Options
                  className={
                    "absolute mt-2 p-2 rounded-lg border-[#e9ebd94d] border bg-black"
                  }
                >
                  {Kotani.map((country) => (
                    <Listbox.Option
                      key={country.code}
                      value={country}
                      className={
                        "rounded-md bg-[#161817]  border border-[#e9ebd94d] p-2 mb-2 w-full"
                      }
                    >
                      {`${country.name} ${country.code}`}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>

            <div className="grow h-fit ">
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                className=" w-full bg-[#161817] border border-[#e9ebd94d] h-full p-3 placeholder:text-white rounded-md"
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-red-400 italic text-[smaller]">
                  {errors.phoneNumber?.message}
                </p>
              )}
            </div>
          </div>

          <Listbox value={serviceProvider} onChange={setServiceProvider}>
            <div className="">
              <Listbox.Button
                className={"w-full bg-[#161817] border border-[#e9ebd94d]"}
              >
                {serviceProvider}
              </Listbox.Button>
            </div>
            <Listbox.Options
              className={
                "absolute mt-1 inset-x-0 mx-2 p-2 mb-24 rounded-lg border-[#e9ebd94d] border bg-black"
              }
            >
              {selectedCountry.serviceProviders.map((provider, index) => (
                <Listbox.Option
                  key={index}
                  value={provider}
                  className={
                    "bg-[#161817] border-[#e9ebd94d] text-sm border rounded-md p-2 mb-2"
                  }
                >
                  {`${provider}`}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
        <div className="form-style form-validation p-3  bg-[#161817]">
          <p className="text-[smaller]">USDT Amount</p>
          <input
            type="number"
            name="inputAmount"
            value={USDTValue}
            className="flex-none w-full bg-transparent h-full placeholder:text-white rounded-md"
            onChange={(e) => {
              setUSDTValue(e.target.value);
            }}
          />
          {USDTValueError?.length > 0 && (
            <p className="text-red-400 italic text-[smaller]">
              {USDTValueError}
            </p>
          )}
        </div>

        <div className="form-style form-validation p-3  bg-[#161817]">
          <p className="text-[smaller]">Fiat Amount</p>
          <input
            type="number"
            name="fiatAmount"
            value={fiatAmount}
            className="flex-none w-full bg-transparent h-full placeholder:text-white rounded-md"
            onChange={(e) => {
              setFiatAmount(e.target.value);
            }}
          />
          {fiatAmountError?.length > 0 && (
            <p className="text-red-400 italic text-[smaller]">
              {fiatAmountError}
            </p>
          )}
        </div>
        <div className="px-4 pb-4 fixed bottom-0 w-full inset-x-0 max-w-md mx-auto">
          <button
            type="submit"
            className=" text-white w-full rounded-md border-[#55BB6C]  bg-[#55BB6C] hover:bg-transparent"
          >
            {isSubmitting ? <Spinner className="h-5" /> : "submit"}
          </button>
        </div>
      </form>
      <TransactionCompleteModal
        transactionComplete={transactionComplete}
        setTransactionComplete={setTransactionComplete}
        transactionStatus={transactionStatus}
        transactionMessage={transactionMessage}
        to={"/account"}
      />
    </main>
  );
};

export default KotaniPay;
