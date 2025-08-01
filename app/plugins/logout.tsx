import { useUserData } from "@/hooks/useUserData";
import api, { clearCsrfToken } from "@/services/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogoutScreen() {
  const router = useRouter();
  const [loadingText, setLoadingText] = useState("Cerrando sesión...");
  const { clearUserData } = useUserData();

  useEffect(() => {
    console.log("Logout screen iniciado");
    handleLogout();
  }, []);

  const handleLogout = async () => {
    try {
      // Paso 1: Cerrar sesión en el servidor
      setLoadingText("Cerrando sesión en el servidor...");
      await new Promise((resolve) => setTimeout(resolve, 400));

      try {
        console.log("Enviando petición POST /logout al servidor...");
        const response = await api.post("/logout");
        console.log("Logout exitoso en el servidor:", response.status);
      } catch (serverError: any) {
        console.log(
          "Error en logout del servidor:",
          serverError?.response?.status || serverError?.message
        );
        console.log("Continuando con logout local...");
        // Continuar con el logout local aunque falle el servidor
      }

      // Paso 2: Limpiar datos locales
      setLoadingText("Limpiando datos locales...");
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Verificar qué datos hay antes de limpiar
      const userDataBefore = await AsyncStorage.getItem("userData");
      console.log(
        "Datos antes de limpiar:",
        userDataBefore ? "EXISTEN" : "NO EXISTEN"
      );

      // Limpiar datos del usuario usando el contexto
      await clearUserData();
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("csrfToken");
      console.log("Items específicos eliminados");

      // Limpiar cualquier otro dato que pueda quedar
      await AsyncStorage.clear();
      console.log("AsyncStorage completamente limpiado");

      // Verificar que realmente se limpiaron
      const userDataAfter = await AsyncStorage.getItem("userData");
      console.log(
        "Datos después de limpiar:",
        userDataAfter ? "AÚN EXISTEN!" : "LIMPIADO CORRECTAMENTE"
      );

      // Limpiar token CSRF de la memoria
      clearCsrfToken();

      // Paso 3: Finalizar
      setLoadingText("Finalizando...");
      await new Promise((resolve) => setTimeout(resolve, 400));

      console.log("Logout completo - navegando al login...");
      router.replace("/");
    } catch (error) {
      console.error("Error crítico en logout:", error);
      // Limpiar datos locales como fallback
      try {
        await clearUserData();
        await AsyncStorage.clear();
        clearCsrfToken();
      } catch (cleanupError) {
        console.error("Error en limpieza de fallback:", cleanupError);
      }
      // Navegar al login de todas formas
      router.replace("/");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
          <Image
            source={require("@/assets/images/Escudo_Fuerza_Aerea_Ecuador.png")}
            className="w-20 h-20 mb-4"
            resizeMode="contain"
          />
          <Text className="text-white text-xl font-bold text-center">
            Biblioteca Digital
          </Text>
          <Text className="text-gray-400 text-sm text-center mt-1">
            Fuerzas Armadas del Ecuador
          </Text>
        </View>

        {/* Loading Animation */}
        <View className="items-center mb-8">
          <View className="mb-6 p-4 bg-gray-800 rounded-full">
            <Feather name="log-out" size={28} color="#EF4444" />
          </View>
          <ActivityIndicator size="large" color="#EF4444" />
        </View>

        {/* Loading Text */}
        <Text className="text-white text-base font-medium text-center mb-2">
          {loadingText}
        </Text>
        <Text className="text-gray-500 text-sm text-center">Hasta pronto</Text>

        {/* Bottom Info */}
        <View className="absolute bottom-8 items-center">
          <View className="flex-row items-center mb-2">
            <Feather name="shield" size={16} color="#6B7280" />
            <Text className="text-gray-500 text-xs ml-2">
              Sesión cerrada de forma segura
            </Text>
          </View>
          <Text className="text-gray-600 text-xs text-center">
            Versión 1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
