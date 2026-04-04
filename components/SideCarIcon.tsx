import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = { size?: number; color?: string };

export function SideCarIcon({ size = 28, color = '#000' }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-2.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0-4 0m-6 0a2 2 0 1 0-4 0" />
    </Svg>
  );
}
