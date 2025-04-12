// CanvasBorderWrapper.tsx

import React from 'react';
import { useEditor } from '@craftjs/core';

export const CanvasBorderWrapper: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const { actions } = useEditor();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      actions.selectNode([]);
    }
  };

  return (
    <div
      id="droppable-canvas-border"
      className="canvas-border-wrapper"
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
