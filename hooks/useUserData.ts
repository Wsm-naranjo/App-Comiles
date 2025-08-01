import { useUser } from '@/services/UserContext';

/**
 * Hook personalizado para acceder fácilmente a los datos del usuario
 * Proporciona funciones de conveniencia y datos formateados
 */
export const useUserData = () => {
  const { 
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
    getUserApiParams
  } = useUser();

  // Funciones adicionales de conveniencia
  const getUserId = (): number | null => {
    return userData?.idusuario || null;
  };

  const getUserCode = (): string => {
    return userData?.cod_usuario || '';
  };

  const getUserInitials = (): string => {
    return userData?.iniciales || '';
  };

  const getUserUsername = (): string => {
    return userData?.name_usuario || '';
  };

  const getUserCedula = (): string => {
    return userData?.cedula || '';
  };

  const getUserInstitutionId = (): number | null => {
    return userData?.institucion?.idInstitucion || null;
  };

  const getUserGroupId = (): number | null => {
    return userData?.id_group || null;
  };

  const getUserPermissions = (): string => {
    return userData?.grupo?.permiso_rol || '';
  };

  const isUserAdmin = (): boolean => {
    return userData?.grupo?.level === 'Default' || false;
  };

  const isUserCapacitador = (): boolean => {
    return userData?.capacitador === 1 || false;
  };

  const getUserCreatedAt = (): string => {
    return userData?.created_at || '';
  };

  const getUserUpdatedAt = (): string => {
    return userData?.updated_at || '';
  };

  // Función para obtener datos formateados para mostrar
  const getFormattedUserInfo = () => {
    if (!userData) return null;

    return {
      fullName: getUserName(),
      email: getUserEmail(),
      role: getUserRole(),
      institution: getUserInstitution(),
      phone: getUserPhone(),
      id: getUserId(),
      username: getUserUsername(),
      cedula: getUserCedula(),
      isAdmin: isUserAdmin(),
      isCapacitador: isUserCapacitador(),
    };
  };

  return {
    // Datos originales
    userData,
    setUserData,
    isLoading,
    clearUserData,
    
    // Funciones básicas
    getUserName,
    getUserEmail,
    getUserRole,
    getUserInstitution,
    getUserInstitutionShort,
    getUserPhone,
    getUserPhoto,
    getUserApiParams,
    
    // Funciones adicionales
    getUserId,
    getUserCode,
    getUserInitials,
    getUserUsername,
    getUserCedula,
    getUserInstitutionId,
    getUserGroupId,
    getUserPermissions,
    isUserAdmin,
    isUserCapacitador,
    getUserCreatedAt,
    getUserUpdatedAt,
    
    // Función de conveniencia
    getFormattedUserInfo,
  };
};