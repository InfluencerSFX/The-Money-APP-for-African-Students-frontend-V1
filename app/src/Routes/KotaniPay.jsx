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

const schema = yup.object({
  phoneNumber: yup.number().required(),
  walletAddress: yup
    .string()
    .required()
    .max(48, "should not exceed 48 characters"),
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

  const onSubmit = async (data) => {
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
  };

  const [selectedCountry, setSelectedCountry] = useState(Kotani[0]);
  const [showForm2, setShowForm2] = useState(false);

  const [serviceProvider, setServiceProvider] = useState(
    selectedCountry.serviceProviders[0]
  );

  const [USDTValue, setUSDTValue] = useState(0);
  const [USDTValueError, setUSDTValueError] = useState("");
  const [UGXValue, setUGXValue] = useState(0);
  const [UGXValueError, setUGXValueError] = useState("");
  // const [outputUSDT, setOutputUSDT] = useState(null);
  // const [inputUGX, setInputUGX] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setServiceProvider(selectedCountry.serviceProviders[0]);
  }, [selectedCountry]);

  useEffect(() => {
    setUGXValue(USDTValue * 2);
  }, [USDTValue]);

  useEffect(() => {
    setUSDTValue(UGXValue / 2);
  }, [UGXValue]);

  return (
    <main className=" relative px-0 mobile-screen space-y-4 bg-black text-white overflow-y-auto no-scrollbar">
      <div className="border-b border-[#e9ebd94d]">
        <button
          className=" bg-transparent inline-flex text-[#55BB6C] gap-3 hover:border-black"
          onClick={() => {
            showForm2 ? setShowForm2(false) : navigate(-1);
          }}
        >
          <ArrowLeftIcon className="h-6 text-[#D4B998] my-auto" />
          <p className="my-auto">Kotani Pay</p>
        </button>
      </div>

      <div className="w-full p-4 min-h-fit space-y-2">
        <p className="font-semi-bold mb-4 text-lg">
          Send and Recieve through Kotani Pay
        </p>
        {!showForm2 ? (
          <div className=" space-y-2">
            <div className="inline-flex w-full gap-2">
              <div className="min-w-fit bg-[#161817] rounded-md border border-[#e9ebd94d]">
                <Listbox value={selectedCountry} onChange={setSelectedCountry}>
                  <div className="basis-full">
                    <Listbox.Button className={"w-full"}>
                      {selectedCountry.name}
                    </Listbox.Button>
                  </div>
                  <Listbox.Options className={"absolute mt-2"}>
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

              <div className="w-full">
                <input
                  type="text"
                  name="phoneNumber"
                  id="telephone_number"
                  className="flex-none min-w-full bg-[#161817] border border-[#e9ebd94d] h-full p-3 placeholder:text-white rounded-md"
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
                className={"absolute mt-1 inset-x-0 mx-2 px-2 mb-24"}
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
        ) : (
          <div className="w-full space-y-2">
            <div className="w-full p-3 bg-[#e9ebd94d] inline-flex justify-between rounded-md">
              <div className="space-y-1">
                <p className="">USDT</p>
                <p className="text-sm">Polygon</p>
              </div>
              <img src={usdt} />
            </div>
            <div className="form-style form-validation p-3">
              <input
                type="text"
                name="walletAddress"
                id="walletAddress"
                placeholder="wallet Address"
                className="flex-none bg-[#161817] w-full bg-transparent h-full placeholder:text-white rounded-md"
                {...register("walletAddress")}
              />
              {errors.walletAddress && (
                <p className="text-red-400 italic text-[smaller]">
                  {errors.walletAddress?.message}
                </p>
              )}
            </div>
            <div className="form-style form-validation p-3">
              <p className="text-[smaller]">USDT Amount</p>
              <input
                type="number"
                name="inputAmount"
                value={USDTValue}
                className="flex-none bg-[#161817] w-full bg-transparent h-full placeholder:text-white rounded-md"
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

            <div className="form-style form-validation p-3">
              <p className="text-[smaller]">UGX Amount</p>
              <input
                type="number"
                name="UGXAmount"
                value={UGXValue}
                className="flex-none bg-[#161817] w-full bg-transparent h-full placeholder:text-white rounded-md"
                onChange={(e) => {
                  setUGXValue(e.target.value);
                }}
              />
              {UGXValueError?.length > 0 && (
                <p className="text-red-400 italic text-[smaller]">
                  {UGXValueError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 fixed bottom-0 w-full max-w-[inherit]">
        <button
          type="button"
          onClick={() => {
            showForm2 ? handleSubmit : setShowForm2(true);
          }}
          className=" text-white w-full bg-lime-700 rounded-md"
        >
          {!showForm2 ? "Next" : isSubmitting ? <Spinner /> : "Submit"}
        </button>
      </div>
    </main>
  );
};

export default KotaniPay;
