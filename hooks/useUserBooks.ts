import BooksService, { LibroEstudiante, PeriodoData } from '@/services/booksService';
import { useEffect, useState } from 'react';
import { useUserData } from './useUserData';

interface UseUserBooksReturn {
  libros: LibroEstudiante[];
  periodo: PeriodoData | null;
  nivel: number;
  cantidadLibros: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para manejar los libros del usuario
 */
export const useUserBooks = (): UseUserBooksReturn => {
  const { userData } = useUserData();
  const [libros, setLibros] = useState<LibroEstudiante[]>([]);
  const [periodo, setPeriodo] = useState<PeriodoData | null>(null);
  const [nivel, setNivel] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLibros = async () => {
    if (!userData) {
      setError('No hay datos de usuario disponibles');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('=== useUserBooks: Obteniendo libros del usuario ===');
      const resultado = await BooksService.obtenerLibrosUsuario(userData);

      if (resultado.error) {
        console.log('❌ Error en useUserBooks:', resultado.error);
        setError(resultado.error);
        setLibros([]);
        setPeriodo(null);
        setNivel(0);
      } else {
        console.log('✅ Libros cargados exitosamente en useUserBooks:', {
          cantidad: resultado.libros.length,
          nivel: resultado.nivel,
          periodo: resultado.periodo?.descripcion
        });
        setLibros(resultado.libros);
        setPeriodo(resultado.periodo);
        setNivel(resultado.nivel);
      }
    } catch (err) {
      console.error('❌ Error crítico en useUserBooks:', err);
      setError('Error al cargar los libros');
      setLibros([]);
      setPeriodo(null);
      setNivel(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar libros cuando el usuario esté disponible
  useEffect(() => {
    if (userData) {
      fetchLibros();
    }
  }, [userData]);

  return {
    libros,
    periodo,
    nivel,
    cantidadLibros: libros.length,
    isLoading,
    error,
    refetch: fetchLibros,
  };
};

export default useUserBooks;