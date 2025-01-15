import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Editor, Frame, Element } from '@craftjs/core';

import { Container } from '../../components/UserComponents';
import { RenderNode } from '../../components/Editor/Utils';
import { Viewport } from '../../components/Editor/Viewport';

// Create a Material-UI theme
const theme = createTheme({
  typography: {
    fontFamily: [
      'acumin-pro',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const EditingInterface: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* Full-height container for the editor */}
      <div style={{ height: '100vh', margin: 0, padding: 0 }}>
        <Editor
          resolver={{
            // Register all components here
            Container,
          }}
          onRender={RenderNode}
          enabled={true}
        >
          <Viewport>
            <Frame>
              <Element is="div" canvas>
                <h2>Hello from Craft.js!</h2>
              </Element>
            </Frame>
          </Viewport>
        </Editor>
      </div>
    </ThemeProvider>
  );
};

export default EditingInterface;
