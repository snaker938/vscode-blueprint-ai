// webview-ui/src/components/RenderNode/RenderNode.tsx

import React from 'react';
import { IndicatorManager } from './IndicatorManager';
import { IndicatorOverlay } from './IndicatorOverlay';

interface RenderNodeProps {
  render: React.ReactElement;
}

/**
 * Renders the node with an IndicatorManager + IndicatorOverlay
 */
export const RenderNode: React.FC<RenderNodeProps> = ({ render }) => {
  return (
    <IndicatorManager render={render} IndicatorOverlay={IndicatorOverlay} />
  );
};
