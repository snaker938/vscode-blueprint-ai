import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LinearProgress } from '@mui/material';
import { Editor, Frame, Element } from '@craftjs/core';
import { Container } from '../../components/UserComponents/Container';
import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
import { PropertiesSidebar } from '../../components/PropertiesSidebar/PropertiesSidebar';
// import { RenderNode } from '../../components/UserComponents/Utils/RenderNode/RenderNode';
// import { AmazonPage } from '../../components/AmazonDemoPage/AmazonDemoPage';
import './MainInterface.css';

const theme = createTheme();

const MainInterface: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Hide the loading overlay after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Editor
        resolver={{
          Container,
        }}
        enabled
        // onRender={(node) => <RenderNode {...node} />}
      >
        <div className="layout-root">
          {loading && (
            <div className="loading-overlay">
              <div className="progress-container">
                <LinearProgress style={{ width: '200px' }} />
              </div>
            </div>
          )}

          {!loading && (
            <>
              <PrimarySidebar />
              <div className="main-content craftjs-renderer">
                <div className="page-container">
                  {/* CraftJS Frame, containing a Container and a Text component */}

                  {/* The static Amazon page below the CraftJS Frame */}
                  {/* <AmazonPage /> */}
                  <Frame>
                    <Element
                      is={Container}
                      canvas
                      width="100%"
                      height="auto"
                      background={{ r: 255, g: 255, b: 255, a: 1 }}
                      padding={['20', '20', '20', '20']}
                      custom={{ displayName: 'RootCanvasContainer' }}
                    ></Element>
                  </Frame>
                </div>
              </div>
              <PropertiesSidebar />
            </>
          )}
        </div>
      </Editor>
    </ThemeProvider>
  );
};

export default MainInterface;
