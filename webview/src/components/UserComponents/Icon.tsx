import React from 'react';
import { useNode } from '@craftjs/core';
import { Icon } from '@fluentui/react';

interface IconProps {
  iconName?: string;
}

export const IconComponent: React.FC<IconProps> & { craft?: any } =
  React.forwardRef<HTMLSpanElement, IconProps>(({ iconName }, ref) => {
    const {
      connectors: { connect, drag },
    } = useNode();

    return (
      <Icon
        iconName={iconName}
        componentRef={(iconRef) => connect(drag(iconRef))}
      />
    );
  });

IconComponent.craft = {
  displayName: 'Icon',
  props: {
    iconName: 'Emoji2',
  },
};
