import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const books = [
  {
    id: 1,
    title: 'Manual de Estrategia Militar Moderna',
    author: 'Coronel García Mendoza',
    progress: 75,
    totalPages: 324,
    currentPage: 243,
    category: 'Estrategia',
    level: 'Avanzado',
    rating: 4.8,
    cover: 'https://via.placeholder.com/120x160/1F2937/FFFFFF?text=Estrategia',
    description: 'Guía completa sobre tácticas y estrategias militares contemporáneas.',
    publishYear: 2023,
    language: 'Español',
    size: '15.2 MB',
    lastRead: '2025-01-30',
  },
  {
    id: 2,
    title: 'Historia de las Fuerzas Armadas del Ecuador',
    author: 'General Morales Vásquez',
    progress: 100,
    totalPages: 456,
    currentPage: 456,
    category: 'Historia',
    level: 'Básico',
    rating: 4.9,
    cover: 'https://via.placeholder.com/120x160/059669/FFFFFF?text=Historia',
    description: 'Recorrido histórico desde la independencia hasta la actualidad.',
    publishYear: 2022,
    language: 'Español',
    size: '22.8 MB',
    lastRead: '2025-01-28',
  },
  {
    id: 3,
    title: 'Liderazgo y Comando en el Siglo XXI',
    author: 'Mayor Rodríguez Silva',
    progress: 45,
    totalPages: 278,
    currentPage: 125,
    category: 'Liderazgo',
    level: 'Intermedio',
    rating: 4.7,
    cover: 'https://via.placeholder.com/120x160/7C3AED/FFFFFF?text=Liderazgo',
    description: 'Principios modernos de liderazgo militar y gestión de equipos.',
    publishYear: 2024,
    language: 'Español',
    size: '18.5 MB',
    lastRead: '2025-01-29',
  },
  {
    id: 4,
    title: 'Operaciones Especiales: Tácticas Avanzadas',
    author: 'Teniente Coronel Silva',
    progress: 0,
    totalPages: 389,
    currentPage: 0,
    category: 'Operaciones',
    level: 'Avanzado',
    rating: 4.6,
    cover: 'https://via.placeholder.com/120x160/DC2626/FFFFFF?text=Operaciones',
    description: 'Manual especializado en operaciones especiales y tácticas avanzadas.',
    publishYear: 2024,
    language: 'Español',
    size: '25.1 MB',
    lastRead: null,
  },
  {
    id: 5,
    title: 'Tecnología Militar Contemporánea',
    author: 'Capitán Vásquez Torres',
    progress: 30,
    totalPages: 198,
    currentPage: 59,
    category: 'Tecnología',
    level: 'Intermedio',
    rating: 4.5,
    cover: 'https://via.placeholder.com/120x160/EA580C/FFFFFF?text=Tecnología',
    description: 'Análisis de las últimas innovaciones en tecnología militar.',
    publishYear: 2024,
    language: 'Español',
    size: '12.3 MB',
    lastRead: '2025-01-27',
  },
  {
    id: 6,
    title: 'Derecho Internacional Humanitario',
    author: 'Dr. Martínez López',
    progress: 60,
    totalPages: 345,
    currentPage: 207,
    category: 'Derecho',
    level: 'Avanzado',
    rating: 4.8,
    cover: 'https://via.placeholder.com/120x160/0891B2/FFFFFF?text=Derecho',
    description: 'Fundamentos legales y éticos en operaciones militares.',
    publishYear: 2023,
    language: 'Español',
    size: '19.7 MB',
    lastRead: '2025-01-26',
  },
];

