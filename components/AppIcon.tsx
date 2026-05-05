import React from 'react';
import { Image } from 'react-native';

type Props = { size?: number };

export function AppIcon({ size = 40 }: Props) {
  return (
    <Image
      source={require('../assets/images/icon.png')}
      style={{ width: size, height: size, borderRadius: size * 0.25 }}
      resizeMode="cover"
    />
  );
}
