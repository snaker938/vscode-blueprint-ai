// webview-ui/src/pages/MainInterface/MainInterface.tsx

import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LayoutViewport } from '../../components/LayoutViewport';

const theme = createTheme();

const MainInterface: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="flex w-screen h-screen bg-gray-100">
        <div className="flex w-full h-full overflow-hidden">
          {/* Sidebar (inside LayoutViewport) */}
          <LayoutViewport />

          {/* Main canvas area to the right */}
          {/* <div className="flex-1 bg-white p-5">
            <p>Placeholder canvas area (no CraftJS)</p>
          </div> */}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MainInterface;
