import api from './api';

// Tipos para las series
export interface Serie {
  id_serie: number;
  nombre_serie: string;
  longitud_numeros: number;
  longitud_letras: number;
  longitud_codigo: string;
  longitud_codigo_grafitext: number;
  ser_estado: number;
  user_created: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Servicio para manejar las series
 */
export class SeriesService {
  
  /**
   * Obtiene todas las series disponibles
   */
  static async obtenerSeries(): Promise<Serie[]> {
    try {
      console.log('=== OBTENIENDO SERIES ===');
      
      const response = await api.get('/series');
      
      console.log('Respuesta de series:', {
        status: response.status,
        cantidad: Array.isArray(response.data) ? response.data.length : 0
      });

      if (response.data && Array.isArray(response.data)) {
        // Filtrar solo series activas
        const seriesActivas = response.data.filter((serie: Serie) => serie.ser_estado === 1);
        
        console.log(`✅ Series obtenidas: ${seriesActivas.length} activas de ${response.data.length} totales`);
        
        return seriesActivas;
      }

      console.log('⚠️ No se encontraron series');
      return [];
    } catch (error: any) {
      console.error('=== ERROR OBTENIENDO SERIES ===');
      console.error('Error:', error);
      console.error('Response status:', error?.response?.status);
      console.error('Response data:', error?.response?.data);
      
      return [];
    }
  }

  /**
   * Obtiene las series que tienen libros del usuario
   */
  static async obtenerSeriesConLibros(librosUsuario: any[]): Promise<Serie[]> {
    try {
      const todasLasSeries = await this.obtenerSeries();
      
      // Obtener series únicas de los libros del usuario
      const seriesEnLibros = new Set(
        librosUsuario
          .map(libro => libro.serie)
          .filter(serie => serie && serie !== 'N/A')
      );

      console.log('=== SERIES EN LIBROS DEL USUARIO ===');
      console.log('Series encontradas en libros:', Array.from(seriesEnLibros));

      // Filtrar solo las series que tienen libros
      const seriesConLibros = todasLasSeries.filter(serie => 
        seriesEnLibros.has(serie.nombre_serie)
      );

      console.log(`✅ Series con libros: ${seriesConLibros.length}`);
      
      return seriesConLibros;
    } catch (error) {
      console.error('Error obteniendo series con libros:', error);
      return [];
    }
  }
}

export default SeriesService;