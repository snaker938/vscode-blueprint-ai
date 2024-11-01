// webview/src/pages/EditingInterface/EditingInterface.tsx

import React from 'react';
import { Editor } from '@craftjs/core';
import Header from '../../components/Header/Header';
import Toolbar from '../../components/Toolbar/Toolbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CanvasArea from '../../components/Canvas/Canvas';
import './EditingInterface.css'; // Optional: styles for the editing interface

const EditingInterface: React.FC = () => {
  return (
    <Editor>
      <div className="editing-interface">
        <Header />
        <Toolbar />
        <div className="editor-body">
          <Sidebar />
          <CanvasArea />
        </div>
      </div>
    </Editor>
  );
};

export default EditingInterface;
