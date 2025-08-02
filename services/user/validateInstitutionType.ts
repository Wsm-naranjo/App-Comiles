import api from "../api";
import { getCurrentEnvironment } from "../config";

export const validateInstitutionType = async (
  institutionId: number
): Promise<boolean> => {
  const envInfo = getCurrentEnvironment();

  console.log("🏛️ VALIDANDO INSTITUCIÓN:");
  console.log(`   ID Institución: ${institutionId}`);
  console.log(`   Entorno: ${envInfo.environment}`);
  console.log(`   URL Base: ${envInfo.baseURL}`);

  try {
    const url = `/api/validarTipoInstitucion/${institutionId}`;
    console.log(`   Haciendo petición a: ${envInfo.baseURL}${url}`);

    const response = await api.get(url);

    console.log("📋 RESPUESTA DE VALIDACIÓN:");
    console.log(`   Status: ${response.status}`);
    console.log(`   Data:`, response.data);
    console.log(`   Headers:`, response.headers);

    const isValid = response.data === true;
    console.log(`   ✅ Institución válida: ${isValid}`);

    return isValid;
  } catch (error: any) {
    console.error("❌ ERROR VALIDANDO INSTITUCIÓN:");
    console.error(`   Status: ${error?.response?.status}`);
    console.error(`   Message: ${error?.message}`);
    console.error(`   Response Data:`, error?.response?.data);
    console.error(`   Full Error:`, error);

    // En desarrollo, retornar false para debugging
    // En producción, podríamos querer un comportamiento diferente
    if (envInfo.isDevelopment) {
      console.log("🔧 Modo desarrollo: retornando false para debugging");
      return false;
    } else {
      console.log("🚀 Modo producción: retornando false por seguridad");
      return false;
    }
  }
};
