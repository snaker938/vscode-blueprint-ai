import React, { useEffect, useState } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { IconButton } from '@mui/material';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import './RenderNode.css';

interface RenderNodeProps {
  render: React.ReactNode;
}

export const RenderNode: React.FC<RenderNodeProps> = ({ render }) => {
  const {
    isSelected,
    connectors: { drag },
    id,
    ameString,
    isRootContainer,
    dom,
  } = useNode((node) => ({
    isSelected: node.events.selected,
    ameString: node.data.props.ameString,
    isRootContainer: node.data.custom?.isRootContainer,
    dom: node.dom,
  }));

  const { actions } = useEditor();

  // Local state for manual hovering and editing name
  const [manualHovered, setManualHovered] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(ameString);

  // Add / remove selected class
  useEffect(() => {
    if (!dom || isRootContainer) return;
    if (isSelected) {
      dom.classList.add('craft-node-selected');
    } else {
      dom.classList.remove('craft-node-selected');
    }
  }, [dom, isSelected, isRootContainer]);

  // Add / remove hovered class
  useEffect(() => {
    if (!dom || isRootContainer) return;
    if (manualHovered) {
      dom.classList.add('craft-node-hovered');
    } else {
      dom.classList.remove('craft-node-hovered');
    }
  }, [dom, manualHovered, isRootContainer]);

  // Begin editing name on double-click
  const handleNameDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent double-click from bubbling
    setTempName(ameString);
    setEditingName(true);
  };

  // Track changes to name while editing
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  // Commit name changes on blur
  const handleNameBlur = () => {
    actions.setProp(id, (props: any) => {
      props.ameString = tempName;
    });
    setEditingName(false);
  };

  // Hide this node
  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.setHidden(id, true);
  };

  // Delete this node
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.delete(id);
  };

  // Mouse over/out to set hover
  const handleWrapperMouseOver = (e: React.MouseEvent) => {
    // Stop bubbling so parent doesn't also get hovered
    e.stopPropagation();
    setManualHovered(true);
  };

  const handleWrapperMouseOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setManualHovered(false);
  };

  // Keep the indicator hovered if we hover over it directly
  const handleIndicatorMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setManualHovered(true);
  };

  const handleIndicatorMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setManualHovered(false);
  };

  // Selecting the node on click
  const handleNodeClick = (e: React.MouseEvent) => {
    // Stop the click from bubbling up to parent
    e.stopPropagation();
    if (!isRootContainer) {
      actions.selectNode([id]);
    }
  };

  // If it's the root container, just render children with no wrapper
  if (isRootContainer) {
    return <>{render}</>;
  }

  return (
    <div
      className="craft-node-wrapper"
      data-node-id={id}
      onMouseOver={handleWrapperMouseOver}
      onMouseOut={handleWrapperMouseOut}
      onClick={handleNodeClick}
    >
      {(isSelected || manualHovered) && (
        <div
          className="craft-node-indicator"
          data-node-id={id}
          onMouseEnter={handleIndicatorMouseEnter}
          onMouseLeave={handleIndicatorMouseLeave}
        >
          {/* Display name or input for editing */}
          {editingName ? (
            <input
              className="craft-name-input"
              value={tempName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              autoFocus
            />
          ) : (
            <span className="craft-name" onDoubleClick={handleNameDoubleClick}>
              {ameString}
            </span>
          )}

          {/* Drag handle */}
          <IconButton
            size="small"
            className="drag-handle"
            component="div"
            ref={(instance: HTMLDivElement | null) =>
              instance && drag(instance)
            }
            title="Drag this component"
            onMouseDown={(e) => e.stopPropagation()} // optional: stop drag mousedown from selecting parent
          >
            <OpenWithIcon fontSize="inherit" />
          </IconButton>

          {/* Hide node */}
          <IconButton
            size="small"
            onClick={handleHide}
            title="Hide this component"
          >
            <VisibilityOffIcon fontSize="inherit" />
          </IconButton>

          {/* Delete node */}
          <IconButton
            size="small"
            onClick={handleDelete}
            title="Delete this component"
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </div>
      )}

      {render}
    </div>
  );
};
