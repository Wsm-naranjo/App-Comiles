import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Tipos para los datos del usuario
export interface UserData {
  apellidos: string;
  capacitador: number;
  cargo_id: string | null;
  cedula: string;
  change_password: number;
  cli_ins_codigo: string | null;
  cod_usuario: string;
  created_at: string;
  curso: string | null;
  date_created: string;
  email: string;
  estado_idEstado: number;
  estado_institucion_temporal: string;
  fecha_change_password: string | null;
  fecha_nacimiento: string | null;
  foto_user: string;
  grupo: {
    busquedaUsuarios: string | null;
    created_at: string;
    deskripsi: string;
    id: number;
    level: string;
    permiso_rol: string;
    updated_at: string | null;
    user_created: string | null;
    user_edited: string | null;
  };
  id_group: number;
  idcreadorusuario: number;
  idusuario: number;
  iniciales: string;
  institucion: {
    idInstitucion: number;
    nombreInstitucion: string;
  };
  institucion_idInstitucion: number;
  institucion_temporal_id: string | null;
  modificado_por: number;
  nacionalidad: string | null;
  name_usuario: string;
  nombres: string;
  p_ingreso: number;
  paralelo: string | null;
  password_status: string;
  periodo_actualizacion: number;
  recurso_externo: string;
  retirado: string | null;
  seccion: string | null;
  session_id: string | null;
  sexo: string | null;
  telefono: string;
  update_datos: string;
  updated_at: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  isLoading: boolean;
  clearUserData: () => void;
  // Funciones de conveniencia para acceder a datos específicos
  getUserName: () => string;
  getUserEmail: () => string;
  getUserRole: () => string;
  getUserInstitution: () => string;
  getUserInstitutionShort: () => string;
  getUserPhone: () => string;
  getUserPhoto: () => string;
  getUserApiParams: () => { id: number; institucion: number; grupo: number; } | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del usuario al iniciar la app
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        setUserDataState(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserData = async (data: UserData | null) => {
    try {
      if (data) {
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        setUserDataState(data);
      } else {
        await AsyncStorage.removeItem('userData');
        setUserDataState(null);
      }
    } catch (error) {
      console.error('Error guardando datos del usuario:', error);
    }
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUserDataState(null);
    } catch (error) {
      console.error('Error limpiando datos del usuario:', error);
    }
  };

  // Funciones de conveniencia
  const getUserName = (): string => {
    if (!userData) return 'Usuario';
    return `${userData.nombres} ${userData.apellidos}`.trim();
  };

  const getUserEmail = (): string => {
    return userData?.email || 'email@ejemplo.com';
  };

  const getUserRole = (): string => {
    return userData?.grupo?.level || 'Usuario';
  };

  const getUserInstitution = (): string => {
    return userData?.institucion?.nombreInstitucion || 'Institución';
  };

  const getUserInstitutionShort = (): string => {
    const fullName = userData?.institucion?.nombreInstitucion || 'Institución';
    
    // Si es muy largo, acortamos manteniendo las partes importantes
    if (fullName.length > 30) {
      // Casos específicos conocidos
      if (fullName.includes('EDITORIAL PROLIPA')) {
        if (fullName.includes('SIERRA')) return 'Prolipa Sierra';
        if (fullName.includes('COSTA')) return 'Prolipa Costa';
        return 'Editorial Prolipa';
      }
      
      // Para otros casos, tomar las primeras palabras importantes
      const words = fullName.split(' ');
      if (words.length > 3) {
        return words.slice(0, 3).join(' ') + '...';
      }
    }
    
    return fullName;
  };

  const getUserPhone = (): string => {
    return userData?.telefono || '';
  };

  const getUserPhoto = (): string => {
    return userData?.foto_user || 'default.png';
  };

  // Funciones para obtener parámetros necesarios para las APIs
  const getUserApiParams = () => {
    if (!userData) return null;
    
    return {
      id: userData.idusuario,
      institucion: userData.institucion_idInstitucion,
      grupo: userData.id_group,
    };
  };

  const value: UserContextType = {
    userData,
    setUserData,
    isLoading,
    clearUserData,
    getUserName,
    getUserEmail,
    getUserRole,
    getUserInstitution,
    getUserInstitutionShort,
    getUserPhone,
    getUserPhoto,
    getUserApiParams,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};