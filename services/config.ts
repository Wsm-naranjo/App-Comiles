import Constants from "expo-constants";

// Configuración de URLs
const config = {
  development: {
    baseURL: "http://10.10.1.220:8000", // URL local
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

// Configuración de datos del usuario
export const USER_CONFIG = {
  // Claves de AsyncStorage
  STORAGE_KEYS: {
    USER_DATA: 'userData',
    USER_TOKEN: 'userToken',
    CSRF_TOKEN: 'csrfToken',
  },
  
  // Valores por defecto para datos faltantes
  DEFAULTS: {
    PHOTO: 'default.png',
    INSTITUTION: 'Institución',
    ROLE: 'Usuario',
    EMAIL_DOMAIN: '@fuerzasarmadas.mil.ec',
  },
};

export default API_CONFIG;
