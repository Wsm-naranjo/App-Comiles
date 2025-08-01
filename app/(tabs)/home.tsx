import { InstitutionResponse } from '@/interfaces/institution/Institutionresponse';
import { getUserInstitution } from '@/services/user/getUserInstitution';
import { useAuthStore } from '@/store/useAuthStore';
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserData {
  nombres: string;
  apellidos: string;
  idusuario: string;
}

export default function HomeScreen() {
  // const [userData, setUserData] = useState<UserData | null>(null);

  const router = useRouter();

  // variables globales
  const user = useAuthStore( ( state ) => state.user );
  const userInstitution = useAuthStore( ( state ) => state.institution );
  const setUserInstitution = useAuthStore( ( state ) => state.setInstitution );








  useEffect( () => {
    getInstitution()
      .then( ( data ) => setUserInstitution( data ) )
      .catch(err => console.log(err));
  }, [ user ] );

  const getInstitution = async (): Promise<InstitutionResponse> => {
    const institucion = await getUserInstitution( user!.institucion_idInstitucion );
    return institucion;
  };




  const handleLogout = async () => {
    try {
      // await AsyncStorage.removeItem("userData");
      // await AsyncStorage.removeItem("userToken");
      useAuthStore.getState().logout();
      router.replace( "/" );
    } catch ( error ) {
      console.error( "Error during logout:", error );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        {/* Header */ }
        <View className="flex-row justify-between items-center p-6 pb-4">
          <View className="flex-row items-center">
            <Image
              source={ require( "../../assets/images/Escudo_Fuerza_Aerea_Ecuador.png" ) }
              className="w-12 h-12 mr-3"
              resizeMode="contain"
            />
            <View>
              <Text className="text-white text-lg font-bold">
                Bienvenido{ user ? `, ${ user.nombres }` : "" }
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={ handleLogout }
            className="p-2 bg-red-600 rounded-lg"
          >
            <Feather name="log-out" size={ 20 } color="white" />
          </TouchableOpacity>
        </View>

        {/* Info de la institucion */}
      <View className='px-6 pb-6'>
        <Text className="text-white text-2xl">
                { userInstitution?.nombreInstitucion ? userInstitution.nombreInstitucion : '' }
        </Text>
      </View>

        {/* Quick Stats */ }
        <View className="px-6 pb-6">
          <View className="flex-row justify-between">
            <View className="bg-blue-600 p-4 rounded-xl flex-1 mr-2">
              <Feather name="book-open" size={ 24 } color="white" />
              <Text className="text-white text-2xl font-bold mt-2">15</Text>
              <Text className="text-blue-200 text-sm">Libros Disponibles</Text>
            </View>
            <View className="bg-green-600 p-4 rounded-xl flex-1 ml-2">
              <Feather name="bookmark" size={ 24 } color="white" />
              <Text className="text-white text-2xl font-bold mt-2">4</Text>
              <Text className="text-green-200 text-sm">Leyendo Ahora</Text>
            </View>
          </View>
        </View>

        {/* Recent Books */ }
        <View className="px-6">
          <Text className="text-white text-xl font-bold mb-4">
            Continuar Leyendo
          </Text>

          <View className="bg-gray-800 p-4 rounded-xl mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white font-semibold text-lg">
                  Manual de Estrategia Militar Moderna
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Capítulo 8: Tácticas Defensivas • Página 243/324
                </Text>
                <View className="flex-row items-center mt-2">
                  <View className="bg-gray-700 rounded-full h-2 flex-1 mr-3">
                    <View className="bg-blue-500 h-2 rounded-full w-3/4" />
                  </View>
                  <Text className="text-gray-400 text-xs">75%</Text>
                </View>
              </View>
              <Feather name="play" size={ 20 } color="#3B82F6" />
            </View>
          </View>

          <View className="bg-gray-800 p-4 rounded-xl mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white font-semibold text-lg">
                  Historia de las Fuerzas Armadas del Ecuador
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Completado • 456 páginas leídas
                </Text>
                <View className="flex-row items-center mt-2">
                  <View className="bg-gray-700 rounded-full h-2 flex-1 mr-3">
                    <View className="bg-green-500 h-2 rounded-full w-full" />
                  </View>
                  <Text className="text-gray-400 text-xs">100%</Text>
                </View>
              </View>
              <Feather name="check-circle" size={ 20 } color="#10B981" />
            </View>
          </View>

          <View className="bg-gray-800 p-4 rounded-xl mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white font-semibold text-lg">
                  Liderazgo y Comando en el Siglo XXI
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Capítulo 5: Gestión de Crisis • Página 125/278
                </Text>
                <View className="flex-row items-center mt-2">
                  <View className="bg-gray-700 rounded-full h-2 flex-1 mr-3">
                    <View className="bg-purple-500 h-2 rounded-full w-2/5" />
                  </View>
                  <Text className="text-gray-400 text-xs">45%</Text>
                </View>
              </View>
              <Feather name="bookmark" size={ 20 } color="#7C3AED" />
            </View>
          </View>
        </View>

        {/* Quick Actions */ }
        <View className="px-6 mt-4">
          <Text className="text-white text-xl font-bold mb-4">
            Acciones Rápidas
          </Text>

          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-purple-600 p-4 rounded-xl flex-1 mr-2 items-center">
              <Feather name="search" size={ 24 } color="white" />
              <Text className="text-white font-semibold mt-2 text-center">
                Explorar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-orange-600 p-4 rounded-xl flex-1 mx-1 items-center">
              <Feather name="bookmark" size={ 24 } color="white" />
              <Text className="text-white font-semibold mt-2 text-center">
                Marcadores
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-teal-600 p-4 rounded-xl flex-1 ml-2 items-center">
              <Feather name="edit-3" size={ 24 } color="white" />
              <Text className="text-white font-semibold mt-2 text-center">
                Mis Notas
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reading Stats */ }
        <View className="px-6 mt-6">
          <Text className="text-white text-xl font-bold mb-4">
            Estadísticas de Lectura
          </Text>

          <View className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-white text-2xl font-bold">2,156</Text>
                <Text className="text-indigo-200 text-sm">Páginas Leídas</Text>
              </View>
              <View>
                <Text className="text-white text-2xl font-bold">12</Text>
                <Text className="text-indigo-200 text-sm">
                  Días Consecutivos
                </Text>
              </View>
              <View>
                <Text className="text-white text-2xl font-bold">45</Text>
                <Text className="text-indigo-200 text-sm">
                  Min/Día Promedio
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
