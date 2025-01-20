// webview-ui/src/components/PropertiesSidebar/PropertiesSidebar.tsx

import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { IconButton, IIconProps } from '@fluentui/react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Button as MatButton,
} from '@mui/material';
import styled from 'styled-components';
import './propertiesSidebarStyles.css';

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
  overflow: visible; /* Let the handle float outside when collapsed */
`;

/**
 * Actual sidebar content area (header + content).
 * Only visible when not collapsed.
 */
const SidebarContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

/**
 * This overlay handle is always present, but only visible if collapsed.
 * We position it relative to the top: 100px on the entire screen by using a new wrapper
 * that is not clipped by the 0-width container.
 */
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
  z-index: 9999; /* visible above everything */
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

export const PropertiesSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const collapseIcon: IIconProps = { iconName: 'ChevronRight' };
  const expandIcon: IIconProps = { iconName: 'ChevronLeft' };
  const toggleCollapse = () => setCollapsed(!collapsed);

  const { actions, selected } = useEditor((state, query) => {
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
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }
    return { selected: selectedData };
  });

  return (
    <>
      {/* The main sidebar in the flex layout */}
      <SidebarContainer $collapsed={collapsed}>
        {/* If not collapsed => show the entire sidebar UI */}
        {!collapsed && (
          <SidebarContent>
            <Header>
              <span style={{ fontWeight: 600 }}>Component Properties</span>
              <IconButton
                iconProps={collapseIcon}
                onClick={toggleCollapse}
                ariaLabel="Collapse Sidebar"
              />
            </Header>

            <ContentArea>
              {!selected ? (
                <p>No element selected.</p>
              ) : (
                <Box>
                  <Grid
                    container
                    alignItems="center"
                    style={{ marginBottom: 16 }}
                  >
                    <Grid item xs>
                      <Typography variant="subtitle1">Selected</Typography>
                    </Grid>
                    <Grid item>
                      <Chip
                        size="small"
                        color="primary"
                        label={selected.name || 'Component'}
                      />
                    </Grid>
                  </Grid>
                  {selected.settings && React.createElement(selected.settings)}
                  {selected.isDeletable && (
                    <MatButton
                      variant="contained"
                      color="primary"
                      onClick={() => actions.delete(selected.id)}
                      style={{ marginTop: 16 }}
                    >
                      Delete
                    </MatButton>
                  )}
                </Box>
              )}
            </ContentArea>
          </SidebarContent>
        )}
      </SidebarContainer>

      {/* Show a small floating handle if collapsed => user can expand */}
      <OverlayHandle $show={collapsed} onClick={toggleCollapse}>
        <IconButton iconProps={expandIcon} ariaLabel="Expand Sidebar" />
      </OverlayHandle>
    </>
  );
};
