// Editor/ComponentPropertiesBar/PropertyBar.tsx

import React from 'react';
import { useEditor } from '@craftjs/core';

export const PropertyBar: React.FC = () => {
  const { selectedNodeIds, relatedFirstNode } = useEditor((state) => {
    const selectedSet = state.events.selected || new Set<string>();
    const selectedArray = Array.from(selectedSet);

    const firstId = selectedArray[0] || null;

    return {
      selectedNodeIds: selectedArray,
      relatedFirstNode: firstId ? state.nodes[firstId].related : null,
    };
  });

  const count = selectedNodeIds.length;

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

  if (count === 1) {
    if (relatedFirstNode?.propertyBar) {
      return React.createElement(relatedFirstNode.propertyBar);
    }
    return (
      <div className="py-1 px-2">
        <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.56)' }}>
          This component has no property bar defined.
        </p>
      </div>
    );
  }

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
