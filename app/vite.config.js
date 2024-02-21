import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default {
  plugins: [
    react(),
    VitePWA({
      manifest: {
        icons: [
          {
            src: "/apple-touch-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "apple-touch-icon",
          },
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        name: "SFx",
        theme_color: "#146f0e",
        background_color: "#ae5b35",
        display: "standalone",
        short_name: "SFx",
        description: "The money platform for African expats",
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.pathname.startsWith("/api");
            },
            handler: "CacheFirst",
            options: {
              cacheName: "api-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
};

// const manifestForPlugin = {
//   registerType: "prompt",
//   includeAssets: ["favicon.ico", "pwa-icon-512.png", "android-chrome-512x512.png", "apple-touch-icon.png", "mask-icon.svg", "cr.jpg"], //I tried adding/removing icon name from here but , no change, generate the 4 icons only

//   manifest: {
//       name: "App name",
//       short_name: "short name",
//       description: "desc...",
//       icons: [
//           {
//               src: "/images/pwa-icon-512.png", //dosen't generate

//               sizes: "512x512",
//               type: "image/png",
//               purpose: "any maskable",
//           },
//           {
//               src: "/images/android-chrome-512x512.png", //dosen't generate
//               sizes: "512x512",
//               type: "image/png",
//               purpose: "any maskable",
//           },
//           {
//               src: "/images/apple-touch-icon.png",
//               sizes: "180x180",
//               type: "image/png",
//               purpose: "apple touch icon",
//           },
//           {
//               src: "/images/mask-icon.svg",
//               sizes: "144x65",
//               type: "image/svg+xml",
//               purpose: "any maskable",
//           },
//           {
//               src: "/images/cr.jpg",
//               sizes: "457x450",
//               type: "image/jpg",
//               purpose: "any maskable",
//           }
//       ],
//       theme_color: "#1e1e1e",
//       background_color: "#1e1e1e",
//       display: "standalone",
//       scope: "/",
//       start_url: "/",
//       orientation: "portrait",
//   },
// };
