const envDev = {
  VITE_SFX_BACKEND_BASE_URL: "http://localhost:3000",
  VITE_YUKI_BACKEND_BASE_URL: "http://localhost:2000",
  VITE_RP_NAME: "sfx",
  VITE_DOMAIN: "localhost",
};

const envTest = {
  VITE_SFX_BACKEND_BASE_URL: "https://dev-api.sfxchange.app",
  VITE_YUKI_BACKEND_BASE_URL: "https://dev-api.altra.click",
  VITE_RP_NAME: "sfx",
  VITE_DOMAIN: "sfx.vercel.app",
};

const envProd = {
  VITE_SFX_BACKEND_BASE_URL: "https://dev-api.sfxchange.app",
  VITE_YUKI_BACKEND_BASE_URL: "https://dev-api.altra.click",
  VITE_RP_NAME: "sfx",
  VITE_DOMAIN: "sfxchange.app",
};

export const env =
  process.env.NODE_ENV === "development"
    ? envDev
    : window.location.origin === "https://sfx.vercel.app"
    ? envTest
    : envProd;
