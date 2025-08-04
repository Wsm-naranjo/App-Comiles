import useSeries from '@/hooks/useSeries';
import useUserBooks from '@/hooks/useUserBooks';
import BooksService, { LibroEstudiante } from '@/services/booksService';
import { useUser } from '@/services/UserContext';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LibraryScreen() {
  const {
    libros,
    cantidadLibros,
    isLoading: librosLoading,
    error: librosError,
    refetch: refetchLibros,
  } = useUserBooks();
  const { seriesConLibros, isLoading: seriesLoading } = useSeries();
  const { userData } = useUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSerie, setSelectedSerie] = useState('Todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [modalVisible, setModalVisible] = useState(false);
  const [bookCode, setBookCode] = useState('');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [addBookMessage, setAddBookMessage] = useState('');

  const seriesOptions = ['Todas', ...seriesConLibros.map(s => s.nombre_serie)];

  const filteredBooks = libros.filter(libro => {
    const matchesSearch =
      libro.nombrelibro.toLowerCase().includes(searchQuery.toLowerCase()) ||
      libro.nombreasignatura.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSerie =
      selectedSerie === 'Todas' || libro.serie === selectedSerie;
    return matchesSearch && matchesSerie;
  });

  const getSerieBgColor = (serie: string) => {
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

  const handleAddBook = async () => {
    // Evitar múltiples ejecuciones
    if (isAddingBook) {
      return;
    }

    if (!userData) {
      setAddBookMessage('Error: No se encontraron datos del usuario');
      return;
    }

    if (!bookCode.trim()) {
      setAddBookMessage('Por favor ingresa un código válido');
      return;
    }

    setIsAddingBook(true);
    setAddBookMessage('');

    try {
      const resultado = await BooksService.agregarLibroPorCodigo(
        bookCode.trim(),
        userData
      );

      if (resultado.success) {
        setAddBookMessage('¡Libro agregado exitosamente!');
        // Refrescar la lista de libros
        await refetchLibros();
        // Cerrar modal después de un breve delay para mostrar el mensaje
        setTimeout(() => {
          setModalVisible(false);
          setBookCode('');
          setAddBookMessage('');
          setIsAddingBook(false);
        }, 1500);
      } else {
        setAddBookMessage(resultado.message || 'Error al agregar el libro');
        setIsAddingBook(false);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setAddBookMessage('Error inesperado. Intenta nuevamente.');
      setIsAddingBook(false);
    }
  };

  const handleCancelAddBook = () => {
    // No permitir cancelar si se está procesando
    if (isAddingBook) {
      return;
    }
    
    setModalVisible(false);
    setBookCode('');
    setAddBookMessage('');
    setIsAddingBook(false);
  };

  const BookCardGrid = ({ libro }: { libro: LibroEstudiante }) => (
    <TouchableOpacity
      className="w-[48%] bg-gray-800 p-3 rounded-xl mb-4"
      onPress={() =>
        router.push({
          pathname: '/Books/bookPage',
          params: {
            init: libro.pag_inicio,
            final: libro.pag_fin,
            idasignatura: libro.asignatura_idasignatura,
            nombreLibro: libro.weblibro,
          },
        })
      }>
      <View className="items-center mb-2">
        <Image
          source={{
            uri: libro.portada
              ? `https://data.prolipadigital.com.ec/archivos/upload/libro/${libro.weblibro}/${libro.portada}`
              : 'https://via.placeholder.com/80x120',
          }}
          className="w-20 h-28 rounded-md bg-gray-700"
          resizeMode="cover"
        />
      </View>
      <Text className="text-white font-bold text-sm mb-1 text-center" numberOfLines={2}>
        {libro.nombrelibro}
      </Text>
      <Text className="text-gray-400 text-xs mb-2 text-center" numberOfLines={1}>
        {libro.nombreasignatura}
      </Text>
      <View className="flex-row items-center justify-between">
        <View
          className={`px-2 py-1 rounded-full ${getSerieBgColor(
            libro.serie || 'default'
          )}`}>
          <Text className="text-white text-xs font-semibold">
            {libro.serie || 'N/A'}
          </Text>
        </View>
        <Text className="text-gray-500 text-xs">{libro.anio}</Text>
      </View>
    </TouchableOpacity>
  );

  const BookCardList = ({ libro }: { libro: LibroEstudiante }) => (
    <TouchableOpacity
      className="bg-gray-800 rounded-2xl p-4 mb-4 shadow-md"
      onPress={() =>
        router.push({
          pathname: '/Books/bookPage',
          params: {
            init: libro.pag_inicio,
            final: libro.pag_fin,
            idasignatura: libro.asignatura_idasignatura,
            nombreLibro: libro.weblibro,
          },
        })
      }>
      <View className="flex-row gap-4">
        <Image
          source={{
            uri: libro.portada
              ? `https://data.prolipadigital.com.ec/archivos/upload/libro/${libro.weblibro}/${libro.portada}`
              : 'https://via.placeholder.com/64x88',
          }}
          className="w-16 aspect-[3/4] rounded-lg bg-gray-700"
          resizeMode="cover"
        />
        <View className="flex-1 justify-between">
          <View className="mb-1">
            <View className="flex-row justify-between items-start mb-1">
              <Text
                className="text-white font-semibold text-base flex-1 pr-2"
                numberOfLines={2}>
                {libro.nombrelibro}
              </Text>
              <Feather name="book-open" size={16} color="#3B82F6" />
            </View>
            <Text className="text-gray-400 text-sm">
              {libro.nombreasignatura}
            </Text>
          </View>
          <View className="flex-row items-center mb-1">
            <View
              className={`px-2 py-0.5 rounded-full mr-2 ${getSerieBgColor(
                libro.serie || 'default'
              )}`}>
              <Text className="text-white text-xs font-semibold">
                {libro.serie || 'N/A'}
              </Text>
            </View>
            <Text className="text-gray-400 text-xs">Año: {libro.anio}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header fijo */}
      <View className="px-6 pt-6 pb-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-white text-2xl font-bold">Mi Biblioteca</Text>
            <Text className="text-gray-400 text-sm">
              {librosLoading
                ? 'Cargando...'
                : `${cantidadLibros} libros disponibles`}
            </Text>
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 bg-gray-800 rounded-lg">
              <Feather
                name={viewMode === 'grid' ? 'list' : 'grid'}
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Book Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-blue-600 p-3 rounded-xl mb-4 flex-row items-center justify-center">
          <Feather name="plus" size={20} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-semibold text-base">Agregar Libro</Text>
        </TouchableOpacity>

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

        {/* Series filter */}
        <FlatList
          horizontal
          data={seriesOptions}
          keyExtractor={item => item}
          className="mb-4"
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedSerie(item)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedSerie === item ? 'bg-blue-600' : 'bg-gray-800'
              }`}>
              <Text
                className={`font-semibold ${
                  selectedSerie === item ? 'text-white' : 'text-gray-400'
                }`}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Book List - Flex 1 para que ocupe el espacio restante */}
      <View className="flex-1 px-6">
        {librosLoading ? (
          <Text className="text-gray-400 text-center">Cargando libros...</Text>
        ) : librosError ? (
          <Text className="text-red-400 text-center">{librosError}</Text>
        ) : filteredBooks.length === 0 ? (
          <Text className="text-gray-500 text-center mt-4">
            No se encontraron libros
          </Text>
        ) : (
          <FlatList
            data={filteredBooks}
            key={viewMode}
            numColumns={viewMode === 'grid' ? 2 : 1}
            columnWrapperStyle={
              viewMode === 'grid'
                ? { justifyContent: 'space-between' }
                : undefined
            }
            keyExtractor={item => item.idlibro.toString()}
            renderItem={({ item }) =>
              viewMode === 'grid' ? (
                <BookCardGrid libro={item} />
              ) : (
                <BookCardList libro={item} />
              )
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Modal for Adding Book */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancelAddBook}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-gray-800 rounded-2xl p-6 mx-4 w-80">
            <Text className="text-white text-xl font-bold mb-4 text-center">
              Agregar Libro
            </Text>
            
            <Text className="text-gray-300 text-sm mb-2">
              Código del libro:
            </Text>
            
            <TextInput
              placeholder="Ingresa el código del libro"
              placeholderTextColor="#6B7280"
              value={bookCode}
              onChangeText={setBookCode}
              className="bg-gray-700 text-white p-3 rounded-lg mb-4"
              autoFocus={true}
              editable={!isAddingBook}
            />

            {/* Message Display */}
            {addBookMessage ? (
              <View className="mb-4">
                <Text 
                  className={`text-center text-sm ${
                    addBookMessage.includes('exitosamente') 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                  {addBookMessage}
                </Text>
              </View>
            ) : null}
            
            <View className="flex-row justify-between gap-4">
              <TouchableOpacity
                onPress={handleCancelAddBook}
                className={`flex-1 p-3 rounded-lg ${
                  isAddingBook ? 'bg-gray-500' : 'bg-gray-600'
                }`}
                disabled={isAddingBook}>
                <Text className={`text-center font-semibold ${
                  isAddingBook ? 'text-gray-400' : 'text-white'
                }`}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleAddBook}
                className={`flex-1 p-3 rounded-lg ${
                  isAddingBook || !bookCode.trim() 
                    ? 'bg-gray-500' 
                    : 'bg-blue-600'
                }`}
                disabled={isAddingBook || !bookCode.trim()}>
                <Text className="text-white text-center font-semibold">
                  {isAddingBook ? 'Agregando...' : 'Aceptar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
