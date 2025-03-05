import { useNode } from '@craftjs/core';
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { Radio } from '../../PropertiesSidebar/UI/Radio';

/**
 * A "properties" component for editing Container props.
 * It uses your new UI components (Section, Item, etc.)
 * to replicate the same structure as the old "Toolbar" version.
 */
export const ContainerProperties = () => {
  const {
    width,
    height,
    background,
    color,
    margin,
    padding,
    radius,
    shadow,
    flexDirection,
    fillSpace,
    alignItems,
    justifyContent,
    actions: { setProp },
  } = useNode((node) => ({
    width: node.data.props.width,
    height: node.data.props.height,
    background: node.data.props.background,
    color: node.data.props.color,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    radius: node.data.props.radius,
    shadow: node.data.props.shadow,
    flexDirection: node.data.props.flexDirection,
    fillSpace: node.data.props.fillSpace,
    alignItems: node.data.props.alignItems,
    justifyContent: node.data.props.justifyContent,
  }));

  return (
    <>
      {/* Dimensions */}
      <Section title={`Dimensions (${width} x ${height})`} defaultExpanded>
        <Item>
          <TextInput
            label="Width"
            value={width}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.width = val;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.height = val;
              })
            }
          />
        </Item>
      </Section>

      {/* Colors */}
      <Section title="Colors">
        <Item>
          <TextInput
            label="Background (rgba)"
            value={Object.values(background).join(', ')}
            onChangeValue={(val) => {
              const [r, g, b, a] = val.split(',').map(Number);
              setProp((props: any) => {
                props.background = { r, g, b, a };
              });
            }}
          />
        </Item>
        <Item>
          <TextInput
            label="Text Color (rgba)"
            value={Object.values(color).join(', ')}
            onChangeValue={(val) => {
              const [r, g, b, a] = val.split(',').map(Number);
              setProp((props: any) => {
                props.color = { r, g, b, a };
              });
            }}
          />
        </Item>
      </Section>

      {/* Margin */}
      <Section
        title={`Margin: ${margin[0]} ${margin[1]} ${margin[2]} ${margin[3]}`}
      >
        <Item>
          <TextInput
            label="Top"
            value={margin[0].toString()}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.margin[0] = parseInt(val, 10) || 0;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Right"
            value={margin[1].toString()}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.margin[1] = parseInt(val, 10) || 0;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Bottom"
            value={margin[2].toString()}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.margin[2] = parseInt(val, 10) || 0;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Left"
            value={margin[3].toString()}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.margin[3] = parseInt(val, 10) || 0;
              })
            }
          />
        </Item>
      </Section>

      {/* Padding */}
      <Section
        title={`Padding: ${padding[0]} ${padding[1]} ${padding[2]} ${padding[3]}`}
      >
        <Item>
          <TextInput
            label="Top"
            value={padding[0].toString()}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.padding[0] = parseInt(val, 10) || 0;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Right"
            value={padding[1].toString()}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.padding[1] = parseInt(val, 10) || 0;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Bottom"
            value={padding[2].toString()}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.padding[2] = parseInt(val, 10) || 0;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Left"
            value={padding[3].toString()}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.padding[3] = parseInt(val, 10) || 0;
              })
            }
          />
        </Item>
      </Section>

      {/* Decoration */}
      <Section title="Decoration">
        <Item>
          <TextInput
            label="Radius"
            value={radius.toString()}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.radius = parseInt(val, 10) || 0;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Shadow"
            value={shadow.toString()}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.shadow = parseInt(val, 10) || 0;
              })
            }
          />
        </Item>
      </Section>

      {/* Alignment */}
      <Section title="Alignment">
        <Item>
          <Radio
            label="Flex Direction"
            value={flexDirection}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.flexDirection = val;
              })
            }
            options={[
              { label: 'Row', value: 'row' },
              { label: 'Column', value: 'column' },
            ]}
          />
        </Item>
        <Item>
          <Radio
            label="Fill Space"
            value={fillSpace}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.fillSpace = val;
              })
            }
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
          />
        </Item>
        <Item>
          <Radio
            label="Align Items"
            value={alignItems}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.alignItems = val;
              })
            }
            options={[
              { label: 'Flex start', value: 'flex-start' },
              { label: 'Center', value: 'center' },
              { label: 'Flex end', value: 'flex-end' },
            ]}
          />
        </Item>
        <Item>
          <Radio
            label="Justify Content"
            value={justifyContent}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.justifyContent = val;
              })
            }
            options={[
              { label: 'Flex start', value: 'flex-start' },
              { label: 'Center', value: 'center' },
              { label: 'Flex end', value: 'flex-end' },
            ]}
          />
        </Item>
      </Section>
    </>
  );
};
