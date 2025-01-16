import React from 'react';
import {
  PropertySection,
  PropertyItem,
  PropertyRadio,
} from '../../Editor/ComponentPropertiesBar';

/**
 * ContainerSettings
 * Demonstrates multiple PropertySection panels, each retrieving and summarizing
 * certain prop keys (e.g., width, height, background, color, etc.).
 * Renders PropertyItem controls within each section.
 */
export const ContainerSettings: React.FC = () => {
  return (
    <>
      <PropertySection
        title="Dimensions"
        props={['width', 'height']}
        summary={({ width, height }: any) => `${width || 0} x ${height || 0}`}
      >
        <PropertyItem propKey="width" type="text" label="Width" />
        <PropertyItem propKey="height" type="text" label="Height" />
      </PropertySection>

      <PropertySection
        title="Colors"
        props={['background', 'color']}
        summary={({ background, color }: any) => (
          <div className="flex flex-row-reverse">
            <div
              style={{
                background: background && `rgba(${Object.values(background)})`,
              }}
              className="shadow-md flex-end w-6 h-6 text-center flex items-center rounded-full bg-black"
            >
              <p
                style={{
                  color: color && `rgba(${Object.values(color)})`,
                }}
                className="text-white w-full text-center"
              >
                T
              </p>
            </div>
          </div>
        )}
      >
        <PropertyItem full propKey="background" type="bg" label="Background" />
        <PropertyItem full propKey="color" type="color" label="Text" />
      </PropertySection>

      <PropertySection
        title="Margin"
        props={['margin']}
        summary={({ margin }: any) =>
          `${margin[0] || 0}px ${margin[1] || 0}px ${margin[2] || 0}px ${
            margin[3] || 0
          }px`
        }
      >
        <PropertyItem propKey="margin" index={0} type="slider" label="Top" />
        <PropertyItem propKey="margin" index={1} type="slider" label="Right" />
        <PropertyItem propKey="margin" index={2} type="slider" label="Bottom" />
        <PropertyItem propKey="margin" index={3} type="slider" label="Left" />
      </PropertySection>

      <PropertySection
        title="Padding"
        props={['padding']}
        summary={({ padding }: any) =>
          `${padding[0] || 0}px ${padding[1] || 0}px ${padding[2] || 0}px ${
            padding[3] || 0
          }px`
        }
      >
        <PropertyItem propKey="padding" index={0} type="slider" label="Top" />
        <PropertyItem propKey="padding" index={1} type="slider" label="Right" />
        <PropertyItem
          propKey="padding"
          index={2}
          type="slider"
          label="Bottom"
        />
        <PropertyItem propKey="padding" index={3} type="slider" label="Left" />
      </PropertySection>

      <PropertySection title="Decoration" props={['radius', 'shadow']}>
        <PropertyItem full propKey="radius" type="slider" label="Radius" />
        <PropertyItem full propKey="shadow" type="slider" label="Shadow" />
      </PropertySection>

      <PropertySection title="Alignment">
        <PropertyItem
          propKey="flexDirection"
          type="radio"
          label="Flex Direction"
        >
          <PropertyRadio value="row" label="Row" />
          <PropertyRadio value="column" label="Column" />
        </PropertyItem>
        <PropertyItem propKey="fillSpace" type="radio" label="Fill space">
          <PropertyRadio value="yes" label="Yes" />
          <PropertyRadio value="no" label="No" />
        </PropertyItem>
        <PropertyItem propKey="alignItems" type="radio" label="Align Items">
          <PropertyRadio value="flex-start" label="Flex start" />
          <PropertyRadio value="center" label="Center" />
          <PropertyRadio value="flex-end" label="Flex end" />
        </PropertyItem>
        <PropertyItem
          propKey="justifyContent"
          type="radio"
          label="Justify Content"
        >
          <PropertyRadio value="flex-start" label="Flex start" />
          <PropertyRadio value="center" label="Center" />
          <PropertyRadio value="flex-end" label="Flex end" />
        </PropertyItem>
      </PropertySection>
    </>
  );
};
