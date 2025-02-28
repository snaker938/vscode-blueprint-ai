// src/components/CraftEditor/PropertiesPanel.tsx
import React from 'react';
import { useEditor } from '@craftjs/core';
import { Stack, Text, DefaultButton } from '@fluentui/react';

export const PropertiesPanel: React.FC = () => {
  // Collect info about the currently selected node
  const { actions, selected } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected; // 'selected' is a Set of selected Node IDs
    let selectedNode = null;

    if (currentNodeId) {
      const node = state.nodes[currentNodeId];
      selectedNode = {
        id: currentNodeId,
        name: node?.data?.displayName || node?.data?.name,
        // a "settings" component if it was attached in the user component
        Settings: node?.related?.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected: selectedNode,
    };
  });

  if (!selected || !selected.id) {
    return (
      <Stack
        verticalFill
        tokens={{ padding: 10 }}
        style={{ backgroundColor: '#f3f2f1' }}
      >
        <Text variant="medium">No node selected</Text>
      </Stack>
    );
  }

  const { id, name, Settings, isDeletable } = selected;

  return (
    <Stack
      verticalFill
      tokens={{ padding: 10 }}
      style={{ backgroundColor: '#f3f2f1' }}
    >
      <Text variant="mediumPlus" block>
        Selected: {name || '—'}
      </Text>

      <Stack style={{ marginTop: '10px' }}>{Settings && <Settings />}</Stack>

      {isDeletable && (
        <DefaultButton
          text="Delete"
          style={{ marginTop: '20px' }}
          onClick={() => actions.delete(id)}
        />
      )}
    </Stack>
  );
};
