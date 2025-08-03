import api from './api';
import { UserData } from './UserContext';

// Tipos para los datos de libros
export interface PeriodoData {
  periodo: number;
  estado: string;
  nombreInstitucion: string;
  descripcion: string;
  region: number;
  imgenInstitucion: string;
}

export interface LibroEstudiante {
  idlibro: number;
  nombrelibro: string;
  descripcionlibro: string;
  serie: string;
  anio: string;
  titulo: string;
  portada: string;
  weblibro: string;
  pdfsinguia: string;
  pdfconguia: string;
  guiadidactica: string;
  Estado_idEstado: number;
  asignatura_idasignatura: number;
  ziplibro: string;
  libroFechaModificacion: string;
  grupo: string;
  puerto: string;
  idasignatura: number;
  nombreasignatura: string;
  area_idarea: number;
  nivel_idnivel: number;
  tipo_asignatura: string;
  estado: number;
  plus: number;
  id_folleto: number | null;
  codigo?: string;
  fechaUpdate?: string;
  creado_at?: string;
  actualizado_at?: string;
  created_at?: string;
  updated_at?: string;
  pag_inicio?: string;
  pag_fin?: string;
}

export interface LibrosResponse {
  libros: LibroEstudiante[];
  nivel: number;
  institucion: number;
}

/**
 * Servicio para manejar los libros del estudiante
 */
export class BooksService {
  /**
   * Obtiene el período activo de una institución
   */
  static async obtenerPeriodoInstitucion(
    institucionId: number
  ): Promise<PeriodoData | null> {
    try {
      console.log(`Obteniendo período para institución: ${institucionId}`);

      const response = await api.get(
        `/api/institucionTraerPeriodo?institucion_id=${institucionId}`
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        // Tomamos el primer período (asumiendo que es el activo)
        const periodoData = response.data[0] as PeriodoData;
        console.log('Período obtenido:', periodoData);
        return periodoData;
      }

      console.log('No se encontró período para la institución');
      return null;
    } catch (error) {
      console.error('Error obteniendo período de institución:', error);
      return null;
    }
  }

  /**
   * Obtiene los códigos de libros para un estudiante
   */
  static async obtenerLibrosEstudiante(
    id: number,
    institucion: number,
    periodo: number,
    region: number,
    grupo: number
  ): Promise<{
    libros: LibroEstudiante[];
    nivel: number;
    institucion: number;
  }> {
    try {
      const url = `/api/libros_estudiante/${id}/${institucion}/${periodo}/${region}/${grupo}`;

      console.log('=== OBTENIENDO LIBROS DEL ESTUDIANTE ===');
      console.log('URL:', url);
      console.log('Parámetros:', {
        id,
        institucion,
        periodo,
        region,
        grupo,
      });

      const response = await api.get(url);

      console.log('=== RESPUESTA DE LA API ===');
      console.log('Status:', response.status);
      console.log('Data type:', typeof response.data);
      console.log('Data:', response.data);

      // La API devuelve { libros: [...], nivel: ..., institucion: ... }
      if (response.data && typeof response.data === 'object') {
        const {
          libros = [],
          nivel = 0,
          institucion: inst = institucion,
        } = response.data;

        console.log('=== DATOS PROCESADOS ===');
        console.log(
          'Cantidad de libros:',
          Array.isArray(libros) ? libros.length : 0
        );
        console.log('Nivel:', nivel);
        console.log('Institución:', inst);

        if (Array.isArray(libros) && libros.length > 0) {
          console.log('Primer libro:', libros[0]);
        }

        return {
          libros: Array.isArray(libros) ? libros : [],
          nivel,
          institucion: inst,
        };
      }

      console.log('⚠️ Respuesta inesperada de la API');
      return { libros: [], nivel: 0, institucion };
    } catch (error: any) {
      console.error('=== ERROR OBTENIENDO LIBROS ===');
      console.error('Error:', error);
      console.error('Response status:', error?.response?.status);
      console.error('Response data:', error?.response?.data);
      console.error('Message:', error?.message);

      return { libros: [], nivel: 0, institucion };
    }
  }

