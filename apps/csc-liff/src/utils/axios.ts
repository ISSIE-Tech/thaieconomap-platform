import { default as axiosInstance } from 'axios';
import { API_KEY } from '@/config-global';

// ----------------------------------------------------------------------

const axios = axiosInstance.create({
  baseURL: API_KEY,
  // headers: {
  //   Authorization:
  //     'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDFiY2I4YWVhNjBhNmMxMjZjNWMxYjQiLCJpYXQiOjE2Nzk1NDMxNzh9.UMPIJ5Jw23VCeZ6NRE6aMUEUpsG8NdO3Vz7edRoCzrI',
  // },
});

axios.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || 'Axios went wrong'
    )
);

export default axios;
