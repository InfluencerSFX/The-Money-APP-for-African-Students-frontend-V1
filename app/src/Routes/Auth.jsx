import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import useAuth from "../hooks/useAuth";

const Auth = () => {
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(document.location.search);
  const token = searchParams.get("token") || localStorage.getItem("token");
  const refreshToken =
    searchParams.get("refreshToken") || localStorage.getItem("refreshToken");

  useEffect(() => {
    if (token && refreshToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      navigate("/secure-wallet", { state: { from: location }, replace: true });
    }
  }, []);

  const handleAuth = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_YUKI_BACKEND_BASE_URL}/auth/google`
      );
      window.location.href = res.data;
    } catch (error) {
      setAuth(null);
    }
  };

  return auth?.authenticated ? (
    <Navigate to="/secure-wallet" state={{ from: location }} replace />
  ) : (
    <main className="bg-black">
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
                <p className="mx-auto">Continue with Google</p>
              </div>
            </button>
            <p className="text-center opacity-60 text-sm mt-auto">
              By proceeding, you accept our Terms of Service and Privacy
              Statement
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
