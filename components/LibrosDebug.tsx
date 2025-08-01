import useUserBooks from '@/hooks/useUserBooks';
import { useUserData } from '@/hooks/useUserData';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

/**
 * Componente de debug para mostrar información de los libros del usuario
 * Útil para desarrollo y testing
 */
export const LibrosDebug: React.FC = () => {
  const { userData, getUserApiParams } = useUserData();
  const { libros, periodo, nivel, cantidadLibros, isLoading, error, refetch } = useUserBooks();

  if (!userData) {
    return (
      <View className="p-4 bg-gray-800 rounded-lg m-4">
        <Text className="text-white font-bold">No hay datos de usuario</Text>
      </View>
    );
  }

  const apiParams = getUserApiParams();

  return (
    <ScrollView className="p-4 bg-gray-900 rounded-lg m-4">
      <Text className="text-white text-lg font-bold mb-4">Debug - Libros del Usuario</Text>
      
      {/* Parámetros de la API */}
      <View className="mb-4 p-3 bg-gray-800 rounded-lg">
        <Text className="text-yellow-400 font-bold mb-2">Parámetros API:</Text>
        <Text className="text-white text-sm">ID Usuario: {apiParams?.id}</Text>
        <Text className="text-white text-sm">Institución: {apiParams?.institucion}</Text>
        <Text className="text-white text-sm">Grupo: {apiParams?.grupo}</Text>
      </View>

      {/* Información del período */}
      {periodo && (
        <View className="mb-4 p-3 bg-gray-800 rounded-lg">
          <Text className="text-green-400 font-bold mb-2">Período Activo:</Text>
          <Text className="text-white text-sm">Período: {periodo.periodo}</Text>
          <Text className="text-white text-sm">Región: {periodo.region}</Text>
          <Text className="text-white text-sm">Descripción: {periodo.descripcion}</Text>
          <Text className="text-white text-sm">Estado: {periodo.estado}</Text>
        </View>
      )}

      {/* Estado de carga */}
      <View className="mb-4 p-3 bg-gray-800 rounded-lg">
        <Text className="text-blue-400 font-bold mb-2">Estado:</Text>
        <Text className="text-white text-sm">Cargando: {isLoading ? 'Sí' : 'No'}</Text>
        <Text className="text-white text-sm">Cantidad de libros: {cantidadLibros}</Text>
        <Text className="text-white text-sm">Nivel: {nivel}</Text>
        {error && <Text className="text-red-400 text-sm">Error: {error}</Text>}
      </View>

      {/* Lista de libros */}
      {libros.length > 0 ? (
        <View className="mb-4 p-3 bg-gray-800 rounded-lg">
          <Text className="text-purple-400 font-bold mb-2">Libros ({libros.length}):</Text>
          {libros.slice(0, 3).map((libro, index) => (
            <View key={index} className="mb-2 p-2 bg-gray-700 rounded">
              <Text className="text-white text-sm font-bold">
                {libro.nombrelibro}
              </Text>
              <Text className="text-gray-300 text-xs">
                ID: {libro.idlibro} | Serie: {libro.serie} | Año: {libro.anio}
              </Text>
              <Text className="text-gray-300 text-xs">
                Asignatura: {libro.nombreasignatura}
              </Text>
            </View>
          ))}
          {libros.length > 3 && (
            <Text className="text-gray-400 text-sm">
              ... y {libros.length - 3} libros más
            </Text>
          )}
        </View>
      ) : (
        <View className="mb-4 p-3 bg-red-900 rounded-lg">
          <Text className="text-red-400 font-bold mb-2">⚠️ No hay libros</Text>
          <Text className="text-red-300 text-sm">
            No se encontraron libros para este usuario.
          </Text>
          <Text className="text-red-300 text-sm mt-2">
            Posibles causas:
          </Text>
          <Text className="text-red-300 text-xs">• Usuario sin libros asignados</Text>
          <Text className="text-red-300 text-xs">• Período inactivo</Text>
          <Text className="text-red-300 text-xs">• Error en parámetros</Text>
        </View>
      )}

      {/* Botón para recargar */}
      <TouchableOpacity
        onPress={refetch}
        className="bg-blue-600 p-3 rounded-lg"
        disabled={isLoading}
      >
        <Text className="text-white text-center font-bold">
          {isLoading ? 'Cargando...' : 'Recargar Libros'}
        </Text>
      </TouchableOpacity>

      {/* URLs que se están llamando */}
      <View className="mt-4 p-3 bg-gray-800 rounded-lg">
        <Text className="text-orange-400 font-bold mb-2">URLs de API:</Text>
        <Text className="text-white text-xs mb-1">
          Período: /institucionTraerPeriodo?institucion_id={apiParams?.institucion}
        </Text>
        <Text className="text-white text-xs">
          Libros: /codigos_libros_estudiante/{apiParams?.id}/{apiParams?.institucion}/{periodo?.periodo}/{periodo?.region}/{apiParams?.grupo}
        </Text>
      </View>
    </ScrollView>
  );
};

export default LibrosDebug;