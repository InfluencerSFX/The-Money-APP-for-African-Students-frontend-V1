import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosType, getMethod } from "../api/axios";
import { BVN, Codes } from "../utils/utilityFunctions";
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
  const displayBVN = () => {
    if (!userDetails?.bvn)
      return <p className="text-xs text-[#CEC6BD]">BVN Not Verified</p>;
    else if (userDetails?.bvn?.code === Codes.Processing)
      return (
        <p className="text-xs text-[#CEC6BD]">BVN Verification Processing</p>
      );
    else if (userDetails?.bvn?.bvn && userDetails?.bvn?.code === Codes.Success)
      return <p className="text-xs text-[#CEC6BD]">BVN Verified</p>;
    else
      return <p className="text-xs text-[#CEC6BD]">BVN Verification Failed</p>;
  };
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
          {displayBVN()}
        </div>
      );
    } else if (!userDetails?.tier) {
      return (
        <div className="col-span-4 text-left col-start-2">
          <p className="text-[#336D21]">Complete your Verification</p>
          <p className="text-xs text-[#CEC6BD]">
            Complete your Verification to start transacting
          </p>
          {displayBVN()}
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
          {displayBVN()}
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
          {displayBVN()}
        </div>
      );
    } else {
      return (
        <div className="col-span-4 text-left col-start-2">
          <p className="text-[#6d2121]">Error, Try again</p>
          <p className="text-xs text-[#CEC6BD]">{userDetails?.tier?.message}</p>
          {displayBVN()}
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
        className="col-span-1 absolute bottom-[1rem] left-4"
        src="/images/compliance.png"
        alt=""
        srcSet=""
      />
      {display()}
    </button>
  );
};

export default CompleteVerification;
