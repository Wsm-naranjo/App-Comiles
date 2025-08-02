import Constants from "expo-constants";

// Configuración de URLs por entorno
const config = {
  development: {
    baseURL: "http://10.10.1.220:8000", // URL local
    environment: "development",
  },
  production: {
    baseURL: "https://server1.prolipadigital.com.ec", 
    environment: "production",
  },
};

// Función para detectar el entorno actual
const getEnvironment = (): 'development' | 'production' => {
  // 1. Verificar variable de entorno de EAS Build
  const easEnv = process.env.APP_ENV;
  if (easEnv === 'production') {
    console.log("🚀 Entorno detectado: PRODUCCIÓN (via EAS_BUILD_ENV)");
    return 'production';
  }
  
  // 2. Verificar si es un build de producción (no __DEV__)
  if (!__DEV__) {
    console.log("🚀 Entorno detectado: PRODUCCIÓN (build release)");
    return 'production';
  }
  
  // 3. Verificar configuración en app.json/expo
  const expoEnv = Constants.expoConfig?.extra?.environment;
  if (expoEnv === 'production') {
    console.log("🚀 Entorno detectado: PRODUCCIÓN (via expo config)");
    return 'production';
  }
  
  // 4. Verificar si estamos en Expo Go (desarrollo)
  if (Constants.appOwnership === 'expo') {
    console.log("🔧 Entorno detectado: DESARROLLO (Expo Go)");
    return 'development';
  }
  
  // 5. Por defecto, si __DEV__ es true, es desarrollo
  if (__DEV__) {
    console.log("🔧 Entorno detectado: DESARROLLO (__DEV__)");
    return 'development';
  }
  
  // 6. Fallback a producción si no se puede determinar
  console.log("⚠️ No se pudo determinar el entorno, usando PRODUCCIÓN por defecto");
  return 'production';
};

// Detectar entorno actual
const currentEnvironment = getEnvironment();

// Exportar la configuración actual
export const API_CONFIG = config[currentEnvironment];

// Función para verificar el entorno actual
export const getCurrentEnvironment = () => {
  return {
    environment: currentEnvironment,
    baseURL: API_CONFIG.baseURL,
    isProduction: currentEnvironment === 'production',
    isDevelopment: currentEnvironment === 'development',
    // Información adicional para debugging
    debug: {
      __DEV__,
      appOwnership: Constants.appOwnership,
      expoConfig: Constants.expoConfig?.extra?.environment,
      processEnv: process.env.APP_ENV,
    }
  };
};

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
    EMAIL_DOMAIN: '@prolipadigital.com.ec',
  },
};

export default API_CONFIG;
