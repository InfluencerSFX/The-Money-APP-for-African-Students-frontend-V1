import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMethod } from "../api/axios";
import Spinner from "../Components/Spinner";

const SecureWallet = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const searchParams = new URLSearchParams(document.location.search);
  const token = searchParams.get("token") || localStorage.getItem("token");
  const refreshToken =
    searchParams.get("refreshToken") || localStorage.getItem("refreshToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (token && refreshToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      navigate("/auth", { state: { from: location }, replace: true });
    }
  }, []);

  const passkey = async () => {
    setLoading(true);
    const data = await getMethod("/auth/credential", true, token, refreshToken);
    console.log(data);
    setLoading(false);
    if (data.length > 0) {
      navigate("/connect-wallet", {
        state: { from: location },
      });
    } else {
      navigate("/register-passkey", {
        state: { from: location },
      });
    }
  };

  return (
    <div className="flex flex-col place-items-center h-full">
      <div className="basis-4/6 w-10/12 flex">
        <img
          src="/images/lock.png"
          alt=""
          srcSet=""
          className="rounded-md my-auto "
        />
      </div>

      <div className="basis-2/6 place-items-center font-medium bg-faded rounded-md p-4 pt-6 space-y-5">
        <p className="text-2xl text-white opacity-100">Secure your wallet</p>
        <p className="text-sm text-[#CEC6BD]">
          Your wallet will be locked and secured just like your phone. Just
          unlock to send money.{" "}
        </p>
        <p className="text-sm text-[#CEC6BD]">
          Your wallet keys will be backed up to your Google account.
        </p>
      </div>

      <div className="basis-1/6 w-full space-y-3 py-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <button
            onClick={passkey}
            className=" bg-[#336D21] rounded-md w-full text-center "
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default SecureWallet;
