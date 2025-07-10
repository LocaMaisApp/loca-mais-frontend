import axios from "axios";
import Cookies from "cookiejs";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    const excludedPaths = ["/auth/sign-in", "/auth/signup"];
    const isExcluded = excludedPaths.some((path) => config.url?.endsWith(path));

    if (token && !isExcluded) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401 || error.response.status === 403) {
      Cookies.remove("token");
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  }
)





export default api;