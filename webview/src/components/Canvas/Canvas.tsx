import React from 'react';
import { Frame, Element } from '@craftjs/core';
import GridEditor from './GridLayout';
import './Canvas.css';

const CanvasArea: React.FC = () => {
  return (
    <div className="canvas-area">
      <Frame>
        <Element is="div" canvas>
          <GridEditor />
        </Element>
      </Frame>
    </div>
  );
};

export default CanvasArea;
