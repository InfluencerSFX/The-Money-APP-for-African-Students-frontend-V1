const ConnectWallet = () => {
  return (
    <div className="flex flex-col place-items-center h-full space-y-5 ">
      <div className=" place-self-start basis-2/6 place-items-center font-medium pt-6 mt-6 space-y-5 w-5/6">
        <p className="text-2xl text-white opacity-100">
          Connect to your existing wallet
        </p>
        <div>
          <p className="text-sm text-[#CEC6BD] leading-relaxed">
            Connect to an existing wallet, restore it, and access the wallet
          </p>
        </div>
      </div>

      <div className=" w-10/12 flex h-1/3 ">
        <img
          src="/images/biometric-key.png"
          alt=""
          srcSet=""
          className="rounded-md my-auto mx-auto h-4/6"
        />
      </div>

      <div className="basis-3/6 w-full space-y-5 ">
        <button className=" bg-[#336D21] rounded-md w-full text-center ">
          Authenticate with Passkey
        </button>
        <p className="text-sm text-[#CEC6BD]">
          If you are unable to authenticate with a passkey, or cannot proceed
          from the passkey authentication screen, please cancel the
          authentication. You will nbe redirected to the passkey settings screen
        </p>
      </div>
    </div>
  );
};

export default ConnectWallet;
