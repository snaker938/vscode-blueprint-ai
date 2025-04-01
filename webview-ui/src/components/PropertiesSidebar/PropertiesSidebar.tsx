// webview-ui/src/components/PropertiesSidebar/PropertiesSidebar.tsx

import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { IconButton, IIconProps } from '@fluentui/react';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { AiSidebar } from '../AiSidebar/AiSidebar';
import './propertiesSidebarStyles.css';

interface PropertiesSidebarProps {
  isAiSidebarOpen: boolean;
  isAiSidebarDetached: boolean;
  setIsAiSidebarDetached: (detached: boolean) => void;
  closeAiSidebar: () => void;
}

const SidebarContainer = styled.div<{ $collapsed: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: width 0.3s ease;
  width: ${(p) => (p.$collapsed ? '0' : '320px')};
  min-width: 0;
  border-left: 1px solid #ccc;
  background-color: #fff;
  /* Hide overflow so we can pin the AI block at the bottom */
  overflow: hidden;
`;

/**
 * Wraps everything (properties + pinned AI) in a vertical layout.
 */
const SidebarInner = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

/**
 * This portion scrolls independently for properties.
 */
const PropertiesScrollArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SidebarContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const OverlayHandle = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 100px;
  right: 0;
  width: 40px;
  height: 40px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px 0 0 8px;
  box-shadow: -2px 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  display: ${(p) => (p.$show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Header = styled.div`
  background-color: #f3f3f3;
  border-bottom: 1px solid #ccc;
  height: 48px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 16px;
`;

/**
 * The pinned AI container at the bottom.
 */
const DockedAiContainer = styled.div`
  border-top: 1px solid #ccc;
  background: #fff;
  width: 100%;
  height: 300px; /* fixed height for pinned AI sidebar */
  flex-shrink: 0; /* do not shrink */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* no scrolling here */
`;

export const PropertiesSidebar: React.FC<PropertiesSidebarProps> = ({
  isAiSidebarOpen,
  isAiSidebarDetached,
  setIsAiSidebarDetached,
  closeAiSidebar,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const collapseIcon: IIconProps = { iconName: 'ChevronRight' };
  const expandIcon: IIconProps = { iconName: 'ChevronLeft' };

  const toggleCollapse = () => setCollapsed(!collapsed);

  // Get the currently selected node's data
  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    let selectedData = null;

    if (currentNodeId) {
      selectedData = {
        id: currentNodeId,
        name:
          state.nodes[currentNodeId].data.displayName ||
          state.nodes[currentNodeId].data.name,
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
      };
    }
    return { selected: selectedData };
  });

  const sidebarHeader = selected
    ? `${selected.name} Properties`
    : 'No element selected';

  return (
    <SidebarContainer $collapsed={collapsed}>
      <SidebarInner>
        {!collapsed && (
          <SidebarContent>
            <Header>
              <span style={{ fontWeight: 600 }}>{sidebarHeader}</span>
              <IconButton
                iconProps={collapseIcon}
                onClick={toggleCollapse}
                ariaLabel="Collapse Sidebar"
              />
            </Header>

            {/* The scrollable area for properties */}
            <PropertiesScrollArea>
              <ContentArea>
                {!selected ? (
                  <Typography variant="body2">
                    Please select an element to configure its properties.
                  </Typography>
                ) : (
                  <Box>
                    {selected.settings &&
                      React.createElement(selected.settings)}
                  </Box>
                )}
              </ContentArea>
            </PropertiesScrollArea>
          </SidebarContent>
        )}

        {/* Handle for expanding when collapsed */}
        <OverlayHandle $show={collapsed} onClick={toggleCollapse}>
          <IconButton iconProps={expandIcon} ariaLabel="Expand Sidebar" />
        </OverlayHandle>

        {/* If AI is open and not detached, show pinned AI at bottom */}
        {isAiSidebarOpen && !isAiSidebarDetached && (
          <DockedAiContainer style={{ overflowY: 'auto' }}>
            <AiSidebar
              isDetached={false}
              onDetach={() => setIsAiSidebarDetached(true)}
              onClose={closeAiSidebar}
            />
          </DockedAiContainer>
        )}
      </SidebarInner>

      {/* If AI is open and detached, show it in a draggable popup */}
      {isAiSidebarOpen && isAiSidebarDetached && (
        <Draggable handle=".ai-sidebar-drag-handle">
          <div
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '80px',
              resize: 'both',
              overflow: 'auto',
              // Example default size ~40% width, 50% height of the viewport:
              width: `${window.innerWidth * 0.4}px`,
              height: `${window.innerHeight * 0.5}px`,
              background: '#fff',
              border: '1px solid #ccc',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 9999,
            }}
          >
            <AiSidebar
              isDetached={true}
              onDock={() => setIsAiSidebarDetached(false)}
              onClose={closeAiSidebar}
            />{' '}
          </div>
        </Draggable>
      )}
    </SidebarContainer>
  );
};
