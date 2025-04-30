import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const baseConfig: AxiosRequestConfig = {
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
  withCredentials: true,
};

export const createBaseAxiosInstance = (): AxiosInstance => {
  return axios.create(baseConfig);
};