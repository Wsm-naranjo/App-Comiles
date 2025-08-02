import { getCurrentEnvironment } from '@/services/config';
import React from 'react';
import { Text, View } from 'react-native';

/**
 * Indicador simple del entorno actual
 * Útil para verificar rápidamente qué entorno está activo
 */
export const EnvIndicator: React.FC = () => {
  const envInfo = getCurrentEnvironment();
  
  return (
    <View
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: envInfo.isProduction ? '#ef4444' : '#22c55e',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 1000,
      }}
    >
      <Text style={{ 
        color: 'white', 
        fontSize: 10, 
        fontWeight: 'bold' 
      }}>
        {envInfo.environment.toUpperCase()}
      </Text>
    </View>
  );
};

/**
 * Hook para obtener información del entorno
 */
export const useEnvironment = () => {
  return getCurrentEnvironment();
};