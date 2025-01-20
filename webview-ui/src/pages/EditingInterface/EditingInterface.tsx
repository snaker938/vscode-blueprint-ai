// webview-ui/src/pages/EditingInterface/EditingInterface.tsx
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Editor, Frame, Element } from '@craftjs/core';
import { Container } from '../../components/UserComponents/Container';
import { RenderNode } from '../../components/UserComponents/Utils';
import { Viewport } from '../../components/Editor/Viewport';

const theme = createTheme();

const EditingInterface: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="fullscreen-flex">
        <Editor resolver={{ Container }} onRender={RenderNode}>
          <Viewport>
            <Frame>
              <Element
                is={Container}
                flexDirection="row"
                width="100%"
                height="auto"
                canvas
              />
            </Frame>
          </Viewport>
        </Editor>
      </div>
    </ThemeProvider>
  );
};

export default EditingInterface;