export default function LibraryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['Todos', 'Estrategia', 'Historia', 'Liderazgo', 'Operaciones', 'Tecnología', 'Derecho'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Básico': return 'text-green-400';
      case 'Intermedio': return 'text-yellow-400';
      case 'Avanzado': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (progress: number) => {
    if (progress === 0) return { icon: 'download', color: '#6B7280' };
    if (progress === 100) return { icon: 'check-circle', color: '#10B981' };
    return { icon: 'bookmark', color: '#3B82F6' };
  };

  const formatLastRead = (dateString: string | null) => {
    if (!dateString) return 'No leído';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-6 pb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-2xl font-bold">
              Mi Biblioteca
            </Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 bg-gray-800 rounded-lg mr-2"
              >
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
              placeholder="Buscar libros o autores..."
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

          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`mr-3 px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-blue-600'
                    : 'bg-gray-800'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedCategory === category
                      ? 'text-white'
                      : 'text-gray-400'
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Books Grid/List */}
        <View className="px-6">
          {viewMode === 'grid' ? (
            <View className="flex-row flex-wrap justify-between">
              {filteredBooks.map((book) => {
                const status = getStatusIcon(book.progress);
                return (
                  <TouchableOpacity
                    key={book.id}
                    className="w-[48%] bg-gray-800 p-4 rounded-xl mb-4"
                  >
                    <View className="items-center mb-3">
                      <View className="w-20 h-28 bg-gray-700 rounded-lg mb-2 items-center justify-center">
                        <Feather name="book" size={24} color="#6B7280" />
                      </View>
                      <View className="absolute top-0 right-0">
                        <Feather name={status.icon as any} size={16} color={status.color} />
                      </View>
                    </View>
                    
                    <Text className="text-white font-bold text-sm mb-1 text-center" numberOfLines={2}>
                      {book.title}
                    </Text>
                    <Text className="text-gray-400 text-xs mb-2 text-center" numberOfLines={1}>
                      {book.author}
                    </Text>
                    
                    {book.progress > 0 && (
                      <View className="mb-2">
                        <View className="bg-gray-700 rounded-full h-1.5">
                          <View
                            className={`h-1.5 rounded-full ${
                              book.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${book.progress}%` }}
                          />
                        </View>
                        <Text className="text-gray-400 text-xs mt-1 text-center">
                          {book.progress}% • Pág. {book.currentPage}/{book.totalPages}
                        </Text>
                      </View>
                    )}
                    
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Feather name="star" size={12} color="#F59E0B" />
                        <Text className="text-yellow-400 text-xs ml-1">
                          {book.rating}
                        </Text>
                      </View>
                      <Text className={`text-xs font-semibold ${getLevelColor(book.level)}`}>
                        {book.level}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View>
              {filteredBooks.map((book) => {
                const status = getStatusIcon(book.progress);
                return (
                  <TouchableOpacity
                    key={book.id}
                    className="bg-gray-800 p-4 rounded-xl mb-4"
                  >
                    <View className="flex-row">
                      <View className="w-16 h-22 bg-gray-700 rounded-lg mr-4 items-center justify-center">
                        <Feather name="book" size={20} color="#6B7280" />
                      </View>
                      
                      <View className="flex-1">
                        <View className="flex-row items-start justify-between mb-1">
                          <Text className="text-white font-bold text-base flex-1 mr-2" numberOfLines={2}>
                            {book.title}
                          </Text>
                          <Feather name={status.icon as any} size={16} color={status.color} />
                        </View>
                        
                        <Text className="text-gray-400 text-sm mb-1">
                          {book.author}
                        </Text>
                        
                        <View className="flex-row items-center mb-2">
                          <View className={`px-2 py-1 rounded-full mr-2 ${
                            book.category === 'Estrategia' ? 'bg-blue-600' :
                            book.category === 'Historia' ? 'bg-green-600' :
                            book.category === 'Liderazgo' ? 'bg-purple-600' :
                            book.category === 'Operaciones' ? 'bg-red-600' :
                            book.category === 'Tecnología' ? 'bg-orange-600' :
                            'bg-teal-600'
                          }`}>
                            <Text className="text-white text-xs font-semibold">
                              {book.category}
                            </Text>
                          </View>
                          <Text className={`text-xs font-semibold ${getLevelColor(book.level)}`}>
                            {book.level}
                          </Text>
                        </View>
                        
                        {book.progress > 0 && (
                          <View className="mb-2">
                            <View className="bg-gray-700 rounded-full h-1.5">
                              <View
                                className={`h-1.5 rounded-full ${
                                  book.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${book.progress}%` }}
                              />
                            </View>
                            <Text className="text-gray-400 text-xs mt-1">
                              Página {book.currentPage} de {book.totalPages} • {book.progress}%
                            </Text>
                          </View>
                        )}
                        
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <Feather name="star" size={12} color="#F59E0B" />
                            <Text className="text-yellow-400 text-xs ml-1 mr-3">
                              {book.rating}
                            </Text>
                            <Text className="text-gray-500 text-xs">
                              {formatLastRead(book.lastRead)}
                            </Text>
                          </View>
                          <Text className="text-gray-500 text-xs">
                            {book.size}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {filteredBooks.length === 0 && (
          <View className="items-center justify-center py-12">
            <Feather name="book-open" size={48} color="#6B7280" />
            <Text className="text-gray-400 text-lg mt-4">
              No se encontraron libros
            </Text>
            <Text className="text-gray-500 text-sm mt-2 text-center px-8">
              Intenta con otros términos de búsqueda o cambia la categoría
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}