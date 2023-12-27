import axios from "axios";
import { saveAccessToken } from "../functions/saveAccessToken";

export const mainAxios = axios.create({
  baseURL: import.meta.env.VITE_SFX_BACKEND_BASE_URL,
});

export const yukiAxios = axios.create({
  baseURL: import.meta.env.VITE_YUKI_BACKEND_BASE_URL,
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
export async function postMethod(url, body, axiosType, token, refreshToken) {
  const a = axiosType === AxiosType.Yuki ? yukiAxios : mainAxios;
  try {
    const res = await a.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "refresh-token": refreshToken,
      },
    });
    saveAccessToken(res);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 * @param {string} url
 * @param {string} axiosType
 * @param {string} token
 * @param {string} refreshToken
 */
export async function getMethod(url, axiosType, token, refreshToken) {
  const a = axiosType === AxiosType.Yuki ? yukiAxios : mainAxios;
  try {
    const res = await a.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "refresh-token": refreshToken,
      },
    });
    saveAccessToken(res);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
