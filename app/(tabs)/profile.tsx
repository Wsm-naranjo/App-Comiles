import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserData {
  nombres: string;
  apellidos: string;
  idusuario: string;
  email?: string;
  rango?: string;
  unidad?: string;
}

const menuItems = [
  {
    id: 1,
    title: 'Editar Perfil',
    icon: 'edit-3',
    color: 'text-blue-400',
    action: 'editProfile',
  },
  {
    id: 2,
    title: 'Configuración de Lectura',
    icon: 'settings',
    color: 'text-gray-400',
    action: 'settings',
  },
  {
    id: 3,
    title: 'Notificaciones',
    icon: 'bell',
    color: 'text-yellow-400',
    action: 'notifications',
  },
  {
    id: 4,
    title: 'Mis Notas y Marcadores',
    icon: 'bookmark',
    color: 'text-green-400',
    action: 'bookmarks',
  },
  {
    id: 5,
    title: 'Historial de Lectura',
    icon: 'clock',
    color: 'text-purple-400',
    action: 'history',
  },
  {
    id: 6,
    title: 'Ayuda y Soporte',
    icon: 'help-circle',
    color: 'text-orange-400',
    action: 'help',
  },
  {
    id: 7,
    title: 'Acerca de',
    icon: 'info',
    color: 'text-gray-400',
    action: 'about',
  },
];

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        const parsedData = JSON.parse(data);
        // Agregar datos simulados para el perfil
        setUserData({
          ...parsedData,
          email: 'usuario@fuerzasarmadas.mil.ec',
          rango: 'Teniente',
          unidad: 'Ala de Combate No. 21',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userData');
              await AsyncStorage.removeItem('userToken');
              router.replace('/');
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'editProfile':
        Alert.alert('Editar Perfil', 'Función en desarrollo');
        break;
      case 'settings':
        Alert.alert('Configuración de Lectura', 'Ajustes de fuente, brillo, modo nocturno, etc.');
        break;
      case 'notifications':
        Alert.alert('Notificaciones', 'Recordatorios de lectura y nuevos libros');
        break;
      case 'bookmarks':
        Alert.alert('Mis Notas y Marcadores', 'Accede a todas tus notas y marcadores');
        break;
      case 'history':
        Alert.alert('Historial de Lectura', 'Revisa tu historial completo de lectura');
        break;
      case 'help':
        Alert.alert('Ayuda y Soporte', 'Función en desarrollo');
        break;
      case 'about':
        Alert.alert(
          'Acerca de',
          'Biblioteca Digital Educativa\nFuerzas Armadas del Ecuador\nVersión 1.0.0\n\nPlataforma de libros digitales para la formación militar profesional.'
        );
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-6 pb-4">
          <Text className="text-white text-2xl font-bold">
            Mi Perfil
          </Text>
        </View>

        {/* Profile Card */}
        <View className="mx-6 mb-6">
          <View className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl">
            <View className="flex-row items-center">
              <View className="bg-white/20 p-4 rounded-full mr-4">
                <Image
                  source={require('../../assets/images/Escudo_Fuerza_Aerea_Ecuador.png')}
                  className="w-16 h-16"
                  resizeMode="contain"
                />
              </View>
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">
                  {userData ? `${userData.nombres} ${userData.apellidos}` : 'Cargando...'}
                </Text>
                <Text className="text-blue-200 text-sm mt-1">
                  {userData?.rango || 'Rango no disponible'}
                </Text>
                <Text className="text-blue-200 text-sm">
                  {userData?.unidad || 'Unidad no disponible'}
                </Text>
                <Text className="text-blue-200 text-sm mt-2">
                  ID: {userData?.idusuario || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between">
            <View className="bg-gray-800 p-4 rounded-xl flex-1 mr-2 items-center">
              <Feather name="book-open" size={24} color="#3B82F6" />
              <Text className="text-white text-xl font-bold mt-2">15</Text>
              <Text className="text-gray-400 text-sm text-center">
                Libros en Biblioteca
              </Text>
            </View>
            <View className="bg-gray-800 p-4 rounded-xl flex-1 mx-1 items-center">
              <Feather name="check-circle" size={24} color="#10B981" />
              <Text className="text-white text-xl font-bold mt-2">8</Text>
              <Text className="text-gray-400 text-sm text-center">
                Libros Completados
              </Text>
            </View>
            <View className="bg-gray-800 p-4 rounded-xl flex-1 ml-2 items-center">
              <Feather name="bookmark" size={24} color="#F59E0B" />
              <Text className="text-white text-xl font-bold mt-2">47</Text>
              <Text className="text-gray-400 text-sm text-center">
                Marcadores
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View className="px-6 mb-6">
          <Text className="text-white text-lg font-bold mb-4">
            Información de Contacto
          </Text>
          
          <View className="bg-gray-800 p-4 rounded-xl mb-3">
            <View className="flex-row items-center">
              <Feather name="mail" size={20} color="#6B7280" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-400 text-sm">Email</Text>
                <Text className="text-white font-semibold">
                  {userData?.email || 'No disponible'}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-gray-800 p-4 rounded-xl">
            <View className="flex-row items-center">
              <Feather name="map-pin" size={20} color="#6B7280" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-400 text-sm">Unidad</Text>
                <Text className="text-white font-semibold">
                  {userData?.unidad || 'No disponible'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6 mb-6">
          <Text className="text-white text-lg font-bold mb-4">
            Opciones
          </Text>
          
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleMenuAction(item.action)}
              className="bg-gray-800 p-4 rounded-xl mb-3"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Feather
                    name={item.icon as any}
                    size={20}
                    color={item.color.replace('text-', '#')}
                    className={item.color}
                  />
                  <Text className="text-white font-semibold ml-3">
                    {item.title}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-600 p-4 rounded-xl"
          >
            <View className="flex-row items-center justify-center">
              <Feather name="log-out" size={20} color="white" />
              <Text className="text-white font-bold ml-2">
                Cerrar Sesión
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}