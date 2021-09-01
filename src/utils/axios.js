import axios from 'axios';
import { getSessionDataFromSessionStorage } from '../actions/nxt-local-storage';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

axiosInstance.interceptors.request.use(
  function (config) {
    const session = getSessionDataFromSessionStorage();
    config.headers = {
      ...config.headers,
      api_key: session && session.token,
      'Content-Type': 'application/json',
      Accept: '*/*',
    };
    // you can also do other modification in config
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// response interceptor defined in App.js

export default axiosInstance;
