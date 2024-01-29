import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import Spinner from "./Spinner";

const schema = yup
  .object({
    firstName: yup.string().required(),
    surname: yup.string().required(),
    address: yup.string().required(),
    universityName: yup.string().required(),
    bankName: yup.string().required(),
    IBAN: yup
      .string()
      .matches(/^TR/, "must start with TR")
      .length(26, "IBAN must be 26 characters")
      .required()
      .uppercase()
      .trim(),
    accountNumber: yup
      .string()
      .length(16, "Account number must be 16 Numbers")
      .required(),
    description: yup.string().max(30, "30 characters maximum").required(),
  })
  .required();

const TuitionForm = ({ setValidated }) => {
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
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // throw new Error();
      alert("form submitted successfully");
      setValidated(true);
    } catch (error) {
      setError("root", { message: "something went wrong" });
    }
  };
  return (
    <div className="h-full grid p-4 place-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 w-full overflow-y-auto"
      >
        <div className="bg-[#e9ebd94d] inline-flex gap-2 px-2 py-1 rounded-lg w-full">
          <InformationCircleIcon className="h-4 place-self-center" />
          <p className="text-sm">Fill transaction details</p>
        </div>

        <div className="form-style form-validation">
          <input
            type="text"
            className="bg-transparent w-full"
            autocomplete="chrome-off"
            placeholder="First Name"
            {...register("firstName")}
          />{" "}
          {errors.firstName && (
            <p className="text-red-400 italic text-[smaller]">
              {errors.firstName?.message}
            </p>
          )}
        </div>

        <div className="form-style form-validation">
          <input
            type="text"
            className="bg-transparent w-full"
            autocomplete="chrome-off"
            placeholder="Surname"
            {...register("surname")}
          />{" "}
          {errors.surname && (
            <p className="text-red-400 italic text-[smaller]">
              {errors.surname?.message}
            </p>
          )}
        </div>

        <div className="form-style form-validation">
          <input
            type="text"
            className="bg-transparent w-full"
            autocomplete="chrome-off"
            placeholder="Your Address"
            {...register("address")}
          />{" "}
          {errors.address && (
            <p className="text-red-400 italic text-[smaller]">
              {errors.address?.message}
            </p>
          )}
        </div>

        <div className="form-style form-validation">
          <input
            type="text"
            className="bg-transparent w-full"
            autoComplete="chrome-off"
            placeholder="University Name"
            {...register("universityName")}
          />{" "}
          {errors.universityName && (
            <p className="text-red-400 italic text-[smaller]">
              {errors.universityName?.message}
            </p>
          )}
        </div>

        <div className="form-style form-validation">
          <input
            type="text"
            className="bg-transparent w-full"
            autoComplete="chrome-off"
            placeholder="Bank Name"
            {...register("bankName")}
          />{" "}
          {errors.bankName && (
            <p className="text-red-400 italic text-[smaller]">
              {errors.bankName?.message}
            </p>
          )}
        </div>

        <div className="form-style form-validation">
          <input
            type="text"
            className="bg-transparent w-full"
            autoComplete="chrome-off"
            placeholder="IBAN"
            {...register("IBAN")}
          />{" "}
          {errors.IBAN && (
            <p className="text-red-400 italic text-[smaller]">
              {errors.IBAN?.message}
            </p>
          )}
        </div>

        <div className="form-style form-validation">
          <input
            type="number"
            className="bg-transparent w-full"
            autoComplete="chrome-off"
            placeholder="Account Number"
            {...register("accountNumber")}
          />{" "}
          {errors.accountNumber && (
            <p className="text-red-400 italic text-[smaller]">
              {errors.accountNumber?.message}
            </p>
          )}
        </div>

        <div className="form-style form-validation">
          <input
            type="text"
            className="bg-transparent w-full"
            autoComplete="chrome-off"
            placeholder="Transaction Description"
            {...register("description")}
          />{" "}
          {errors.description && (
            <p className="text-red-400 italic text-[smaller]">
              {errors.description?.message}
            </p>
          )}
        </div>
        {errors.root && (
          <div className="bg-red-400 inline-flex gap-2 p-2 rounded-lg w-full">
            <InformationCircleIcon className="h-4 place-self-center" />
            <p className="text-sm text-white">{errors.root?.message}</p>
          </div>
        )}

        <button className="bg-[#55BB6C] w-full rounded-lg" type="submit">
          {isSubmitting ? <Spinner className="h-5" /> : "submit"}
        </button>
      </form>
    </div>
  );
};

export default TuitionForm;
