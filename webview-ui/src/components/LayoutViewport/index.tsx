import React from 'react';
import { PrimarySidebar } from '../PrimarySidebar/PrimarySidebar';

export const LayoutViewport: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex w-full h-full">
      <PrimarySidebar />
      <div className="flex-1 relative overflow-auto">{children}</div>
    </div>
  );
};
