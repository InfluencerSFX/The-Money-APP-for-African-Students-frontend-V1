import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <main className="relative px-0 pb-4 mobile-screen grid place-items-center space-y-4">
      <div className="space-y-3 mt-5">
        <img
          src="/images/error-2.png"
          alt="error occured"
          className="h-auto mx-auto"
          srcset=""
        />
        <p className="">An error occured!</p>
        <button
          onClick={() => {
            navigate("/account", { replace: true });
          }}
          className="inline-flex w-full mx-auto  bg-[#336D21] rounded-md justify-center place-content-center"
        >
          Return
        </button>
      </div>
    </main>
  );
};

export default ErrorPage;
