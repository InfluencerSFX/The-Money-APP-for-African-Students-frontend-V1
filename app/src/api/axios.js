import axios from "axios";
import { saveAccessToken } from "../functions/saveAccessToken";
import { env } from "../utils/env";

export const backend = axios.create({
  baseURL: env.VITE_SFX_BACKEND_BASE_URL,
});

export const AxiosType = {
  Yuki: "Yuki",
  Main: "Main",
};

/**
 *
 * @param {string} url
 * @param {any} body
 * @param {string} axiosType
 * @param {string} token
 * @param {string} refreshToken
 */
export async function postMethod(url, body, token, refreshToken) {
  try {
    const res = await backend.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "refresh-token": refreshToken,
      },
    });
    saveAccessToken(res);
    return res.data;
  } catch (error) {
    console.error(error);
    console.error(error?.response?.data?.statusCode);
    if (error?.response?.data?.statusCode == 401) {
      window.location.href = `${window.location.origin}/auth?signin=true`;
    } else {
      return { ...error?.response?.data, isError: true };
    }
  }
}

/**
 *
 * @param {string} url
 * @param {string} axiosType
 * @param {string} token
 * @param {string} refreshToken
 */
export async function getMethod(url, token, refreshToken) {
  try {
    const res = await backend.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "refresh-token": refreshToken,
      },
    });
    saveAccessToken(res);
    return res.data;
  } catch (error) {
    console.error(error?.response?.data?.statusCode);
    if (error?.response?.data?.statusCode == 401) {
      window.location.href = `${window.location.origin}/auth?signin=true`;
    }
  }
}
