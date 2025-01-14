import React from 'react';
import { useEditor } from '@craftjs/core';

/**
 * PropertyBar
 * - Shows a property editor for the currently selected node if exactly one node is selected.
 * - If multiple nodes are selected, shows a “multiple” message.
 * - If no node is selected, displays a helpful “no selection” message.
 */
export const PropertyBar: React.FC = () => {
  const { selectedNodeIds, relatedFirstNode } = useEditor((state, query) => {
    // 'selected' is typically a Set<NodeId> (or array) of selected node IDs
    const selectedSet = state.events.selected || new Set<string>();
    const selectedArray = Array.from(selectedSet);

    // We'll pick the first selected ID (if any) to read its 'related'
    const firstId = selectedArray[0] || null;

    return {
      selectedNodeIds: selectedArray,
      relatedFirstNode: firstId ? state.nodes[firstId].related : null,
    };
  });

  const count = selectedNodeIds.length;

  // 0) No selection
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

  // 1) Exactly one node selected
  if (count === 1) {
    if (relatedFirstNode?.propertyBar) {
      // Render the custom property bar for the single selected node
      return React.createElement(relatedFirstNode.propertyBar);
    }
    // If no propertyBar is defined, show a fallback message
    return (
      <div className="py-1 px-2">
        <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.56)' }}>
          This component has no property bar defined.
        </p>
      </div>
    );
  }

  // 2) More than one node selected
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
