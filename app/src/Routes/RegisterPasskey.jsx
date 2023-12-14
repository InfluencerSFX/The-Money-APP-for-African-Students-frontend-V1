import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { getMethod, postMethod } from "../api/axios";
import Spinner from "../Components/Spinner";
import CreatePassKeyCredential from "../hooks/CreatePasskeyCredential";
import { validatePassKeyCreation } from "../hooks/validatePassKeyCreation";

const RegisterPasskey = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const data = await getMethod(
        "/auth/credential",
        true,
        token,
        refreshToken
      );
      if (data.length > 0) {
        navigate("/connect-wallet", {
          state: { from: location },
        });
      }
    })();
  }, []);
  const createPassKey = async () => {
    setLoading(true);
    const data = await postMethod(
      "/auth/register-request",
      {},
      true,
      token,
      refreshToken
    );
    const {
      userId,
      challengeBufferString,
      username,
      displayName,
      excludeCredentials,
      authenticatorSelection,
    } = data;
    console.log("✅  Created userId : ", userId);
    console.log("✅ Created challengeBufferString : ", challengeBufferString);
    try {
      const credential = await CreatePassKeyCredential(
        username.toLowerCase(),
        displayName.toLowerCase(),
        challengeBufferString,
        userId,
        excludeCredentials,
        authenticatorSelection
      );

      console.log("✅ Created Pass Key Credential ! ");
      if (credential) {
        console.log("✅ Credential is not null : ", credential);
        const clientData = await postMethod(
          "/auth/register-response",
          {
            id: credential.id,
            response: {
              clientDataJSON: isoBase64URL.fromBuffer(
                credential.response.clientDataJSON
              ),
              attestationObject: isoBase64URL.fromBuffer(
                credential.response.attestationObject
              ),
            },
            authenticatorAttachment: "cross-platform",
            rawId: isoBase64URL.fromBuffer(credential.rawId),
            type: credential.type,
          },
          true,
          token,
          refreshToken
        );
        setLoading(false);
        console.log(clientData);
        console.log(window.location.origin);
        const challenge = validatePassKeyCreation(clientData);
        if (!challenge) {
          console.log("❌ PassKey verification failed.");
          return;
        } else {
          console.log(
            "✅ PassKey verification passed with challenge : ",
            challenge
          );
          await postMethod(
            "/auth/credential",
            {
              challenge,
              challengeBuffer: challengeBufferString,
            },
            true,
            token,
            refreshToken
          );
          navigate("/connect-wallet", {
            state: { from: location },
          });
        }
      } else {
        console.log("❌ Credential does not exist.");
      }
    } catch (error) {
      console.log("❌ Error creating credential");
      console.error("ERROR: ", error);
    }
  };
  return (
    <div className="flex flex-col place-items-center h-full space-y-5 ">
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
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <button
            onClick={createPassKey}
            className=" bg-[#336D21] rounded-md w-full text-center "
          >
            Register Passkey
          </button>
        )}
        <p className="text-sm text-[#CEC6BD]">
          If an error occurs please go back to the previous page and start
          again.
        </p>
      </div>
    </div>
  );
};

export default RegisterPasskey;
