import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = { size?: number; color?: string };

export function SideCarIcon({ size = 28, color = '#000' }: Props) {
  return <MaterialCommunityIcons name="car-side" size={size} color={color} />;
}
