const RegisterPasskey = () => {
  return (
    <main className="bg-black mobile-screen">
      <div className="flex flex-col lg:max-w-md place-items-center h-full space-y-5 ">
        <div className=" place-self-start basis-2/6 place-items-center font-medium pt-6 mt-6 space-y-5 w-5/6">
          <p className="text-2xl text-white opacity-100">Register Passkey</p>
          <div>
            <p className="text-sm text-[#CEC6BD] mb-1">
              Please register a passkey on your device
            </p>
            <p className="text-sm text-[#CEC6BD] leading-relaxed">
              Setting up a passkey enable you to sign securely with your phone
              security.
            </p>
          </div>
        </div>

        <div className="basis-2/6 w-10/12 flex ">
          <img
            src="/images/biometric-key.png"
            alt=""
            srcSet=""
            className="rounded-md my-auto mx-auto "
          />
        </div>

        <div className="basis-2/6 w-full space-y-5 py-4">
          <button className=" bg-[#336D21] rounded-md w-full text-center ">
            Register Passkey
          </button>
          <p className="text-sm text-[#CEC6BD]">
            If an error occurs please go back to the previous page and start
            again.
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPasskey;
