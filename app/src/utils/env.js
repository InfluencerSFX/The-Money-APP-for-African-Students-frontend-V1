const envDev = {
  VITE_SFX_BACKEND_BASE_URL: "http://localhost:3000",
  VITE_YUKI_BACKEND_BASE_URL: "http://localhost:2000",
  VITE_RP_NAME: "sfx",
  VITE_DOMAIN: "localhost",
  VITE_NGNC_PUBLIC_KEY:
    "ngnc_p_lk_dcbe3d76a9d1c8991b470a2bc69a1f6f19515c9cd8749e6825b69cdfb40cefa0",
};

const envTest = {
  VITE_SFX_BACKEND_BASE_URL: "https://dev-api.sfxchange.app",
  VITE_YUKI_BACKEND_BASE_URL: "https://dev-api.altra.click",
  VITE_RP_NAME: "sfx",
  VITE_DOMAIN: "sfx.vercel.app",
  VITE_NGNC_PUBLIC_KEY:
    "ngnc_p_lk_dcbe3d76a9d1c8991b470a2bc69a1f6f19515c9cd8749e6825b69cdfb40cefa0",
};

const envProd = {
  VITE_SFX_BACKEND_BASE_URL: "https://prod-api.sfxchange.app",
  VITE_YUKI_BACKEND_BASE_URL: "https://dev-api.altra.click",
  VITE_RP_NAME: "sfx",
  VITE_DOMAIN: "sfxchange.app",
  VITE_NGNC_PUBLIC_KEY:
    "ngnc_p_lk_dcbe3d76a9d1c8991b470a2bc69a1f6f19515c9cd8749e6825b69cdfb40cefa0",
};

export const env =
  process.env.NODE_ENV === "development"
    ? envDev
    : window.location.origin === "https://sfx.vercel.app"
    ? envTest
    : envProd;
