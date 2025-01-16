import React from 'react';
import { useNode } from '@craftjs/core';
import { Paper } from '@mui/material';
import { ContainerSettingsUI } from './ContainerSettingsUI';

interface ContainerProps {
  background: string;
  padding: number;
  children: React.ReactNode;
  [key: string]: any;
}

interface CustomContainer extends React.FC<ContainerProps> {
  craft: {
    props: typeof ContainerDefaultProps;
    related: {
      settings: typeof ContainerSettingsUI;
    };
  };
}

export const Container: CustomContainer = ({
  background,
  padding,
  children,
  ...props
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Paper
      {...props}
      ref={(ref) => ref && connect(drag(ref))}
      style={{ margin: '5px 0', background, padding: `${padding}px` }}
    >
      {children}
    </Paper>
  );
};

const ContainerDefaultProps = {
  background: '#ffffff',
  padding: 3,
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettingsUI,
  },
};
