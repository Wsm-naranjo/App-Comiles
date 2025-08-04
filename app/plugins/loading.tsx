import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoadingScreen() {
  const router = useRouter();
  const [loadingText, setLoadingText] = useState('Iniciando sesión...');

  useEffect(() => {
    console.log('Loading screen iniciado');
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Simular carga con pasos
      setLoadingText('Verificando credenciales...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingText('Cargando biblioteca personal...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoadingText('Preparando interfaz...');
      await new Promise(resolve => setTimeout(resolve, 600));

      // Verificar datos de usuario
      const userData = await AsyncStorage.getItem('userData');
      console.log('Datos de usuario encontrados:', !!userData);
      
      if (userData) {
        const parsedData = JSON.parse(userData);
        console.log('=== DATOS DE USUARIO CARGADOS ===');
        console.log('Nombre:', parsedData.nombres);
        console.log('Apellido:', parsedData.apellidos);
        console.log('ID Usuario:', parsedData.idusuario);
        console.log('Username:', parsedData.name_usuario);
        console.log('Email:', parsedData.email);
        console.log('ID Institución:', parsedData.institucion_idInstitucion);
        console.log('================================');
        
        // Validar tipo de institución
        setLoadingText('Verificando permisos de institución...');
        console.log('🔍 INICIANDO VALIDACIÓN DE INSTITUCIÓN');
        
        try {
          // Importar dinámicamente para evitar problemas de ciclo de dependencias
          const { validateInstitutionType } = await import('@/services/user/validateInstitutionType');
          
          console.log('📞 Llamando a validateInstitutionType...');
          const isValidInstitution = await validateInstitutionType(parsedData.institucion_idInstitucion);
          
          console.log('🎯 RESULTADO DE VALIDACIÓN:');
          console.log(`   Institución ID: ${parsedData.institucion_idInstitucion}`);
          console.log(`   Es válida: ${isValidInstitution}`);
          console.log(`   Institución: ${parsedData.institucion?.nombreInstitucion}`);
          
          if (isValidInstitution) {
            console.log('✅ Institución validada correctamente - Navegando a home');
            setLoadingText('Acceso autorizado...');
            await new Promise(resolve => setTimeout(resolve, 500));
            router.replace('/(tabs)/home');
          } else {
            console.log('❌ Institución no autorizada - Navegando a AccessDenied');
            setLoadingText('Acceso denegado...');
            await new Promise(resolve => setTimeout(resolve, 500));
            router.replace('/auth/AccessDenied');
          }
        } catch (validationError) {
          console.error('💥 ERROR CRÍTICO EN VALIDACIÓN:', validationError);
          console.error('Stack trace:', validationError);
          
          // En lugar de ir a home automáticamente, vamos a AccessDenied por seguridad
          console.log('🚨 Por seguridad, enviando a AccessDenied debido al error');
          setLoadingText('Error de validación...');
          await new Promise(resolve => setTimeout(resolve, 500));
          router.replace('/auth/AccessDenied');
        }
      } else {
        console.log('No hay datos, regresando al login...');
        router.replace('/');
      }
    } catch (error) {
      console.error('Error en loading:', error);
      router.replace('/');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
          <Image
            source={require('@/assets/images/fuerzaterrestre.png')}
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
            <Feather name="book-open" size={28} color="#3B82F6" />
          </View>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>

        {/* Loading Text */}
        <Text className="text-white text-base font-medium text-center mb-2">
          {loadingText}
        </Text>
        <Text className="text-gray-500 text-sm text-center">
          Por favor espera un momento
        </Text>

        {/* Bottom Info */}
        <View className="absolute bottom-8 items-center">
          <Text className="text-gray-600 text-xs text-center">
            Versión 1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}