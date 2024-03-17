const envDev = {
  VITE_SFX_BACKEND_BASE_URL: "http://localhost:3000",
  VITE_YUKI_BACKEND_BASE_URL: "http://localhost:2000",
  VITE_RP_NAME: "sfx",
  VITE_DOMAIN: "localhost",
  VITE_NGNC_PUBLIC_KEY:
    "ngnc_p_tk_1af2badc47b90e34d6add4f9f2f708c0c5cfe440a83986c2d6eb3f357f2c83ca",
};

const envTest = {
  VITE_SFX_BACKEND_BASE_URL: "https://dev-api.sfxchange.app",
  VITE_YUKI_BACKEND_BASE_URL: "https://dev-api.altra.click",
  VITE_RP_NAME: "sfx",
  VITE_DOMAIN: "sfx.vercel.app",
  VITE_NGNC_PUBLIC_KEY:
    "ngnc_p_tk_1af2badc47b90e34d6add4f9f2f708c0c5cfe440a83986c2d6eb3f357f2c83ca",
};

const envProd = {
  VITE_SFX_BACKEND_BASE_URL: "https://prod-api.sfxchange.app",
  VITE_YUKI_BACKEND_BASE_URL: "https://dev-api.altra.click",
  VITE_RP_NAME: "sfx",
  VITE_DOMAIN: "sfxchange.app",
  VITE_NGNC_PUBLIC_KEY:
    "ngnc_p_tk_1af2badc47b90e34d6add4f9f2f708c0c5cfe440a83986c2d6eb3f357f2c83ca",
};

export const env =
  process.env.NODE_ENV === "development"
    ? envDev
    : window.location.origin === "https://sfx.vercel.app"
    ? envTest
    : envProd;
