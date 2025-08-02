import useSeries from '@/hooks/useSeries';
import useUserBooks from '@/hooks/useUserBooks';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Los libros ahora vienen de useUserBooks() - datos reales de la API

export default function LibraryScreen() {
  const {
    libros,
    cantidadLibros,
    isLoading: librosLoading,
    error: librosError,
  } = useUserBooks();
  const { seriesConLibros, isLoading: seriesLoading } = useSeries();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSerie, setSelectedSerie] = useState('Todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Crear lista de series para el filtro
  const seriesOptions = [
    'Todas',
    ...seriesConLibros.map(serie => serie.nombre_serie),
  ];

  // Filtrar libros por búsqueda y serie
  const filteredBooks = libros.filter(libro => {
    const matchesSearch =
      libro.nombrelibro.toLowerCase().includes(searchQuery.toLowerCase()) ||
      libro.nombreasignatura.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSerie =
      selectedSerie === 'Todas' || libro.serie === selectedSerie;
    return matchesSearch && matchesSerie;
  });

  const getSerieColor = (serie: string) => {
    // Colores basados en el hash del nombre de la serie
    const colors = [
      'text-blue-400',
      'text-green-400',
      'text-purple-400',
      'text-yellow-400',
      'text-red-400',
      'text-pink-400',
      'text-indigo-400',
      'text-teal-400',
      'text-orange-400',
    ];
    const hash = serie.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getSerieBgColor = (serie: string) => {
    // Colores de fondo basados en el hash del nombre de la serie
    const colors = [
      'bg-blue-600',
      'bg-green-600',
      'bg-purple-600',
      'bg-yellow-600',
      'bg-red-600',
      'bg-pink-600',
      'bg-indigo-600',
      'bg-teal-600',
      'bg-orange-600',
    ];
    const hash = serie.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-6 pb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-white text-2xl font-bold">
                Mi Biblioteca
              </Text>
              <Text className="text-gray-400 text-sm">
                {librosLoading
                  ? 'Cargando...'
                  : `${cantidadLibros} libros disponibles`}
              </Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() =>
                  setViewMode(viewMode === 'grid' ? 'list' : 'grid')
                }
                className="p-2 bg-gray-800 rounded-lg mr-2">
                <Feather
                  name={viewMode === 'grid' ? 'list' : 'grid'}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity className="p-2 bg-gray-800 rounded-lg">
                <Feather name="filter" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View className="relative mb-4">
            <TextInput
              placeholder="Buscar libros o asignaturas..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="bg-gray-800 text-white p-4 pl-12 rounded-xl"
            />
            <Feather
              name="search"
              size={20}
              color="#6B7280"
              style={{ position: 'absolute', left: 16, top: 16 }}
            />
          </View>

          {/* Series Filter */}
          {seriesLoading ? (
            <View className="mb-4 p-4 bg-gray-800 rounded-xl">
              <Text className="text-gray-400 text-center">
                Cargando series...
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4">
              {seriesOptions.map(serie => (
                <TouchableOpacity
                  key={serie}
                  onPress={() => setSelectedSerie(serie)}
                  className={`mr-3 px-4 py-2 rounded-full ${
                    selectedSerie === serie ? 'bg-blue-600' : 'bg-gray-800'
                  }`}>
                  <Text
                    className={`font-semibold ${
                      selectedSerie === serie ? 'text-white' : 'text-gray-400'
                    }`}>
                    {serie}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Books Grid/List */}
        <View className="px-6">
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
          ) : filteredBooks.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Feather name="book-open" size={48} color="#6B7280" />
              <Text className="text-gray-400 text-lg mt-4">
                {libros.length === 0
                  ? 'No hay libros disponibles'
                  : 'No se encontraron libros'}
              </Text>
              <Text className="text-gray-500 text-sm mt-2 text-center px-8">
                {libros.length === 0
                  ? 'Contacta con tu institución para obtener acceso a libros'
                  : 'Intenta con otros términos de búsqueda o cambia la serie'}
              </Text>
            </View>
          ) : viewMode === 'grid' ? (
            <View className="flex-row flex-wrap justify-between">
              {filteredBooks.map(libro => (
                <TouchableOpacity
                  key={libro.idlibro}
                  className="w-[48%] bg-gray-800 p-4 rounded-xl mb-4"
                  onPress={() => {
                    router.push({
                      pathname: '/Books/bookPage',
                      params: {
                        init: libro.pag_inicio,
                        final: libro.pag_fin,
                        idasignatura: libro.asignatura_idasignatura,
                        nombreLibro: libro.weblibro,
                      },
                    });
                  }}>
                  <View className="items-center mb-3">
                    <View className="w-20 h-28 bg-gray-700 rounded-lg mb-2 items-center justify-center">
                      <Image
                        source={{
                          uri: libro.portada
                            ? `https://data.prolipadigital.com.ec/archivos/upload/libro/${libro.weblibro}/${libro.portada}`
                            : 'https://via.placeholder.com/80x120',
                        }}
                        style={{ width: "100%", height: "100%", borderRadius: 5 }}
                        resizeMode="cover"
                      />
                    </View>
                    <View className="absolute top-0 right-0">
                      <Feather name="book-open" size={16} color="#3B82F6" />
                    </View>
                  </View>

                  <Text
                    className="text-white font-bold text-sm mb-1 text-center"
                    numberOfLines={2}>
                    {libro.nombrelibro}
                  </Text>
                  <Text
                    className="text-gray-400 text-xs mb-2 text-center"
                    numberOfLines={1}>
                    {libro.nombreasignatura}
                  </Text>

                  <View className="flex-row items-center justify-between">
                    <View
                      className={`px-2 py-1 rounded-full ${getSerieBgColor(libro.serie || 'default')}`}>
                      <Text className="text-white text-xs font-semibold">
                        {libro.serie || 'N/A'}
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-xs">{libro.anio}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View>
              {filteredBooks.map(libro => (
                <TouchableOpacity
                  key={libro.idlibro}
                  className="bg-gray-800 p-4 rounded-xl mb-4"
                  onPress={() => {
                    router.push({
                      pathname: '/Books/bookPage',
                      params: {
                        init: libro.pag_inicio,
                        final: libro.pag_fin,
                        idasignatura: libro.asignatura_idasignatura,
                        nombreLibro: libro.weblibro,
                      },
                    });
                  }}>
                  <View className="flex-row">
                    <View className="w-16 h-22 bg-gray-700 rounded-lg mr-4 items-center justify-center">
                      <Image
                        source={{
                          uri: libro.portada
                            ? `https://data.prolipadigital.com.ec/archivos/upload/libro/${libro.weblibro}/${libro.portada}`
                            : 'https://via.placeholder.com/64x88',
                        }}
                        style={{ width: "100%", height: "100%", borderRadius: 5 }}
                        resizeMode="cover"
                      />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-start justify-between mb-1">
                        <Text
                          className="text-white font-bold text-base flex-1 mr-2"
                          numberOfLines={2}>
                          {libro.nombrelibro}
                        </Text>
                        <Feather name="book-open" size={16} color="#3B82F6" />
                      </View>

                      <Text className="text-gray-400 text-sm mb-1">
                        {libro.nombreasignatura}
                      </Text>

                      {/* <View className="mb-2">
                        <View className="bg-gray-700 rounded-full h-1.5">
                          <View
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </View>
                        <Text className="text-gray-400 text-xs mt-1 text-center">
                          {Math.floor(Math.random() * 100)}%
                        </Text>
                      </View> */}

                      <View className="flex-row items-center mb-2">
                        <View
                          className={`px-2 py-1 rounded-full mr-2 ${getSerieBgColor(libro.serie || 'default')}`}>
                          <Text className="text-white text-xs font-semibold">
                            {libro.serie || 'N/A'}
                          </Text>
                        </View>
                        <Text className="text-gray-500 text-xs">
                          Año: {libro.anio}
                        </Text>
                      </View>

                      {/* <View className="mb-2">
                        <View className="bg-gray-700 rounded-full h-1.5">
                          <View
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </View>
                        <Text className="text-gray-400 text-xs mt-1">
                          Progreso: {Math.floor(Math.random() * 100)}%
                        </Text>
                      </View> */}

                      <View className="flex-row items-center justify-between">
                        <Text className="text-gray-500 text-xs">
                          ID: {libro.idlibro}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {libro.plus ? 'Plus' : 'Estándar'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}