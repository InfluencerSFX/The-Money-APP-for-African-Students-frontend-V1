import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosType, getMethod } from "../api/axios";
import { Codes } from "../utils/utilityFunctions";
import Spinner from "./Spinner";

const CompleteVerification = () => {
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
      setUser(user);
    })();
  }, []);
  const display = () => {
    if (!userDetails)
      return (
        <div className="col-span-4 text-left col-start-2">
          <Spinner as="div" />
        </div>
      );
    if (userDetails?.tier?.code === Codes.Processing) {
      return (
        <div className="col-span-4 text-left col-start-2">
          <p className="text-[#336D21]">Processing</p>
          <p className="text-xs text-[#CEC6BD]">Verification Processing</p>
        </div>
      );
    } else if (!userDetails?.tier || userDetails?.tier?.level === 0) {
      return (
        <div className="col-span-4 text-left col-start-2">
          <p className="text-[#336D21]">Complete your Verification</p>
          <p className="text-xs text-[#CEC6BD]">
            Complete your Verification to start transacting
          </p>
        </div>
      );
    } else if (
      userDetails?.tier?.level === 1 &&
      userDetails?.tier?.code === Codes.Success
    ) {
      return (
        <div className="col-span-4 text-left col-start-2">
          <p className="text-[#336D21]">Verified</p>
          <p className="text-xs text-[#CEC6BD]">Upgrade to Tier 2</p>
        </div>
      );
    } else if (
      userDetails?.tier?.level === 2 &&
      userDetails?.tier?.code === Codes.Success
    ) {
      return (
        <div className="col-span-4 text-left col-start-2">
          <p className="text-[#336D21]">Upgraded</p>
          <p className="text-xs text-[#CEC6BD]">Upgraded to Tier 2</p>
        </div>
      );
    } else {
      return (
        <div className="col-span-4 text-left col-start-2">
          <p className="text-[#6d2121]">Error, Try again</p>
          <p className="text-xs text-[#CEC6BD]">{userDetails?.tier?.message}</p>
        </div>
      );
    }
  };
  return (
    <button
      className="relative grid grid-cols-5 p-3 w-full bg-[#161817] rounded-lg border border-[#e9ebd94d]"
      onClick={() => {
        navigate("/kyc");
      }}
    >
      <img
        className="col-span-1 absolute bottom-6 md:bottom-3 lg:bottom-7 left-4"
        src="/images/compliance.png"
        alt=""
        srcSet=""
      />
      {display()}
    </button>
  );
};

export default CompleteVerification;
