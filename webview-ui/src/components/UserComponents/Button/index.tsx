import React from 'react';
import { useNode } from '@craftjs/core';
import cx from 'classnames';
import styled from 'styled-components';

import { ButtonProperties } from './ButtonProperties';
import { Text } from '../Text';

/**
 * Button prop definitions
 */
export interface IButtonProps {
  background: { r: number; g: number; b: number; a: number };
  color: { r: number; g: number; b: number; a: number };
  buttonStyle: 'full' | 'outline' | string;
  margin: [number, number, number, number];
  text: string;
  /**
   * Configuration object for the internal Text component.
   * You can pass any of the `Text.craft.props` fields here.
   */
  textComponent: any;
}

/**
 * Make all fields optional when using <Button ...props />
 */
export type ButtonComponentProps = Partial<IButtonProps>;

/**
 * Default props for the Button
 */
const defaultProps: IButtonProps = {
  background: { r: 255, g: 255, b: 255, a: 0.5 },
  color: { r: 92, g: 90, b: 90, a: 1 },
  buttonStyle: 'full',
  margin: [5, 0, 5, 0],
  text: 'Button',
  textComponent: {
    ...Text.craft.props,
    textAlign: 'center',
  },
};

/**
 * Styled component for the Button
 * Using Transient Props ($propName) to avoid passing them to the DOM
 */
const StyledButton = styled.button<{
  $background: IButtonProps['background'];
  $buttonStyle: IButtonProps['buttonStyle'];
  $margin: IButtonProps['margin'];
}>`
  background: ${({ $buttonStyle, $background }) =>
    $buttonStyle === 'full'
      ? `rgba(${$background.r}, ${$background.g}, ${$background.b}, ${$background.a})`
      : 'transparent'};
  border: 2px solid transparent;
  border-color: ${({ $buttonStyle, $background }) =>
    $buttonStyle === 'outline'
      ? `rgba(${$background.r}, ${$background.g}, ${$background.b}, ${$background.a})`
      : 'transparent'};
  margin: ${({ $margin }) =>
    `${$margin[0]}px ${$margin[1]}px ${$margin[2]}px ${$margin[3]}px`};
`;

/**
 * Craft.js settings interface
 */
interface ICraftSettings {
  displayName: string;
  props: IButtonProps;
  related: {
    settings: React.ComponentType<any>;
  };
}

/**
 * Custom Craft.js component type
 */
interface ICraftComponent<T = object> extends React.FC<T> {
  craft: ICraftSettings;
}

/**
 * Button component for Craft.js
 */
export const Button: ICraftComponent<ButtonComponentProps> = (props) => {
  // Merge default props with props passed in
  const { background, color, buttonStyle, margin, text, textComponent } = {
    ...defaultProps,
    ...props,
  };

  // Craft.js node connector
  const {
    connectors: { connect, drag },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <StyledButton
      ref={(dom) => {
        if (dom) {
          connect(drag(dom));
        }
      }}
      className={cx([
        'rounded w-full px-4 py-2',
        {
          'shadow-lg': buttonStyle === 'full',
        },
      ])}
      $buttonStyle={buttonStyle}
      $background={background}
      $margin={margin}
    >
      {/* The Text component is responsible for editing its own text via ContentEditable */}
      <Text {...textComponent} text={text} color={color} />
    </StyledButton>
  );
};

/**
 * Craft.js configuration
 */
Button.craft = {
  displayName: 'Button',
  props: {
    ...defaultProps,
  },
  related: {
    settings: ButtonProperties,
  },
};
