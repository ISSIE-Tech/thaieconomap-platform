import axios from '@/utils/axios';

// ----------------------------------------------------------------------

export const isValidToken = async (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  // call api for validate token

  return true;
};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // tokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');

    delete axios.defaults.headers.common.Authorization;
  }
};
