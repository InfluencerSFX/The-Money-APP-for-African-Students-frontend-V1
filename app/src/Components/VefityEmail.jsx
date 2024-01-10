const VerifyEmail = () => {
  return (
    <button className="relative grid grid-cols-4 p-3 m-0 w-full bg-[#161817] rounded-lg border border-[#e9ebd94d]">
      <img
        className="col-span-1 absolute bottom-5 left-3"
        src="/images/mail.png"
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

export default VerifyEmail;
