import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_CONFIG } from "./config";

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Variable para almacenar el token CSRF
let csrfToken: string | null = null;

// Función para limpiar el token CSRF
export const clearCsrfToken = (): void => {
  console.log("Limpiando token CSRF...");
  csrfToken = null;
};

// Función para reset completo de la sesión
export const resetSession = async (): Promise<void> => {
  console.log("Iniciando reset completo de sesión...");
  
  // 1. Intentar hacer logout en el servidor primero (antes de limpiar tokens)
  try {
    await api.post("/logout");
    console.log("Logout en servidor exitoso");
  } catch (error: any) {
    if (error?.response?.status === 419) {
      console.log("Token CSRF expirado (normal)");
    } else if (error?.response?.status === 401) {
      console.log("No hay sesión activa en servidor");
    } else {
      console.log("Error en logout del servidor:", error?.response?.status || error?.message);
    }
  }
  
  // 2. Limpiar token CSRF
  clearCsrfToken();
  
  // 3. Limpiar AsyncStorage
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage limpiado");
  } catch (error) {
    console.error("Error limpiando AsyncStorage:", error);
  }
  
  console.log("Reset de sesión completo");
};

// Función para obtener el token CSRF
export const getCsrfToken = async (forceRefresh: boolean = false): Promise<string | null> => {
  // Si ya tenemos un token y no se fuerza el refresh, devolverlo
  if (csrfToken && !forceRefresh) {
    console.log("Usando token CSRF existente");
    return csrfToken;
  }
  
  try {
    console.log("1. Solicitando CSRF cookie...");

    // 1. Obtener la cookie CSRF
    const response = await axios.get(`${api.defaults.baseURL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });

    console.log("2. Procesando respuesta...");

    // 2. Intentar extraer el token de las cookies de respuesta
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      for (const cookie of setCookieHeader) {
        if (cookie.includes('XSRF-TOKEN=')) {
          const tokenMatch = cookie.match(/XSRF-TOKEN=([^;]+)/);
          if (tokenMatch) {
            csrfToken = decodeURIComponent(tokenMatch[1]);
            console.log("Token CSRF obtenido:", csrfToken);
            // Pequeña pausa para asegurar que el token esté listo
            await new Promise(resolve => setTimeout(resolve, 100));
            return csrfToken;
          }
        }
      }
    }

    // 3. Si no se encuentra en las cookies, generar un token temporal
    console.log("No se pudo extraer token de cookies, usando token temporal");
    csrfToken = "temp-csrf-token-" + Date.now();
    return csrfToken;
  } catch (error) {
    console.log("Error obteniendo token CSRF:", error);
    return null;
  }
};

// Interceptor para agregar tokens de autenticación
api.interceptors.request.use(
  async (config) => {
    // Agregar token JWT si existe
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error obteniendo token JWT:", error);
    }

    // Agregar token CSRF si existe y es una petición POST/PUT/DELETE
    if (csrfToken && ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 419) {
      console.log("Error CSRF - Token expirado o inválido");
    }
    return Promise.reject(error);
  }
);

export default api;
