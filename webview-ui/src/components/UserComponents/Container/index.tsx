import React from 'react';
import { useNode } from '@craftjs/core';

import { ContainerSettings } from './ContainerSettings';
import { Resizer } from '../Utils/Resizer';

export type ContainerProps = {
  background: Record<'r' | 'g' | 'b' | 'a', number>;
  color: Record<'r' | 'g' | 'b' | 'a', number>;
  flexDirection: string;
  alignItems: string;
  justifyContent: string;
  fillSpace: string;
  width: string;
  height: string;
  padding: string[];
  margin: string[];
  marginTop: number;
  marginLeft: number;
  marginBottom: number;
  marginRight: number;
  shadow: number;
  children: React.ReactNode;
  radius: number;
};

const defaultProps: Partial<ContainerProps> = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  fillSpace: 'no',
  padding: ['0', '0', '0', '0'],
  margin: ['0', '0', '0', '0'],
  background: { r: 255, g: 255, b: 255, a: 1 },
  color: { r: 0, g: 0, b: 0, a: 1 },
  shadow: 0,
  radius: 0,
  width: '100%',
  height: 'auto',
};

export const Container = (props: Partial<ContainerProps>) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const {
    flexDirection,
    alignItems,
    justifyContent,
    fillSpace,
    background = { r: 255, g: 255, b: 255, a: 1 },
    color = { r: 0, g: 0, b: 0, a: 1 },
    padding = ['0', '0', '0', '0'],
    margin = ['0', '0', '0', '0'],
    shadow,
    radius,
    children,
  } = {
    ...defaultProps,
    ...props,
  };

  return (
    <Resizer
      // Let Resizer manage width/height
      propKey={{ width: 'width', height: 'height' }}
      ref={(ref: HTMLDivElement) => connect(drag(ref))}
      style={{
        justifyContent,
        flexDirection,
        alignItems,
        background: `rgba(${Object.values(background)})`,
        color: `rgba(${Object.values(color)})`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        boxShadow:
          shadow === 0
            ? 'none'
            : `0px 3px 100px ${shadow}px rgba(0, 0, 0, 0.13)`,
        borderRadius: `${radius}px`,
        flex: fillSpace === 'yes' ? 1 : 'unset',
      }}
    >
      {children}
    </Resizer>
  );
};

Container.craft = {
  displayName: 'Container',
  props: defaultProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: ContainerSettings,
  },
};
