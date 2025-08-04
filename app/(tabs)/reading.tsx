import { Feather } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const readingStats = {
  totalBooksRead: 8,
  currentlyReading: 4,
  totalPages: 2156,
  readingStreak: 12,
  averageReadingTime: 45,
  favoriteGenre: 'Estrategia Militar',
  monthlyGoal: 15,
  monthlyProgress: 8,
};

const currentlyReading = [
  {
    id: 1,
    title: 'Manual de Estrategia Militar Moderna',
    author: 'Coronel García Mendoza',
    progress: 75,
    currentPage: 243,
    totalPages: 324,
    timeLeft: '2h 15min',
    lastRead: '2025-01-30',
    bookmark: 'Capítulo 8: Tácticas Defensivas',
  },
  {
    id: 2,
    title: 'Liderazgo y Comando en el Siglo XXI',
    author: 'Mayor Rodríguez Silva',
    progress: 45,
    currentPage: 125,
    totalPages: 278,
    timeLeft: '4h 30min',
    lastRead: '2025-01-29',
    bookmark: 'Capítulo 5: Gestión de Crisis',
  },
  {
    id: 3,
    title: 'Tecnología Militar Contemporánea',
    author: 'Capitán Vásquez Torres',
    progress: 30,
    currentPage: 59,
    totalPages: 198,
    timeLeft: '3h 45min',
    lastRead: '2025-01-27',
    bookmark: 'Capítulo 3: Sistemas de Comunicación',
  },
];

const recentBookmarks = [
  {
    id: 1,
    bookTitle: 'Manual de Estrategia Militar Moderna',
    chapter: 'Capítulo 8: Tácticas Defensivas',
    page: 243,
    note: 'Importante: Revisar formaciones defensivas en terreno montañoso',
    date: '2025-01-30',
    color: 'bg-blue-600',
  },
  {
    id: 2,
    bookTitle: 'Historia de las Fuerzas Aereas del Ecuador',
    chapter: 'Capítulo 12: Guerra del Cenepa',
    page: 387,
    note: 'Análisis estratégico del conflicto de 1995',
    date: '2025-01-28',
    color: 'bg-green-600',
  },
  {
    id: 3,
    bookTitle: 'Derecho Internacional Humanitario',
    chapter: 'Capítulo 6: Protección de Civiles',
    page: 207,
    note: 'Protocolo adicional I - Artículo 51',
    date: '2025-01-26',
    color: 'bg-purple-600',
  },
];

const readingGoals = [
  {
    id: 1,
    title: 'Meta Mensual',
    current: 8,
    target: 15,
    unit: 'libros',
    color: 'bg-blue-600',
    icon: 'target',
  },
  {
    id: 2,
    title: 'Páginas Diarias',
    current: 45,
    target: 50,
    unit: 'páginas',
    color: 'bg-green-600',
    icon: 'book-open',
  },
  {
    id: 3,
    title: 'Racha de Lectura',
    current: 12,
    target: 30,
    unit: 'días',
    color: 'bg-orange-600',
    icon: 'calendar',
  },
];

