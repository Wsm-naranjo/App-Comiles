import SeriesService, { Serie } from '@/services/seriesService';
import { useEffect, useState } from 'react';
import useUserBooks from './useUserBooks';

interface UseSeriesReturn {
  series: Serie[];
  seriesConLibros: Serie[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para manejar las series
 */
export const useSeries = (): UseSeriesReturn => {
  const { libros } = useUserBooks();
  const [series, setSeries] = useState<Serie[]>([]);
  const [seriesConLibros, setSeriesConLibros] = useState<Serie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSeries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('=== useSeries: Obteniendo series ===');
      
      // Obtener todas las series
      const todasLasSeries = await SeriesService.obtenerSeries();
      setSeries(todasLasSeries);

      // Si hay libros, obtener solo las series que tienen libros
      if (libros.length > 0) {
        const seriesConLibrosData = await SeriesService.obtenerSeriesConLibros(libros);
        setSeriesConLibros(seriesConLibrosData);
        
        console.log('✅ Series cargadas:', {
          total: todasLasSeries.length,
          conLibros: seriesConLibrosData.length
        });
      } else {
        setSeriesConLibros([]);
      }

    } catch (err) {
      console.error('❌ Error en useSeries:', err);
      setError('Error al cargar las series');
      setSeries([]);
      setSeriesConLibros([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar series cuando cambien los libros
  useEffect(() => {
    fetchSeries();
  }, [libros]);

  return {
    series,
    seriesConLibros,
    isLoading,
    error,
    refetch: fetchSeries,
  };
};

export default useSeries;