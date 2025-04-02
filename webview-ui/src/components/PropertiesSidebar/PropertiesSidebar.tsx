// webview-ui/src/components/PropertiesSidebar/PropertiesSidebar.tsx

import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { IconButton, IIconProps } from '@fluentui/react';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';
import './propertiesSidebarStyles.css';

/**
 * The main container for the properties sidebar
 */
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
  /* No overflow constraints so it's purely for properties. */
`;

const SidebarInner = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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
  /* No scrolling here; remove overflow-y. */
  padding: 16px;
`;

export interface PropertiesSidebarProps {
  defaultCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void; // <-- NEW
}

export const PropertiesSidebar: React.FC<PropertiesSidebarProps> = ({
  defaultCollapsed = false,
  onCollapseChange,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const collapseIcon: IIconProps = { iconName: 'ChevronRight' };
  const expandIcon: IIconProps = { iconName: 'ChevronLeft' };

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(!collapsed);
    onCollapseChange?.(newState);
  };

  // Get the currently selected node's data from the Craft editor
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
        {/* If not collapsed, show the main content */}
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

            <ContentArea>
              {!selected ? (
                <Typography variant="body2">
                  Please select an element to configure its properties.
                </Typography>
              ) : (
                <Box>
                  {/* Render the node’s settings component, if it exists */}
                  {selected.settings && React.createElement(selected.settings)}
                </Box>
              )}
            </ContentArea>
          </SidebarContent>
        )}

        {/* Overlay handle to expand when collapsed */}
        <OverlayHandle $show={collapsed} onClick={toggleCollapse}>
          <IconButton iconProps={expandIcon} ariaLabel="Expand Sidebar" />
        </OverlayHandle>
      </SidebarInner>
    </SidebarContainer>
  );
};
