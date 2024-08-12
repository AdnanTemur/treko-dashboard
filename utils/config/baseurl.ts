// utils/config/baseUrl.js
import axios from "axios";
import { toast } from "react-toastify";

const BASEURL = import.meta.env.VITE_BASEURL;

const BaseUrl = axios.create({
  baseURL: BASEURL,
});

BaseUrl.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

BaseUrl.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

const handleLogout = () => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    window.location.reload();
  } catch (error) {
    console.error("Error logging out:", error);
    toast.error("An unexpected error occurred while logging out");
  }
};

export default BaseUrl;
