import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

const config: AxiosRequestConfig = {
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420", // For ngrok bypass
  },
  withCredentials: true, // Critical: Ensures accessToken and refreshToken cookies are sent/received
};

const axiosInstance: AxiosInstance = axios.create(config);

// State to manage concurrent refresh requests
let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

// Queue requests waiting for token refresh
const addRefreshSubscriber = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

// Notify queued requests after refresh (no token passed since it’s in cookies)
const onTokenRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = []; // Clear queue
};

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response, // Success: Pass through
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Check for 401 and ensure we don’t retry infinitely
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue request if refresh is already happening
        return new Promise((resolve) => {
          addRefreshSubscriber(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      // Start refresh process
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh endpoint uses refreshToken cookie to set a new accessToken cookie
        await axios.get("/api/user/auth/refresh-token", {
          withCredentials: true, // Sends refreshToken cookie
        });

        // Refresh complete: New accessToken cookie is set by server
        onTokenRefreshed();
        isRefreshing = false;

        // Retry original request with new accessToken cookie
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = []; // Clear queue on failure

        // Redirect to signin if refresh fails (e.g., refreshToken expired)
        if (!["/signin", "/signup"].includes(window.location.pathname)) {
          window.location.href = "/signin";
        }

        return Promise.reject(refreshError);
      }
    }

    // Pass non-401 errors through (e.g., 403, 500)
    return Promise.reject(error);
  }
);

export default axiosInstance;