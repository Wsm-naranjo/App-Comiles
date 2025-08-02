#!/usr/bin/env node

/**
 * Script para verificar la configuración de entornos
 * Uso: node scripts/check-environment.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO CONFIGURACIÓN DE ENTORNOS\n');

// Verificar eas.json
const easPath = path.join(__dirname, '..', 'eas.json');
if (fs.existsSync(easPath)) {
  const easConfig = JSON.parse(fs.readFileSync(easPath, 'utf8'));
  console.log('✅ eas.json encontrado');
  
  if (easConfig.build) {
    console.log('📋 Profiles configurados:');
    Object.keys(easConfig.build).forEach(profile => {
      const config = easConfig.build[profile];
      const env = config.env?.APP_ENV || 'no configurado';
      console.log(`   - ${profile}: APP_ENV=${env}`);
    });
  }
} else {
  console.log('❌ eas.json no encontrado');
}

console.log('');

// Verificar app.json
const appJsonPath = path.join(__dirname, '..', 'app.json');
if (fs.existsSync(appJsonPath)) {
  const appConfig = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  console.log('✅ app.json encontrado');
  
  const extraEnv = appConfig.expo?.extra?.environment;
  if (extraEnv) {
    console.log(`📝 Environment en app.json: ${extraEnv}`);
  } else {
    console.log('📝 No hay environment configurado en app.json');
  }
} else {
  console.log('❌ app.json no encontrado');
}

console.log('');

// Verificar app.config.js
const appConfigPath = path.join(__dirname, '..', 'app.config.js');
if (fs.existsSync(appConfigPath)) {
  console.log('✅ app.config.js encontrado');
} else {
  console.log('❌ app.config.js no encontrado');
}

console.log('');

// Verificar variables de entorno
console.log('🌍 VARIABLES DE ENTORNO:');
console.log(`   APP_ENV: ${process.env.APP_ENV || 'no configurado'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'no configurado'}`);

console.log('');

// Comandos recomendados
console.log('🚀 COMANDOS PARA TUS BUILDS:');
console.log('   Desarrollo:  npm run build:android:dev');
console.log('   Preview:     npm run build:android:preview  ← TU COMANDO');
console.log('   Producción:  npm run build:android:prod');
console.log('');
console.log('   O directamente:');
console.log('   eas build -p android --profile preview  ← TU COMANDO ACTUAL');

console.log('\n✨ Verificación completa');