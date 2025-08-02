import { clearToken, getCurrentToken, logoutFromServer } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Utilidades para manejo de autenticación
 */

// Función para hacer logout manual (útil para debugging)
export const manualLogout = async (): Promise<void> => {
  console.log("=== LOGOUT MANUAL ===");
  
  // 1. Mostrar token actual
  const currentToken = await getCurrentToken();
  if (currentToken) {
    console.log("Token actual (primeros 20 chars):", currentToken.substring(0, 20) + "...");
  } else {
    console.log("No hay token guardado");
    return;
  }
  
  // 2. Hacer logout en servidor
  const success = await logoutFromServer();
  console.log("Logout en servidor:", success ? "EXITOSO" : "FALLÓ");
  
  // 3. Limpiar token local
  await clearToken();
  console.log("Token local eliminado");
  
  // 4. Verificar limpieza
  const tokenAfter = await getCurrentToken();
  console.log("Token después del logout:", tokenAfter ? "AÚN EXISTE" : "ELIMINADO");
  
  console.log("=== FIN LOGOUT MANUAL ===");
};

// Función para verificar estado del token
export const checkTokenStatus = async (): Promise<void> => {
  console.log("=== ESTADO DEL TOKEN ===");
  
  const token = await getCurrentToken();
  if (token) {
    console.log("Token existe");
    console.log("Longitud:", token.length);
    console.log("Primeros 20 chars:", token.substring(0, 20) + "...");
    console.log("Últimos 10 chars:", "..." + token.slice(-10));
  } else {
    console.log("No hay token guardado");
  }
  
  console.log("=== FIN ESTADO TOKEN ===");
};

// Función para limpiar todo (reset completo)
export const fullReset = async (): Promise<void> => {
  console.log("=== RESET COMPLETO ===");
  
  try {
    // 1. Logout del servidor
    await logoutFromServer();
    
    // 2. Limpiar AsyncStorage completo
    await AsyncStorage.clear();
    
    console.log("Reset completo exitoso");
  } catch (error) {
    console.error("Error en reset completo:", error);
  }
  
  console.log("=== FIN RESET COMPLETO ===");
};