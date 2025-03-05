import { Layers } from '@craftjs/layers';
import { Layer } from './CustomLayer';

export const CustomLayers = () => {
  return (
    <div style={{ background: '#fffef5', padding: 16, borderRadius: 8 }}>
      <Layers
        expandRootOnLoad
        renderLayer={(layerProps) => <Layer {...layerProps} />}
      />
    </div>
  );
};
