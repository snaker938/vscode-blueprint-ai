// webview-ui/src/pages/MainInterface/MainInterface.tsx

import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Editor, Frame, Element } from '@craftjs/core';
import { Container } from '../../components/UserComponents/Container';
import { Text as CraftText } from '../../components/UserComponents/Text';
import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
import { PropertiesSidebar } from '../../components/PropertiesSidebar/PropertiesSidebar';
import './MainInterface.css';
import { RenderNode } from '../../components/UserComponents/Utils';

const theme = createTheme();

const MainInterface: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* Wrap everything in <Editor> so useEditor can be used in sidebars */}
      <Editor
        resolver={{
          Container,
          Text: CraftText,
        }}
        enabled
        onRender={RenderNode}
      >
        <div className="layout-root">
          <PrimarySidebar />

          <div className="main-content">
            <Frame>
              <Element is={Container} canvas background="#f5f5f5" padding={20}>
                <CraftText text="Hello Craft" fontSize={16} />
              </Element>
            </Frame>
          </div>

          <PropertiesSidebar />
        </div>
      </Editor>
    </ThemeProvider>
  );
};

export default MainInterface;
