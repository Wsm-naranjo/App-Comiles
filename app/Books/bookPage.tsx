import Book from '@/components/Book';
import { useLocalSearchParams } from 'expo-router';

interface params {
  init: string;
  final: string;
  idasignatura: string;
}

const BookPage = () => {
  const { init, final, idasignatura, nombreLibro } = useLocalSearchParams();

  return <Book init={init} final={final} idasignatura={idasignatura} nombreLibro={nombreLibro} />;
};

export default BookPage;
