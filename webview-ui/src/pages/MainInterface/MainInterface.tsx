// webview-ui/src/pages/MainInterface/MainInterface.tsx
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
import { PropertiesSidebar } from '../../components/PropertiesSidebar/PropertiesSidebar';
import './MainInterface.css';

const theme = createTheme();

const MainInterface: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="layout-root">
        <PrimarySidebar />
        <div className="main-content">
          <p>Placeholder main content (no CraftJS)</p>
        </div>

        {/* Our new right-hand sidebar */}
        <PropertiesSidebar />
      </div>
    </ThemeProvider>
  );
};

export default MainInterface;
