import { useNode } from '@craftjs/core';
import {
  Slider,
  Paper,
  FormControl,
  FormLabel,
  TextField,
} from '@mui/material';

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
      settings: typeof ContainerSettings;
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

export const ContainerSettings = () => {
  const {
    background,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
  }));

  return (
    <div>
      <FormControl fullWidth margin="normal" component="fieldset">
        <FormLabel component="legend">Background</FormLabel>
        <TextField
          type="color"
          value={background || '#ffffff'}
          onChange={(e) =>
            setProp(
              (props: ContainerProps) => (props.background = e.target.value),
              500
            )
          }
        />
      </FormControl>
      <FormControl fullWidth margin="normal" component="fieldset">
        <FormLabel component="legend">Padding</FormLabel>
        <Slider
          value={padding}
          onChange={(_, value) =>
            setProp(
              (props: ContainerProps) =>
                (props.padding = Array.isArray(value) ? value[0] : value),
              500
            )
          }
          min={0}
          max={50}
        />
      </FormControl>
    </div>
  );
};

const ContainerDefaultProps = {
  background: '#ffffff',
  padding: 3,
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};
