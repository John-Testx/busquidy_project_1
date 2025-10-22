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

// Manejo global de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en la API:", error.response?.data || error.message);
    
    // Asegurar que siempre se rechace con un objeto que tenga las propiedades esperadas
    const errorData = error.response?.data || { 
      error: error.message,
      message: error.message 
    };
    
    return Promise.reject(errorData);
  }
);

export default apiClient;