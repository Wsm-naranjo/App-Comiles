import { useUser } from "@/services/UserContext";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccessDenied() {
  const router = useRouter();
  const { getUserInstitution, clearUserData } = useUser();

  const handleLogout = async () => {
    // Navegar a la pantalla de logout que se encargará de limpiar los datos
    router.replace("/plugins/logout");
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-6 justify-center">
      <View className="items-center mb-12">
        <View className="bg-red-800 p-6 rounded-full mb-6">
          <Feather name="x-circle" size={60} color="#FFF" />
        </View>
        <Text className="text-3xl font-bold text-white text-center mb-4">
          Acceso Denegado
        </Text>
        <Text className="text-lg text-gray-300 text-center mb-8">
          Lo sentimos, su institución no tiene acceso a esta aplicación.
        </Text>
        <Text className="text-base text-gray-400 text-center mb-12">
          Institución: {getUserInstitution()}
        </Text>
      </View>

      <TouchableOpacity
        className="p-4 bg-red-700 rounded-md items-center mt-2"
        onPress={handleLogout}
      >
        <View className="flex-row items-center">
          <Feather name="log-out" size={20} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold">CERRAR SESIÓN</Text>
        </View>
      </TouchableOpacity>

      <View className="mt-8">
        <Text className="text-gray-500 text-center text-sm">
          Si considera que esto es un error, por favor contacte al administrador del sistema.
        </Text>
      </View>
    </SafeAreaView>
  );
}