export default function ReadingScreen() {
  const formatLastRead = (dateString: string) => {
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
          <Text className="text-white text-2xl font-bold mb-2">
            Mi Lectura
          </Text>
          <Text className="text-gray-400 text-sm">
            Seguimiento de tu progreso de lectura
          </Text>
        </View>

        {/* Reading Stats Overview */}
        <View className="px-6 mb-6">
          <View className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl mb-4">
            <Text className="text-white text-lg font-bold mb-2">
              Estadísticas de Lectura
            </Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-blue-100 text-2xl font-bold">
                  {readingStats.totalBooksRead}
                </Text>
                <Text className="text-blue-200 text-sm">
                  Libros Completados
                </Text>
              </View>
              <View>
                <Text className="text-blue-100 text-2xl font-bold">
                  {readingStats.totalPages}
                </Text>
                <Text className="text-blue-200 text-sm">
                  Páginas Leídas
                </Text>
              </View>
              <View>
                <Text className="text-blue-100 text-2xl font-bold">
                  {readingStats.readingStreak}
                </Text>
                <Text className="text-blue-200 text-sm">
                  Días Consecutivos
                </Text>
              </View>
            </View>
          </View>

          {/* Reading Goals */}
          <Text className="text-white text-lg font-bold mb-4">
            Metas de Lectura
          </Text>
          <View className="flex-row justify-between mb-6">
            {readingGoals.map((goal) => (
              <View key={goal.id} className="bg-gray-800 p-4 rounded-xl flex-1 mx-1">
                <View className={`p-2 rounded-full self-start mb-2 ${goal.color}`}>
                  <Feather name={goal.icon as any} size={16} color="white" />
                </View>
                <Text className="text-white text-lg font-bold">
                  {goal.current}/{goal.target}
                </Text>
                <Text className="text-gray-400 text-xs">
                  {goal.title}
                </Text>
                <View className="bg-gray-700 rounded-full h-1.5 mt-2">
                  <View
                    className={`h-1.5 rounded-full ${goal.color.replace('bg-', 'bg-')}`}
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Currently Reading */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">
              Leyendo Actualmente
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-400 text-sm">Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {currentlyReading.map((book) => (
            <TouchableOpacity
              key={book.id}
              className="bg-gray-800 p-4 rounded-xl mb-3"
            >
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-white font-bold text-base mb-1">
                    {book.title}
                  </Text>
                  <Text className="text-gray-400 text-sm mb-2">
                    {book.author}
                  </Text>
                  <View className="flex-row items-center mb-2">
                    <Feather name="bookmark" size={14} color="#6B7280" />
                    <Text className="text-gray-400 text-sm ml-2">
                      {book.bookmark}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-gray-400 text-sm mb-1">
                    {formatLastRead(book.lastRead)}
                  </Text>
                  <View className="flex-row items-center">
                    <Feather name="clock" size={14} color="#6B7280" />
                    <Text className="text-gray-400 text-sm ml-1">
                      {book.timeLeft}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="bg-gray-700 rounded-full h-2 mb-2">
                <View
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${book.progress}%` }}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-sm">
                  Página {book.currentPage} de {book.totalPages}
                </Text>
                <Text className="text-blue-400 text-sm font-semibold">
                  {book.progress}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Bookmarks & Notes */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">
              Marcadores Recientes
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-400 text-sm">Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {recentBookmarks.map((bookmark) => (
            <TouchableOpacity
              key={bookmark.id}
              className="bg-gray-800 p-4 rounded-xl mb-3"
            >
              <View className="flex-row items-start">
                <View className={`p-2 rounded-full mr-3 ${bookmark.color}`}>
                  <Feather name="bookmark" size={16} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-sm mb-1">
                    {bookmark.bookTitle}
                  </Text>
                  <Text className="text-gray-400 text-sm mb-1">
                    {bookmark.chapter} • Página {bookmark.page}
                  </Text>
                  <Text className="text-gray-300 text-sm mb-2">
                    "{bookmark.note}"
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {formatLastRead(bookmark.date)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-white text-lg font-bold mb-4">
            Acciones Rápidas
          </Text>
          
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-blue-600 p-4 rounded-xl flex-1 mr-2 items-center">
              <Feather name="play" size={24} color="white" />
              <Text className="text-white font-semibold mt-2 text-center">
                Continuar Leyendo
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-green-600 p-4 rounded-xl flex-1 mx-1 items-center">
              <Feather name="bookmark" size={24} color="white" />
              <Text className="text-white font-semibold mt-2 text-center">
                Mis Marcadores
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-purple-600 p-4 rounded-xl flex-1 ml-2 items-center">
              <Feather name="edit-3" size={24} color="white" />
              <Text className="text-white font-semibold mt-2 text-center">
                Mis Notas
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}