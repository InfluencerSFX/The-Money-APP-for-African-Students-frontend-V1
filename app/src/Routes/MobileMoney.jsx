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

const MobileMoney = () => {
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
      serviceProvider,
    });
    let customerKey = user?.customerKey;
    if (!customerKey) {
      console.log("mobile money");
      customerKey = await postMethod(
        "/auth/mobile-money",
        {
          phoneNumber: `${selectedCountry.code}${data.phoneNumber}`,
          network: serviceProvider,
          countryCode: selectedCountry.letter,
        },
        AxiosType.Main,
        token,
        refreshToken
      );
      if (customerKey?.isError || !customerKey) {
        setTransactionStatus(false);
        setTransactionComplete(true);
        setTransactionMessage(customerKey?.message);
      } else {
        setTransactionStatus(true);
        setTransactionComplete(true);
        setTransactionMessage("SUCCESS");
      }
    }
    const wallet = user?.wallets?.find(
      (w) => w.blockchain === "Polygon" && w.asset.includes("USDT")
    );
    console.log(wallet);
  };

  const [selectedCountry, setSelectedCountry] = useState(Kotani[0]);

  const [serviceProvider, setServiceProvider] = useState(
    selectedCountry.serviceProviders[0]
  );

  const navigate = useNavigate();

  useEffect(() => {
    setServiceProvider(selectedCountry.serviceProviders[0]);
  }, [selectedCountry]);

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

export default MobileMoney;
