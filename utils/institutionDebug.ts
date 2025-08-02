import { getCurrentEnvironment } from "@/services/config";
import { validateInstitutionType } from "@/services/user/validateInstitutionType";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Función de debugging para validación de institución
 */
export const debugInstitutionValidation = async (): Promise<void> => {
  console.log('🔍 === DEBUG VALIDACIÓN DE INSTITUCIÓN ===');
  
  try {
    // 1. Verificar entorno
    const envInfo = getCurrentEnvironment();
    console.log('🌍 Entorno actual:', envInfo.environment);
    console.log('🌐 URL Base:', envInfo.baseURL);
    
    // 2. Obtener datos de usuario
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      console.log('❌ No hay datos de usuario guardados');
      return;
    }
    
    const parsedData = JSON.parse(userData);
    console.log('👤 Usuario:', parsedData.nombres, parsedData.apellidos);
    console.log('🏛️ Institución ID:', parsedData.institucion_idInstitucion);
    console.log('🏛️ Institución Nombre:', parsedData.institucion?.nombreInstitucion);
    
    // 3. Probar validación
    console.log('🧪 Probando validación...');
    const isValid = await validateInstitutionType(parsedData.institucion_idInstitucion);
    
    console.log('📊 RESULTADO FINAL:');
    console.log(`   ✅ Institución válida: ${isValid}`);
    console.log(`   🎯 Debería ir a: ${isValid ? 'HOME' : 'ACCESS DENIED'}`);
    
  } catch (error) {
    console.error('💥 Error en debug:', error);
  }
  
  console.log('🔍 === FIN DEBUG VALIDACIÓN ===');
};

/**
 * Función para probar manualmente la validación con un ID específico
 */
export const testInstitutionValidation = async (institutionId: number): Promise<void> => {
  console.log(`🧪 === TEST VALIDACIÓN INSTITUCIÓN ${institutionId} ===`);
  
  try {
    const result = await validateInstitutionType(institutionId);
    console.log(`📊 Resultado para institución ${institutionId}: ${result}`);
  } catch (error) {
    console.error(`💥 Error probando institución ${institutionId}:`, error);
  }
  
  console.log('🧪 === FIN TEST ===');
};

/**
 * Función para verificar conectividad con el endpoint
 */
export const testInstitutionEndpoint = async (): Promise<void> => {
  console.log('🌐 === TEST CONECTIVIDAD ENDPOINT ===');
  
  try {
    const envInfo = getCurrentEnvironment();
    const testUrl = `${envInfo.baseURL}/api/validarTipoInstitucion/1`;
    
    console.log('🔗 URL de prueba:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Status:', response.status);
    console.log('📡 Status Text:', response.statusText);
    
    const data = await response.text();
    console.log('📄 Response:', data);
    
  } catch (error) {
    console.error('💥 Error de conectividad:', error);
  }
  
  console.log('🌐 === FIN TEST CONECTIVIDAD ===');
};