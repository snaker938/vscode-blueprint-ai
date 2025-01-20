// webview-ui/src/pages/MainInterface/MainInterface.tsx

import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Editor, Frame, Element } from '@craftjs/core';
import { Container } from '../../components/UserComponents/Container';
import { Text } from '../../components/UserComponents/Text';
import { Button } from '../../components/UserComponents/Button';
import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
import { PropertiesSidebar } from '../../components/PropertiesSidebar/PropertiesSidebar';
import './MainInterface.css';
import { RenderNode } from '../../components/UserComponents/Utils/RenderNode/RenderNode';

const theme = createTheme();

const MainInterface: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* Wrap everything in <Editor> so useEditor can be used in sidebars */}
      <Editor
        resolver={{
          Container,
          Text,
          Button,
        }}
        enabled
        onRender={RenderNode}
      >
        <div className="layout-root">
          <PrimarySidebar />

          <div className="main-content">
            <Frame>
              {/* Root container with a background */}
              <Element
                canvas
                is={Container}
                width="800px"
                height="auto"
                background={{ r: 250, g: 250, b: 250, a: 1 }}
                padding={['40', '40', '40', '40']}
                margin={['0', 'auto', '0', 'auto']}
                custom={{ displayName: 'RootContainer' }}
              ></Element>
            </Frame>
          </div>

          <PropertiesSidebar />
        </div>
      </Editor>
    </ThemeProvider>
  );
};

export default MainInterface;
