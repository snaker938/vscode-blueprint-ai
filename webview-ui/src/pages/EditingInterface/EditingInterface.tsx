import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Editor, Frame, Element } from '@craftjs/core';

import { Viewport } from '../../components/Editor';

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
        <Editor resolver={{}} enabled={true}>
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
