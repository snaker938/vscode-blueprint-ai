import React from 'react';

/**
 * ContainerSettingsUI
 * This is a PURE UI component that does NOT import or use PropertyItem or useNode().
 * It is the one directly assigned to `Container.craft.related.settings`.
 */
export const ContainerSettingsUI: React.FC = () => {
  return (
    <div style={{ padding: 8 }}>
      <h3>Container Settings (Placeholder UI)</h3>
      <p>
        This is a dumb/pure settings component without any direct references to
        PropertyItem or `useNode`.
      </p>
    </div>
  );
};
