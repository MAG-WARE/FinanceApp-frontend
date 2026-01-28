import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@financeapp:token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🌐 [API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      hasToken: !!token,
      params: config.params,
    });

    return config;
  },
  (error) => {
    console.error("❌ [API Request Error]", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
    });
    return response;
  },
  (error) => {
    console.error(`❌ [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("@financeapp:token");
      localStorage.removeItem("@financeapp:user");

      if (typeof window !== "undefined" &&
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/register")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
