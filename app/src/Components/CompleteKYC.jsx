import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosType, getMethod } from "../api/axios";
import Spinner from "./Spinner";

const CompleteKYC = () => {
  const navigate = useNavigate();
  const [userDetails, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  useEffect(() => {
    (async () => {
      const user = await getMethod(
        "/auth/me",
        AxiosType.Main,
        token,
        refreshToken
      );
      console.log(user);
      setUser(user);
    })();
  }, []);
  console.log(userDetails?.tier);
  const display = () => {
    if (!userDetails)
      return (
        <div className="col-span-3 col-start-2">
          <Spinner as="div" />
        </div>
      );
    if (userDetails?.tier?.level === 1) {
      return (
        <div className="col-span-3 col-start-2">
          <p className="text-[#336D21]">Verified</p>
          <p className="text-xs text-[#CEC6BD]">Upgrade to Tier 2</p>
        </div>
      );
    } else if (userDetails?.tier?.level === 2) {
    } else {
      if (userDetails?.tier?.message === "Processing...")
        return (
          <div className="col-span-3 col-start-2">
            <p className="text-[#336D21]">Processing</p>
            <p className="text-xs text-[#CEC6BD]">KYC Processing</p>
          </div>
        );
      else if (!userDetails?.tier?.message)
        return (
          <div className="col-span-3 col-start-2">
            <p className="text-[#336D21]">Complete your KYC</p>
            <p className="text-xs text-[#CEC6BD]">
              Please complete your KYC to start transacting
            </p>
          </div>
        );
      else
        return (
          <div className="col-span-3 col-start-2">
            <p className="text-[#336D21]">Error, Try again</p>
            <p className="text-xs text-[#CEC6BD]">
              {userDetails?.tier?.message}
            </p>
          </div>
        );
    }
  };
  return (
    <button
      className="relative grid grid-cols-4 p-3 w-full bg-[#161817] rounded-lg border border-[#e9ebd94d]"
      onClick={() => {
        navigate("/kyc");
      }}
    >
      <img
        className="col-span-1 absolute bottom-5 left-3"
        src="/images/compliance.png"
        alt=""
        srcSet=""
      />
      {display()}
    </button>
  );
};

export default CompleteKYC;
