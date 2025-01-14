import React from 'react';
import { useEditor } from '@craftjs/core';

export { PropertyDropdown } from './PropertyDropdown';
export { PropertyItem } from './PropertyItem';
export { PropertyRadio } from './PropertyRadio';
export { PropertySection } from './PropertySection';
export { PropertyTextInput } from './PropertyTextInput';

/**
 * PropertyBar
 * Renders different UI based on the node selection state in the editor:
 *   1. If zero nodes are selected, display a "no selection" message
 *   2. If exactly one node is selected, display that node’s custom property bar (if defined)
 *   3. If multiple nodes are selected, display a “multiple selection” message
 */
export const PropertyBar: React.FC = () => {
  const { selectedNodeIds, relatedFirstNode } = useEditor((state) => {
    // state.events.selected is usually a Set of NodeIds that are currently selected
    const selectedSet = state.events.selected || new Set<string>();
    const selectedArray = Array.from(selectedSet);

    // For single selection, we only need the first selected node's related data
    const firstId = selectedArray[0] || null;

    return {
      selectedNodeIds: selectedArray,
      relatedFirstNode: firstId ? state.nodes[firstId].related : null,
    };
  });

  const count = selectedNodeIds.length;

  // No nodes selected
  if (count === 0) {
    return (
      <div className="py-1 h-full flex flex-col items-center justify-center text-center px-5">
        <h2
          className="pb-1"
          style={{ fontSize: '11px', color: 'rgba(0,0,0,0.56)' }}
        >
          Click on a component to start editing.
        </h2>
        <h2 style={{ fontSize: '11px', color: 'rgba(0,0,0,0.56)' }}>
          You can also double-click layer names in the panel to rename them.
        </h2>
      </div>
    );
  }

  // Exactly one node selected
  if (count === 1) {
    if (relatedFirstNode?.propertyBar) {
      // Render the custom property bar for the single selected node
      return React.createElement(relatedFirstNode.propertyBar);
    }
    // Fallback if the node doesn't have a custom property bar
    return (
      <div className="py-1 px-2">
        <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.56)' }}>
          This component has no property bar defined.
        </p>
      </div>
    );
  }

  // Multiple nodes selected
  return (
    <div className="py-1 h-full flex flex-col items-center justify-center text-center px-5">
      <h2
        className="pb-1"
        style={{ fontSize: '11px', color: 'rgba(0,0,0,0.56)' }}
      >
        You have selected {count} components.
      </h2>
      <h2 style={{ fontSize: '11px', color: 'rgba(0,0,0,0.56)' }}>
        Please deselect some components to edit their properties.
      </h2>
    </div>
  );
};
