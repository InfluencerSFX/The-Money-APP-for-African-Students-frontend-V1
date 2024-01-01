const SecureWallet = () => {
  return (
    <main className="bg-black mobile-screen">
      <div className="flex flex-col place-items-center h-full">
        <div className="basis-4/6 w-10/12 flex">
          <img
            src="/images/lock.png"
            alt=""
            srcSet=""
            className="rounded-md my-auto mx-auto"
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
          <button className=" bg-[#336D21] rounded-md w-full text-center ">
            Next
          </button>
        </div>
      </div>
    </main>
  );
};

export default SecureWallet;
