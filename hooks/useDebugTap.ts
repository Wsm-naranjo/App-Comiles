import { useCallback, useState } from 'react';

/**
 * Hook para manejar taps múltiples para activar debug
 * @param requiredTaps - Número de taps requeridos (default: 3)
 * @param resetTimeout - Tiempo en ms para resetear el contador (default: 2000)
 */
export const useDebugTap = (requiredTaps: number = 3, resetTimeout: number = 2000) => {
  const [tapCount, setTapCount] = useState(0);
  const [isDebugVisible, setIsDebugVisible] = useState(false);

  const handleTap = useCallback(() => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);
    
    if (newTapCount >= requiredTaps) {
      setIsDebugVisible(true);
      setTapCount(0); // Reset counter
    } else {
      // Reset counter después del timeout si no llega al número requerido
      setTimeout(() => {
        setTapCount(0);
      }, resetTimeout);
    }
  }, [tapCount, requiredTaps, resetTimeout]);

  const hideDebug = useCallback(() => {
    setIsDebugVisible(false);
    setTapCount(0);
  }, []);

  const resetTaps = useCallback(() => {
    setTapCount(0);
  }, []);

  return {
    tapCount,
    isDebugVisible,
    handleTap,
    hideDebug,
    resetTaps,
  };
};