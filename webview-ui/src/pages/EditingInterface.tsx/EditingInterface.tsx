import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Viewport, RenderNode } from '../../components/Editor';
import { Container } from '../components/selectors';

// Create a Material-UI theme (mimicking your MyApp example)
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
            Container,
            // Register all components here
          }}
          enabled={true}
          onRender={RenderNode}
        >
          <Viewport>
            <Frame>
              <Element is={Container} canvas></Element>
            </Frame>
          </Viewport>
        </Editor>
      </div>
    </ThemeProvider>
  );
};

export default EditingInterface;
