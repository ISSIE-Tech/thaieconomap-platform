import axios from 'axios';
import { CONFIG } from 'src/config-global';
import { endpoints } from 'src/shared/configs/endpoints.config';
import { STORAGE_KEY, REFRESH_TOKEN_KEY } from 'src/modules/auth/_constants/auth.constant';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

// ----------------------------------------------------------------------

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// ----------------------------------------------------------------------

// Trade the stored refresh token for new credentials. The gateway rotates the
// refresh token on every call, so the new one must be stored too.
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  // plain axios so a failed refresh doesn't loop back through the interceptor
  const { data } = await axios.post(
    endpoints.auth.refresh,
    { refreshToken },
    { baseURL: CONFIG.site.serverUrl }
  );

  const newAccessToken: string = data.data?.accessToken ?? data.accessToken;
  const newRefreshToken: string | undefined = data.data?.refreshToken ?? data.refreshToken;

  localStorage.setItem(STORAGE_KEY, newAccessToken);
  if (newRefreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
  }
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

  return newAccessToken;
}

// ----------------------------------------------------------------------

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 and if we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      // No refresh token available — force logout
      if (!refreshToken) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        delete axiosInstance.defaults.headers.common.Authorization;
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;

      // Another tab may have rotated the tokens already, which also invalidates
      // our refresh token; reuse its access token instead of refreshing again
      const storedAccessToken = localStorage.getItem(STORAGE_KEY);
      if (
        storedAccessToken &&
        originalRequest.headers.Authorization !== `Bearer ${storedAccessToken}`
      ) {
        originalRequest.headers.Authorization = `Bearer ${storedAccessToken}`;
        return axiosInstance(originalRequest);
      }

      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return await axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        delete axiosInstance.defaults.headers.common.Authorization;
        window.location.href = '/auth/login';

        return await Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject((error.response && error.response.data) || 'Something went wrong!');
  }
);

export default axiosInstance;
