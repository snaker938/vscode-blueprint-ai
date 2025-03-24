import { FC, MouseEvent } from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { Slider as FluentSlider } from '@fluentui/react';
import { SliderProperties } from './SliderProperties';

/**
 * Props for the Slider component.
 */
export interface ISliderProps {
  /** Minimum slider value. */
  min: number;
  /** Maximum slider value. */
  max: number;
  /** Increment step. */
  step: number;
  /** Controlled current value. */
  currentValue: number;
  /** 'horizontal' or 'vertical'. */
  orientation: 'horizontal' | 'vertical';

  /** Craft Resizer dimensions. */
  width: string;
  height: string;

  /** Color of the slider thumb/handle. */
  thumbColor: string;
  /** Color of the slider track (both active and inactive sections). */
  trackColor: string;

  /**
   * Margin for each side (top, right, bottom, left).
   * Example usage: "10px", "2rem", etc.
   */
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;

  /**
   * Padding for each side (top, right, bottom, left).
   */
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;

  /** Thickness of the track. If undefined, defaults to 8px. */
  trackThickness?: number;

  /**
   * Whether to show or hide the numeric value label on the slider.
   * Fluent UI uses `showValue` for controlling this label.
   */
  showValue: boolean;

  /** Color for the displayed numeric value. */
  valueColor?: string;
  /** Font size for the displayed numeric value (e.g., "14px"). */
  valueFontSize?: string;
  /** Font weight for the displayed numeric value (e.g., "bold", "normal"). */
  valueFontWeight?: string;
}

/**
 * Craft configuration interface.
 */
interface ISliderCraft {
  displayName: string;
  props: ISliderProps;
  isCanvas: boolean;
  rules: {
    canDrag: (node: Node) => boolean;
    canMove: (node: Node) => boolean;
    canDelete: (node: Node) => boolean;
    canSelect: (node: Node) => boolean;
  };
  related: {
    settings: typeof SliderProperties;
  };
}

/**
 * Extend the FC so we can attach Craft configuration.
 */
interface ISliderComponent extends FC {
  craft: ISliderCraft;
}

/**
 * The main Slider component, integrated with Craft.
 */
export const Slider: ISliderComponent = () => {
  const {
    connectors: { connect },
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props as ISliderProps,
  }));

  const isVertical = props.orientation === 'vertical';

  // Prevent de-selecting the component in the Craft editor
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Resizer
      ref={(ref) => ref && connect(ref)}
      propKey={{ width: 'width', height: 'height' }}
      style={{
        display: 'inline-block',
        // Provide a minimum size so the slider track remains visible.
        minWidth: isVertical ? '40px' : '200px',
        minHeight: isVertical ? '150px' : '40px',
      }}
      onClick={handleClick}
    >
      <FluentSlider
        // Basic slider props
        min={props.min}
        max={props.max}
        step={props.step}
        vertical={isVertical}
        value={props.currentValue}
        onChange={(val: number) => {
          setProp((draft: ISliderProps) => {
            draft.currentValue = val;
          });
        }}
        // Show/hide the numeric value
        showValue={props.showValue}
        // Fluent UI styling overrides
        styles={{
          root: {
            width: '100%',
            height: '100%',
            // Apply four-sided margin & padding from props
            margin: `${props.marginTop} ${props.marginRight} ${props.marginBottom} ${props.marginLeft}`,
            padding: `${props.paddingTop} ${props.paddingRight} ${props.paddingBottom} ${props.paddingLeft}`,
          },
          slideBox: {
            // Ensure the slide box fills available space
            width: isVertical ? 'auto' : '100%',
            height: isVertical ? '100%' : 'auto',
          },
          // Control the thickness of the slider track
          line: {
            [isVertical ? 'width' : 'height']: props.trackThickness ?? 8,
          },
          thumb: {
            backgroundColor: props.thumbColor,
          },
          activeSection: {
            backgroundColor: props.trackColor,
          },
          inactiveSection: {
            backgroundColor: props.trackColor,
          },
          // Style the numeric value label
          valueLabel: {
            color: props.valueColor ?? '#000',
            fontSize: props.valueFontSize ?? '14px',
            fontWeight: props.valueFontWeight ?? 'normal',
          },
        }}
      />
    </Resizer>
  );
};

/**
 * Craft configuration + default props for new Slider instances.
 */
Slider.craft = {
  displayName: 'Slider',
  props: {
    min: 0,
    max: 100,
    step: 1,
    currentValue: 50,
    orientation: 'horizontal',
    width: '300px',
    height: '40px',
    thumbColor: '#ffffff',
    trackColor: '#0078d4',

    // Default margin for each side
    marginTop: '0px',
    marginRight: '0px',
    marginBottom: '0px',
    marginLeft: '0px',
    // Default padding for each side
    paddingTop: '0px',
    paddingRight: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',

    trackThickness: 8,

    // Show the numeric value label by default
    showValue: true,
    valueColor: '#000000',
    valueFontSize: '14px',
    valueFontWeight: 'normal',
  },
  isCanvas: false,
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  related: {
    settings: SliderProperties,
  },
};
