import React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

type Props = { size?: number };

export function AppIcon({ size = 40 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Rect width="32" height="32" rx="8" fill="white" />
      <Path
        d="M13 22V10H18.5C20.433 10 22 11.567 22 13.5C22 15.433 20.433 17 18.5 17H15.5V22H13Z"
        fill="#1D54D3"
      />
      <Circle cx="10" cy="10" r="1.5" fill="#10B981" />
    </Svg>
  );
}
