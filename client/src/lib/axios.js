import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/users`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 3000,
});
