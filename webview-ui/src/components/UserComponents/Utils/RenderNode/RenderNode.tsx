// webview-ui/src/components/RenderNode/RenderNode.tsx

import React from 'react';
import { IndicatorManager } from './IndicatorManager';
import { IndicatorOverlay } from './IndicatorOverlay';

interface RenderNodeProps {
  render: React.ReactElement;
}

/**
 * Main RenderNode that merges the manager logic + overlay
 */
export const RenderNode: React.FC<RenderNodeProps> = ({ render }) => {
  return (
    <IndicatorManager render={render} IndicatorOverlay={IndicatorOverlay} />
  );
};
