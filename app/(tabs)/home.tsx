import useUserBooks from '@/hooks/useUserBooks';
import { useUserData } from '@/hooks/useUserData';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { userData, getUserInstitution } = useUserData();
  const {
    libros,
    cantidadLibros,
    isLoading: librosLoading,
    error: librosError,
  } = useUserBooks();

  useFocusEffect(
    useCallback(() => {
      console.log('Home screen focused, checking user data...');
      if (!userData) {
        console.log('No hay datos de usuario, redirigiendo al login');
        router.replace('/');
      }
    }, [userData])
  );

  const handleLogout = async () => {
    console.log('Iniciando logout desde home...');
    router.replace('/plugins/logout');
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center p-6 pb-4">
          <View className="flex-row items-center">
            <Image
              source={require('@/assets/images/Escudo_Fuerza_Aerea_Ecuador.png')}
              className="w-12 h-12 mr-3"
              resizeMode="contain"
            />
            <View>
              <Text className="text-white text-lg font-bold">
                Bienvenido, {userData?.nombres || 'Usuario'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="p-2 bg-red-600 rounded-lg">
            <Feather name="log-out" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Institution Banner */}
        <View className="mx-6 mb-6">
          <View className="bg-gradient-to-r from-blue-800 to-purple-800 p-6 rounded-xl border border-blue-700">
            <View className="flex-row items-center">
              <View className="bg-white/10 p-3 rounded-full mr-4">
                <Feather name="award" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-blue-200 text-sm font-medium mb-1">
                  Institución Educativa
                </Text>
                <Text className="text-white text-lg font-bold leading-tight">
                  {getUserInstitution()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 pb-6">
          <View className="flex-row justify-between">
            <View className="bg-blue-600 p-4 rounded-xl flex-1 mr-2">
              <Feather name="book-open" size={24} color="white" />
              <Text className="text-white text-2xl font-bold mt-2">
                {librosLoading ? '...' : cantidadLibros}
              </Text>
              <Text className="text-blue-200 text-sm">Libros Disponibles</Text>
              {librosError && (
                <Text className="text-red-300 text-xs mt-1">
                  Error cargando
                </Text>
              )}
            </View>
            <View className="bg-green-600 p-4 rounded-xl flex-1 ml-2">
              <Feather name="bookmark" size={24} color="white" />
              <Text className="text-white text-2xl font-bold mt-2">0</Text>
              <Text className="text-green-200 text-sm">Leyendo Ahora</Text>
            </View>
          </View>
        </View>

        {/* Recent Books */}
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Mis Libros</Text>
            {cantidadLibros > 3 && (
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/library')}
                className="flex-row items-center">
                <Text className="text-blue-400 text-sm mr-1">Ver todos</Text>
                <Feather name="arrow-right" size={16} color="#60A5FA" />
              </TouchableOpacity>
            )}
          </View>

          {librosLoading ? (
            <View className="bg-gray-800 p-6 rounded-xl mb-4 items-center">
              <Text className="text-gray-400">Cargando libros...</Text>
            </View>
          ) : librosError ? (
            <View className="bg-red-900 p-4 rounded-xl mb-4">
              <Text className="text-red-400 font-semibold">
                Error al cargar libros
              </Text>
              <Text className="text-red-300 text-sm mt-1">{librosError}</Text>
            </View>
          ) : libros.length === 0 ? (
            <View className="bg-gray-800 p-6 rounded-xl mb-4 items-center">
              <Feather name="book-open" size={32} color="#6B7280" />
              <Text className="text-gray-400 text-lg mt-2">
                No hay libros disponibles
              </Text>
              <Text className="text-gray-500 text-sm mt-1 text-center">
                Contacta con tu institución para obtener acceso a libros
              </Text>
            </View>
          ) : (
            libros.slice(0, 3).map((libro, index) => (
              <TouchableOpacity
                key={libro.idlibro}
                className="bg-gray-800 p-4 rounded-xl mb-4"
                onPress={() => {
                  // Aquí puedes navegar al lector del libro
                  console.log('Abrir libro:', libro.nombrelibro);
                }}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text
                      className="text-white font-semibold text-lg"
                      numberOfLines={2}>
                      {libro.nombrelibro}
                    </Text>
                    <Text className="text-gray-400 text-sm mt-1">
                      {libro.nombreasignatura} • Serie: {libro.serie || 'N/A'}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      Año: {libro.anio} • ID: {libro.idlibro}
                    </Text>

                    {/* Barra de progreso simulada - puedes conectar con progreso real */}
                    {/* <View className="flex-row items-center mt-3">
                      <View className="bg-gray-700 rounded-full h-2 flex-1 mr-3">
                        <View
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </View>
                      <Text className="text-gray-400 text-xs">
                        {Math.floor(Math.random() * 100)}%
                      </Text>
                    </View> */}
                  </View>
                  <View className="ml-4">
                    <Feather name="book-open" size={24} color="#3B82F6" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-6 mt-4">
          <Text className="text-white text-xl font-bold mb-4">
            Acciones Rápidas
          </Text>

          <View className="flex-row justify-between">
            {/* Explorar - Para buscar libros */}
            <TouchableOpacity
              className="bg-purple-600 p-4 rounded-xl flex-1 mr-2 items-center"
              onPress={() => router.push('/(tabs)/library')}>
              <Feather name="search" size={24} color="white" />
              <Text className="text-white font-semibold mt-2 text-center">
                Explorar
              </Text>
              <Text className="text-purple-200 text-xs mt-1 text-center">
                Buscar libros
              </Text>
            </TouchableOpacity>

            {/* Mis Notas */}
            <TouchableOpacity
              className="bg-teal-600 p-4 rounded-xl flex-1 ml-2 items-center"
              onPress={() => {
                // Aquí puedes navegar a la pantalla de notas
                console.log('Navegar a Mis Notas');
                // router.push('/notas'); // cuando tengas la pantalla
              }}>
              <Feather name="edit-3" size={24} color="white" />
              <Text className="text-white font-semibold mt-2 text-center">
                Mis Notas
              </Text>
              <Text className="text-teal-200 text-xs mt-1 text-center">
                Notas y apuntes
              </Text>
            </TouchableOpacity>

            {/* Marcadores - Comentado por ahora */}
            {/* 
            <TouchableOpacity className="bg-orange-600 p-4 rounded-xl flex-1 mx-1 items-center">
              <Feather name="bookmark" size={24} color="white" />
              <Text className="text-white font-semibold mt-2 text-center">
                Marcadores
              </Text>
            </TouchableOpacity>
            */}
          </View>
        </View>

        {/* Reading Stats */}
        {/* <View className="px-6 mt-6">
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
        </View> */}

        {/* Debug Component - Solo para desarrollo */}
        {/* <LibrosDebug /> */}
      </ScrollView>
    </SafeAreaView>
  );
}
