// webview-ui/src/components/Editor/Viewport/index.tsx
import React from 'react';
import { useEditor } from '@craftjs/core';
import cx from 'classnames';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';

export const Viewport: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { enabled, connectors } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <div className="fullscreen-flex">
      {/* LeftSidebar pinned on the left */}
      <LeftSidebar />

      {/* Main content area: the craftjs renderer */}
      <div
        className={cx(
          'craftjs-renderer flex-1 relative overflow-auto',
          enabled ? 'bg-gray-200' : ''
        )}
        ref={(ref) => {
          if (ref) connectors.select(connectors.hover(ref, ''), '');
        }}
      >
        {children}
      </div>

      {/* RightSidebar pinned on the right */}
      <RightSidebar />
    </div>
  );
};
