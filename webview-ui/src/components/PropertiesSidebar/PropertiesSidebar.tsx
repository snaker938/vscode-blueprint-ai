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
import './propertiesSidebarStyles.css';

export const PropertiesSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const collapseIcon: IIconProps = { iconName: 'ChevronRight' };
  const expandIcon: IIconProps = { iconName: 'ChevronLeft' };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Craft.js selection logic
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
      <div
        className={`properties-sidebar-wrapper ${
          collapsed ? 'properties-sidebar-collapsed' : ''
        }`}
      >
        <div className="properties-header">
          <span>Component Properties</span>
          <div className="custom-tooltip-wrapper">
            <IconButton
              iconProps={collapseIcon}
              onClick={toggleCollapse}
              ariaLabel="Collapse Sidebar"
            />
            <div className="custom-tooltip">Collapse Sidebar</div>
          </div>
        </div>

        <div className="properties-content">
          {/* Display selected node's info + settings if any */}
          {!selected ? (
            <p>No element selected.</p>
          ) : (
            <Box>
              <Grid container alignItems="center" style={{ marginBottom: 16 }}>
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
        </div>
      </div>

      {collapsed && (
        <div className="properties-expander-button" onClick={toggleCollapse}>
          <div className="custom-tooltip-wrapper">
            <IconButton iconProps={expandIcon} ariaLabel="Expand Sidebar" />
            <div className="custom-tooltip">Expand Sidebar</div>
          </div>
        </div>
      )}
    </>
  );
};
