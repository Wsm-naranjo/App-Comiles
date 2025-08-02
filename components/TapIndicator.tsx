import React from 'react';
import { Text, View } from 'react-native';

interface TapIndicatorProps {
  tapCount: number;
  maxTaps: number;
  style?: any;
}

export const TapIndicator: React.FC<TapIndicatorProps> = ({ 
  tapCount, 
  maxTaps, 
  style 
}) => {
  if (tapCount === 0) return null;

  return (
    <View 
      style={[
        {
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: [{ translateX: -15 }],
          backgroundColor: 'rgba(255,255,255,0.2)',
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 10,
        },
        style
      ]}
    >
      <Text style={{ 
        color: 'white', 
        fontSize: 10, 
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        {Array(maxTaps).fill(0).map((_, index) => (
          <Text key={index} style={{ 
            color: index < tapCount ? '#22c55e' : 'rgba(255,255,255,0.3)' 
          }}>
            ●
          </Text>
        ))}
      </Text>
    </View>
  );
};