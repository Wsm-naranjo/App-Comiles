import api from '../api';

export const validateInstitutionType = async (institutionId: number): Promise<boolean> => {
  try {
    const response = await api.get(`/validarTipoInstitucion/${institutionId}`);
    return response.data === true;
  } catch (error) {
    console.error('Error validando tipo de institución:', error);
    return false;
  }
};