import Constants from "expo-constants";

// Configuración de URLs
const config = {
  development: {
    baseURL: "http://10.10.1.204:8000", // URL local
  },
  production: {
    baseURL: "https://mobil.prolipa.com", // Ejemplo de URL
  },
};

// Detectar si estamos en desarrollo o producción
const isDevelopment =
  __DEV__ || Constants.expoConfig?.extra?.environment === "development";

// Exportar la configuración actual
export const API_CONFIG = isDevelopment
  ? config.development
  : config.production;

export default API_CONFIG;
