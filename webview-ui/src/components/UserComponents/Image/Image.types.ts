// Image.types.ts

import React from 'react';

export interface ImageProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  margin?: [number, number, number, number];
  padding?: [number, number, number, number];
  shadow?: number;
  borderRadius?: number;
  border?: string;
  children?: React.ReactNode;
}
