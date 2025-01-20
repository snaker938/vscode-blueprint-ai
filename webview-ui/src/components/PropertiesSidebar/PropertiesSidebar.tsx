import React, { useState } from 'react';
import { IconButton, IIconProps } from '@fluentui/react';
import './propertiesSidebarStyles.css';

export const PropertiesSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const collapseIcon: IIconProps = { iconName: 'ChevronRight' };
  const expandIcon: IIconProps = { iconName: 'ChevronLeft' };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Main sidebar container */}
      <div
        className={`properties-sidebar-wrapper ${
          collapsed ? 'properties-sidebar-collapsed' : ''
        }`}
      >
        <div className="properties-header">
          <span>Component Properties</span>

          {/* Custom tooltip wrapper for the collapse arrow */}
          <div className="custom-tooltip-wrapper">
            <IconButton
              iconProps={collapseIcon}
              onClick={toggleCollapse}
              ariaLabel="Collapse Sidebar"
            />
            {/* Our custom tooltip content: */}
            <div className="custom-tooltip">Collapse Sidebar</div>
          </div>
        </div>

        <div className="properties-content">
          <p>(Empty for now. Future property controls go here.)</p>
        </div>
      </div>

      {/* The small floating rectangle if collapsed */}
      {collapsed && (
        <div className="properties-expander-button" onClick={toggleCollapse}>
          {/* Another custom tooltip wrapper for expand arrow */}
          <div className="custom-tooltip-wrapper">
            <IconButton iconProps={expandIcon} ariaLabel="Expand Sidebar" />
            <div className="custom-tooltip">Expand Sidebar</div>
          </div>
        </div>
      )}
    </>
  );
};
