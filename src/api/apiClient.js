import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // se lee del .env
});

// Interceptor para incluir automáticamente el token en cada petición
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo global de errores (opcional pero útil)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en la API:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
);

export default apiClient;