  /**
   * Obtiene todos los libros de un usuario usando sus datos
   */
  static async obtenerLibrosUsuario(userData: UserData): Promise<{
    libros: LibroEstudiante[];
    periodo: PeriodoData | null;
    nivel: number;
    error?: string;
  }> {
    try {
      // Extraer datos del usuario
      const id = userData.idusuario;
      const institucion = userData.institucion_idInstitucion;
      const grupo = userData.id_group;

      console.log('=== INICIANDO OBTENCIÓN DE LIBROS ===');
      console.log('Usuario:', `${userData.nombres} ${userData.apellidos}`);
      console.log('Parámetros del usuario:', {
        id,
        institucion,
        grupo,
        email: userData.email,
        rol: userData.grupo?.level,
      });

      // Paso 1: Obtener el período de la institución
      console.log('=== PASO 1: OBTENIENDO PERÍODO ===');
      const periodoData = await this.obtenerPeriodoInstitucion(institucion);

      if (!periodoData) {
        console.log('❌ No se pudo obtener el período');
        return {
          libros: [],
          periodo: null,
          nivel: 0,
          error: 'No se pudo obtener el período de la institución',
        };
      }

      console.log('✅ Período obtenido:', periodoData);

      // Paso 2: Obtener los libros del estudiante
      console.log('=== PASO 2: OBTENIENDO LIBROS ===');
      const resultado = await this.obtenerLibrosEstudiante(
        id,
        institucion,
        periodoData.periodo,
        periodoData.region,
        grupo
      );

      console.log('=== RESULTADO FINAL ===');
      console.log('Cantidad de libros:', resultado.libros.length);
      console.log('Nivel:', resultado.nivel);

      if (resultado.libros.length === 0) {
        console.log('⚠️ No se encontraron libros para este usuario');
        console.log('Verificar:');
        console.log('- ¿El usuario tiene libros asignados?');
        console.log('- ¿Los parámetros son correctos?');
        console.log('- ¿El período está activo?');
      }

      return {
        libros: resultado.libros,
        periodo: periodoData,
        nivel: resultado.nivel,
      };
    } catch (error) {
      console.error('=== ERROR GENERAL ===');
      console.error('Error obteniendo libros del usuario:', error);
      return {
        libros: [],
        periodo: null,
        nivel: 0,
        error: 'Error interno al obtener los libros',
      };
    }
  }

  /**
   * Función de conveniencia para obtener solo la cantidad de libros
   */
  static async obtenerCantidadLibrosUsuario(
    userData: UserData
  ): Promise<number> {
    try {
      const resultado = await this.obtenerLibrosUsuario(userData);
      const cantidad = resultado.libros.length;

      console.log('=== CANTIDAD DE LIBROS ===');
      console.log('Usuario:', `${userData.nombres} ${userData.apellidos}`);
      console.log('Cantidad:', cantidad);

      return cantidad;
    } catch (error) {
      console.error('Error obteniendo cantidad de libros:', error);
      return 0;
    }
  }

  /**
   * Agrega un libro por código al usuario
   */
  static async agregarLibroPorCodigo(
    codigo: string,
    userData: UserData,
    periodoData?: PeriodoData
  ): Promise<{
    success: boolean;
    message: string;
    error?: string;
  }> {
    try {
      console.log('=== AGREGANDO LIBRO POR CÓDIGO ===');
      console.log('Código:', codigo);
      console.log('Usuario:', `${userData.nombres} ${userData.apellidos}`);

      // Si no se proporciona periodoData, obtenerlo
      let periodo = periodoData;
      if (!periodo) {
        console.log('Obteniendo período de la institución...');
        const periodoObtenido = await this.obtenerPeriodoInstitucion(userData.institucion_idInstitucion);
        
        if (!periodoObtenido) {
          return {
            success: false,
            message: 'No se pudo obtener el período de la institución',
            error: 'PERIODO_NO_ENCONTRADO'
          };
        }
        periodo = periodoObtenido;
      }



      const body = {
        codigo: codigo,
        idusuario: userData.idusuario,
        id_periodo: periodo.periodo,
        id_institucion: userData.institucion_idInstitucion
      };

      console.log('Body del request:', body);

      const response = await api.post('/api/codigoslibros', body );
      

      console.log('=== RESPUESTA AGREGAR LIBRO ===');
      console.log('Status:', response.status);
      console.log('Data:', response.data);

      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          message: 'Libro agregado exitosamente'
        };
      } else {
        return {
          success: false,
          message: 'Error al agregar el libro',
          error: 'RESPUESTA_INESPERADA'
        };
      }

    } catch (error: any) {
      console.error('=== ERROR AGREGANDO LIBRO ===');
      console.error('Error:', error);
      console.error('Response status:', error?.response?.status);
      console.error('Response data:', error?.response?.data);
      console.error('Message:', error?.message);

      // Manejar diferentes tipos de errores
      let message = 'Error al agregar el libro';
      let errorCode = 'ERROR_DESCONOCIDO';

      if (error?.response?.status === 400) {
        message = 'Código de libro inválido o ya existe';
        errorCode = 'CODIGO_INVALIDO';
      } else if (error?.response?.status === 404) {
        message = 'Código de libro no encontrado';
        errorCode = 'CODIGO_NO_ENCONTRADO';
      } else if (error?.response?.status === 403) {
        message = 'No tienes permisos para agregar este libro';
        errorCode = 'SIN_PERMISOS';
      } else if (error?.response?.status >= 500) {
        message = 'Error del servidor. Intenta más tarde';
        errorCode = 'ERROR_SERVIDOR';
      } else if (error?.message === 'Network Error') {
        message = 'Error de conexión. Verifica tu internet';
        errorCode = 'ERROR_RED';
      }

      return {
        success: false,
        message,
        error: errorCode
      };
    }
  }
}

export default BooksService;





