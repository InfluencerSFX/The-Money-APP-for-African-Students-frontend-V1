import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosType, getMethod, postMethod } from "../api/axios";
import Spinner from "../Components/Spinner";
import getPasskeyCredential from "../hooks/getPassKeyCredential";
import { isoBase64URL } from "@simplewebauthn/server/helpers";

const ConnectWallet = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    (async () => {
      const data = await getMethod(
        "/auth/credential",
        AxiosType.Yuki,
        token,
        refreshToken
      );
      const credentialOnDevice = localStorage.getItem("credential");
      const credentialOnDeviceParsed = JSON.parse(credentialOnDevice);
      if (!credentialOnDeviceParsed && data.length == 0) {
        navigate("/register-passkey", {
          state: { from: location },
        });
      }
    })();
  }, []);

  const performLogin = async (userAccount) => {
    console.log("⚈ ⚈ ⚈ performLogin ⚈ ⚈ ⚈");
    try {
      const credential = await getPasskeyCredential(userAccount);
      console.log(" performLogin ✅ credential : ", credential);
      return credential;
    } catch (error) {
      console.log(
        "performLogin ❌  Failed to get credential with error : ",
        error
      );
      return null;
    }
  };

  const signin = async () => {
    setLoading(true);
    const credentialOnDevice = localStorage.getItem("credential");
    const credentialOnDeviceParsed = JSON.parse(credentialOnDevice);
    const userAccount = await postMethod(
      "/auth/signin-request",
      { challenge: credentialOnDeviceParsed.challenge },
      AxiosType.Yuki,
      token,
      refreshToken
    );
    if (userAccount !== null) {
      console.log(
        "Get User Account ✅ There is a match for that username : ",
        userAccount
      );
      // Login with the details.
      // This part remains on the front-end in production.
      const credential = await performLogin(userAccount);
      console.log(credential);
      if (credential !== null) {
        /*
          This functionality confirms that theres a credentials are valid
          and that they match the details related to the users account.
      */
        try {
          const data = await postMethod(
            "/auth/signin-response",
            {
              credential: {
                id: credential.id,
                response: {
                  clientDataJSON: isoBase64URL.fromBuffer(
                    credential.response.clientDataJSON
                  ),
                  attestationObject: isoBase64URL.fromBuffer(
                    credential.response.attestationObject
                  ),
                  userHandle: isoBase64URL.fromBuffer(
                    credential.response.userHandle
                  ),
                },
                authenticatorAttachment: "cross-platform",
                rawId: isoBase64URL.fromBuffer(credential.rawId),
                type: credential.type,
              },
              user: userAccount,
            },
            AxiosType.Yuki,
            token,
            refreshToken
          );
          const { verifiedUserId, verifiedClientData } = data;
          switch (verifiedUserId) {
            case true:
              switch (verifiedClientData) {
                case true:
                  console.log("✅ You have successfully logged in.");
                  navigate("/", {
                    state: { from: location },
                  });
                  break;
                case false:
                  console.log("❌ The challenge does not match.");
                  break;
              }
              break;
            case false:
              break;
          }
        } catch (error) {
          console.log(error);
        }
      }
      setLoading(false);
    }
  };
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
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <button
            onClick={signin}
            className=" bg-[#336D21] rounded-md w-full text-center "
          >
            Authenticate with Passkey
          </button>
        )}
        <p className="text-sm text-[#CEC6BD]">
          If you are unable to authenticate with a passkey, or cannot proceed
          from the passkey authentication screen, please cancel the
          authentication. You will be redirected to the passkey settings screen
        </p>
      </div>
    </div>
  );
};

export default ConnectWallet;
