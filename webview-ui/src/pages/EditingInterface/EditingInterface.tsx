import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Editor, Frame, Element } from '@craftjs/core';

import { Viewport } from '../../components/Editor';
import { Container } from '../../components/UserComponents/Container';
import { RenderNode } from '../../components/UserComponents/Utils';

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
              <Element
                is={Container}
                flexDirection="row"
                width="100%"
                height="auto"
                padding={['40', '40', '40', '40']}
                margin={['0', '0', '40', '0']}
                canvas
              ></Element>
            </Frame>
          </Viewport>
        </Editor>
      </div>
    </ThemeProvider>
  );
};

export default EditingInterface;
