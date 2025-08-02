export default ({ config }) => {
  // Detectar el entorno desde las variables de entorno
  const APP_ENV = process.env.APP_ENV || 'development';
  
  return {
    ...config,
    extra: {
      ...config.extra,
      environment: APP_ENV,
      // Agregar más configuraciones específicas por entorno si es necesario
      apiTimeout: APP_ENV === 'production' ? 15000 : 10000,
      enableLogging: APP_ENV === 'development',
    },
  };
};