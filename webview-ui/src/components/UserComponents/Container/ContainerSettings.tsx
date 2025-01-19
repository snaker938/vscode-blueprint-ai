import { PropertySection, PropertyItem, PropertyRadio } from '../../Editor';

export const ContainerSettings = () => {
  return (
    <>
      <PropertySection title="Dimensions" props={['width', 'height']}>
        <PropertyItem propKey="width" type="text" label="Width" />
        <PropertyItem propKey="height" type="text" label="Height" />
      </PropertySection>

      <PropertySection title="Colors" props={['background', 'color']}>
        <PropertyItem full propKey="background" type="bg" label="Background" />
        <PropertyItem full propKey="color" type="color" label="Text" />
      </PropertySection>

      <PropertySection title="Margin" props={['margin']}>
        <PropertyItem propKey="margin" index={0} type="slider" label="Top" />
        <PropertyItem propKey="margin" index={1} type="slider" label="Right" />
        <PropertyItem propKey="margin" index={2} type="slider" label="Bottom" />
        <PropertyItem propKey="margin" index={3} type="slider" label="Left" />
      </PropertySection>

      <PropertySection title="Padding" props={['padding']}>
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
        <PropertyItem propKey="radius" type="slider" label="Radius" full />
        <PropertyItem propKey="shadow" type="slider" label="Shadow" full />
      </PropertySection>

      <PropertySection title="Alignment">
        <PropertyRadio
          propKey="flexDirection"
          label="Flex Direction"
          options={[
            { value: 'row', label: 'Row' },
            { value: 'column', label: 'Column' },
          ]}
        />
        <PropertyRadio
          propKey="fillSpace"
          label="Fill space"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />
        <PropertyRadio
          propKey="alignItems"
          label="Align Items"
          options={[
            { value: 'flex-start', label: 'Flex start' },
            { value: 'center', label: 'Center' },
            { value: 'flex-end', label: 'Flex end' },
          ]}
        />
        <PropertyRadio
          propKey="justifyContent"
          label="Justify Content"
          options={[
            { value: 'flex-start', label: 'Flex start' },
            { value: 'center', label: 'Center' },
            { value: 'flex-end', label: 'Flex end' },
          ]}
        />
      </PropertySection>
    </>
  );
};
