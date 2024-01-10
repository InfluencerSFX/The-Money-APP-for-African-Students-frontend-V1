import { useNavigate } from "react-router-dom";

const CompleteKYC = () => {
  const navigate = useNavigate();
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
      <div className="col-span-3 col-start-2">
        <p className="text-[#336D21]">Verify your email</p>
        <p className="text-xs text-[#CEC6BD]">
          We’ll send you a verification code
        </p>
      </div>
    </button>
  );
};

export default CompleteKYC;
