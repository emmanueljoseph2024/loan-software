// utils/axiosConfig.js
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";


NProgress.configure({ showSpinner: true });

const api = axios.create({
  baseURL: "//loan-software.onrender.com",
});

// Request interceptor → start progress bar
api.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

// Response interceptor → stop progress bar
api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;
