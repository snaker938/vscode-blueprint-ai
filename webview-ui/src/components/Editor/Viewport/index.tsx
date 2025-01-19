import React from 'react';
import { useEditor } from '@craftjs/core';
import cx from 'classnames';

import { RightSidebar } from './RightSidebar';
import { LeftSidebar } from './LeftSidebar';

export const Viewport: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { enabled, connectors } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <div className="viewport w-full h-full relative">
      <div className={cx(['flex h-full w-full overflow-hidden flex-row'])}>
        {/* Main content area */}
        <div
          className={cx([
            'craftjs-renderer flex-1 h-full w-full transition pb-8 overflow-auto relative',
            {
              'bg-gray-200': enabled, // adjust the background to your preference
            },
          ])}
          ref={(ref) => {
            if (ref) {
              connectors.select(connectors.hover(ref, ''), '');
            }
          }}
        >
          <div className="pt-6 flex flex-col items-center min-h-full">
            {/* The user’s page or craft elements go here */}
            {children}
          </div>
        </div>

        <RightSidebar />
        <LeftSidebar />
      </div>
    </div>
  );
};
