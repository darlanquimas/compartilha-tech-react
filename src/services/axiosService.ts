import axios from "axios";

const axiosService = axios.create({
  baseURL: "http://localhost:3333",
});

// Interceptor para registrar as requisições
axiosService.interceptors.request.use(
  (config) => {
    console.log("Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Interceptor para registrar as respostas
axiosService.interceptors.response.use(
  (response) => {
    console.log("Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Response Error:", {
        url: error.response.config.url,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error("Response Error:", error);
    }
    return Promise.reject(error);
  }
);

export default axiosService;
