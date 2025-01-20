import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
import './mainInterface.css';

const theme = createTheme();

const MainInterface: React.FC = () => (
  <ThemeProvider theme={theme}>
    <div className="layout-root">
      <PrimarySidebar />
      <div className="main-content">
        <p>Placeholder main content (no CraftJS)</p>
      </div>
    </div>
  </ThemeProvider>
);

export default MainInterface;
