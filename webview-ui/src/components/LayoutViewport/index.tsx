// webview-ui/src/components/LayoutViewport/index.tsx
import React from 'react';
import { PrimarySidebar } from '../PrimarySidebar/PrimarySidebar';

export const LayoutViewport: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="tw-flex w-full h-full">
      <PrimarySidebar />
      <div className="tw-flex-1 relative overflow-auto">{children}</div>
    </div>
  );
};
