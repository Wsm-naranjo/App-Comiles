#!/usr/bin/env node

/**
 * Script para probar la validación de institución
 * Uso: node scripts/test-institution.js [institutionId]
 */

const axios = require('axios');

// Configuración de URLs (debe coincidir con tu config.ts)
const config = {
  development: {
    baseURL: "http://10.10.1.220:8000",
  },
  production: {
    baseURL: "https://server1.prolipadigital.com.ec", 
  },
};

// Detectar entorno
const isDevelopment = process.env.NODE_ENV !== 'production';
const currentConfig = isDevelopment ? config.development : config.production;

console.log('🧪 PROBANDO VALIDACIÓN DE INSTITUCIÓN');
console.log(`🌍 Entorno: ${isDevelopment ? 'DESARROLLO' : 'PRODUCCIÓN'}`);
console.log(`🌐 URL Base: ${currentConfig.baseURL}`);

// Obtener ID de institución desde argumentos o usar por defecto
const institutionId = process.argv[2] || '66'; // ID por defecto de EDITORIAL PROLIPA - SIERRA

console.log(`🏛️ Probando institución ID: ${institutionId}`);

async function testInstitution() {
  try {
    const url = `${currentConfig.baseURL}/api/validarTipoInstitucion/${institutionId}`;
    console.log(`📞 Haciendo petición a: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    console.log('✅ RESPUESTA EXITOSA:');
    console.log(`   Status: ${response.status}`);
    console.log(`   Data:`, response.data);
    console.log(`   Es válida: ${response.data === true}`);
    
  } catch (error) {
    console.error('❌ ERROR:');
    console.error(`   Status: ${error?.response?.status || 'N/A'}`);
    console.error(`   Message: ${error?.message}`);
    console.error(`   Response:`, error?.response?.data);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🚨 No se puede conectar al servidor');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('⏰ Timeout de conexión');
    }
  }
}

// Probar múltiples IDs si se especifica 'all'
if (institutionId === 'all') {
  console.log('🔄 Probando múltiples instituciones...');
  const testIds = [1, 66, 100, 999]; // IDs de prueba
  
  for (const id of testIds) {
    console.log(`\n--- Probando ID ${id} ---`);
    await testInstitution(id);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa entre peticiones
  }
} else {
  testInstitution();
}