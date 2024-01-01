import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../Components/Spinner";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const AUTH_URL = "/posts/";

const Auth = () => {
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [Loading, setLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setLoading(true);
      const response = await axios.get(AUTH_URL, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setAuth({ user: "gozie", authenticated: true });
      }
      setLoading(false);
    } catch (error) {
      setAuth(null);
    }
  };

  return auth?.authenticated ? (
    <Navigate to="/secure-wallet" state={{ from: location }} replace />
  ) : (
    <>
      <div className="mobile-screen">
        <div className="flex flex-col place-items-center h-full">
          <div className="basis-4/6 w-10/12 flex">
            <img
              src="/images/sfx-mark.png"
              alt=""
              srcSet=""
              className="rounded-md my-auto mx-auto "
            />
          </div>

          <div className="basis-2/6 flex place-items-center text-3xl text-center font-medium px-1">
            <p>Secure Money App for African Expats</p>
          </div>

          <div className="basis-1/6 w-full space-y-3 py-4">
            <button
              onClick={() => {
                handleAuth();
              }}
              className="inline-flex bg-[#336D21] rounded-md w-full"
            >
              <div className="basis-1/8">
                {Loading ? (
                  <Spinner />
                ) : (
                  <img
                    className="flex-none h-auto"
                    src="/images/flat-color-icons_google.png"
                    alt=""
                    srcSet=""
                  />
                )}
              </div>
              <div className="basis-5/6">
                <p className="mx-auto">Sign in with Google</p>
              </div>
            </button>
            <p className="text-center opacity-60 text-sm mt-auto">
              By proceeding, you accept our Terms of Service and Privacy
              Statement
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
