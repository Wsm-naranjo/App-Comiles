import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogoutScreen() {
  const router = useRouter();
  const [loadingText, setLoadingText] = useState("Cerrando sesión...");

  useEffect(() => {
    console.log("Logout screen iniciado");
    handleLogout();
  }, []);

  const handleLogout = async () => {
    try {
      // Simular proceso de logout con pasos
      setLoadingText("Cerrando sesión...");
      await new Promise((resolve) => setTimeout(resolve, 600));

      setLoadingText("Limpiando datos locales...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Limpiar AsyncStorage
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("userToken");
      console.log("Datos de usuario eliminados");

      setLoadingText("Finalizando...");
      await new Promise((resolve) => setTimeout(resolve, 400));

      console.log("Navegando al login...");
      router.replace("/");
    } catch (error) {
      console.error("Error en logout:", error);
      // Aún así navegar al login
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
